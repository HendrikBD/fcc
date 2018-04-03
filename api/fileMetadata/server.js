// init project
const express = require('express')
const app = express()


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  
  if(Object.keys(req.query).length>0){
    
    
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(req.query));
    
  } else {
    res.sendFile(__dirname + '/views/index.html');
  }
  
})


app.get("/todo", function(req, res){
  
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(req.query));
  
})


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
