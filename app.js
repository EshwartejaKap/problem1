const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
let db = null;
const dbPath = path.join(__dirname, "cricketTeam.db");

const startConnectionAndServer = async () => {
  try {
    let db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("The server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`The error message is ${e.message}`);
    process.exit(1);
  }
};
startConnectionAndServer();

// API GET ALL PLAYERS
app.get("/players/", async (request, response) => {
  const playerDetails = ` 
     SELECT
     * 
     FROM
     cricket_team;`;
  const playerResult = await db.all(playerDetails);
  response.send(playerResult);
});

//API2 POST A PLAYER IN DATABASE
app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { player_name, jersey_number, role } = playerDetails;
  const insertingPlayer = `INSERT INTO cricket_team (player_name,jersey_number,role)
    VALUES(${player_name},${jersey_number},${role});`;
  const dbResponse = await db.run(insertingPlayer);
  const playedId = dbResponse.lastID;
  response.send("Player Added to Team");
});

//API3 GET A PLAYER
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const sqlQuery = `SELECT * FROM cricket_team WHERE player_id = ${playerId};`;
  const result = await db.get(sqlQuery);
  response.send(result);
});

//API4 PUT A PLAYER
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const sqlQuery = `UPDATE cricket_team set (playerName = ${playerName},
        jerseyNumber = ${jerseyNumber},role = ${role} WHERE player_id = ${playerId});`;
  const result = await db.run(sqlQuery);
  response.send("Player Details Updated");
});

//API5 DELETE A PLAYER
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const sqlQuery = `DELETE FROM cricket_team WHERE player_id = ${playerId};`;
  const result = await db.run(sqlQuery);
  response.send("Player Removed");
});

module.exports = app;
