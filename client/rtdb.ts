import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from "firebase/database"

const firebaseConfig = {
    apiKey: 'Iwk9zLCFlzE7Z7ZHDkxtwVrZDLfFiG94AlRSGf83',
    authDomain: 'final-project-mod6.firebaseapp.com',
    databaseURL:'https://final-project-mod6-default-rtdb.firebaseio.com',
    projectId: 'final-project-mod6'
};

const app = initializeApp(firebaseConfig);

const rtdbFirebase = getDatabase();

export { rtdbFirebase }
