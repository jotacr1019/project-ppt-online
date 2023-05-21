const API_BASE_URL = process.env.API_BASE_URL
import { getDatabase, ref, onValue, set } from "firebase/database"
import { rtdbFirebase } from "./rtdb"
import * as dotenv from 'dotenv';
dotenv.config()


type Plays = "rock" | "paper" | "scissors" | "null";

const state = {
    data: {
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
    },

    listeners: [],

    getState(){
        return this.data;
    },

    setState(newState: object){
        this.data = newState;
        for (const cb of this.listeners){
            cb();
            this.listeners = [];
        }
        localStorage.setItem("saved-online-game", JSON.stringify(newState));
    },

    subscribe(callBack: (any)=>any){
        this.listeners.push(callBack);
    },

    initOfHistory(){
        const dataOfHistory: any = localStorage.getItem("saved-online-game");
        if(dataOfHistory !== null){
            this.setState(JSON.parse(dataOfHistory))
        }   
    },

    listenDatabase() {
        return new Promise<{currentGame: any}>((resolve, reject) => {
            const rtdbRef = ref(rtdbFirebase, `/rooms/${this.data.longRoomId}`);
            onValue(rtdbRef, (snapshot) => {
                const currentState = this.getState();
                const value = snapshot.val();
                currentState.rtdbData.currentGame = value.currentGame;
                this.setState(currentState);
                resolve(value); 
            }, (error) => {
                reject(error); 
            });
        });
    },
    
    setUserOneInState(user: string){
        const currentState = this.getState();
        currentState.user = user;
        currentState.rtdbData.currentGame.playerOne.name = user;
        this.setState(currentState);
    },

    setUserTwoInState(user: string){
        const currentState = this.getState();
        currentState.user = user;
        this.setState(currentState);
    },

    setRoomIdInState(roomId){
        const currentState = this.getState();
        currentState.roomId = roomId;
        this.setState(currentState)
    },

    setPlayerOneMoveInState(myMove: Plays, cb){
        const currentState = this.getState();
        currentState.currentGameInState.playerOneMove = myMove;
        currentState.rtdbData.currentGame.playerOne.choice = myMove;
        this.setState(currentState);
        cb()
    },

    setPlayerOneMoveInRTDB(cb?: Function){
        this.listenDatabase().then(()=>{
            const currentState = this.getState();
            const rtdbRef = ref(rtdbFirebase, `/rooms/${currentState.longRoomId}/currentGame`);
            set(rtdbRef, {
                playerOne: {
                    choice: currentState.currentGameInState.playerOneMove,
                    userId: currentState.rtdbData.currentGame.playerOne.userId,
                    name: currentState.rtdbData.currentGame.playerOne.name,
                    online: currentState.rtdbData.currentGame.playerOne.online,
                    start: currentState.rtdbData.currentGame.playerOne.start
                },
                playerTwo: {
                    choice: currentState.rtdbData.currentGame.playerTwo.choice || "",
                    userId: currentState.rtdbData.currentGame.playerTwo.userId,
                    name: currentState.rtdbData.currentGame.playerTwo.name,
                    online: currentState.rtdbData.currentGame.playerTwo.online,
                    start: currentState.rtdbData.currentGame.playerTwo.start
                }
            }).then(()=>{
                if(typeof cb === 'function'){
                    cb()
                }
            }).catch((error)=>{
                console.error(error)
            })
        })
    },

    async setPlayerTwoMoveInState(myMove: Plays, cb){
        const currentState = this.getState();
        currentState.currentGameInState.playerTwoMove = myMove;
        currentState.rtdbData.currentGame.playerTwo.choice = myMove;
        await this.setState(currentState)
        cb()
    },

    async setPlayerTwoMoveInRTDB(cb?: Function){
        this.listenDatabase().then(()=>{
            const currentState = this.getState();
            const rtdbRef = ref(rtdbFirebase, `/rooms/${currentState.longRoomId}/currentGame`);
            set(rtdbRef, {
                playerOne: {
                    choice: currentState.rtdbData.currentGame.playerOne.choice || "",
                    userId: currentState.rtdbData.currentGame.playerOne.userId,
                    name: currentState.rtdbData.currentGame.playerOne.name,
                    online: currentState.rtdbData.currentGame.playerOne.online,
                    start: currentState.rtdbData.currentGame.playerOne.start
                },
                playerTwo: {
                    choice: currentState.currentGameInState.playerTwoMove,
                    userId: currentState.rtdbData.currentGame.playerTwo.userId,
                    name: currentState.rtdbData.currentGame.playerTwo.name,
                    online: currentState.rtdbData.currentGame.playerTwo.online,
                    start: currentState.rtdbData.currentGame.playerTwo.start
                }
            }).then(()=>{
                if(typeof cb === 'function'){
                    cb()
                }
            }).catch((error)=>{
                console.error(error)
            })
        })
    },

    async setPlaysInDBHistory(){
        const currentState = this.getState()
        const response = await fetch(API_BASE_URL + '/playsInHistory', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                longRoomId: currentState.longRoomId,
                playerOneId: currentState.rtdbData.currentGame.playerOne.userId,
                playerTwoId: currentState.rtdbData.currentGame.playerTwo.userId,
                currentGame: {
                    playerOne: {
                        name: currentState.rtdbData.currentGame.playerOne.name,
                        move: currentState.rtdbData.currentGame.playerOne.choice
                    },
                    playerTwo: {
                        name: currentState.rtdbData.currentGame.playerTwo.name,
                        move: currentState.rtdbData.currentGame.playerTwo.choice
                    }
                }
            })
        })
        const result = await response.json();
    },

    async setIdOfPlayerTwoInDB(){
        const currentState = this.getState()
        const response = await fetch(API_BASE_URL + '/setId', {
            method: 'PATCH',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                longRoomId: currentState.longRoomId,
                playerTwoId: currentState.userId,
            })
        })
        const result = await response.json()
    },

    setStartOfPlayerOneInRTDB(param: Boolean){
        const currentState = this.getState()
        const rtdbRef = ref(rtdbFirebase, `/rooms/${currentState.longRoomId}/currentGame`);
        set(rtdbRef, {
            playerOne: {
                choice: "",
                userId: currentState.rtdbData.currentGame.playerOne.userId,
                name: currentState.rtdbData.currentGame.playerOne.name,
                online: true,
                start: param
            },
            playerTwo: {
                choice: "",
                userId: currentState.rtdbData.currentGame.playerTwo.userId,
                name: currentState.rtdbData.currentGame.playerTwo.name,
                online: true,
                start: currentState.rtdbData.currentGame.playerTwo.start
            }
        })
    },

    setStartOfPlayerTwoInRTDB(param: Boolean){
        const currentState = this.getState()
        const rtdbRef = ref(rtdbFirebase, `/rooms/${currentState.longRoomId}/currentGame`);
        set(rtdbRef, {
            playerOne: {
                choice: "",
                userId: currentState.rtdbData.currentGame.playerOne.userId,
                name: currentState.rtdbData.currentGame.playerOne.name,
                online: true,
                start: currentState.rtdbData.currentGame.playerOne.start
            },
            playerTwo: {
                choice: "",
                userId: currentState.rtdbData.currentGame.playerTwo.userId,
                name: currentState.rtdbData.currentGame.playerTwo.name,
                online: true,
                start: param
            }
        })
    },

    setOnlineOfPlayerOneInRTDB(param: Boolean){
        const currentState = this.getState()
        const rtdbRef = ref(rtdbFirebase, `/rooms/${currentState.longRoomId}/currentGame`);
        set(rtdbRef, {
            playerOne: {
                choice: "",
                userId: currentState.rtdbData.currentGame.playerOne.userId,
                name: currentState.rtdbData.currentGame.playerOne.name,
                online: param,
                start: currentState.rtdbData.currentGame.playerOne.start
            },
            playerTwo: {
                choice: "",
                userId: currentState.rtdbData.currentGame.playerTwo.userId,
                name: currentState.rtdbData.currentGame.playerTwo.name,
                online: currentState.rtdbData.currentGame.playerTwo.online,
                start: currentState.rtdbData.currentGame.playerTwo.start
            }
        })
    },

    setOnlineOfPlayerTwoInRTDB(param: Boolean){
        const currentState = this.getState()
        const rtdbRef = ref(rtdbFirebase, `/rooms/${currentState.longRoomId}/currentGame`);
        set(rtdbRef, {
            playerOne: {
                choice: "",
                userId: currentState.rtdbData.currentGame.playerOne.userId,
                name: currentState.rtdbData.currentGame.playerOne.name,
                online: currentState.rtdbData.currentGame.playerOne.online,
                start: currentState.rtdbData.currentGame.playerOne.start
            },
            playerTwo: {
                choice: "",
                userId: currentState.rtdbData.currentGame.playerTwo.userId,
                name: currentState.rtdbData.currentGame.playerTwo.name,
                online: param,
                start: currentState.rtdbData.currentGame.playerTwo.start
            }
        })
    },

    async updateScoreInDB(player){
        const currentState = this.getState()
        const response = await fetch(API_BASE_URL + '/updateScore', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                longRoomId: currentState.longRoomId,
                roomId: currentState.roomId,
                player: player,
                scoreToAdd: 1
            })
        })
        const result = await response.json();
    },

    async getScoreFromDB() {
        const currentState = this.getState();
        const response = await fetch(API_BASE_URL + "/score/" + currentState.longRoomId, {
            method: 'GET',
        });
        const data = await response.json();
        currentState.scoreFromDB = data;
        this.setState(currentState);
    },

    whoWins(playerOnePlay: Plays, playerTwoPlay: Plays){
        const p1Winner = "p1Winner";
        const p2Winner = "p2Winner";
        const tied = "tied";
        
        const p1WonWithScissors: boolean = playerOnePlay === "scissors" && playerTwoPlay === "paper";
        const p1WonWithPaper: boolean = playerOnePlay === "paper" && playerTwoPlay === "rock";
        const p1WonWithRock: boolean = playerOnePlay === "rock" && playerTwoPlay === "scissors";

        const p2WonWithScissors: boolean = playerOnePlay === "scissors" && playerTwoPlay === "rock";
        const p2WonWithPaper: boolean = playerOnePlay === "paper" && playerTwoPlay === "scissors";
        const p2WonWithRock: boolean = playerOnePlay === "rock" && playerTwoPlay === "paper";

        const tiedWithScissors: boolean = playerOnePlay === "scissors" && playerTwoPlay === "scissors";
        const tiedWithPaper: boolean = playerOnePlay === "paper" && playerTwoPlay === "paper";
        const tiedWithRock: boolean = playerOnePlay === "rock" && playerTwoPlay === "rock";

        const p1Victory: boolean = [p1WonWithScissors, p1WonWithRock, p1WonWithPaper].includes(true);
        const p2Victory: boolean = [p2WonWithScissors, p2WonWithRock, p2WonWithPaper].includes(true);
        const tie: boolean = [tiedWithScissors, tiedWithRock, tiedWithPaper].includes(true);

        if(p1Victory){
            return p1Winner;
        };
        if(p2Victory){
            return p2Winner;
        };
        if(tie){
            return tied;
        }
    },

    async authUser() {
        try {
            const currentState = this.getState();
            const response = await fetch(API_BASE_URL + '/auth', {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    name: currentState.user
                })
            });
            const data = await response.json();
            currentState.userId = data.id;
            this.setState(currentState);
        } catch (err) {
            console.error(err);
        }
    },

    async authUserInRoom(){
        try {
            const currentState = this.getState();
            const response = await fetch(API_BASE_URL + "/authUsers/" + currentState.longRoomId + "?userId=" + currentState.userId, {
                method: 'GET',
            });
            if (response.status === 204) {
                return this.setUserTwoInRoom().then(()=>{
                    return this.setIdOfPlayerTwoInDB()
                }).then(()=>{
                    return true
                })
            }
            if (response.status === 401) {
                throw new Error("Unauthorized user");
            }
            if (response.status === 200) {
                return true;    
            }
        } catch (err) {
            console.error(err);
            return false;
        }
    },

    async createUserOneInDB(){
        try{
            const currentState = this.getState();
            const response = await fetch(API_BASE_URL + '/signup', {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    name: this.data.user
                })
            })
            if(response.status === 400){
                throw new Error("Usuario ya existe");
            }
            if(response.status === 200){
                const data = await response.json()
                currentState.rtdbData.currentGame.playerOne.userId = data.id;
                currentState.userId = data.id;
                this.setState(currentState);
                return true;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
    },

    async createUserTwoInDB(){
        try {
            const currentState = this.getState();
            const response = await fetch(API_BASE_URL + '/signup', {
                method: 'POST',
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify({
                    name: this.data.user
                })
            })
            if(response.status === 400){
                throw new Error("Usuario ya existe");
            }
            if(response.status === 200){
                const data = await response.json()
                currentState.userId = data.id;
                this.setState(currentState);
                return true;
            }
        } catch (err) {
            console.error(err);
            return false;
        }
    },

    async setUserTwoInRoom(){
        const currentState = this.getState();
        const rtdbRef = ref(rtdbFirebase,`/rooms/${currentState.longRoomId}/currentGame/playerTwo`);
        await set(rtdbRef, {
            choice: "",
            userId: currentState.userId,
            name: currentState.user,
            online: true,
            start: false,
        });
    },

    async createRoom(){
        const currentState = this.getState()
        const response = await fetch(API_BASE_URL + '/rooms', {
            method: 'POST',
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify({
                userId: currentState.userId
            })
        }).then((res)=>{
            return res.json()
        }).then((data)=>{
            currentState.roomId = data.id;
            currentState.longRoomId = data.longId;
            this.setState(currentState);
            const rtdbRef = ref(rtdbFirebase, `/rooms/${this.data.longRoomId}/currentGame`);
            set(rtdbRef, {
                playerOne: {
                    choice: "",
                    userId: currentState.userId,
                    name: currentState.rtdbData.currentGame.playerOne.name,
                    online: true,
                    start: false
                },
                playerTwo: {
                    choice: "",
                    userId: "",
                    name: "",
                    online: false,
                    start: false
                }
            })
        })
        this.listenDatabase();
        return response
    },

    async getRoom() {
        const currentState = this.getState();
        try {
            const resp = await fetch(API_BASE_URL + "/rooms/" + currentState.roomId,
                { method: "GET" });
            if (resp.status === 401) {
                throw new Error("Room doesn't exist");
            }

            const data = await resp.json();
            currentState.longRoomId = data.rtdbRoomId;
            this.setState(currentState);

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}

export { state }