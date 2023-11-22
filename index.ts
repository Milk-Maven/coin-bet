
// const posts = require('./posts');
const express = require('express');
const bodyParser = require('body-parser');
const desoApi = require('./deso-api.ts')
//@ts-ignore
interface Bet {
  greeting: string;
  event_description: string;
  outcomes: string[];
  explainer: string;
}

//tengu app name
var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

var port = 3000;

app.post('/bet/new', function(req: { body: { bet: Bet } }) {
  const body = req.body;
  desoApi.makeBet(req.body.bet)
});


// start the server
app.listen(port, () => {
  console.log(port, 'hello')
});

// make a bet
