const imgOfGame = require("url:../../../client/assets/9ca51c26d4784ebc942633215453adda.png")
import { state } from "../../state"
import "../../components/button/index" 
import "../../components/text/index"


export function initStartRoom (params){
    const div = document.createElement("div");

    div.innerHTML = `
        <custom-text class="text-initRoom" variant="title" font-size="3.6rem">Piedra, Papel o Tijera</custom-text>
        <img class="img-initRoom" src="${imgOfGame}" alt="imagen-juego-ppt">
        <Form class="form-room">
            <input class="input_form-room" type="text" name="text" placeholder="Código"></input>
            <button class="input_button-room">Ingresar a la sala</button>
        </Form>
    `
    div.className = "initRoom-root";

    const formEl = div.querySelector(".form-room");
    formEl.addEventListener("submit", (e)=>{
        e.preventDefault();
        const f = e.target as any;
        const value = f.text.value;
        if (value !== ""){
            state.setRoomIdInState(value)    
            params.goTo("/ingresar-nombre")
        } else {
            div.innerHTML = `
                <custom-text class="text-initRoom" variant="title" font-size="3.1rem">Piedra, Papel o Tijera</custom-text>
                <img class="img-initRoom img_no-code" src="${imgOfGame}" alt="imagen-juego-ppt">
                <div class="container_no-code">
                    <custom-text class="text-info" variant="normal-short">Favor ingresar un código válido para jugar</custom-text>
                    <custom-button class="button-info" label="Entendido"></custom-button>
                </div>
            `

            const btnEl = div.querySelector(".button-info")
            btnEl.addEventListener("click", ()=>{
                params.goTo("/ingresar-room")
            })
        }
    })
    return div;
}