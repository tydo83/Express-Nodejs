const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

// GET, POST, PUT, and DELETE
// middleware - give abilities to our application
// param e.g /team/:anyname : mean dynamic

let teamArray = [
    {
        id: 1,
        name: 'lakers',
        playersArray: [
            {
                player: "kobe",
            },
            {
                player: "shaq",
            }
        ],
    },
];

app.get("/", function (req, res) {
    res.send("Welcome to our first API");
})

app.get("/team", function (req, res) {
    res.status(200).json({
        teamArray,
        query: req.query,
    })
})

app.get("/team/:teamID", function (req, res) {
    let result = null;
    let teamIDNumber = Number(req.params.teamID); // Number method is needed since req.params.teamID is a string
    teamArray.forEach((team) => { // loops through the teamArray and checks every team objects in teamArray
        if (team.id === teamIDNumber) { // if team.id is equal to teamIDNumber (/team/1)
            result = team;              // assign result to the team object 
        }
        if (team.id !== teamIDNumber) { // if team.id doesn't match with the user input from URL
            result = "The team you are looking for doesn’t exist"; // assign string tp result 
        }
    });
    res.status(200).json({
        team: result, // return result
    });
});

app.post("/team", function (req, res) {
    res.status(200).json({
        teamArray,
    });
});

// app.post("/team", function (req, res) {
//     teamArray.push({
//         id: req.body.id,
//         name: req.body.name,
//     })
//     res.status(200).json({
//         teamArray,
//     })
// })

app.post("/team/add-players/:teamID", function (req, res) {
    let teamIDNumber = Number(req.params.teamID);
    let message;
    let targetTeam;
    let teamIndex;

    teamArray.forEach((team, index) => { 
        if (team.id === teamIDNumber) { // loops through the teamArray and if team is is matched, 
            let singleTeamArray = team.playersArray; // declare singleTeamArray to team.playersArray to check target team
            singleTeamArray.push(req.body); //?
            targetTeam = team; 
            teamIndex = index;
            return;
        }
    });
    //set the playersArray to targetTeamArray
    let targetTeamArray = targetTeam.playersArray;
    //return only players array
    let playersNameArray = targetTeamArray.map(function (item) {
        return item.player;
    });
    //using some to check the array and using indexOf to compare, and if it exists return true
    let isDuplicate = playersNameArray.some(function (item, index) {
        return playersNameArray.indexOf(item) != index;
    });
    //if is true, we set a message for the user to see
    if (isDuplicate) {
        message = "Sorry, player already exist!";
    }
    //we filter player the duplicate using Map Filter and IndexOf
    let results = targetTeamArray
        .map((item) => item.player)
        .filter(function (player, index, collection) {
            return collection.indexOf(player) == index;
        });
    //once we grab the array we push it to the object
    let resultObj = [];
    results.forEach((item, index) => {
        resultObj.push({ player: item });
    });
    //set playersArray
    teamArray[teamIndex].playersArray = resultObj;
    res.status(200).json({
        teamArray,
        message,
    });
});

app.put("/team/edit-players/:teamID", function (req, res) {
    let teamIDNumber = Number(req.params.teamID);
    let obj = {};
    let teamIndex;
    let playerIndex;
    // teamArray.forEach((team, indexTeam) => {
    //   if (team.id === teamIDNumber) {
    //     teamIndex = indexTeam;
    //     let singleTeamArray = team.playersArray;
    //     singleTeamArray.forEach((item, indexPlayer) => {
    //       if (item.player === req.body.player) {
    //         obj = { ...item, ...req.body };
    //         playerIndex = indexPlayer;
    //       }
    //     });
    //   }
    // });
    teamArray.forEach((team, indexTeam) => {
        if (team.id === teamIDNumber) {
            teamIndex = indexTeam;
            let singleTeamArray = team.playersArray;
            singleTeamArray.forEach((item, indexPlayer) => {
                if (item.player === req.query.player) {
                    obj = { ...item, ...req.query };
                    playerIndex = indexPlayer;
                }
            });
        }
    });
    teamArray[teamIndex].playersArray[playerIndex] = obj;
    res.json(teamArray);
});

app.delete("/team/delete-player-by-name/:teamID", function (req, res) {
    res.send(teamArray);
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`);
});

