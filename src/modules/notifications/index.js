import { fire as fireAppleNotification } from './apple'
import { fire as fireFirebaseNotification } from './firebase'
import { fire as fireExpoNotification } from './expo'
export * from './notification'

export async function fireNotification(notificationId) {
	return fireExpoNotification(notificationId)
	// return {
	// 	// apple: await fireAppleNotification(notification),
	// 	// firebase: await fireFirebaseNotification(notification),
	// 	expo: await fireExpoNotification(notification)
	// }
}
