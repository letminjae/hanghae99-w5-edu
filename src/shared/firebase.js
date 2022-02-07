import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database'


const firebaseConfig = {
  apiKey: "AIzaSyDI0vx3jU0KUNA9ZRTHRLLiUdURRFPDqTQ",
  authDomain: "image-community-b7eab.firebaseapp.com",
  projectId: "image-community-b7eab",
  storageBucket: "image-community-b7eab.appspot.com",
  messagingSenderId: "286053126809",
  appId: "1:286053126809:web:7941faef0459e19411de08",
  measurementId: "G-HPHGLRHQ6D"
};

firebase.initializeApp(firebaseConfig);

const apiKey = firebaseConfig.apiKey;
const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
const realtime = firebase.database();

export{auth, apiKey, firestore, storage, realtime};