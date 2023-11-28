
import axios from 'axios';
import * as deso from 'deso-protocol';

interface SubmitPostResponse {
  TstampNanos: number;
  PostHashHex: string;
  TotalInputNanos: number;
  ChangeAmountNanos: number;
  FeeNanos: number;
  Transaction: MsgDeSoTxn;
  TransactionHex: string;
}
interface DeSoBodySchema {
  Body: string;
  ImageURLs: string[] | null;
  VideoURLs: string[] | null;
}
interface Signature {
  R: number | null;
  S: number | null;
}
interface DeSoInput {
  TxID: number[];
  Index: number;
}
interface DeSoOutput {
  PublicKey: number[] | null;
  AmountNanos: number;
}
interface SubmitPostRequest {
  UpdaterPublicKeyBase58Check: string;
  PostHashHexToModify: string;
  ParentStakeID: string;
  BodyObj: DeSoBodySchema;
  RepostedPostHashHex: string;
  PostExtraData: { [key: string]: string };
  IsHidden: boolean;
  MinFeeRateNanosPerKB: number;
  TransactionFees: null;
  InTutorial: boolean;
}
interface MsgDeSoTxn {
  TxInputs: DeSoInput[] | null;
  TxOutputs: DeSoOutput[] | null;
  TxnMeta: null;
  PublicKey: number[] | null;
  ExtraData: { [key: string]: number };
  Signature: Signature | null;
  TxnTypeJSON: number;
}
interface SubmitPostResponse {
  TstampNanos: number;
  PostHashHex: string;
  TotalInputNanos: number;
  ChangeAmountNanos: number;
  FeeNanos: number;
  Transaction: MsgDeSoTxn;
  TransactionHex: string;
}
export interface Bet {
  greeting: string;
  event_description: string;
  outcomes: string[];
  explainer: string;
}

export const makeBet = async (bet: Bet): Promise<void> => {
  const seedHex = process.env.APP_SEED_HEX ?? ''
  const keyPair = deso.keygen(seedHex)
  const pubKey = deso.publicKeyToBase58Check(keyPair.public)
  console.log(pubKey)
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
