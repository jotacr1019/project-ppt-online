import * as dotenv from 'dotenv';         
dotenv.config()
const admin = require("firebase-admin");
// const serviceAccount = require('./key.json')
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY_JSON)

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://final-project-mod6-default-rtdb.firebaseio.com"
    databaseURL: process.env.FIREBASE_DB_URL
});


const firestore = admin.firestore();
const rtdb = admin.database()

export { firestore, rtdb }

