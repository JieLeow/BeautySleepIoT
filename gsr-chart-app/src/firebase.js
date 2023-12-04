// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvQ8IXZ5MC3RKuLN8bt03OGg39zrWxEnY",
  authDomain: "beautysleep-f8936.firebaseapp.com",
  databaseURL: "https://beautysleep-f8936-default-rtdb.firebaseio.com",
  projectId: "beautysleep-f8936",
  storageBucket: "beautysleep-f8936.appspot.com",
  messagingSenderId: "266892340555",
  appId: "1:266892340555:web:5c6b6d03d906fa64034cce",
  measurementId: "G-9YY01G63NW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { app, database, auth };
