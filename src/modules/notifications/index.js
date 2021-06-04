import { fire as fireExpoNotification } from './expo'
export * from './notification'

export async function fireNotification(notificationId) {
	return fireExpoNotification(notificationId)
}
