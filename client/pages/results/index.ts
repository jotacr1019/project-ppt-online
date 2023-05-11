import "../../components/button/index"
import "../../components/score/index"
import "../../components/label-results/index"
import { state } from "../../state"



export function initResults (params){
    const div = document.createElement("div");

    const currentState = state.getState();
    currentState.rtdbData.currentGame.playerOne.start = false;
    currentState.rtdbData.currentGame.playerTwo.start = false;
    state.setState(currentState)

    console.log(currentState.rtdbData.currentGame.playerOne.choice);
    console.log(currentState.rtdbData.currentGame.playerTwo.choice);
    
    const resultInPlay = state.whoWins(currentState.rtdbData.currentGame.playerOne.choice, currentState.rtdbData.currentGame.playerTwo.choice);

    if(currentState.userId === currentState.rtdbData.currentGame.playerOne.userId){
        if(resultInPlay === "p1Winner"){
            div.innerHTML = `
                <custom-label-results label="Ganaste" background-color="var(--color-ganador)"></custom-label-results>
                <custom-score class="score"></custom-score>
                <custom-button class="btn-one" label="Volver a jugar"></custom-button>
                <custom-button class="btn-reset" label="Iniciar un nuevo juego"></custom-button>
            `
            div.className = "root-results-win";
        }
    
        if (resultInPlay === "p2Winner"){
            div.innerHTML = `
                <custom-label-results label="Perdiste" background-color="var(--color-perdedor)"></custom-label-results>
                <custom-score class="score"></custom-score>
                <custom-button class="btn-one" label="Volver a jugar"></custom-button>
                <custom-button class="btn-reset" label="Iniciar un nuevo juego"></custom-button>
            `
            div.className = "root-results-lose";
        }
    
        if(resultInPlay === "tied"){
            div.innerHTML = `
                <custom-label-results label="Empataste" background-color="var(--color-empate)"></custom-label-results>
                <custom-score class="score"></custom-score>
                <custom-button class="btn-one" label="Volver a jugar"></custom-button>
                <custom-button class="btn-reset" label="Iniciar un nuevo juego"></custom-button>
            `
            div.className = "root-results-tie";
        }

        const btnEl = div.querySelector(".btn-one");
        btnEl?.addEventListener("click", ()=>{
            const lastState = state.getState();
            if(lastState.rtdbData.currentGame.playerTwo.start === true){
                state.setStartOfPlayerOneInRTDB(false)
                state.setStartOfPlayerTwoInRTDB(true)
                params.goTo("/reglas")
            } else {
                state.setStartOfPlayerOneInRTDB(false)
                state.setStartOfPlayerTwoInRTDB(false)
                params.goTo("/reglas")
            }
        })
        state.setStartOfPlayerOneInRTDB(false)
        state.setStartOfPlayerTwoInRTDB(false)
    }


    if(currentState.userId === currentState.rtdbData.currentGame.playerTwo.userId){
        if(resultInPlay === "p1Winner"){
            div.innerHTML = `
                <custom-label-results label="Perdiste" background-color="var(--color-perdedor)"></custom-label-results>
                <custom-score class="score"></custom-score>
                <custom-button class="btn-two" label="Volver a jugar"></custom-button>
                <custom-button class="btn-reset" label="Iniciar un nuevo juego"></custom-button>
            `
            div.className = "root-results-lose";
        }
    
        if (resultInPlay === "p2Winner"){
            div.innerHTML = `
                <custom-label-results label="Ganaste" background-color="var(--color-ganador)"></custom-label-results>
                <custom-score class="score"></custom-score>
                <custom-button class="btn-two" label="Volver a jugar"></custom-button>
                <custom-button class="btn-reset" label="Iniciar un nuevo juego"></custom-button>
            `
            div.className = "root-results-win";
        }
    
        if(resultInPlay === "tied"){
            div.innerHTML = `
                <custom-label-results label="Empataste" background-color="var(--color-empate)"></custom-label-results>
                <custom-score class="score"></custom-score>
                <custom-button class="btn-two" label="Volver a jugar"></custom-button>
                <custom-button class="btn-reset" label="Iniciar un nuevo juego"></custom-button>
            `
            div.className = "root-results-tie";
        }

        const btnEl = div.querySelector(".btn-two");
        btnEl?.addEventListener("click", ()=>{
            const lastState = state.getState();
            if(lastState.rtdbData.currentGame.playerOne.start === true){
                state.setStartOfPlayerOneInRTDB(true)
                state.setStartOfPlayerTwoInRTDB(false)
                params.goTo("/reglas")
            } else {
                state.setStartOfPlayerOneInRTDB(false)
                state.setStartOfPlayerTwoInRTDB(false)
                params.goTo("/reglas")
            }
        })
    }

    const btnReset = div.querySelector(".btn-reset");
    btnReset?.addEventListener("click", ()=>{
        div.innerHTML = `
            <custom-label-results label="Warning!" background-color="rgb(192, 101, 101)"></custom-label-results>
            <custom-score class="score"></custom-score>
            <div class="container_warning">
                <custom-text class="text-warning" variant="normal-short">Si inicias un nuevo juego se borrará el historial actual!</custom-text>
                <div class="container-btns">
                    <custom-button class="btn-warning" label="Aceptar"></custom-button>
                    <custom-button class="btn-back" label="Atrás"></custom-button>
                </div>
            </div>
        `
        div.className = "root_results-warning";

        const btnBack = div.querySelector(".btn-back");
        btnBack?.addEventListener("click", ()=>{
            params.goTo("/resultados")
        })

        const btnWarning = div.querySelector(".btn-warning")
        btnWarning.addEventListener("click", ()=>{
            state.setState({
                rtdbData: {
                    currentGame:{
                        playerOne:{
                            userId: "",
                            choice: "",
                            name:"",
                            online: false,
                            start: false
                        },
                        playerTwo:{
                            userId: "",
                            choice: "",
                            name:"",
                            online: false,
                            start: false
                        }
                    }
                },
                currentGameInState: {   
                    playerOneMove: "",
                    playerTwoMove: ""
                },
                scoreFromDB: {
                    playerOne: 0,
                    playerTwo: 0
                },
                user: "",
                roomId: "",
                longRoomId: "",
                userId: "",
                shareCodeRoomInitialized: false,
                waitingRoomInitialized: false,
                playRoomInitialized: false
            });
            localStorage.removeItem("saved-online-game");
            params.goTo("/inicio")
        })
    })
    return div;
}

