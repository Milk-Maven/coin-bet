// const posts = require('./posts');i

// ES6 imports
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { z } from 'zod';




const betValidation = z.object({
  greeting: z.string(),
  event_description: z.string(),
  outcomes: z.array(z.string()),
  explainer: z.string(),
});



//tengu app name
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

app.use(cors());
const port = 3000;

app.post('/bet/new', function(req: { body: Bet }) {
  const validationResult = betValidation.safeParse(req.body);
  if (validationResult.success) {
    makeBet(validationResult.data)
  } else {
    console.error(validationResult.error.errors);
  }
  makeBet(req.body)
});

// start the server
app.listen(port, () => {
  makeBet
  console.log(port, 'hello')
});

// make a bet

