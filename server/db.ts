const admin = require("firebase-admin");
const serviceAccount = require('./key.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://final-project-mod6-default-rtdb.firebaseio.com"
});


const firestore = admin.firestore();
const rtdb = admin.database()

export { firestore, rtdb }

