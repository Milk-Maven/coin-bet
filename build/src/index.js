import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { endpoints } from '../shared/utils.js';
import dotenv from 'dotenv';
import { game } from './bots/static.js';
import { offeringRequestValidation, sacrificeDesoRequestValidation, sacrificeDiamondsRequestValidation } from '../shared/validators.js';
dotenv.config();
const app = express();
const port = 3000;
//
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
//   res.status(200).json({ success: true, message: 'Request successful' });
//   res.status(500).json({ success: false, message: 'Internal Server Error' });
//   res.status(404).json({ success: false, message: 'Not Found' });
//   res.status(500).json({ success: false, message: 'Internal Server Error' });
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
// TODO
app.post('/' + endpoints.offering, async function (req, res) {
    // add zod validation
    const request = offeringRequestValidation.safeParse(req.body);
    if (!request.success) {
        return res.status(500).json({ err: 'issue validating request' });
    }
    const response = await game.makeOffering(req.body);
    if (response.res) {
        return res.status(200).json({ ...response.res, });
    }
    if (response.err) {
        return res.status(404).json({ err: response.err });
    }
});
// TODO
app.post('/' + endpoints.sacrifice, async function (req, res) {
    // add zod validation
    const request = sacrificeDiamondsRequestValidation.safeParse(req.body);
    if (!request.success) {
        return res.status(500).json({ err: 'issue validating request' });
    }
    const response = await game.makeSacrificeWithDiamonds(req.body);
    if (response.res) {
        return res.status(200).json({ ...response.res, });
    }
    if (response.err) {
        return res.status(404).json({ err: response.err });
    }
});
// TODO
app.post('/' + endpoints.sacrifice, async function (req, res) {
    // add zod validation
    const request = sacrificeDesoRequestValidation
        .safeParse(req.body);
    if (!request.success) {
        return res.status(500).json({ err: 'issue validating request' });
    }
    const response = await game.makeSacrificeWithDiamonds(req.body);
    if (response.res) {
        return res.status(200).json({ ...response.res, });
    }
    if (response.err) {
        return res.status(404).json({ err: response.err });
    }
});
// TODO
app.post('/' + endpoints.snapshot, async function (_req, res) {
    // add zod validation
    const response = await game.gameState();
    if (response.res) {
        return res.status(200).json({ response, });
    }
    // if (response.err) {
    // res.status(404).json({ err: response.err });
    // }
});
// TODO
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
// TODO
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
    const res = await game.startWeek({ description: "test description" });
    console.log(res);
    // const res = await gameState()
    // console.log(res)
});
//# sourceMappingURL=index.js.map