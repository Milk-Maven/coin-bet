
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { getBet, makeBet } from './deso.js';
import { PostEntryResponse } from 'deso-protocol';
import { betGetValidation, betCreateValidation, BetGet, } from '../shared/validators.js'
import { endpoints } from '../shared/utils.js'
// Get the type of the Zod object

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());

app.get('/', (r, res) => {
  console.log(r)
  res.send('Hello, this is a GET request!');
});

app.post(endpoints.betNew, function(req: { body: BetGet }) {
  const validationResult = betCreateValidation.safeParse(req.body);
  if (validationResult.success) makeBet(validationResult.data)
});

app.post(endpoints.betGet, function(req: { body: Pick<PostEntryResponse, 'PostHashHex' | 'PostExtraData' | 'PosterPublicKeyBase58Check'> }) {
  const validationResult = betGetValidation.safeParse({ PostHashHex: req.body.PostHashHex, OptionPostHashHex: req.body.PostExtraData.OptionPostHashHex, PosterPublicKeyBase58Check: req.body.PosterPublicKeyBase58Check });
  if (validationResult.success) getBet(validationResult.data)
});
// start the server
app.listen(port, () => {
  console.log(endpoints.betGet)

  console.log('listening on port ', port)
});


