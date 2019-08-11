
  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');

// Config
app.use(cors());

const PORT = process.env.PORT || 6969;


const app = express(); // Define our app


// Configure app to use bodyParser()
// This will let us get data from a POST
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var sign_s3 = require('./sign_s3');

app.use('/sign_s3', sign_s3.sign_s3);

app.listen(PORT);

console.log("Server Started make a request to localhost:" + PORT )
