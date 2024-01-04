import * as deso from 'deso-protocol';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
const seedHex = process.env.APP_SEED_HEX;
const keyPair = deso.keygen(seedHex);
const pubKey = deso.publicKeyToBase58Check(keyPair.public);
const selectedNodePath = 'https://node.deso.org/api/v0/';
export const submitPost = (req) => {
    const transactionEndpoint = 'submit-post';
    const { Body, ...extra } = req;
    const post = axios.post(selectedNodePath + transactionEndpoint, {
        BodyObj: {
            Body,
            VideoURLs: [],
            ImageURLs: []
        },
        UpdaterPublicKeyBase58Check: pubKey,
        ParentStakeID: '',
        MinFeeRateNanosPerKB: 1000,
        PostHashHexToModify: '',
        RepostedPostHashHex: '',
        IsHidden: false,
        TransactionFees: [],
        InTutorial: false,
        IsFrozen: false, ...extra
    }).then(res => {
        return res.data;
    });
    return post;
};
export const signTransaction = async (postTransaction) => {
    return await deso.signTx(postTransaction.TransactionHex, seedHex, { isDerivedKey: false });
};
export const submitTransaction = (TransactionHex) => {
    console.log('TransactionHex', TransactionHex);
    const transactionEndpoint = 'submit-transaction';
    return axios.post(selectedNodePath + transactionEndpoint, { TransactionHex }).then(res => {
        return res.data;
    });
};
export const waitForSeconds = (seconds) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(`Waited for ${seconds} seconds!`);
        }, seconds * 1000); // Convert seconds to milliseconds
    });
};
export const getCurrentWeek = async () => {
    const res = await deso.getPostsForUser({ PublicKeyBase58Check: pubKey, "NumToFetch": 20, });
    const post = res.Posts.find(p => {
        const week = p.PostExtraData;
        return week.latestWeek === 'true';
    });
    return post;
};
export const retireCurrentWeek = async () => {
    const currentWeek = await getCurrentWeek();
    return submitPost({
        Body: currentWeek.Body,
        PostHashHexToModify: currentWeek.PostHashHex,
        PostExtraData: { ...currentWeek.PostExtraData, latestWeek: 'false' }
    }).then(signTransaction)
        .then(submitTransaction).then(() => currentWeek.PostExtraData);
};
//# sourceMappingURL=deso.js.map