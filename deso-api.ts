
require('dotenv').config();
const ec = require('elliptic').ec;
const EC = require('elliptic');
const HDKey = require('hdkey')
const sha256 = require('sha256')
const bs58check = require('bs58check')
const bip39 = require('bip39');
const axios = require('axios');

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
  console.log(publicKey)
  signMessageLocally({ transactionHex: '', keyPair })
  // const txInfo = await Deso.submitPost({
  //   UpdaterPublicKeyBase58Check: publicKey,
  //   BodyObj: {
  //     Body: 'My first post on DeSo!',
  //     ImageURLs: [],
  //     VideoURLs: [],
  //   },
  // });
  // deso.signTx('temp',)
}
module.exports = { makeBet }
