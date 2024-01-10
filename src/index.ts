
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
// import { endpoints } from '../shared/utils.js';
import dotenv from 'dotenv'
import { consumersMakeSuggestions, } from './bots/static.js';
import { GoldenCalfBot } from './bots/goldenCalf.js';


dotenv.config();


// import { PostEntryResponse } from './deso.js';
//
// import { offeringGetValidation, offeringCreateValidation, OfferingGetRequest } from '../shared/validators.js'
// import { z } from 'zod';
// import { endpoints } from '../shared/utils.js'
// import { getOffering, makeOffering, startWeek } from './game.js';
// import { runTest } from './test.js';
// Get the type of the Zod object

const app = express();
const port = 3000;

// const goldenCalfBot = new GoldenCalfBot({ seedHex: process.env.APP_SEED_HEX as string })
//
// const consumerBot = new ConsumerBot({ seedHex: process.env.APP_SEED_HEX as string })
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());



// app.post('/' + endpoints.offeringCreate, function(req: { body: OfferingGetRequest }) {
// const validationResult = offeringCreateValidation.extend({ ParentStakeID: z.string() }).safeParse(req.body); // add validation
// if (validationResult.success) consumerBot.makeOffering(validationResult.data)
// });



// app.post('/' + endpoints.startWeek, function(req: { body: { description: string, init?: boolean } }) {
// goldenCalfBot.startWeek({ 'description': 'start week' }) //TODO add validations back in
// startWeek(req.body)
// });
// start the server
app.listen(port, async () => {
  // const date = new Date()
  const goldenCalf = new GoldenCalfBot()
  const currentWeek = await goldenCalf.getCurrentWeek()
  console.log('1')
  if (currentWeek.err) {
    console.log(currentWeek.err)
  };
  // const start = await startWeek({ 'description': `new Round ${Number(currentWeek.res.PostExtraData.currentWeek) + 1} date is ${date.toString()}` })
  // console.log(start)
  // if (start.err) {
  //   console.log(start.err)
  // }
  const offer = await consumersMakeSuggestions(1)
  console.log(offer)
  // console.log('3')
  // console.log(offer)


})


export const testStartWeek = async () => {
  // runTest().then(res => {
  //   console.log(res)
  //
  // })
  // const startWeek = startWeek({ init: true, description: 'asdf' })
}

export const testMakeOffering = async () => {
  // const res = await makeOffering({ event_description: 'asdfas', outcomes: ['adsf'], endDate: 'asdf', publicKey: 'asdf' }).catch(e => e.message)
  // console.log('results:')
  // console.log(res)
  // const startWeek = startWeek({ init: true, description: 'asdf' })
}




