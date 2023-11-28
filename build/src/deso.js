import * as deso from 'deso-protocol';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
export const makeBet = async (bet) => {
    const seedHex = process.env.APP_SEED_HEX;
    console.log(process.env);
    const keyPair = deso.keygen(seedHex);
    const pubKey = deso.publicKeyToBase58Check(keyPair.public);
    console.log('oy?');
    const successRes = await submitPost({
        "UpdaterPublicKeyBase58Check": pubKey,
        MinFeeRateNanosPerKB: 1500,
        "BodyObj": {
            "Body": bet.greeting,
            "VideoURLs": [],
            "ImageURLs": []
        },
        PostHashHexToModify: '',
        ParentStakeID: '',
        RepostedPostHashHex: '',
        PostExtraData: undefined,
        IsHidden: false,
        TransactionFees: [],
        InTutorial: false,
        IsFrozen: false
    }).then(postTransaction => {
        console.log('seed => + seedHex');
        console.log('seed', seedHex);
        const res = deso.signTx(postTransaction.TransactionHex, seedHex, { isDerivedKey: false });
        return res;
    }).then(TransactionHex => submitTransaction({ TransactionHex }));
    return successRes;
};
export const submitPost = (req) => {
    const selectedNodePath = 'https://node.deso.org/api/v0/';
    const transactionEndpoint = 'submit-post';
    const post = axios.post(selectedNodePath + transactionEndpoint, req).then(res => {
        return res.data;
    });
    return post;
};
export const submitTransaction = (req) => {
    const selectedNodePath = 'https://node.deso.org/api/v0/';
    const transactionEndpoint = 'submit-transaction';
    return axios.post(selectedNodePath + transactionEndpoint, req).then(res => {
        return res.data;
    });
};
//# sourceMappingURL=deso.js.map