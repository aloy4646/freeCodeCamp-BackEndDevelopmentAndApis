// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

app.get("/api/:date", (req, res)=>{
  let unix
  let utc
  let date_string = req.params.date

  if(date_string.includes('-')|| date_string.includes(' ')){
    unix = new Date(date_string).getTime()
    utc = new Date(date_string).toUTCString()
  }else{
    date_milisecond = parseInt(date_string)
    unix = new Date(date_milisecond).getTime()
    utc = new Date(date_milisecond).toUTCString()
  }

  if(!unix || !utc){
    res.json({"error": "Invalid Date"})
  }

  res.json({"unix": unix, "utc":utc})
})

app.get("/api", (req,res) => {
  let currentTime = new Date()

  res.json({"unix": currentTime.getTime(), "utc":currentTime.toUTCString()})
})

// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

