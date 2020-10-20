import firebase from "firebase";

const firebaseApp = firebase.initializeApp( {
    apiKey: "[YOUR KEYS]",
    authDomain: "",
    databaseURL: "",
    projectId: "fikrettgram",
    storageBucket: "",
    messagingSenderId: "",
    appId: "",
    measurementId: ""
  });

  const db= firebaseApp.firestore();
  const auth = firebase.auth();
  const storage = firebase.storage();

  export {db,auth , storage};