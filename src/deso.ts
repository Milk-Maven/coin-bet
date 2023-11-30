import * as deso from 'deso-protocol';
import { Bet } from './types.js';
import axios from 'axios';
import dotenv from 'dotenv'
// The Golden Calf (project name 100%); 
dotenv.config();
// deso.SubmitTransactionResponse
export const makeBet = async (bet: Bet): Promise<void> => {
  const seedHex = process.env.APP_SEED_HEX;
  const keyPair = deso.keygen(seedHex)
  const pubKey = deso.publicKeyToBase58Check(keyPair.public)
  const potKeyPair = deso.keygen();
  const potPubKey = deso.publicKeyToBase58Check(potKeyPair.public);
  const success = await submitPost({
    "UpdaterPublicKeyBase58Check": pubKey,
    MinFeeRateNanosPerKB: 1500,
    "BodyObj": {
      "Body": bet.greeting,
      "VideoURLs": [],
      "ImageURLs": []
    },
    PostExtraData: { potPubKey },
    PostHashHexToModify: '',
    ParentStakeID: '',
    RepostedPostHashHex: '',
    IsHidden: false,
    TransactionFees: [],
    InTutorial: false,
    IsFrozen: false
  }).then(postTransaction => {
    return deso.signTx(postTransaction.TransactionHex, seedHex, { isDerivedKey: false })
  }).then(TransactionHex => submitTransaction({ TransactionHex })).then((a) => {
    // now that the transaction exists reply with the options 
    return Promise.all(bet.outcomes.map(outcome => {
      return submitPost(
        {
          UpdaterPublicKeyBase58Check: pubKey,
          MinFeeRateNanosPerKB: 1500,
          BodyObj: {
            Body: outcome,
            VideoURLs: [],
            ImageURLs: []
          },
          PostExtraData: { potPubKey },
          PostHashHexToModify: '',
          ParentStakeID: a.PostEntryResponse.PostHashHex,
          RepostedPostHashHex: '',
          IsHidden: false,
          TransactionFees: [],
          InTutorial: false,
          IsFrozen: false
        }
      )
    }))
  }).then(res => {
    return Promise.all(res.map(postTransaction => {
      return deso.signTx(postTransaction.TransactionHex, seedHex, { isDerivedKey: false })
    }))

  }).then(signatures => { return Promise.all(signatures.map(TransactionHex => submitTransaction({ TransactionHex }))) })
  console.log(success)
}

export const submitPost = (req: deso.SubmitPostRequest): Promise<deso.SubmitPostResponse> => {
  const selectedNodePath = 'https://node.deso.org/api/v0/'
  const transactionEndpoint = 'submit-post'
  const post = axios.post(selectedNodePath + transactionEndpoint, req).then(res => {
    return res.data as deso.SubmitPostResponse;
  })
  return post
}

export const submitTransaction = (req: deso.SubmitTransactionRequest): Promise<deso.SubmitTransactionResponse> => {
  const selectedNodePath = 'https://node.deso.org/api/v0/'
  const transactionEndpoint = 'submit-transaction';
  return axios.post(selectedNodePath + transactionEndpoint, req).then(res => {
    return res.data as deso.SubmitTransactionResponse;
  })
}
export const waitForSeconds = (seconds: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Waited for ${seconds} seconds!`);
    }, seconds * 1000); // Convert seconds to milliseconds
  });
}
