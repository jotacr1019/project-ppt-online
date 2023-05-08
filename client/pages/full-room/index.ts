const imgOfGame = require("url:../../../client/assets/9ca51c26d4784ebc942633215453adda.png")
import "../../components/button/index" 
import "../../components/text/index"


export function initFullRoom (params){
    const div = document.createElement("div");

    div.innerHTML = `
        <custom-text class="text_full-room" variant="title" font-size="3.8rem">Piedra, Papel o Tijera</custom-text>
        <img class="img-initName" src="${imgOfGame}" alt="imagen-juego-ppt">
        <div class="container_full-room">
            <custom-text class="text_full_room" variant="normal-short">Ups, esta sala está completa, y tu nombre no coincide con los usuarios de la sala.</custom-text>
            <custom-button class="button_full-room" label="Regresar al inicio"></custom-button>
        </div>
    `
    div.className = "root-full_room";

    const btnEl = div.querySelector(".button_full-room");
    if(btnEl){
        btnEl.addEventListener("click", ()=>{
            params.goTo("/inicio")
        })
    }
    return div;
}