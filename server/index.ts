// import { json, response } from "express"
import { firestore, rtdb } from "./db"
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';  
const express = require('express')
import * as dotenv from 'dotenv';         
dotenv.config()
let myApp = express()
let router = express.Router()
let cors = require('cors')    
let bodyParser = require('body-parser') 


myApp.use(bodyParser.urlencoded({ extended: true }))
myApp.use(bodyParser.json())
myApp.use(cors())   
// myApp.use(express.static('dist'))

let port = process.env.PORT || 9000

const userCollection = firestore.collection("users"); 
const roomsCollection = firestore.collection("rooms");

// signup

router.post('/signup', function(req,res){
    const name = req.body.name;
    userCollection.where('name','==',name).get().then((response)=>{
        if (response.empty){
            userCollection.add({
                name: name
            }).then((newUserRef)=>{
                res.status(200).json({
                    id: newUserRef.id     
                })
            });
        } else {
            res.status(400).json({
                message: "User already exists"
            })
        }
    })
})

// auth

router.post("/auth", function(req,res){
    const {name} = req.body;
    userCollection.where('name', '==', name).get().then((response)=>{
        if (response.empty){
            userCollection.add({
                name: name
            }).then((newUserRef)=>{
                res.json({
                    id: newUserRef.id,
                    status: "User recently created"
                })
            });
        } else {
            res.json({
                id: response.docs[0].id, 
                status: "User already created"
            }) 
        }
    })
})

// auth users in rooms

router.get('/authUsers/:rtdbRoomId', (req, res) => {
    const rtdbRoomId = req.params.rtdbRoomId;
    const { userId } = req.query;
    const roomsCollection = firestore.collection("rooms");
    const query = roomsCollection.where('rtdbRoomId', '==', rtdbRoomId).get()
    .then(querySnapshot => {
        if (querySnapshot.empty) {
            res.status(404).send('Room not found');
        } else {
            const roomDoc = querySnapshot.docs[0];
            const playerOneId = roomDoc.data().playerOneId;
            const playerTwoId = roomDoc.data().playerTwoId;
            if (playerTwoId !== "") {
                if (playerOneId === userId ||playerTwoId  === userId) {
                    res.status(200).send('Authorized user')
                } else {
                    res.status(401).send('Unauthorized user in the DB');
                }
            } 
            else {
                res.status(204).send('No existe playerTwoId!');
            }
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('An error occurred');
    });
});

// create room

router.post("/rooms", function(req,res){
    const {userId} = req.body;
    userCollection.doc(userId.toString()).get().then((doc)=>{ 
        if(doc.exists){
            const roomRef = rtdb.ref('rooms/' + uuidv4());
            roomRef.set({
                owner: userId,
                currentGame: {
                    playerOne: {
                        userId: userId,
                        choice: "",
                        name: "",
                        online: false,
                        start: false
                    },
                    playerTwo: {
                        userId: "",
                        choice: "",
                        name: "",
                        online: false,
                        start: false
                    }
                }
            }).then(()=>{
                const longRoomId = roomRef.key;     
                const shortId = uuidv4().split("-")[0].slice(0, 6);  
                roomsCollection.doc(shortId.toString()).set({
                    rtdbRoomId: longRoomId,
                    playerOneId: userId,
                    playerTwoId: "",
                    score: {
                        playerOne: 0,
                        playerTwo: 0
                    },
                    history: []
                }).then(()=>{
                    res.json({
                        id: shortId,
                        longId: longRoomId
                    })
                })
            })
        } else {
            res.status(401).json({
                message: 'You need an user to create a Room'   
            })
        }
    })
})

// get room

router.get("/rooms/:roomId", function(req,res){
    const {roomId} = req.params;
    roomsCollection.doc(roomId).get().then((snap)=>{
        if(snap.exists){
            const data = snap.data()
            res.json(data)
        } else {
            res.status(401).json({
                message: "Room don't exist"
            })
        }
    })
})

// plays in History

router.post('/playsInHistory', async function(req,res){
    const currentGame = req.body.currentGame;
    const longRoomId = req.body.longRoomId;
    const roomRef = await roomsCollection.where('rtdbRoomId','==',longRoomId).get();
    if (!roomRef.empty){
        const roomDoc = roomRef.docs[0];
        const history = roomDoc.data().history;
        history.push(currentGame);
        await roomDoc.ref.update({
            history: history
        });
        res.status(200).json({
            message: "Plays added to history"
        });
    } else {
        res.status(400).json({
            message: "Room doesn't exist"
        });
    }
}),

// set Id

router.patch('/setId', async function(req,res){
    const longRoomId = req.body.longRoomId;
    const userId = req.body.playerTwoId
    const roomRef = await roomsCollection.where('rtdbRoomId','==',longRoomId).get();
    if (!roomRef.empty){
        const roomDoc = roomRef.docs[0];
        let playerTwoId = roomDoc.data().playerTwoId;
        playerTwoId = userId
        await roomDoc.ref.update({
            playerTwoId: playerTwoId
        });
        res.status(200).json({
            message: "ID of playerTwo added successfully"
        });
    } else {
        res.status(400).json({
            message: "Room doesn't exist"
        });
    }
}),

// update score

router.post('/updateScore', async function(req, res) {
    const longRoomId = req.body.longRoomId;
    const player = req.body.player;
    const scoreToAdd = req.body.scoreToAdd;
    const roomRef = await roomsCollection.where('rtdbRoomId', '==', longRoomId).get();
    if (!roomRef.empty) {
        const roomDoc = roomRef.docs[0];
        const score = roomDoc.data().score;
        const playerKey = player === 'playerOne' ? 'playerOne' : 'playerTwo';
        score[playerKey] += scoreToAdd;
        await roomDoc.ref.update({
            score: score
        });
        res.status(200).json({
            message: "Score updated successfully"
        });
    } else {
        res.status(400).json({
            message: "Room doesn't exist"
        });
    }
});

// get score

router.get('/score/:rtdbRoomId', (req, res) => {
    const rtdbRoomId = req.params.rtdbRoomId;
    const roomsCollection = firestore.collection("rooms");
    const query = roomsCollection.where('rtdbRoomId', '==', rtdbRoomId).get()
    .then(querySnapshot => {
        if (querySnapshot.empty) {
            res.status(404).send('Room not found');
        } else {
            const roomDoc = querySnapshot.docs[0];
            const score = roomDoc.data().score;
            res.json(score);
        }
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('An error occurred');
    });
});


// router.get("*", (req,res)=>{
//     res.sendFile(__dirname + '../dist/index.html')
// })

myApp.use(express.static(path.join(__dirname, 'dist')));
myApp.use('/api', router)
myApp.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });


// myApp.use(express.static('dist'))
// router.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "../dist/index.html"));
// });

// myApp.use('/api', router)

myApp.listen(port)
console.log('API escuchando en el puerto ' + port)
