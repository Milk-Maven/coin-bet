
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { getBet, makeBet } from './deso.js';
import { PostEntryResponse } from 'deso-protocol';
import { BetGet, betCreateValidation, betGetValidation, } from './validation.js';


// Get the type of the Zod object

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());


app.post('/bet/new', function(req: { body: BetGet }) {
  const validationResult = betCreateValidation.safeParse(req.body);
  if (validationResult.success) makeBet(validationResult.data)

});

app.post('/bet/get', function(req: { body: Pick<PostEntryResponse, 'PostHashHex' | 'PostExtraData' | 'PosterPublicKeyBase58Check'> }) {
  const validationResult = betGetValidation.safeParse({ PostHashHex: req.body.PostHashHex, OptionPostHashHex: req.body.PostExtraData.OptionPostHashHex, PosterPublicKeyBase58Check: req.body.PosterPublicKeyBase58Check });
  if (validationResult.success) getBet(validationResult.data)
});

// start the server
app.listen(port, () => {
  console.log('listening on port ', port)
});


