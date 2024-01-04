import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { offeringGetValidation, offeringCreateValidation } from '../shared/validators.js';
import { endpoints } from '../shared/utils.js';
import { getOffering, makeOffering, startWeek } from './game.js';
import { runTest } from './test.js';
// Get the type of the Zod object
const app = express();
const port = 3000;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.post('/' + endpoints.offeringCreate, function (req) {
    const validationResult = offeringCreateValidation.safeParse(req.body);
    if (validationResult.success)
        makeOffering(validationResult.data);
});
app.post('/' + endpoints.offeringGet, function (req) {
    const validationResult = offeringGetValidation.safeParse({ PostHashHex: req.body.PostHashHex, OptionPostHashHex: req.body.PostExtraData.OptionPostHashHex, PosterPublicKeyBase58Check: req.body.PosterPublicKeyBase58Check });
    if (validationResult.success)
        getOffering(validationResult.data);
});
app.post('/' + endpoints.startWeek, function (req) {
    startWeek(req.body);
});
// start the server
app.listen(port, async () => {
    await testStartWeek();
});
export const testStartWeek = async () => {
    runTest().then(res => {
        console.log(res);
    });
    // const startWeek = startWeek({ init: true, description: 'asdf' })
};
export const testMakeOffering = async () => {
    const res = await makeOffering({ event_description: 'asdfas', outcomes: ['adsf'], endDate: 'asdf', publicKey: 'asdf' }).catch(e => e.message);
    // console.log('results:')
    console.log(res);
    // const startWeek = startWeek({ init: true, description: 'asdf' })
};
//# sourceMappingURL=index.js.map