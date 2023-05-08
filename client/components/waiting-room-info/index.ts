import { state } from "../../state";

export class WaitingInfo extends HTMLElement {
    shadowDom = this.attachShadow({mode: "open"});
    constructor(){
        super();
        this.render();
    }
    render(){
        state.listenDatabase().then(()=>{
            const currentState = state.getState()
            
            if(currentState.rtdbData.currentGame.playerOne.start === false){
                this.shadowDom.innerHTML = `
                    <div style="
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                    ">
                        <span style="
                                font-family: 'Lora';
                                font-size: 2rem;
                                font-weight: 600;
                                text-align: center;
                        ">Esperando a que <strong style="color: #0f3e57">${currentState.rtdbData.currentGame.playerOne.name}</strong> presione</span>
                        <span style="
                                font-family: 'Lora';
                                font-size: 2rem;
                                font-weight: 600;
                        ">¡Jugar!...</span>
                    </div>
                `
            } else if(currentState.rtdbData.currentGame.playerTwo.start === false){
                this.shadowDom.innerHTML = `
                    <div style="
                            display: flex;
                            flex-direction: column;
                            justify-content: center;
                            align-items: center;
                    ">
                        <span style="
                                font-family: 'Lora';
                                font-size: 2rem;
                                font-weight: 600;
                                text-align: center;
                        ">Esperando a que <strong style="color: #0f3e57">${currentState.rtdbData.currentGame.playerTwo.name}</strong> presione</span>
                        <span style="
                                font-family: 'Lora';
                                font-size: 2rem;
                                font-weight: 600;
                        ">¡Jugar!...</span>
                    </div>
                `
            }
        })
    };
}
customElements.define("custom-waiting-info", WaitingInfo)