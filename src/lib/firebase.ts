// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  "projectId": "coin-tracker-dxoid",
  "appId": "1:190553711182:web:f155cf0a48ef57ddba191f",
  "storageBucket": "coin-tracker-dxoid.firebasestorage.app",
  "apiKey": "AIzaSyCvqixlup_WlW72R7JrbChkPK_LlKQBmeM",
  "authDomain": "coin-tracker-dxoid.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "190553711182"
};


// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export { app };
