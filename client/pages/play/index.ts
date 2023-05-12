import { getDatabase, ref, onValue, set } from "firebase/database"
import { rtdbFirebase } from "../../rtdb"
import { state } from "../../state"
import "../../components/button/index" 
import "../../components/text/index"
import "../../components/plays/index"
import "../../components/counter/index"


const currentState = state.getState()

export function initPlays (params){
    if(currentState.userId === currentState.rtdbData.currentGame.playerOne.userId){
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="container-counter">
                <custom-counter count="3" class="counter"></custom-counter>
            </div>
            <div class="progress-bar"></div>
            <custom-plays class="custom-plays"></custom-plays>
        `
        div.className = "root-play";
        document.body.appendChild(div);

        const progressBar: any = div.querySelector(".progress-bar");
        progressBar.style.visibility = "hidden";
    
        const counterContent: any = div.querySelector(".counter");
        let counterAttribute: any = counterContent?.getAttribute("count");
        let countNumber: number = JSON.parse(counterAttribute);
        
        const intervalPlayerOne = setInterval(function(){
            let newCountNumber = countNumber - 1;
            countNumber = newCountNumber;
            const lastState = state.getState()
            
            if (countNumber <= 0){
                clearInterval(intervalPlayerOne)

                if(lastState.rtdbData.currentGame.playerOne.choice === ""){
                    state.setPlayerOneMoveInState("null", (()=>{   
                        state.setPlayerOneMoveInRTDB(()=>{
                            state.setStartOfPlayerOneInRTDB(false)
                            state.setStartOfPlayerTwoInRTDB(false)
                            params.goTo("/reglas")
                        })
                    }))
                }
            }
        }, 1500);
    
        state.subscribe(()=>{
            if(!currentState.playRoomInitialized){
                currentState.playRoomInitialized = true;
                const rtdbRef = ref(rtdbFirebase, `/rooms/${currentState.longRoomId}`);
            
                onValue(rtdbRef, (snapshot) => { 
                    const value = snapshot.val(); 

                    if(value.currentGame.playerOne.choice !== "" && 
                    value.currentGame.playerOne.choice !== "null"){
                        clearInterval(intervalPlayerOne)

                        if(value.currentGame.playerTwo.choice !== "" &&
                        value.currentGame.playerTwo.choice !== "null"&&
                        currentState.playRoomInitialized){
                            const resultOfWhoWins = state.whoWins(value.currentGame.playerOne.choice, value.currentGame.playerTwo.choice)
                            
                            const div = document.querySelector(".root-play");
                            if (div && div.parentNode) {
                                div.parentNode.removeChild(div);
                            }
                            createDiv()

                            if(resultOfWhoWins?.includes("p1Winner") || resultOfWhoWins?.includes("p2Winner") || resultOfWhoWins?.includes("tied")){
                                state.setPlaysInDBHistory()

                                if(resultOfWhoWins.includes("p1Winner")){
                                    state.updateScoreInDB("playerOne")
                                }

                                if(resultOfWhoWins.includes("p2Winner")){
                                    state.updateScoreInDB("playerTwo")
                                }
                                currentState.playRoomInitialized = false;
                                state.setState(currentState);
                            }
                        } else if (value.currentGame.playerTwo.choice === "null"){
                            params.goTo("/reglas")
                        }
                    }
                });
            }
        });
    
        function timerToRederect(){
            setTimeout(() => {
                const newDiv = document.querySelector(".root-play-reverse");
                if (newDiv && newDiv.parentNode) {
                    newDiv.parentNode.removeChild(newDiv);
                    params.goTo("/resultados")
                }
            }, 1000);
        }

        function createDiv(){
            const newDiv = document.createElement("div"); 
            
            newDiv.innerHTML = `
                <custom-plays class="custom-plays-reverse" style="
                                                            transform: rotate(180deg);
                "></custom-plays>
                <div class="progress-bar"></div>
                <custom-plays class="custom-plays"></custom-plays>
            `
            newDiv.className = "root-play-reverse";
            document.body.appendChild(newDiv);
        
            const rootElAgain: any = document.querySelector(".root-play-reverse");
            if(rootElAgain){
                rootElAgain.style.animationDuration =  "3s";
                rootElAgain.style.transitionTimingFunction =  "ease-in";
                rootElAgain.style.animationFillMode = "both";
                rootElAgain.style.animationName = "fadeIn";
            }

            const customPlaysEl: any = newDiv.querySelector(".custom-plays")
            const shadowRootDeCustomPlays = customPlaysEl.shadowRoot;
            const childNodesDeCustomPlays: any = Array.from(shadowRootDeCustomPlays.childNodes);
            customPlaysEl.style.pointerEvents =  "none";

            const customPlaysReverseEl: any = newDiv.querySelector(".custom-plays-reverse")
            const shadowRootDeCustomPlaysReverse = customPlaysReverseEl.shadowRoot;
            const childNodesDeCustomPlaysReverse: any = Array.from(shadowRootDeCustomPlaysReverse.childNodes);
            customPlaysReverseEl.style.pointerEvents =  "none";

            const scissorsEl = childNodesDeCustomPlays[1].querySelector(".img-scissors");
            const paperEl = childNodesDeCustomPlays[1].querySelector(".img-paper");
            const rockEl = childNodesDeCustomPlays[1].querySelector(".img-rock");

            const scissorsReverseEl = childNodesDeCustomPlaysReverse[1].querySelector(".img-scissors")
            const paperReverseEl = childNodesDeCustomPlaysReverse[1].querySelector(".img-paper");
            const rockReverseEl = childNodesDeCustomPlaysReverse[1].querySelector(".img-rock")
        
            const lastState = state.getState()

            if(lastState.rtdbData.currentGame.playerOne.choice === "scissors"){
                paperEl.style.opacity = "0.3";
                rockEl.style.opacity = "0.3";
                scissorsEl.style.width = "150px";
                scissorsEl.style.height = "150px";
                rockEl.style.width = "70px";
                rockEl.style.height = "70px";
                paperEl.style.width = "70px";
                paperEl.style.height = "70px";
            }
        
            if(lastState.rtdbData.currentGame.playerOne.choice === "paper"){
                scissorsEl.style.opacity = "0.3";
                rockEl.style.opacity = "0.3";
                paperEl.style.width = "150px";
                paperEl.style.height = "150px";
                rockEl.style.width = "70px";
                rockEl.style.height = "70px";
                scissorsEl.style.width = "70px";
                scissorsEl.style.height = "70px";
            }

            if(lastState.rtdbData.currentGame.playerOne.choice === "rock"){
                paperEl.style.opacity = "0.3";
                scissorsEl.style.opacity = "0.3";
                rockEl.style.width = "150px";
                rockEl.style.height = "150px";
                scissorsEl.style.width = "70px";
                scissorsEl.style.height = "70px";
                paperEl.style.width = "70px";
                paperEl.style.height = "70px";
            }

            if(lastState.rtdbData.currentGame.playerTwo.choice === "scissors"){
                paperReverseEl.style.opacity = "0.3";
                rockReverseEl.style.opacity = "0.3";
                scissorsReverseEl.style.width = "150px";
                scissorsReverseEl.style.height = "150px";
                rockReverseEl.style.width = "70px";
                rockReverseEl.style.height = "70px";
                paperReverseEl.style.width = "70px";
                paperReverseEl.style.height = "70px";
            }

            if(lastState.rtdbData.currentGame.playerTwo.choice === "paper"){
                scissorsReverseEl.style.opacity = "0.3";
                rockReverseEl.style.opacity = "0.3";
                paperReverseEl.style.width = "150px";
                paperReverseEl.style.height = "150px";
                rockReverseEl.style.width = "70px";
                rockReverseEl.style.height = "70px";
                scissorsReverseEl.style.width = "70px";
                scissorsReverseEl.style.height = "70px";
            }

            if(lastState.rtdbData.currentGame.playerTwo.choice === "rock"){
                scissorsReverseEl.style.opacity = "0.3";
                paperReverseEl.style.opacity = "0.3";
                rockReverseEl.style.width = "150px";
                rockReverseEl.style.height = "150px";
                paperReverseEl.style.width = "70px";
                paperReverseEl.style.height = "70px";
                scissorsReverseEl.style.width = "70px";
                scissorsReverseEl.style.height = "70px";
            }

            clearInterval(intervalPlayerOne) 
            let newNumberForCount = 3;
            const intervalInside = setInterval(function(){
                let newCountInside = newNumberForCount - 1;
                newNumberForCount = newCountInside;
                if(newNumberForCount <= -48){
                    timerToRederect()
                    clearInterval(intervalInside)
                }
            }, 1000)
        }
        return div;
    }
    

    if(currentState.userId === currentState.rtdbData.currentGame.playerTwo.userId){
        const div = document.createElement("div");
        div.innerHTML = `
            <div class="container-counter">
                <custom-counter count="3" class="counter"></custom-counter>
            </div>
            <div class="progress-bar"></div>
            <custom-plays class="custom-plays"></custom-plays>
        `
        div.className = "root-play";
        document.body.appendChild(div);
    
        const progressBar: any = div.querySelector(".progress-bar");
        progressBar.style.visibility = "hidden";
    
        const counterContent: any = div.querySelector(".counter");
        let counterAttribute: any = counterContent?.getAttribute("count");
        let countNumber: number = JSON.parse(counterAttribute);
        
        const intervalPlayerTwo = setInterval(function(){
            let newCountNumber = countNumber - 1;
            countNumber = newCountNumber;
            const lastState = state.getState()
            
            if (countNumber <= 0){
                clearInterval(intervalPlayerTwo)

                if(lastState.rtdbData.currentGame.playerTwo.choice === ""){
                    state.setPlayerTwoMoveInState("null", (()=>{   
                        state.setPlayerTwoMoveInRTDB(()=>{
                            state.setStartOfPlayerOneInRTDB(false)
                            state.setStartOfPlayerTwoInRTDB(false)
                            params.goTo("/reglas")
                        })
                    }))
                }
            }
        }, 1500);
    
        state.subscribe(()=>{
            if(!currentState.playRoomInitialized){
                currentState.playRoomInitialized = true;
                const rtdbRef = ref(rtdbFirebase, `/rooms/${currentState.longRoomId}`);
    
                onValue(rtdbRef, (snapshot) => { 
                    const value = snapshot.val();

                    if(value.currentGame.playerTwo.choice !== "" && 
                    value.currentGame.playerTwo.choice !== "null"){
                        clearInterval(intervalPlayerTwo)

                        if(value.currentGame.playerOne.choice !== "" &&
                        value.currentGame.playerOne.choice !== "null"&&
                        currentState.playRoomInitialized){
                            const resultOfWhoWins = state.whoWins(value.currentGame.playerOne.choice, value.currentGame.playerTwo.choice)

                            const div = document.querySelector(".root-play");
                            if (div && div.parentNode) {
                                div.parentNode.removeChild(div);
                            }
                            createDiv()

                            if(resultOfWhoWins?.includes("p1Winner") || resultOfWhoWins?.includes("p2Winner") || resultOfWhoWins?.includes("tied")){
                                currentState.playRoomInitialized = false;
                                state.setState(currentState);
                            }
                        } else if (value.currentGame.playerOne.choice === "null"){
                            params.goTo("/reglas")
                        }
                    }
                });
            }
        });

        function timerToRederect(){
            setTimeout(() => {
                const newDiv = document.querySelector(".root-play-reverse");
                if (newDiv && newDiv.parentNode) {
                    newDiv.parentNode.removeChild(newDiv);
                    params.goTo("/resultados")
                }
            }, 1000);
        }
    
        function createDiv(){
            const newDiv = document.createElement("div"); 
            newDiv.innerHTML = `
                <custom-plays class="custom-plays-reverse" style="
                                                            transform: rotate(180deg);
                "></custom-plays>
                <div class="progress-bar"></div>
                <custom-plays class="custom-plays"></custom-plays>
            `
            newDiv.className = "root-play-reverse";
            document.body.appendChild(newDiv);
        
            const rootEl: any = document.querySelector(".root-play-reverse");
            if(rootEl){
                rootEl.style.animationDuration =  "3s";
                rootEl.style.transitionTimingFunction =  "ease-in";
                rootEl.style.animationFillMode = "both";
                rootEl.style.animationName = "fadeIn";
            }

            const customPlaysEl: any = newDiv.querySelector(".custom-plays")
            const shadowRootDeCustomPlays = customPlaysEl.shadowRoot;
            const childNodesDeCustomPlays: any = Array.from(shadowRootDeCustomPlays.childNodes);
            customPlaysEl.style.pointerEvents =  "none";

            const customPlaysReverseEl: any = newDiv.querySelector(".custom-plays-reverse")
            const shadowRootDeCustomPlaysReverse = customPlaysReverseEl.shadowRoot;
            const childNodesDeCustomPlaysReverse: any = Array.from(shadowRootDeCustomPlaysReverse.childNodes);
            customPlaysReverseEl.style.pointerEvents =  "none";

            const scissorsEl = childNodesDeCustomPlays[1].querySelector(".img-scissors");
            const paperEl = childNodesDeCustomPlays[1].querySelector(".img-paper");
            const rockEl = childNodesDeCustomPlays[1].querySelector(".img-rock");

            const scissorsReverseEl = childNodesDeCustomPlaysReverse[1].querySelector(".img-scissors")
            const paperReverseEl = childNodesDeCustomPlaysReverse[1].querySelector(".img-paper");
            const rockReverseEl = childNodesDeCustomPlaysReverse[1].querySelector(".img-rock")
        
            const lastState = state.getState()

            if(lastState.rtdbData.currentGame.playerTwo.choice === "scissors"){
                paperEl.style.opacity = "0.3";
                rockEl.style.opacity = "0.3";
                scissorsEl.style.width = "150px";
                scissorsEl.style.height = "150px";
                rockEl.style.width = "70px";
                rockEl.style.height = "70px";
                paperEl.style.width = "70px";
                paperEl.style.height = "70px";
            }

            if(lastState.rtdbData.currentGame.playerTwo.choice === "paper"){
                scissorsEl.style.opacity = "0.3";
                rockEl.style.opacity = "0.3";
                paperEl.style.width = "150px";
                paperEl.style.height = "150px";
                rockEl.style.width = "70px";
                rockEl.style.height = "70px";
                scissorsEl.style.width = "70px";
                scissorsEl.style.height = "70px";
            }

            if(lastState.rtdbData.currentGame.playerTwo.choice === "rock"){
                paperEl.style.opacity = "0.3";
                scissorsEl.style.opacity = "0.3";
                rockEl.style.width = "150px";
                rockEl.style.height = "150px";
                scissorsEl.style.width = "70px";
                scissorsEl.style.height = "70px";
                paperEl.style.width = "70px";
                paperEl.style.height = "70px";
            }

            if(lastState.rtdbData.currentGame.playerOne.choice === "scissors"){
                paperReverseEl.style.opacity = "0.3";
                rockReverseEl.style.opacity = "0.3";
                scissorsReverseEl.style.width = "150px";
                scissorsReverseEl.style.height = "150px";
                rockReverseEl.style.width = "70px";
                rockReverseEl.style.height = "70px";
                paperReverseEl.style.width = "70px";
                paperReverseEl.style.height = "70px";
            }

            if(lastState.rtdbData.currentGame.playerOne.choice === "paper"){
                scissorsReverseEl.style.opacity = "0.3";
                rockReverseEl.style.opacity = "0.3";
                paperReverseEl.style.width = "150px";
                paperReverseEl.style.height = "150px";
                rockReverseEl.style.width = "70px";
                rockReverseEl.style.height = "70px";
                scissorsReverseEl.style.width = "70px";
                scissorsReverseEl.style.height = "70px";
            }

            if(lastState.rtdbData.currentGame.playerOne.choice === "rock"){
                scissorsReverseEl.style.opacity = "0.3";
                paperReverseEl.style.opacity = "0.3";
                rockReverseEl.style.width = "150px";
                rockReverseEl.style.height = "150px";
                paperReverseEl.style.width = "70px";
                paperReverseEl.style.height = "70px";
                scissorsReverseEl.style.width = "70px";
                scissorsReverseEl.style.height = "70px";
            }

            clearInterval(intervalPlayerTwo) 
            let newNumberForCount = 3;
            const intervalInside = setInterval(function(){
                let newCountInside = newNumberForCount - 1;
                newNumberForCount = newCountInside;
                if(newNumberForCount <= -48){
                    timerToRederect()
                    clearInterval(intervalInside)
                }
            }, 1000)
            return newDiv
        }
        return div;
    }
}