export class Typografy extends HTMLElement {
    constructor(){
        super();
        this.render();
    }
    render(){
        const shadowDom = this.attachShadow({mode: "open"});
        const variant = this.getAttribute("variant") || "body";
        const fontSize = this.getAttribute("font-size") || "4.8rem";
        const span = document.createElement("span");
        const style = document.createElement("style");

        style.innerHTML = `
            .title{
                font-family: 'Lora';
                font-size: ${fontSize};
                font-weight: 700;
            }
            .body{
                font-family: 'Lora';
                font-size: 2.5rem;
                font-weight: 600;
            }
            .normal-high{
                font-family: 'Odibee Sans';
                font-size: 3.4rem;
                font-weight: 400;
            }
            .normal{
                font-family: 'Odibee Sans';
                font-size: 2.8rem;
                font-weight: 400;
            }
            .normal-short{
                font-family: 'Odibee Sans';
                font-size: 2.2rem;
                font-weight: 400;
            }
        `

        span.className = variant;
        span.textContent = this.textContent;
        shadowDom.appendChild(style);
        shadowDom.appendChild(span);
    };
}
customElements.define("custom-text", Typografy)