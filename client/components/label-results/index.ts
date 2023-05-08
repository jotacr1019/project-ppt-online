export class LabelResult extends HTMLElement {
    shadowDom = this.attachShadow({mode: "open"});
    constructor(){
        super();
        this.render();
    }
    render(){
        const label = this.getAttribute("label");
        const backgroundColor = this.getAttribute("background-color") || "#000";

        this.shadowDom.innerHTML = `
            <div style="
                    border: solid 8px #000;
                    background-color: ${backgroundColor};
                    ">
                <h2 style="
                        color: #fff;
                        font-size: 3.4rem;
                        margin: 0;
                        padding: 8px 15px;
                        text-align: center;
                ">${label}</h2>
            </div>
        `
    };
}
customElements.define("custom-label-results", LabelResult)