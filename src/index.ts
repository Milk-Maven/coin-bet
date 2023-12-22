
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { getOffering, makeOffering } from './deso.js';
import { PostEntryResponse } from 'deso-protocol';
import { offeringGetValidation, offeringCreateValidation, OfferingGetRequest } from '../shared/validators.js'
import { endpoints } from '../shared/utils.js'
// Get the type of the Zod object

const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());


app.post('/' + endpoints.offeringCreate, function(req: { body: OfferingGetRequest }) {
  console.log('in')
  const validationResult = offeringCreateValidation.safeParse(req.body);
  if (validationResult.success) makeOffering(validationResult.data)
});

type BetGetRequest = Pick<PostEntryResponse, 'PostHashHex' | 'PostExtraData' | 'PosterPublicKeyBase58Check'>
app.post('/' + endpoints.offeringGet, function(req: { body: BetGetRequest }) {
  console.log('in')
  const validationResult = offeringGetValidation.safeParse({ PostHashHex: req.body.PostHashHex, OptionPostHashHex: req.body.PostExtraData.OptionPostHashHex, PosterPublicKeyBase58Check: req.body.PosterPublicKeyBase58Check });
  if (validationResult.success) getOffering(validationResult.data)
});
// start the server
app.listen(port, () => {
  console.log('listening on port ', port)
});


