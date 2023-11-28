
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { z } from 'zod';
import { makeBet } from './deso.js';
import { Bet } from './types.js';

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());

const betValidation = z.object({
  greeting: z.string(),
  event_description: z.string(),
  outcomes: z.array(z.string()),
  explainer: z.string(),
});

app.post('/bet/new', function(req: { body: Bet }) {
  const validationResult = betValidation.safeParse(req.body);
  if (validationResult.success) {
    makeBet(validationResult.data as Bet)
  } else {
    // console.error(validationResult.error.errors);
  }
  makeBet(req.body)
});

// start the server
app.listen(port, () => {
  console.log('listening on port ', port)
});


