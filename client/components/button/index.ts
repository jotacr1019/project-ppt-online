export class Button extends HTMLElement {
    shadowDom = this.attachShadow({mode: "open"});
    constructor(){
        super();
        this.render();
    }
    render(){
        const label = this.getAttribute("label");
        const fontSize = this.getAttribute("font-size") || "2.8rem";

        this.shadowDom.innerHTML = `
            <button style="
                font-family: 'Odibee Sans';
                font-weight: 400;
                font-size: ${fontSize};
                color: #fff;
                height: 75px;
                width: 100%;
                background-color: #006CFC;
                border: none;
                border-radius: 8px;
            ">${label}</button>
        `
    };
}
customElements.define("custom-button", Button)