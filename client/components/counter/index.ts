export class Counter extends HTMLElement {
    shadowDom = this.attachShadow({mode: "open"});
    constructor(){
        super();
        this.render();
    }
    
    render(){
        this.shadowDom.innerHTML= `
            <h2 class="counter" style="
                                font-family: 'Odibee Sans';
                                font-size: 8rem;
                                font-weight: 700;
                                margin: 0;
            ">3</h2>
        `
        const counterEl: any = this.shadowDom.querySelector(".counter")

        const interval = setInterval(function(){
            counterEl.addEventListener("change", ()=>{
                counterEl.textContent = counterEl.textContent;
            })
            counterEl.textContent--;
            if(counterEl.textContent <= 1){
                clearInterval(interval)
            }
        }, 1500)
    };
}
customElements.define("custom-counter", Counter)