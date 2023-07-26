// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from '@firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDmXtyLd6koFAJaCVbnvGuiMYoFn9SLjbE",
  authDomain: "jollygistics.firebaseapp.com",
  projectId: "jollygistics",
  storageBucket: "jollygistics.appspot.com",
  messagingSenderId: "1051429796972",
  appId: "1:1051429796972:web:cfc24d9ef1a11a884dec49"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);