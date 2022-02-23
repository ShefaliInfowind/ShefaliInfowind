// import firebase from 'firebase'
// import "firebase/firestore";
// import "firebase/database";

import firebase from 'firebase/compat/app'; 
import 'firebase/compat/firestore'; 
import "firebase/compat/database";
import 'firebase/compat/messaging';
import 'firebase/compat/storage';

const settings = {timestampsInSnapshots: true};
// const firebaseConfig = {
//     apiKey: "AIzaSyA4qAi1iTrEFy0OzNHHZDO10PPs6MQnDG8",
//     authDomain: "pwa-app-2d6be.firebaseapp.com",
//     projectId: "pwa-app-2d6be",
//     storageBucket: "pwa-app-2d6be.appspot.com",
//     messagingSenderId: "155791405091",
//     appId: "1:155791405091:web:d371984ff3ce0ee42f4196"
//   };

//client details

const firebaseConfig = {
    apiKey: "AIzaSyAAMQOR6lqT1DnIXt8Z5gmUx6WiJrniuIo",
    authDomain: "dapify-c5ba4.firebaseapp.com",
    projectId: "dapify-c5ba4",
    storageBucket: "dapify-c5ba4.appspot.com",
    messagingSenderId: "824141673742",
    appId: "1:824141673742:web:e4f2b924dd6871812a535f",
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.firestore().settings(settings);

// for pwa----
export const db = firebase.firestore();

db.enablePersistence().catch(err => {
  if (err.code === 'failed-precondition') {
    // Multiple tabs open, persistence can only be enabled
    // in one tab at a a time.
    console.log('persistance failed');
  } else if (err.code === 'unimplemented') {
    // The current browser does not support all of the
    // features required to enable persistence
    console.log('persistance not available');
  }
});
// end for pwa----


const messaging = firebase.messaging();

export const onMessageListener = () =>
  new Promise((resolve) => {
    
    messaging.onMessage((payload) => {
      console.log('msgpayload',payload);
      resolve(payload);
    });
});



export default firebase;

