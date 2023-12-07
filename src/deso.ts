import * as deso from 'deso-protocol';
import axios from 'axios';
import dotenv from 'dotenv'
import { BetCreate, BetGet } from '../shared/validators.js';
import { getBetQl } from './graphQl.js';
// The Golden Calf (project name 100%); 
dotenv.config();

export type PostEntryResponse = deso.PostEntryResponse;
export const getBet = async (bet: BetGet) => {
  const res = getBetQl(bet)
  return res;
}
export const makeBet = async (bet: BetCreate): Promise<void> => {
  const seedHex = process.env.APP_SEED_HEX;
  const keyPair = deso.keygen(seedHex)
  const pubKey = deso.publicKeyToBase58Check(keyPair.public)
  const potKeyPair = deso.keygen();
  const potPubKey = deso.publicKeyToBase58Check(potKeyPair.public);
  const success = await submitPost({
    UpdaterPublicKeyBase58Check: pubKey,
    BodyObj: {
      Body: bet.greeting,
      VideoURLs: [],
      ImageURLs: []
    },
    PostExtraData: { potPubKey },
  }).then(postTransaction => {
    return deso.signTx(postTransaction.TransactionHex, seedHex, { isDerivedKey: false })
  }).then(TransactionHex => submitTransaction({ TransactionHex })).then((a) => {
    // now that the transaction exists reply with the options 
    return Promise.all(bet.outcomes.map(outcome => {
      return submitPost(
        {
          UpdaterPublicKeyBase58Check: pubKey,
          ParentStakeID: a.PostEntryResponse.PostHashHex,
          BodyObj: {
            Body: outcome,
            VideoURLs: [],
            ImageURLs: []
          },
          PostExtraData: { potPubKey },
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

const selectedNodePath = 'https://node.deso.org/api/v0/'
export const submitPost = (req: Partial<deso.SubmitPostRequest>): Promise<deso.SubmitPostResponse> => {
  const transactionEndpoint = 'submit-post'
  const post = axios.post(selectedNodePath + transactionEndpoint, {
    MinFeeRateNanosPerKB: 1500,
    PostHashHexToModify: '',
    RepostedPostHashHex: '',
    IsHidden: false,
    TransactionFees: [],
    InTutorial: false,
    IsFrozen: false, ...req
  }).then(res => {
    return res.data as deso.SubmitPostResponse;
  })
  return post
}

export const submitTransaction = (req: deso.SubmitTransactionRequest): Promise<deso.SubmitTransactionResponse> => {
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

