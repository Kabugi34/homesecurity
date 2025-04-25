// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3QmjtMr-mQt6LEg4ctQPQvVVeshx6guU",
  authDomain: "home-security-9d841.firebaseapp.com",
  projectId: "home-security-9d841",
  storageBucket: "home-security-9d841.firebasestorage.app",
  messagingSenderId: "147263415352",
  appId: "1:147263415352:web:45c3db92050fb65e6572cd",
  measurementId: "G-JJ5M10FNCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export  const auth = getAuth(app);