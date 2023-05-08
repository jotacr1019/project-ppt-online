const imgOfGame = require("url:../../../client/assets/9ca51c26d4784ebc942633215453adda.png")
import { state } from "../../state"
import "../../components/button/index" 
import "../../components/text/index"


export function initStart (params){
    const div = document.createElement("div");
    div.innerHTML = `
        <custom-text class="text-welcome" variant="title" font-size="3.8rem">Piedra, Papel o Tijera</custom-text>
        <img class="img-welcome" src="${imgOfGame}" alt="imagen-juego-ppt">
        <div class="container_buttons">
            <custom-button class="button-continueGame" label="Continuar juego"></custom-button>
            <custom-button class="button-initName" label="Nuevo juego"></custom-button>
            <custom-button class="button-initRoom" font-size="2.4rem" label="Ingresar a una sala"></custom-button>
        </div>
    `
    div.className = "root-welcome";

    const btnContinueEl = div.querySelector(".button-continueGame");
    if(btnContinueEl){
        btnContinueEl.addEventListener("click", ()=>{
            state.initOfHistory()
            const currentState = state.getState();
            if(currentState.longRoomId !== ""){
                if(currentState.userId === currentState.rtdbData.currentGame.playerOne.userId){
                    state.setOnlineOfPlayerOneInRTDB(true)
                    currentState.rtdbData.currentGame.playerOne.online = true;
                    state.setState(currentState)
                    params.goTo("/reglas")
                }
                if(currentState.userId === currentState.rtdbData.currentGame.playerTwo.userId){
                    state.setOnlineOfPlayerTwoInRTDB(true)
                    currentState.rtdbData.currentGame.playerOne.online = true;
                    state.setState(currentState)
                    params.goTo("/reglas")
                }
            } else {
                div.innerHTML = `
                    <custom-text class="text-info" variant="title" font-size="3.1rem">Piedra, Papel o Tijera</custom-text>
                    <img class="img-welcome" src="${imgOfGame}" alt="imagen-juego-ppt">
                    <div class="container-info">
                        <custom-text class="text-info" variant="normal-short">No tienes un juego pendiente con otro jugador. Puedes iniciar un nuevo juego o agregar un código de alguna sala ya existente</custom-text>
                        <custom-button class="button-return" label="Entendido"></custom-button>
                    </div>
                `

                const btnEl = div.querySelector(".button-return")
                btnEl.addEventListener("click", ()=>{
                    params.goTo("/inicio")
                })
            }
        })
    }

    const btnNameEl = div.querySelector(".button-initName");
    if(btnNameEl){
        btnNameEl.addEventListener("click", ()=>{
            params.goTo("/ingresar-nombre")
        })
    }

    const btnRoomEl = div.querySelector(".button-initRoom");
    if(btnRoomEl){
        btnRoomEl.addEventListener("click", ()=>{
            params.goTo("/ingresar-room")
        })
    }

    return div;
}