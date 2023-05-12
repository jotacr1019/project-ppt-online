const imgOfGame = require("url:../../../client/assets/9ca51c26d4784ebc942633215453adda.png")
import { state } from "../../state"
import "../../components/button/index" 
import "../../components/text/index"


export function initStartName (params){
    const div = document.createElement("div");
    const lastState = state.getState()

    div.innerHTML = `
        <custom-text class="text-initName" variant="title" font-size="3.6rem">Piedra, Papel o Tijera</custom-text>
        <img class="img-initName" src="${imgOfGame}" alt="imagen-juego-ppt">
        <Form class="form">
            <label class="label-form">Tu nombre</label>
            <input class="input-form" type="text" name="text" placeholder="Ingresa tu nombre"></input>
            <button class="input-button">Empezar</button>
        </Form>
    `
    div.className = "initName-root";

    const formEl = div.querySelector(".form");
    formEl?.addEventListener("submit", (e)=>{
        e.preventDefault();
        const f = e.target as any;
        const value = f.text.value;
        if(value !== "" && lastState.roomId){
            const capitalizedName = capitalizeFirstTwoWords(value);
            state.setUserTwoInState(capitalizedName)
            state.getRoom().then((sucess)=>{
                if(sucess){
                    state.authUser().then(()=>{
                        state.authUserInRoom().then((sucessInAuth)=>{
                            if(sucessInAuth){
                                const newState = state.getState()
                                state.listenDatabase().then((value) => {
                                    state.setState({
                                        ...state.getState(), 
                                        rtdbData: { currentGame: value.currentGame }
                                    })
                                    if(newState.rtdbData.currentGame.playerOne.userId === newState.userId){
                                        state.setOnlineOfPlayerOneInRTDB(true)
                                    }
                                    if(newState.rtdbData.currentGame.playerTwo.userId === newState.userId){
                                        state.setOnlineOfPlayerTwoInRTDB(true)
                                    }
                                    params.goTo("/reglas");
                                }).catch((error) => {
                                    console.log(error);
                                });
                            } else {
                                params.goTo("/sala-llena")
                            }
                        })
                    })
                } else {
                    div.innerHTML = `
                        <custom-text class="text-initName text_info-room" variant="title" font-size="3.1rem">Piedra, Papel o Tijera</custom-text>
                        <img class="img-initName" src="${imgOfGame}" alt="imagen-juego-ppt">
                        <div class="container_info-room">
                            <custom-text class="text_info-room" variant="normal-short">La sala '${lastState.roomId}' no existe! Asegúrate de introducir correctamente el id de la sala, o puedes iniciar un nuevo juego</custom-text>
                            <custom-button class="button_info-room" label="Entendido"></custom-button>
                        </div>
                    `
                    const btnEl = div.querySelector(".button_info-room")
                    btnEl.addEventListener("click", ()=>{
                        params.goTo("/ingresar-room")
                    })
                }
            })
        } else if (value !== ""){
            const capitalizedName = capitalizeFirstTwoWords(value);
            state.setUserOneInState(capitalizedName)   
            state.createUserOneInDB().then((sucess) => {
                if(sucess){
                    state.createRoom().then(() => {
                        params.goTo('/compartir-codigo');         
                    })
                } else {
                    div.innerHTML = `
                        <custom-text class="text-initName text_info-name" variant="title" font-size="3.1rem">Piedra, Papel o Tijera</custom-text>
                        <img class="img-initName" src="${imgOfGame}" alt="imagen-juego-ppt">
                        <div class="container_info-name">
                            <custom-text class="text-name" variant="normal-short">El usuario '${capitalizedName}' ya existe, deseas continuar con este usuario?</custom-text>
                            <div class="container-buttons-2">
                                <custom-button class="button-continue" font-size="2.2rem" label="Continuar"></custom-button>
                                <custom-button class="button-return" font-size="2.2rem" label="Volver"></custom-button>
                            </div>
                        </div>
                    `
                    const btnReturnEl = div.querySelector(".button-return")
                    btnReturnEl.addEventListener("click", ()=>{
                        params.goTo("/ingresar-nombre")
                    })
                    const btnContinueEl = div.querySelector(".button-continue")
                    btnContinueEl.addEventListener("click", ()=>{
                        state.authUser().then(() => {
                            state.createRoom().then(() => {
                                params.goTo('/compartir-codigo');         
                            })
                        })
                    })
                }       
            }).catch((error) => {
                console.log(error);
            });
        } else {
            div.innerHTML = `
                <custom-text class="text-initName" variant="title" font-size="3.4rem">Piedra, Papel o Tijera</custom-text>
                <img class="img-initName img_no-name" src="${imgOfGame}" alt="imagen-juego-ppt">
                <div class="container_no-name">
                    <custom-text class="text_no-name" variant="normal-short">Favor ingresar un nombre para jugar</custom-text>
                    <custom-button class="button_no-name" label="Entendido"></custom-button>
                </div>
            `
            
            const btnEl = div.querySelector(".button_no-name")
            btnEl.addEventListener("click", ()=>{
                params.goTo("/ingresar-nombre")
            })
        }
    })
    return div;
}

function capitalizeFirstLetter(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}

function capitalizeFirstTwoWords(name: string) {
    let words = name.split(" ");
    if (words.length >= 2) {
        return words.slice(0, 2).map(word => capitalizeFirstLetter(word)).join(" ") +
            " " + words.slice(2).map(word => capitalizeFirstLetter(word)).join(" ");
    } else {
        return capitalizeFirstLetter(name);
    }
}

