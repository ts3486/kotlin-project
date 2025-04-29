import firebase from '@react-native-firebase/app';
import firestore from '@react-native-firebase/firestore';

// Replace these values with your Firebase project credentials
// You can find these in your Firebase Console -> Project Settings -> General -> Your apps -> Web app
const firebaseConfig = {
  apiKey: "AIzaSyBbPaafDFM3__JBFGZ-TZH2euAou1unEz0",
  authDomain: "library-tracker-f4b03.firebaseapp.com",
  projectId: "library-tracker-f4b03",
  storageBucket: "library-tracker-f4b03.appspot.com",
  messagingSenderId: "978318445107",
  appId: "1:978318445107:android:1546a25c0672b6f599f146"
};

// Initialize Firebase if it hasn't been initialized yet
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// Get Firestore instance
const db = firestore();

// Enable offline persistence
db.settings({
  persistence: true,
  cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED
});

export { db }; 