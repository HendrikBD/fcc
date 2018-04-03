
// init project
const express = require('express')
const app = express()
var request = require("request"),
    fs = require("fs");


app.use(express.static('public'))

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get("/img", function(req, res){
  var query = req.query.q, page = req.query.offset;
  
  
  page = (!page) ? 1 : page;
  
  if(!query){
    res.redirect("/")
  } else{
  
    var url = "https://pixabay.com/api/?key=8573728-7f25b061566072ed4e319c011&page=" + String(page) + "&q=" + String(query);

    request(url, function(err, qRes, body){
      var results = JSON.parse(body), out = [];

      for(var i=0; i<results.hits.length; i++){
        let result = results.hits[i],
            info = {
              alt_text: result.tags,
              img_url: result.largeImageURL,
              page_url: result.pageURL,
            };
        out.push(info)
      }
      
      updateRecent(query);
      res.setHeader("Content-Type", "application/json");
      res.end(JSON.stringify(out))
    })
  }
  
})

app.get("/img/rec", function(req, res){
  var recent = getRecent();
  if(recent){
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(recent));
  } else{
    res.end("No recent history, query an image to start one!")
  }
})


function updateRecent(query){
  var recent = [];
  
  try {
    recent = JSON.parse(fs.readFileSync("./tmp/recent"));
  } catch(err) {
    if(err.errno!=-2) throw err
  }
  
  recent.unshift(query)
  
  if(recent.length>50){
    recent.pop();
  }
  
  fs.writeFile("./tmp/recent", JSON.stringify(recent), function(err){
    if(err) throw err;
    return
  });
  
}

function getRecent(){
  
  try {
    var recent = JSON.parse(fs.readFileSync("./tmp/recent"));
    return recent;
  } catch(err){
    if(err.errno=-2){
      return null;
    } else throw err;
  }
  
}


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
