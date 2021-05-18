import { Expo } from 'expo-server-sdk'
import { Notification } from './notification'
import { getClient } from '../../db'
import { notificationController } from '../../controllers'

let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN })

/**
 *
 * @param {Notification} notification Requested notification to fire.
 * @return {'SUCCESS' | string} Return 'SUCCESS' or the reason for failure.
 */
export async function fire(notification) {
	const dbClient = await getClient()
	let audience
	let messages
	switch (notification.type) {
		case 'ARTICLE':
			audience = (
				await dbClient.query(
					"SELECT token FROM (SELECT notificationToken FROM notificationSettings WHERE tagSlug = $1 AND active = 'true') AS targetUsers LEFT JOIN notificationTokens ON targetUsers.notificationToken = notificationTokens.token",
					[notification.tagSlug]
				)
			).rows
			console.log(audience)
			messages = audience
				.filter(({ token }) => Expo.isExpoPushToken(token))
				.map(({ token }) => ({
					to: token,
					sound: 'default',
					title: notification.title,
					body: notification.body,
					data: {
						notificationId: notification.id,
						token,
						articleSlug: notification.articleSlug,
					},
				}))
			break
		case 'GENERAL':
			audience = (
				await dbClient.query('SELECT token FROM notificationTokens')
			).rows
			messages = audience
				.filter(({ token }) => Expo.isExpoPushToken(token))
				.map(({ token }) => ({
					to: token,
					sound: 'default',
					title: notification.title,
					body: notification.body,
					data: { notificationId: notification.id, token },
				}))
			break
	}
	if (!messages?.length) return

	/**
	 * @see https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
	 */
	function handleNotificationError(ticket) {
		console.error(ticket.details.error)
		switch (ticket.details.error) {
			case 'DeviceNotRegistered':
				const badToken = ticket.message.split('"')[1]
				if (badToken) {
					console.log(`Bad token: ${badToken}`)
					// notificationController.deleteToken(badToken)
				}
		}
	}

	const chunks = expo.chunkPushNotifications(messages)
	const tickets = []
	await Promise.allSettled(
		chunks.map(async (chunk) => {
			const chunkTickets = await expo.sendPushNotificationsAsync(chunk)
			chunkTickets.forEach((ticket) => {
				if (ticket.status === 'ok') {
					tickets.push(ticket)
				} else {
					handleNotificationError(ticket)
				}
			})
		})
	)
	const receiptIdChunks = expo.chunkPushNotificationReceiptIds(
		tickets.map(({ id }) => id)
	)
	await Promise.all(
		receiptIdChunks.map(async (chunk) => {
			const receipts = await expo.getPushNotificationReceiptsAsync(chunk)
			Object.entries(receipts).forEach(([_, receipt]) => {
				if (receipt.status === 'ok') {
				} else {
					handleNotificationError(ticket)
				}
			})
		})
	)
	// dbClient.query('INSERT INTO notificationFires (notificationId, notificationToken, success) VALUES ($1, $2, $3)', [notification.id, TODO])
	dbClient.release()
}
