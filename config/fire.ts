import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
const firebaseConfig = {
  apiKey: "AIzaSyB3FWhQqgucf6GCXrV8McC0ytyPuy-9078",
  authDomain: "chat-simple-firebase.firebaseapp.com",
  databaseURL: "https://chat-simple-firebase-default-rtdb.firebaseio.com",
  projectId: "chat-simple-firebase",
  storageBucket: "chat-simple-firebase.appspot.com",
  messagingSenderId: "467652392003",
  appId: "1:467652392003:web:d0b528a93d160488af90f6",
  measurementId: "G-B3S5RDEYGT",
};
const fire = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

export default fire;
