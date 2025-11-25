// 🔔 Notification Service - Capacitor Push Notifications
// Bech admin yab3ath notifications lel users

import { 
  PushNotifications, 
  Token, 
  PushNotificationSchema,
  ActionPerformed 
} from '@capacitor/push-notifications';

export const notificationService = {
  // 🔧 Initialize push notifications
  init: async (): Promise<void> => {
    try {
      console.log('🔔 Initializing push notifications...');

      // ✅ Request permission
      let permStatus = await PushNotifications.checkPermissions();

      if (permStatus.receive === 'prompt') {
        permStatus = await PushNotifications.requestPermissions();
      }

      if (permStatus.receive !== 'granted') {
        console.log('⚠️ Push notification permission denied');
        return;
      }

      // 📝 Register with Apple / Google for push
      await PushNotifications.register();
      console.log('✅ Push notifications registered');

    } catch (error) {
      console.error('❌ Notification init error:', error);
    }
  },

  // 📋 Add listeners for push notifications
  addListeners: () => {
    // ✅ Registration success - t7osalna 3la token
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('✅ Push registration success, token:', token.value);
      // Hna normallement tab3ath token lel backend bech i7afdhou
      // Backend yestaamlou bech yab3ath notifications
    });

    // ❌ Registration error
    PushNotifications.addListener('registrationError', (error: unknown) => {
      console.error('❌ Push registration error:', error);
    });

    // 📩 Notification received (app fel foreground)
    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('📩 Push notification received:', notification);
        // Afficher local notification
        notificationService.showLocalNotification(
          notification.title || 'Notification',
          notification.body || ''
        );
      }
    );

    // 👆 User clicked notification
    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('👆 Notification action performed:', notification);
        // Navigate to specific page based on notification data
        const data = notification.notification.data;
        if (data.route) {
          window.location.href = data.route;
        }
      }
    );
  },

  // 🔕 Remove all listeners
  removeListeners: async (): Promise<void> => {
    await PushNotifications.removeAllListeners();
    console.log('🔕 All notification listeners removed');
  },

  // 📱 Show local notification (manual)
  showLocalNotification: async (title: string, body: string): Promise<void> => {
    try {
      // Hna Ionic ma3andouch direct local notifications
      // Nestaamlou browser notification API (works 3la web)
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
          body,
          icon: '/assets/icon/icon.png',
          badge: '/assets/icon/icon.png',
        });
      }
    } catch (error) {
      console.error('❌ Local notification error:', error);
    }
  },

  // 🔔 Request notification permission (web)
  requestWebPermission: async (): Promise<boolean> => {
    try {
      if (!('Notification' in window)) {
        console.log('⚠️ Browser does not support notifications');
        return false;
      }

      if (Notification.permission === 'granted') {
        return true;
      }

      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }

      return false;
    } catch (error) {
      console.error('❌ Web permission error:', error);
      return false;
    }
  },

  // 📊 Get delivery status
  getDeliveredNotifications: async () => {
    try {
      const notificationList = await PushNotifications.getDeliveredNotifications();
      console.log('📊 Delivered notifications:', notificationList);
      return notificationList;
    } catch (error) {
      console.error('❌ Error getting notifications:', error);
      return { notifications: [] };
    }
  },

  // 🗑️ Remove delivered notifications
  removeDeliveredNotifications: async () => {
    try {
      await PushNotifications.removeAllDeliveredNotifications();
      console.log('🗑️ All notifications cleared');
    } catch (error) {
      console.error('❌ Error removing notifications:', error);
    }
  },
};