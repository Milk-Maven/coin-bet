// const posts = require('./posts');
const express = require('express');
const bodyParser = require('body-parser');
const desoApi = require('./deso-api.ts')
const { z } = require('zod');

const BetValidation = z.object({
  greeting: z.string(),
  event_description: z.string(),
  outcomes: z.array(z.string()),
  explainer: z.string(),
});

// Example usage:
const validBet = BetValidation.parse({
  greeting: 'Hello',
  event_description: 'Sports event',
  outcomes: ['Outcome1', 'Outcome2'],
  explainer: 'Explanation of the bet',
});

console.log(validBet);
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

app.post('/bet/new', function(req: { body: Bet }) {
  const validationResult = z.safeParse(req.body);

  if (validationResult.success) {
    const validBet = validationResult.data;
    console.log(validBet);
    desoApi.makeBet(validBet)
  } else {
    console.error(validationResult.error.errors);
  }
  desoApi.makeBet(req.body)
});

// start the server
app.listen(port, () => {
  console.log(port, 'hello')
});

// make a bet
