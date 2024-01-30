import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { endpoints } from '../shared/utils.js';
import dotenv from 'dotenv';
import { CalfOfferingValidation, } from '../shared/validators.js';
import { GoldenCalfBot } from './bots/goldenCalf.js';
const calf = new GoldenCalfBot();
dotenv.config();
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
//   res.status(200).json({ success: true, message: 'Request successful' });
//   res.status(500).json({ success: false, message: 'Internal Server Error' });
//   res.status(404).json({ success: false, message: 'Not Found' });
//   res.status(500).json({ success: false, message: 'Internal Server Error' });
// Testing
app.post('/' + endpoints.offering, async function (req, res) {
    console.log(req.body);
    const request = CalfOfferingValidation.safeParse(req.body);
    if (!request.success) {
        return res.status(500).json({ err: 'issue validating request: ' + request.error });
    }
    const payload = await calf.setOfferingForWeekState({ goldenCalf: req.body });
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
app.post('/' + endpoints.resetState, async function (res) {
    try {
        await calf.clearExtraData();
    }
    catch {
        res.status(500).json({ success: false, message: 'failed to clear extra data' });
    }
});
app.post('/' + endpoints.init, async function (req, res) {
    try {
        const currentWeek = await calf.setWeek({ Body: req.body.description, });
        const profile = calf.setProfile({ currentWeekHashHex: currentWeek.PostHashHex });
        return res.status(200).json({ profile, currentWeek });
    }
    catch {
        res.status(500).json({ success: false, message: 'unable to to startsnapshot' });
    }
});
// TODO
app.post('/' + endpoints.snapshot, async function (_req, res) {
    try {
        const profile = await calf.getProfile();
        const week = await calf.getWeek({ PostHashHex: profile.currentWeekHashHex });
        const offerings = await calf.getOfferingsForWeek({ PostHashHex: profile.currentWeekHashHex });
        return res.status(200).json({ profile, week, offerings });
    }
    catch {
        // todo add more precise error handling
        res.status(500).json({ success: false, message: 'unable to fetch snapshot' });
    }
});
app.post('/' + endpoints.start, async function (req, res) {
    try {
        const week = await calf.setWeek({ Body: req.body.description });
        console.log({ currentWeekHashHex: week.PostHashHex });
        const response = await calf.setProfile({ currentWeekHashHex: week.PostHashHex });
        return res.status(200).json(response);
    }
    catch {
        res.status(500).json({ success: false, message: 'unable to to startsnapshot' });
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
    console.log('listening on port ' + port);
    const res = await calf.getProfile();
    const res2 = await calf.getOfferingsForWeek({ PostHashHex: res.currentWeekHashHex });
    console.log(res2);
    // const res = CalfOfferingValidation.parse({ "endDate": "2024-02-01T05:05:00.000Z", "creatorPublicKey": "BC1YLgJ6FWVz9GKQwktGmgRQ7DDFZj65ZhyxTGiSGnCGcYX4Hhx2VaY", "options": ["a", "b", "c", "d"], "winningOption": "", "Body": "test" })
    // console.log(res)
    // await calf.setOfferingForWeekState({ goldenCalf: res })
    // calf.setOferingForWeekState()
});
//# sourceMappingURL=index.js.map