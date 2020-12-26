import * as admin from "firebase-admin";

const json = require("./admin.json");

const FBAdmin = !admin.apps.length
  ? admin.initializeApp({
      credential: admin.credential.cert(json),
      databaseURL: "https://chat-simple-firebase-default-rtdb.firebaseio.com",
    })
  : admin.app();

export default FBAdmin;
