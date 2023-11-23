// const posts = require('./posts');i
const express = require('express');
const bodyParser = require('body-parser');
const desoApi = require('./deso-api.ts')
const { z } = require('zod');

const betValidation = z.object({
  greeting: z.string(),
  event_description: z.string(),
  outcomes: z.array(z.string()),
  explainer: z.string(),
});


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
  const validationResult = betValidation.safeParse(req.body);
  if (validationResult.success) {
    desoApi.makeBet(validationResult.data)
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

