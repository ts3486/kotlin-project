import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

// Your Firebase configuration object
const firebaseConfig = {
  // You'll need to replace these with your actual Firebase config
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase if it hasn't been initialized
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firestore();
export default firebase; 