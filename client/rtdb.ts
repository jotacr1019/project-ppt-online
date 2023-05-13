import * as dotenv from 'dotenv';         
dotenv.config()
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from "firebase/database"

const firebaseConfig = {
    // apiKey: 'Iwk9zLCFlzE7Z7ZHDkxtwVrZDLfFiG94AlRSGf83',
    apiKey: process.env.FIREBASE_API_KEY,
    // authDomain: 'final-project-mod6.firebaseapp.com',
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    // databaseURL:'https://final-project-mod6-default-rtdb.firebaseio.com',
    databaseURL: process.env.FIREBASE_DB_URL,
    projectId: 'final-project-mod6'
};

const app = initializeApp(firebaseConfig);

const rtdbFirebase = getDatabase();

export { rtdbFirebase }
