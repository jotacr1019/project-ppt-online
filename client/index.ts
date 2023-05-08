import "./components/button" 
import "./components/text"
import { initRouter } from "./router"
import { state } from "./state"

(function(){
    const containerEl = document.querySelector(".principal-container");
    initRouter(containerEl);
    window.addEventListener("beforeunload",(e)=>{
        e.preventDefault();
        const currentState = state.getState()
        if(currentState.userId === currentState.rtdbData.currentGame.playerOne.userId){
            state.setOnlineOfPlayerOneInRTDB(false)
        }
        if(currentState.userId === currentState.rtdbData.currentGame.playerTwo.userId){
            state.setOnlineOfPlayerTwoInRTDB(false)
        }
    }) 
})()