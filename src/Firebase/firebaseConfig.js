// src/Firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDFWhUPJ1GvJwkHP1yUlp2yVBdiGe6xM1k",
  authDomain: "bienestarcecar-421e6.firebaseapp.com",
  databaseURL: "https://bienestarcecar-421e6-default-rtdb.firebaseio.com",
  projectId: "bienestarcecar-421e6",
  storageBucket: "bienestarcecar-421e6.appspot.com",
  messagingSenderId: "194932586805",
  appId: "1:194932586805:web:af6fa227b298e4e777f47c",
  measurementId: "G-1B9241FH62"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };  // Exporta solo auth
