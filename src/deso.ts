
import axios from 'axios';
import * as deso from 'deso-protocol';
import { SubmitPostResponse, SubmitPostRequest } from 'deso-protocol-types';

export const makeBet = async (bet: Bet): Promise<void> => {
  const seedHex = process.env.APP_SEED_HEX ?? ''
  const keyPair = deso.keygen(seedHex)
  const pubKey = deso.publicKeyToBase58Check(keyPair.public)
  const post = await submitPost({
    "UpdaterPublicKeyBase58Check": pubKey,
    MinFeeRateNanosPerKB: 1500,
    "BodyObj": {
      "Body": bet.greeting,
      "VideoURLs": [],
      "ImageURLs": []
    }
  })
  const signMessaged = await deso.signTx(post.TransactionHex, seedHex, { isDerivedKey: false })
  const res = await submitTransaction({ TransactionHex: signMessaged })
  console.log(res)
}

const submitPost = async (
  request: Partial<SubmitPostRequest>,
): Promise<
  SubmitPostResponse> => {

  const constructedTransactionResponse: SubmitPostResponse = (
    await axios.post(`${desoNode}submit-post`, request)
  ).data;
  return constructedTransactionResponse
}
const submitTransaction = async (request: SumbitTransactionRequest) => {
  return await axios.post(`${desoNode}submit-transaction`, request)
}
const desoNode = 'http://node.deso.org/api/v0/';

interface SumbitTransactionRequest {
  TransactionHex: string
}
