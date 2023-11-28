import * as deso from 'deso-protocol';
import { Bet } from './types.js';
import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config();
export const makeBet = async (bet: Bet): Promise<deso.SubmitTransactionResponse> => {
  const seedHex = process.env.APP_SEED_HEX;
  const keyPair = deso.keygen(seedHex)
  const pubKey = deso.publicKeyToBase58Check(keyPair.public)
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
    const res = deso.signTx(postTransaction.TransactionHex, seedHex, { isDerivedKey: false })
    return res
  }).then(TransactionHex => submitTransaction({ TransactionHex }))
  return successRes;
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
