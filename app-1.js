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
    let teamIDNumber = Number(req.params.teamID);
    teamArray.forEach((team) => {
        if (team.id === teamIDNumber) {
            result = team;
        }
        if (team.id !== teamIDNumber) {
            result = "The team you are looking for doesn’t exist";
        }
    });
    res.status(200).json({
        team: result,
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
        if (team.id === teamIDNumber) {
            let singleTeamArray = team.playersArray;
            singleTeamArray.push(req.body);
            targetTeam = team;
            teamIndex = index;
            return;
        }
    });
    //console.log(JSON.stringify(teamArray));
    //set the playersARray to targetTeamArray
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

// app.put("/team/edit-players/:teamID", function (req, res) {

//     let teamIDNumber = Number(req.params.teamID);

//     let obj = {};
//     let teamIndex;
//     let playerIndex;

//     teamArray.forEach((team, indexTeam) => {
//         if (team.id === teamIDNumber) {
//             teamIndex = indexTeam
//             let singleTeamArray = team.playersArray;

//             singleTeamArray.forEach((item, indexPlayer) => {
//                 if (item.player === req.query.player) {
//                     obj = { ...item, ...req.query };
//                     playerIndex = indexPlayer
//                 }
//             });
//         }
//     });

//     teamArray[teamIndex].playersArray[playerIndex] = obj;
//     res.status(200).json({
//         teamArray,
//     })
// });

// app.delete("/team/delete-player-by-name/:teamID", function (req, res) {
//     res.send("This is the delete path")
// })

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`)
})

