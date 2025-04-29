import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const configurePushNotifications = async () => {
  // Configure how notifications are handled when the app is in the foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  // Request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  
  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  // Get the push token
  const token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log('Push token:', token);
  
  return token;
}; 