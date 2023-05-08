import { state } from "../../state";

export class ShareCode extends HTMLElement {
    shadowDom = this.attachShadow({mode: "open"});
    constructor(){
        super();
        this.render();
    }
    render(){
        const lastState = state.getState()

        this.shadowDom.innerHTML = `
            <div style="
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 16px;
            ">
                <span style="
                        font-family: 'Lora';
                        font-size: 2rem;
                        font-weight: 600;
                ">Compartí el código:</span>
                <span style="
                        font-family: 'Lora';
                        font-size: 2.5rem;
                        font-weight: 700;
                ">${lastState.roomId}</span>
                <span style="
                        font-family: 'Lora';
                        font-size: 2rem;
                        font-weight: 600;
                ">con tu contrincante</span>
            </div>
        `
    };
}
customElements.define("custom-share-code", ShareCode)