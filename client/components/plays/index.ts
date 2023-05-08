const paperImage = require("url:../../../client/assets/Untitled-paper.png")
const rockImage = require("url:../../../client/assets/Untitled-rock.png")
const scissorsImage = require("url:../../../client/assets/Untitled-scissors.png")
import { state } from "../../state";

export class Plays extends HTMLElement {
    shadowDom = this.attachShadow({mode: "open"});
    constructor(){
        super();
        this.render();
    }
    render(){
        const currentState = state.getState()
        this.shadowDom.innerHTML = `
            <div style="
                display:flex;
                align-items: center;
                gap: 8px;
                width: 100%;
                ">
                <div>
                    <img style="
                        width:100px;
                        height: 100px;
                        border-radius: 40px;
                        box-shadow: 5px 10px 10px hsl(240 25% 50% / 0.2);
                    " class="img-paper" type="paper" src="${paperImage}" alt="imagen-paper">
                </div>
                <div>
                    <img  style="
                        width:98px;
                        height: 98px;
                        border-radius: 40px;
                        box-shadow: 5px 10px 10px hsl(240 25% 50% / 0.2);
                    " class="img-rock" type="rock" src="${rockImage}" alt="imagen-rock">
                </div>
                <div>
                    <img style="
                        width:100px;
                        height: 100px;
                        border-radius: 40px;
                        box-shadow: 5px 10px 10px hsl(240 25% 50% / 0.2);
                    " class="img-scissors" type="scissors" src="${scissorsImage}" alt="imagen-scissors">
                </div>
            </div>
        `

        const imgPaper:any = this.shadowDom.querySelector(".img-paper");
        const imgRock: any = this.shadowDom.querySelector(".img-rock");
        const imgScissors:any = this.shadowDom.querySelector(".img-scissors");

        imgPaper?.addEventListener("click", ()=>{
            imgPaper.style.width = "170px";
            imgPaper.style.height = "170px";
            imgScissors.style.display = "none";
            imgRock.style.display = "none";
        
            if(currentState.userId === currentState.rtdbData.currentGame.playerOne.userId){
                state.setPlayerOneMoveInState('paper', (()=>{
                    state.setPlayerOneMoveInRTDB()
                }))
            }
        
            if(currentState.userId === currentState.rtdbData.currentGame.playerTwo.userId){
                state.setPlayerTwoMoveInState('paper', (()=>{
                    state.setPlayerTwoMoveInRTDB()
                }))
            }
        });

        imgRock?.addEventListener("click", ()=>{
            imgRock.style.width = "170px";
            imgRock.style.height = "170px";
            imgScissors.style.display = "none";
            imgPaper.style.display = "none";
        
            if(currentState.userId === currentState.rtdbData.currentGame.playerOne.userId){
                state.setPlayerOneMoveInState('rock', (()=>{
                    state.setPlayerOneMoveInRTDB()
                }))
            }
        
            if(currentState.userId === currentState.rtdbData.currentGame.playerTwo.userId){
                state.setPlayerTwoMoveInState('rock', (()=>{
                    state.setPlayerTwoMoveInRTDB()
                }))
            }
        });
        
        imgScissors?.addEventListener("click", ()=>{
            imgScissors.style.width = "170px";
            imgScissors.style.height = "170px";
            imgPaper.style.display = "none";
            imgRock.style.display = "none";

            if(currentState.userId === currentState.rtdbData.currentGame.playerOne.userId){
                state.setPlayerOneMoveInState('scissors', (()=>{
                    state.setPlayerOneMoveInRTDB()
                }))
            }
        
            if(currentState.userId === currentState.rtdbData.currentGame.playerTwo.userId){
                state.setPlayerTwoMoveInState('scissors', (()=>{
                    state.setPlayerTwoMoveInRTDB()
                }))
            }
        });
    };
}
customElements.define("custom-plays", Plays)