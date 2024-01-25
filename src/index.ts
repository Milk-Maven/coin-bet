
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { endpoints } from '../shared/utils.js';
import dotenv from 'dotenv'
import { offeringRequestValidation, } from '../shared/validators.js';
import { CalfOfferingGame } from './bots/calfState.js'
import { GoldenCalfBot } from './bots/goldenCalf.js';
const calf = new GoldenCalfBot()
dotenv.config();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(cors());

//   res.status(200).json({ success: true, message: 'Request successful' });
//   res.status(500).json({ success: false, message: 'Internal Server Error' });
//   res.status(404).json({ success: false, message: 'Not Found' });
//   res.status(500).json({ success: false, message: 'Internal Server Error' });



// Testing
app.post('/' + endpoints.offering, async function(req: { body: CalfOfferingGame }, res) {
  // add zod validation
  const request = offeringRequestValidation.safeParse(req.body)
  if (!request.success) {
    return res.status(500).json({ err: 'issue validating request' });
  }
  const payload = await calf.setOfferingForWeekState({ goldenCalf: req.body })
  return res.status(200).json(payload);
});

// TODO
// app.post('/' + endpoints.sacrifice, async function(req: { body: SacrificeDiamondRequest }, res) {
// // add zod validation
// const request = sacrificeDiamondsRequestValidation.safeParse(req.body)
// if (!request.success) {
//   return res.status(500).json({ err: 'issue validating request' });
// }
// const response = await game.makeSacrificeWithDiamonds(req.body)
// if (response.res) {
//   return res.status(200).json({ ...response.res, });
// }
// if (response.err) {
//   return res.status(404).json({ err: response.err });
// }
// });

// TODO
// app.post('/' + endpoints.sacrifice, async function(req: { body: SacrificeDesoRequest }, res) {
// // add zod validation
// const request = sacrificeDesoRequestValidation
//   .safeParse(req.body)
// if (!request.success) {
//   return res.status(500).json({ err: 'issue validating request' });
// }
// const response = await game.makeSacrificeWithDiamonds(req.body)
// if (response.res) {
//   return res.status(200).json({ ...response.res, });
// }
// if (response.err) {
//   return res.status(404).json({ err: response.err });
// }
// });
app.post('/' + endpoints.resetState, async function(res) {
  try {
    await calf.clearExtraData()
  }
  catch {

    res.status(500).json({ success: false, message: 'failed to clear extra data' })
  }
}
)


app.post('/' + endpoints.init, async function(req: { body: { description: string } }, res) {
  try {
    const currentWeek = await calf.setWeek({ Body: req.body.description, })
    const profile = calf.setProfile({ currentWeekHashHex: currentWeek.PostHashHex })
    return res.status(200).json({ profile, currentWeek });
  } catch {
    res.status(500).json({ success: false, message: 'unable to to startsnapshot' })
  }
  // }
});
// TODO
app.post('/' + endpoints.snapshot, async function(_req, res) {
  try {
    const profile = await calf.getProfile()
    const week = await calf.getWeek({ PostHashHex: profile.currentWeekHashHex })
    const offerings = await calf.getOfferingsForWeek({ PostHashHex: profile.currentWeekHashHex })
    return res.status(200).json({ profile, week, offerings });
  } catch {
    // todo add more precise error handling
    res.status(404).json({ success: false, message: 'unable to fetch snapshot' })
  }
});

app.post('/' + endpoints.start, async function(req: { body: { description: string }, }, res) {
  try {
    const week = await calf.setWeek({ Body: req.body.description })
    console.log({ currentWeekHashHex: week.PostHashHex })
    const response = await calf.setProfile({ currentWeekHashHex: week.PostHashHex })
    return res.status(200).json(response);
  } catch {
    res.status(500).json({ success: false, message: 'unable to to startsnapshot' })
  }
  // }
});
// TODO
// app.post('/' + endpoints.end, async function(_req, res) {
//   // add zod validation
//   const response = await game.endWeek()
//   if (response.res) {
//     return res.status(200).json({ ...response.res, });
//   }
//   if (response.err) {
//     return res.status(404).json({ err: response.err });
//   }
// });

// TODO
// app.post('/' + endpoints.pay, async function(_req, res) {
//   // add zod validation
//   const response = await game.payWeek()
//   if (response.res) {
//     return res.status(200).json({ ...response.res, });
//   }
//   if (response.err) {
//     return res.status(404).json({ err: response.err });
//   }
// });
// start the server
app.listen(port, async () => {
  console.log('listening on port ' + port)
})






