require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

let mongoose = require("mongoose");
const bodyParser = require('body-parser');
const dns = require("dns")
const urlParser = require("url")

let uri = process.env.MONGO_URI

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

let urlSchema = mongoose.Schema({
  original_url : {type: String, required: true},
  short_url : Number
})

Url = mongoose.model('Url', urlSchema)

app.use(bodyParser.urlencoded({extended: false}))

let resObject = {}

app.post("/api/shorturl", (req, res) => {
  input_url = req.body.url
  // let urlRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi)

  const dnslookup = dns.lookup(urlParser.parse(input_url).hostname, async (err, address) =>{
    if(!address){
      res.json({error: "Invalid URL"})
    }else{
      resObject['original_url'] = input_url

      let short_url_number = 1

      Url.findOne({})
      .sort({short_url: 'desc'})
      .exec((err, result) => {
        if(!err && result != undefined){
          short_url_number = result.short_url + 1
        }
        if(!err){
          Url.findOneAndUpdate(
            {original_url: input_url}, 
            {original_url: input_url, short_url: short_url_number}, 
            {new:true, upsert: true},
            (error, savedUrl) => {
              if(!error){
                resObject['short_url'] = savedUrl.short_url
                res.json(resObject)
              }
            })
        }
      })
    }
  })  
})

app.get('/api/shorturl/:short_url', (req, res) => {
  let short_url = req.params.short_url
  Url.findOne({short_url: short_url}, (err, result) => {
    if(!err){
      res.redirect(result.original_url)
    }
  })
})


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
