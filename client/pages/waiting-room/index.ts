import { state } from "../../state"
import { getDatabase, ref, onValue, set } from "firebase/database"
import { rtdbFirebase } from "../../rtdb"
import "../../components/button/index" 
import "../../components/text/index"
import "../../components/score-and-room"
import "../../components/waiting-room-info"
const imgOfGame = require("url:../../../client/assets/9ca51c26d4784ebc942633215453adda.png")


const currentState = state.getState()

export function initWaitingRoom (params){
    if (!currentState.waitingRoomInitialized) {
        currentState.waitingRoomInitialized = true;
        state.setState(currentState)

        const div = document.createElement("div");
        div.innerHTML = `
            <custom-score-data class="score-data"></custom-score-data>
            <custom-waiting-info class="waiting-info"></custom-waiting-info>
            <img class="img-rules" src="${imgOfGame}" alt="imagen-juego-ppt">
        `
        div.className = "root-waiting_room";
        
        const newState = state.getState()

        const rtdbRef = ref(rtdbFirebase, `/rooms/${newState.longRoomId}`);        
        onValue(rtdbRef, (snapshot) => { 
            const value = snapshot.val();

            if (value.currentGame.playerOne.start === true &&    
            value.currentGame.playerTwo.start === true &&
            currentState.waitingRoomInitialized){
                currentState.waitingRoomInitialized = false;
                params.goTo("/jugadas")
            }
        })
    return div;
    }
}