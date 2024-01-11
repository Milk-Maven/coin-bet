import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { endpoints } from '../shared/utils.js';
import dotenv from 'dotenv';
import { game } from './bots/static.js';
import { offeringExamples } from '../shared/validators.js';
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
//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// app.post('/' + endpoints.offeringCreate, function(req: { body: OfferingGetRequest }) {
// const validationResult = offeringCreateValidation.extend({ ParentStakeID: z.string() }).safeParse(req.body); // add validation
// if (validationResult.success) consumerBot.makeOffering(validationResult.data)
// });
// app.get('/success', (req, res) => {
//   res.status(200).json({ success: true, message: 'Request successful' });
// });
//
// // Example route for error
// app.get('/error', (req, res) => {
//   res.status(500).json({ success: false, message: 'Internal Server Error' });
// });
//
// // Handling 404 Not Found
// app.use((req, res) => {
//   res.status(404).json({ success: false, message: 'Not Found' });
// });
//
// // Error handler middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ success: false, message: 'Internal Server Error' });
// });
app.post('/' + endpoints.start, async function (req, res) {
    // add zod valdaation
    const response = await game.startWeek(req.body);
    if (response.res) {
        return res.status(200).json({ ...response.res, });
    }
    if (response.err) {
        return res.status(404).json({ err: response.err });
    }
});
app.post('/' + endpoints.makeOffering, async function (req, res) {
    // add zod validation
    const response = await game.makeOffering(req.body);
    if (response.res) {
        return res.status(200).json({ ...response.res, });
    }
    if (response.err) {
        return res.status(404).json({ err: response.err });
    }
});
app.post('/' + endpoints.snapshot, async function (_req, res) {
    // add zod validation
    const response = await game.getSnapshot();
    if (response.res) {
        return res.status(200).json({ ...response.res, });
    }
    if (response.err) {
        res.status(404).json({ err: response.err });
    }
});
app.post('/' + endpoints.end, async function (_req, res) {
    // add zod validation
    const response = await game.endWeek();
    if (response.res) {
        return res.status(200).json({ ...response.res, });
    }
    if (response.err) {
        return res.status(404).json({ err: response.err });
    }
});
app.post('/' + endpoints.pay, async function (_req, res) {
    // add zod validation
    const response = await game.payWeek();
    if (response.res) {
        return res.status(200).json({ ...response.res, });
    }
    if (response.err) {
        return res.status(404).json({ err: response.err });
    }
});
// start the server
app.listen(port, async () => {
    console.log('listening on port' + port);
    const res = await game.makeOffering(offeringExamples[0]);
    console.log('res');
    console.log(res);
    // const snapshot = await getSnapshot()
    // console.log(snapshot)
});
//# sourceMappingURL=index.js.map