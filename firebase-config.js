// Firebase Configuration for Cloud Sync
//
// To enable cloud sync between devices, you need to create a free Firebase project
// and fill in your project's configuration values below.
//
// Setup instructions:
//   1. Go to https://console.firebase.google.com and create a new project
//   2. In the project console, go to Project Settings > General > Your apps
//   3. Click "Add app" > Web, register your app, and copy the config object here
//   4. In the Firebase console, enable Authentication:
//      - Go to Build > Authentication > Sign-in method
//      - Enable "Email/Password" provider
//   5. Enable Firestore Database:
//      - Go to Build > Firestore Database > Create database
//      - Start in production mode, choose a region close to your users
//   6. Set up Firestore Security Rules (Build > Firestore Database > Rules):
//      rules_version = '2';
//      service cloud.firestore {
//        match /databases/{database}/documents {
//          match /users/{userId}/{document=**} {
//            allow read, write: if request.auth != null && request.auth.uid == userId;
//          }
//        }
//      }
//
// Note: Firebase API keys are NOT secret - they identify your project but access is
// controlled by Firebase Authentication and Firestore Security Rules.
// It is safe to commit this file with your actual project values.
//
// Leave apiKey empty to disable cloud sync (app works in local-only mode).

// eslint-disable-next-line no-unused-vars
const firebaseConfig = {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
};
