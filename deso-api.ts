require('dotenv').config();
const ec = require('elliptic').ec;
const HDKey = require('hdkey')
const sha256 = require('sha256')
const bs58check = require('bs58check')
const bip39 = require('bip39');
//@ts-ignore
const axios = require('axios');
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
type Bet = {
  greeting: string;
  event_description: string;
  outcomes: string[];
  explainer: string;
};
type Network = 'mainnet' | 'testnet';

interface KeyFromMnemonicInput {
  mnemonic: string;
  extraText?: string;
  nonStandard?: boolean;
}
const generateKeyFromSource = async ({
  mnemonic,
  extraText = '',
  nonStandard = true,

}: KeyFromMnemonicInput) => {
  const bip = await bip39;
  const e = new ec('secp256k1');
  const seed = bip.mnemonicToSeedSync(mnemonic, extraText);
  const hdKey = HDKey
  // @ts-ignore
  const hdk = hdKey.fromMasterSeed(seed).derive(
    "m/44'/0'/0'/0/0",
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    nonStandard
  );
  const seedHex = hdk.privateKey.toString('hex');
  return e.keyFromPrivate(seedHex);
};
const uvarint64ToBuf = (uint: number): Buffer => {
  const result: number[] = [];
  while (uint >= 0x80) {
    result.push(Number((BigInt(uint) & BigInt(0xff)) | BigInt(0x80)));
    uint = Number(BigInt(uint) >> BigInt(7));
  }
  result.push(uint | 0);

  return Buffer.from(result);
};

const signMessageLocally = ({
  transactionHex,
  keyPair,
}: {
  transactionHex: string;
  keyPair: any
}): string => {
  const transactionBytes = Buffer.from(transactionHex, 'hex');
  const transactionHash = Buffer.from(sha256.x2(transactionBytes), 'hex');
  const sig = keyPair.sign(transactionHash);
  const signatureBytes = Buffer.from(sig.toDER());
  const signatureLength = uvarint64ToBuf(signatureBytes.length);
  const signedTransactionBytes = Buffer.concat([
    transactionBytes.slice(0, -1),
    signatureLength,
    signatureBytes,
  ]);
  return signedTransactionBytes.toString('hex');
};

const publicKeyToDeSoPublicKey = (
  publicKey: any,
  network: Network = 'mainnet'
): string => {
  const prefix = PUBLIC_KEY_PREFIXES[network].deso;
  const key = publicKey.getPublic().encode('array', true);
  return bs58check.encode(Uint8Array.from([...prefix, ...key]));
};

const PUBLIC_KEY_PREFIXES = {
  mainnet: {
    bitcoin: [0x00],
    deso: [0xcd, 0x14, 0x0],
  },
  testnet: {
    bitcoin: [0x6f],
    deso: [0x11, 0xc2, 0x0],
  },
};


const makeBet = async (bet: Bet) => {
  // const deso = await Deso;
  const keyPair = await generateKeyFromSource({ mnemonic: process.env.APP_KEY ?? '' })
  const publicKey = publicKeyToDeSoPublicKey(keyPair)
  const post = await submitPost({
    "UpdaterPublicKeyBase58Check": publicKey,
    "BodyObj": {
      "Body": bet.greeting,
      "VideoURLs": [],
      "ImageURLs": []
    }
  })
  console.log({ transactionHex: post.TransactionHex, keyPair })
  const signMessage = signMessageLocally({ transactionHex: post.TransactionHex, keyPair })

  const res = await submitTransaction({ TransactionHex: signMessage })
}
module.exports = { makeBet }
