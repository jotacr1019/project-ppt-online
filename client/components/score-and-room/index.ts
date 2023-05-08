import { state } from "../../state";


export class ScoreAndRoom extends HTMLElement {
    shadowDom = this.attachShadow({mode: "open"});
    constructor(){
        super();
        state.getScoreFromDB().then(()=>{
            this.render();
        })
    }

    connectedCallback(){
        state.subscribe(()=>{
            this.render();
        })
    }

    render(){
        const currentState = state.getState()
        const playerOneScore = currentState.scoreFromDB.playerOne;
        const playerTwoScore = currentState.scoreFromDB.playerTwo;
        let playerOneColor = "#0f3e57";
        let playerTwoColor = "#0f3e57";

        if (playerOneScore > playerTwoScore) {
            playerOneColor = "rgb(37, 176, 13)";
            playerTwoColor = "rgb(238, 63, 63)";
        } else if (playerOneScore < playerTwoScore) {
            playerOneColor = "rgb(238, 63, 63)";
            playerTwoColor = "rgb(37, 176, 13)";
        }else if (playerOneScore === playerTwoScore) {
            playerOneColor = playerTwoColor = "#0f3e57";
        }
        
        this.shadowDom.innerHTML = `
            <div style="
                    display: flex;
                    justify-content: space-between;
            ">
                <div style="
                        display: flex;
                        flex-direction: column;
                ">
                    <div style="
                            display: flex;
                            gap: 5px;
                    ">
                        <span style="
                                font-family: 'Lora';
                                font-size: 1.2rem;
                                font-weight: 400;
                                color: #000;
                        ">${currentState.rtdbData.currentGame.playerOne.name || "Jugador uno"}</span>
                        <span style="
                                font-family: 'Lora';
                                font-size: 1.2rem;
                                font-weight: 400;
                                color: ${playerOneColor};
                        ">${currentState.scoreFromDB.playerOne}</span>
                    </div>
                    <div style="
                            display: flex;
                            gap: 5px;
                    ">
                        <span style="
                                font-family: 'Lora';
                                font-size: 1.2rem;
                                font-weight: 400;
                                color: #000;
                        ">${currentState.rtdbData.currentGame.playerTwo.name || "Jugador dos"}</span>
                        <span style="
                                font-family: 'Lora';
                                font-size: 1.2rem;
                                font-weight: 400;
                                color: ${playerTwoColor};
                        ">${currentState.scoreFromDB.playerTwo}</span>
                    </div>
                </div>
                <div style="
                        display: flex;
                        flex-direction: column;
                        align-items: flex-end;
                ">
                    <span style="
                            font-family: 'Lora';
                            font-size: 1.2rem;
                            font-weight: 700;
                            color: #0f3e57;
                    ">Sala</span>
                    <span style="
                            font-family: 'Lora';
                            font-size: 1.2rem;
                            font-weight: 400;
                    ">${currentState.roomId}</span>
                </div>
            </div>
        `
    };
}
customElements.define("custom-score-data", ScoreAndRoom)