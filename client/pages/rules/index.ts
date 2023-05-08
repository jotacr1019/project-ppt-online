import { state } from "../../state";
import "../../components/score-and-room"
import "../../components/button/index"
import "../../components/text/index"
const imgOfGame = require("url:../../../client/assets/9ca51c26d4784ebc942633215453adda.png")


export function initRules (params){
    const currentState = state.getState()
    
    const div = document.createElement("div");
    div.innerHTML = `
        <custom-score-data class="score-data_rules"></custom-score-data>
        <custom-text class="text-rules" variant="body">Presioná jugar
            y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.</custom-text>
        <img class="img-rules" src="${imgOfGame}" alt="imagen-juego-ppt">
        <custom-button class="button" label="Jugar"></custom-button>
    `
    div.className = "root-rules";

    const btnEl = div.querySelector(".button");
    btnEl.addEventListener("click", ()=>{
        if(currentState.userId === currentState.rtdbData.currentGame.playerOne.userId &&
        currentState.rtdbData.currentGame.playerTwo.start === false){
            currentState.rtdbData.currentGame.playerOne.start = true;
            state.setStartOfPlayerOneInRTDB(true)
            state.setStartOfPlayerTwoInRTDB(false) 
            params.goTo("/sala-de-espera")
        } else if (currentState.userId === currentState.rtdbData.currentGame.playerOne.userId &&
            currentState.rtdbData.currentGame.playerTwo.start === true){
                currentState.rtdbData.currentGame.playerOne.start = true; 
                state.setStartOfPlayerOneInRTDB(true)
                state.setStartOfPlayerTwoInRTDB(true)
                params.goTo("/jugadas")
        } else if (currentState.userId === currentState.rtdbData.currentGame.playerTwo.userId &&
            currentState.rtdbData.currentGame.playerOne.start === false){
                currentState.rtdbData.currentGame.playerTwo.start = true;
                state.setStartOfPlayerOneInRTDB(false)
                state.setStartOfPlayerTwoInRTDB(true)
                params.goTo("/sala-de-espera")
        } else if (currentState.userId === currentState.rtdbData.currentGame.playerTwo.userId &&
            currentState.rtdbData.currentGame.playerOne.start === true){
            currentState.rtdbData.currentGame.playerTwo.start = true;
            state.setStartOfPlayerOneInRTDB(true)
            state.setStartOfPlayerTwoInRTDB(true)
            params.goTo("/jugadas")
        }
    })
    return div;
}
