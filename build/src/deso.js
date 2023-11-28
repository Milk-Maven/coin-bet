import axios from 'axios';
import * as deso from 'deso-protocol';
export const makeBet = async (bet) => {
    const seedHex = process.env.APP_SEED_HEX ?? '';
    const keyPair = deso.keygen(seedHex);
    const pubKey = deso.publicKeyToBase58Check(keyPair.public);
    console.log(pubKey);
    const post = await submitPost({
        "UpdaterPublicKeyBase58Check": pubKey,
        MinFeeRateNanosPerKB: 1500,
        "BodyObj": {
            "Body": bet.greeting,
            "VideoURLs": [],
            "ImageURLs": []
        }
    });
    console.log(post.TransactionHex, seedHex, { isDerivedKey: false });
    const signMessaged = await deso.signTx(post.TransactionHex, seedHex, { isDerivedKey: false });
    const res = await submitTransaction({ TransactionHex: signMessaged });
    console.log(res);
};
const submitPost = async (request) => {
    const constructedTransactionResponse = (await axios.post(`${desoNode}submit-post`, request)).data;
    return constructedTransactionResponse;
};
const submitTransaction = async (request) => {
    return await axios.post(`${desoNode}submit-transaction`, request);
};
const desoNode = 'http://node.deso.org/api/v0/';
//# sourceMappingURL=deso.js.map