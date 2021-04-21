import { fire as fireAppleNotification } from './apple'
import { fire as fireFirebaseNotification } from './firebase'

export async function fireNotification(notification) {
	return {
		apple: await fireAppleNotification(notification),
		firebase: await fireFirebaseNotification(notification)
	}
}