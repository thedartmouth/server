import * as admin from 'firebase-admin';
import * as serviceAccount from '../../../firebase-admin-sdk-service-account.json'
/**
 * 
 * @param {*} notification Requested notification to fire.
 * @return {'SUCCESS' | string} Return 'SUCCESS' or the reason for failure.
 */

export async function fire(notification) {

    // initialize sdk
    if (admin.apps.length === 0) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
    }
    
    var defaultMessaging = admin.messaging()

    // construct message to be send to topic defined by notification.type
    var message = {
        notification: {
            title: notification.title,
            body: notification.text
        },
        topic: notification.type
    }

    try {
        const res = await defaultMessaging.send(message)
        console.log(res)
        return 'SUCCESS'
    } catch (e) {
        console.error(e)
        return e.toString()
    }

 }