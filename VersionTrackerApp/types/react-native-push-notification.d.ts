declare module 'react-native-push-notification' {
  interface PushNotificationOptions {
    onNotification?: (notification: any) => void;
    permissions?: {
      alert?: boolean;
      badge?: boolean;
      sound?: boolean;
    };
    popInitialNotification?: boolean;
    requestPermissions?: boolean;
  }

  interface LocalNotification {
    title: string;
    message: string;
    channelId: string;
  }

  const PushNotification: {
    configure: (options: PushNotificationOptions) => void;
    localNotification: (details: LocalNotification) => void;
  };

  export default PushNotification;
} 