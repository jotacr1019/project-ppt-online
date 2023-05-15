import * as dotenv from 'dotenv';         
dotenv.config()
const admin = require("firebase-admin");
const serviceAccount = require('../key.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DB_URL
});


const firestore = admin.firestore();
const rtdb = admin.database()

export { firestore, rtdb }

