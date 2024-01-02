import * as deso from 'deso-protocol';
import axios from 'axios';
import dotenv from 'dotenv';
import { PostType } from '../shared/utils.js';
dotenv.config();
const seedHex = process.env.APP_SEED_HEX;
const keyPair = deso.keygen(seedHex);
const pubKey = deso.publicKeyToBase58Check(keyPair.public);
export const getOffering = async ({ PostHashHex, OptionPostHashHex, PosterPublicKeyBase58Check }) => {
    console.log(OptionPostHashHex, PosterPublicKeyBase58Check, PostHashHex);
};
export const makeOffering = async (bet) => {
    const PostExtraData = { endDate: bet.endDate, totalOptions: `${bet.outcomes.length}`, postType: PostType.offering, creatorPublicKey: bet.publicKey };
    const success = await submitPost({
        UpdaterPublicKeyBase58Check: pubKey,
        BodyObj: {
            Body: bet.event_description,
            VideoURLs: [],
            ImageURLs: []
        },
        PostExtraData,
    }).then(postTransaction => {
        return deso.signTx(postTransaction.TransactionHex, seedHex, { isDerivedKey: false });
    }).then(TransactionHex => submitTransaction({ TransactionHex })).then((a) => {
        // now that the transaction exists reply with the options 
        return Promise.all(bet.outcomes.map((outcome, i) => {
            const PostExtraData = {
                option: `${i}`
            };
            return submitPost({
                UpdaterPublicKeyBase58Check: pubKey,
                ParentStakeID: a.PostEntryResponse.PostHashHex,
                BodyObj: {
                    Body: outcome,
                    VideoURLs: [],
                    ImageURLs: []
                },
                PostExtraData
            });
        }));
    }).then(res => {
        return Promise.all(res.map(postTransaction => {
            return deso.signTx(postTransaction.TransactionHex, seedHex, { isDerivedKey: false });
        }));
    }).then(signatures => { return Promise.all(signatures.map(TransactionHex => submitTransaction({ TransactionHex }))); });
    console.log(success);
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
        BodyObj: {
            Body: currentWeek.Body,
            VideoURLs: [],
            ImageURLs: []
        }, UpdaterPublicKeyBase58Check: pubKey, 'PostHashHexToModify': currentWeek.PostHashHex, PostExtraData: { ...currentWeek.PostExtraData, latestWeek: 'false' }
    }).then(postTransaction => {
        return deso.signTx(postTransaction.TransactionHex, seedHex, { isDerivedKey: false });
    })
        .then(async (TransactionHex) => {
        await submitTransaction({ TransactionHex });
        return currentWeek.PostExtraData;
    });
};
export const startWeek = async (payload, init = false) => {
    //first post of its type? set it to zero
    const newCurrentWeek = init ? '0' : (1 + Number((await retireCurrentWeek()).currentWeek)) + "";
    const PostExtraData = {
        'postType': PostType.startWeek,
        'currentWeek': newCurrentWeek,
        'latestWeek': 'true'
    };
    return await submitPost({
        UpdaterPublicKeyBase58Check: pubKey,
        BodyObj: {
            Body: payload.description,
            VideoURLs: [],
            ImageURLs: []
        },
        PostExtraData,
    }).then(postTransaction => deso.signTx(postTransaction.TransactionHex, seedHex, { isDerivedKey: false }))
        .then(TransactionHex => submitTransaction({ TransactionHex }))
        .then(getCurrentWeek)
        .then((startWeek) => {
        const week = startWeek.PostExtraData;
        return {
            success: week.currentWeek === newCurrentWeek, startWeek
        };
    });
};
export const getResultsSnapshot = async (PostHashHex) => {
    console.log(PostHashHex);
    // const diamonds = await deso.getDiamondsForPost({ PostHashHex, 'Limit': 100 })
    // diamonds.DiamondSenders[0].
};
//   const success = await submitPost({ // submit offering 
//     UpdaterPublicKeyBase58Check: pubKey,
//     BodyObj: {
//       Body: payload.description,
//       VideoURLs: [],
//       ImageURLs: []
//     },
//     PostExtraData,
//   }).then(postTransaction => {
//     return deso.signTx(postTransaction.TransactionHex, seedHex, { isDerivedKey: false })
//   })
// }
const selectedNodePath = 'https://node.deso.org/api/v0/';
export const submitPost = (req) => {
    const transactionEndpoint = 'submit-post';
    const post = axios.post(selectedNodePath + transactionEndpoint, {
        MinFeeRateNanosPerKB: 1500,
        PostHashHexToModify: '',
        RepostedPostHashHex: '',
        IsHidden: false,
        TransactionFees: [],
        InTutorial: false,
        IsFrozen: false, ...req
    }).then(res => {
        return res.data;
    });
    return post;
};
export const submitTransaction = (req) => {
    const transactionEndpoint = 'submit-transaction';
    return axios.post(selectedNodePath + transactionEndpoint, req).then(res => {
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
//# sourceMappingURL=deso.js.map