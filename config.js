// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCyLgPzhSBW2uEMzjBzpstedJCUdBzDyD4",
  authDomain: "video-f9152.firebaseapp.com",
  projectId: "video-f9152",
  storageBucket: "video-f9152.appspot.com",
  messagingSenderId: "149254166100",
  appId: "1:149254166100:web:747b02ff2594aa9a29bfc1",
  measurementId: "G-LLG6E6PBLK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

