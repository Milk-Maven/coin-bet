require('dotenv').config();
const ec = require('elliptic').ec;
const HDKey = require('hdkey')
const sha256 = require('sha256')
const bs58check = require('bs58check')
const bip39 = require('bip39');
//@ts-ignore
const axios = require('axios');
const deso = require('deso-protocol');

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
  TxnMeta: any;
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
const desoNode = 'http://node.deso.org/api/v0/';

interface SumbitTransactionRequest {
  TransactionHex: string
}
const submitTransaction = async (request: SumbitTransactionRequest) => {
  return await axios.post(`${desoNode}submit-transaction`, request)
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
//@ts-ignore
// const generateKeyFromSource = async ({
//   mnemonic,
//   extraText = '',
//   nonStandard = true,
//
// }: KeyFromMnemonicInput) => {
//   const bip = await bip39;
//   const e = new ec('secp256k1');
//   const seed = bip.mnemonicToSeedSync(mnemonic, extraText);
//   const hdKey = HDKey
//   // @ts-ignore
//   const hdk = hdKey.fromMasterSeed(seed).derive(
//     "m/44'/0'/0'/0/0",
//     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//     // @ts-ignore
//     nonStandard
//   );
//   const seedHex = hdk.privateKey.toString('hex');
//   return e.keyFromPrivate(seedHex);
// };
// const uvarint64ToBuf = (uint: number): Buffer => {
//   const result: number[] = [];
//   while (uint >= 0x80) {
//     result.push(Number((BigInt(uint) & BigInt(0xff)) | BigInt(0x80)));
//     uint = Number(BigInt(uint) >> BigInt(7));
//   }
//   result.push(uint | 0);
//
//   return Buffer.from(result);
// };





const makeBet = async (bet: Bet) => {
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
}
module.exports = { makeBet }
