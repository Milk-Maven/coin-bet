import * as deso from 'deso-protocol';
import axios from 'axios';
import dotenv from 'dotenv'
import { StartWeekRequest } from '../shared/utils.js';
dotenv.config();

const seedHex = process.env.APP_SEED_HEX;
const keyPair = deso.keygen(seedHex)
const pubKey = deso.publicKeyToBase58Check(keyPair.public)


export type PostEntryResponse = deso.PostEntryResponse;

const selectedNodePath = 'https://node.deso.org/api/v0/'

export const submitPost = (req: Partial<deso.SubmitPostRequest> & { Body: string }): Promise<deso.SubmitPostResponse> => {
  const transactionEndpoint = 'submit-post'
  const { Body, ...extra } = req
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
    return res.data as deso.SubmitPostResponse;
  })
  return post
}

export const signTransaction = async (postTransaction: { TransactionHex: string }) => {
  return await deso.signTx(postTransaction.TransactionHex, seedHex, { isDerivedKey: false })
}

export const submitTransaction = (TransactionHex: string): Promise<deso.SubmitTransactionResponse> => {
  console.log('TransactionHex', TransactionHex)
  const transactionEndpoint = 'submit-transaction';
  return axios.post(selectedNodePath + transactionEndpoint, { TransactionHex }).then(res => {
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

export const getCurrentWeek = async () => {
  const res = await deso.getPostsForUser({ PublicKeyBase58Check: pubKey, "NumToFetch": 20, })
  const post = res.Posts.find(p => {
    const week: StartWeekRequest = p.PostExtraData as StartWeekRequest
    return week.latestWeek === 'true'
  })
  return post
}

export const retireCurrentWeek = async () => {
  const currentWeek = await getCurrentWeek()
  return submitPost({
    Body: currentWeek.Body,
    PostHashHexToModify: currentWeek.PostHashHex,
    PostExtraData: { ...currentWeek.PostExtraData, latestWeek: 'false' }
  }
  ).then(signTransaction)
    .then(submitTransaction).then(() => currentWeek.PostExtraData as StartWeekRequest)
}
