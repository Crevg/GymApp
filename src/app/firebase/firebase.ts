// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

/* const firebaseConfig = {

  apiKey: "AIzaSyBiNprU9d5jnnf0w3aLSeGlPFjraJWfe3U",

  authDomain: "trainingappcris.firebaseapp.com",

  projectId: "trainingappcris",

  storageBucket: "trainingappcris.appspot.com",

  messagingSenderId: "630341374056",

  appId: "1:630341374056:web:dcc3b4ec186f9cd51aebdd",

  measurementId: "G-5T2XJJYB39"

};

 */
// Initialize Firebase

import admin from 'firebase-admin'

export const app = admin.initializeApp({

  credential: admin.credential.cert('./src/app/firebase/trainingappcris-firebase-adminsdk-pogfz-ea6447e0b7.json'),

  databaseURL: "https://trainingappcris-default-rtdb.firebaseio.com"

});





//export const app = initializeApp(firebaseConfig);
