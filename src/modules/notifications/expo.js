import { Expo } from 'expo-server-sdk'
import { Notification } from './notification'
import { getClient } from '../../db'

let expo = new Expo({ accessToken: process.env.EXPO_ACCESS_TOKEN })

/**
 *
 * @param {string} notificationId Requested notification ID to fire.
 */
export async function fire(notificationId) {
	const dbClient = await getClient()
	let notification = await Notification.fetchById(notificationId)
	let messages = await notification.generateTargetAudience()
	console.log(messages)

	if (!messages?.length) {
		dbClient.release()
		return
	}

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
					dbClient.query(
						'INSERT INTO notificationFires (notificationId, notificationToken, success) VALUES ($1, $2, $3)',
						[notificationId, badToken, false]
					)
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

	dbClient.query('UPDATE notifications SET triggered = $1 WHERE id = $2', [
		true,
		notificationId,
	])
	dbClient.release()
}
