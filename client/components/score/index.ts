import "../text/index";
import { state } from "../../state";


export class Score extends HTMLElement {
    shadowDom = this.attachShadow({mode: "open"});
    constructor(){
        super();
        this.render();
        state.getScoreFromDB()
    }

    connectedCallback(){
        state.subscribe(()=>{
            this.render();
        })
    }

    render(){
        const currentState = state.getState()
        const playerOneName = currentState.rtdbData.currentGame.playerOne.name.slice(0, 10);
        const playerTwoName = currentState.rtdbData.currentGame.playerTwo.name.slice(0, 10);

        this.shadowDom.innerHTML = `
            <div style="
                    display: flex;
                    flex-direction: column;
                    // align-items: center;
                    border: solid 8px #000;
                    height: 200px;
                    padding: 8px 12px;
                    background-color: #fff;
            ">
                <custom-text variant="normal-high" style="
                                                    align-self: center;
                                                    margin-bottom: 20px;
                ">Marcador</custom-text>
                <custom-text variant="normal" style="
                                                    align-self: flex-end;
                ">${playerOneName}: ${currentState.scoreFromDB.playerOne}</custom-text>
                <custom-text variant="normal" style="
                                                    align-self: flex-end;
                ">${playerTwoName}: ${currentState.scoreFromDB.playerTwo}</custom-text>
            </div>
        `
    };
}
customElements.define("custom-score", Score)
