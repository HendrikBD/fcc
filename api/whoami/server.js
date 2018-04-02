// server.js
// where your node app starts

// init project
const express = require('express')
const app = express()

// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

app.enable("trust proxy")

app.get("/", (req, res) => {
  var whoami = {};
  
  whoami.ip = req.ip;
  whoami.lang = req.headers["accept-language"].split(",")[0];
  whoami.os = req.headers['user-agent'].split("(")[1].split(")")[0];
  
  res.setHeader("Content-Type", "application/json")
  res.end(JSON.stringify(whoami))
  
})


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})