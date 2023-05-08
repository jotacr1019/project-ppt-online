import { state } from "../../state";
import { getDatabase, ref, onValue, set, off } from "firebase/database"
import { rtdbFirebase } from "../../rtdb"
import "../../components/button/index"; 
import "../../components/text/index";
import "../../components/score-and-room";
import "../../components/share-code";
const imgOfGame = require("url:../../../client/assets/9ca51c26d4784ebc942633215453adda.png")


const currentState = state.getState()

export function initShareCodeRoom (params){
    if (!currentState.shareCodeRoomInitialized) {
        currentState.shareCodeRoomInitialized = true;
        state.setState(currentState)

        const div = document.createElement("div");
        div.innerHTML = `
            <custom-score-data class="score-data"></custom-score-data>
            <custom-share-code class="share-code"></custom-share-code>
            <img class="img-rules" src="${imgOfGame}" alt="imagen-juego-ppt">
        `
        div.className = "root-share_code";

        const newState = state.getState()

        const rtdbRef = ref(rtdbFirebase, `/rooms/${newState.longRoomId}`);        
        onValue(rtdbRef, (snapshot) => { 
            const value = snapshot.val();
            
            if (value.currentGame.playerOne.online === true &&
            value.currentGame.playerTwo.online === true  &&
            currentState.shareCodeRoomInitialized){
                currentState.shareCodeRoomInitialized = false;
                params.goTo("/reglas")
            }
        });
    return div;
    }
}