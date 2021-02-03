app.delete("/delete-player-by-name/:teamID", function (req, res) {
    let teamIDNumber = Number(req.params.teamID);
    let foundTeamPlayerArray;
    let targetTeamIndex;
    
    teamArray.forEach((team, indexTeam) => {
        if (team.id === teamIDNumber) {
            foundTeamPlayerArray = team.playersArray
            targetTeamIndex = indexTeam;
            return;
        }
    });
    console.log(foundTeamPlayerArray)
    let filteredTeamPlayerArray = foundTeamPlayerArray.filter((item) => {
        return item.player !== req.body.player
    })
    console.log(filteredTeamPlayerArray)
    teamArray[targetTeamIndex].playersArray = filteredTeamPlayerArray

    res.json(teamArray);
});