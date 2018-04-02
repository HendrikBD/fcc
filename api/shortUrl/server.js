const express = require('express')
const app = express()


var mongo = require("mongodb").MongoClient,
    url="mongodb://HendrikBD:yellow112@ds161584.mlab.com:61584/fcc-api-bhd";


app.use(express.static('public'))
app.use(parse)


app.get("/", (request, response) => {
  response.sendFile(__dirname + '/views/index.html')
})

app.get("/:addr", parse, function(req, res){
  var urlRedir, short = String(req.params.addr);
  
  mongo.connect(url, function(err, db){
    var coll = db.db("fcc-api-bhd").collection("shortURLs");
    
    coll.find({short_url: short}).toArray(function(err, data){
      if(data.length>0){
        res.redirect(data[0].original_url)
      } else {
        res.end("Error: Can't find that url.");
      }
    })
    
  })
})


function parse(req, res, next){
  
  if(req.path.slice(0,5)=="/new/"){  
    var sentURL = req.path.slice(5);
    
    mongo.connect(url, function(err, db){
      if(err) throw err;
      
      var collection = db.db("fcc-api-bhd").collection("shortURLs");
      
      collection.find({original_url: sentURL}).toArray(function(err, data){
        if(data.length>0){
          var urlReturn = {};
          urlReturn.original_url = data[0].original_url;
          urlReturn.short_url = "https://url-bhd.glitch.me/"+data[0].short_url;

          res.setHeader("Content-Type", 'application/json')
          res.end(JSON.stringify(urlReturn))
          
        } else if(sentURL.slice(0,8)=="https://" || sentURL.slice(0,7)=="http://"){
          setURL(collection, sentURL, res)
        } else {
          res.type("text")
          res.end("Error: Incorrect format (must include http:// or https://)");
        }
      })
      
    })
  } else {
    next();
  }
  
}

function setURL(collection, sentURL, res){
  
  var urlJSON = {}, urlReturn = {};
  urlJSON.original_url = sentURL;
  urlReturn.original_url = sentURL;
  
  collection.count(function(err, num){
    urlJSON.short_url = encode(num+15230);
    urlReturn.short_url = "https://url-bhd.glitch.me/"+String(encode(num+15230));
    
    collection.insert(urlJSON)
    res.setHeader("Content-Type", 'application/json')
    res.end(JSON.stringify(urlReturn))
  });
}

function encode(num){
  var code = [];
  var base = 62, divBase=true;
  
  
  while(divBase){
    if(num/base>1){
      code.unshift(num%base);
      num = Math.floor(num/base);
    } else {
      code.unshift(num);
      divBase = false;
    }
  }
  
  code = toBaseNum(code);
  // code = code.join("")
  return code
}

function decode(code){
  var num=0;
  code = fromBaseNum(code);
  
  for(var i=0; i<code.length; i++){
    var ind = code.length-1-i;
    num +=code[ind]*62**(i);
  }
  
  return num
}

function toBaseNum(code){
  var num;
  for(var i=0; i<code.length; i++){
    num = code[i];
    if(num<10){
      code[i] = String(code[i]);
    } else if(num<36){
      code[i] = String.fromCharCode(num-10+97);
    } else if(num<62){
      code[i] = String.fromCharCode(num-36+65);
    }
  }
  return code.join("")
}

function fromBaseNum(code){
  var charId;
  code = code.split("");
  
  for(var i=0; i<code.length; i++){
    charId = code[i].charCodeAt(0);
    
    if(charId>=48 && charId<=57){
      code[i] = Number(code[i]);
    } else if(charId>=97 && charId<=122){
      code[i] = charId+10-97;
    } else if (charId>=65 && charId<=90){
      code[i] = charId+36-65;
    }
    
  }
  
  return code
}


// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
