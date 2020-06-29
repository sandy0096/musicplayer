const PushNotification = require("react-native-push-notification");

export default class NotificationService {
    constructor(onNotification) {
        this.configure(onNotification);
        this.lastId = 0;
    }

    configure(onNotification) {

        PushNotification.configure({
            onNotification: onNotification,

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            popInitialNotification: true,
        });
    }

    //Appears right away
    localNotification(notif) {
        console.log('local notif', notif);
        this.lastId++;
        PushNotification.localNotification(notif);
    }

    //Appears after a specified time. App does not have to be open.
    scheduleNotification() {
        this.lastId++;
        PushNotification.localNotificationSchedule({
            date: new Date(Date.now() + (30 * 1000)), //30 seconds
            title: "Scheduled Notification",
            message: "My Notification Message",
            playSound: true,
            soundName: 'default',
        });
    }

    checkPermission(cbk) {
        return PushNotification.checkPermissions(cbk);
    }

    cancelNotif() {
        PushNotification.cancelLocalNotifications({id: ''+this.lastId});
    }

    cancelAll() {
        PushNotification.cancelAllLocalNotifications();
    }
}
