
require('dotenv').config();
const ec = require('elliptic').ec
// import e from 'elliptic'
const HDKey = require('hdkey')
// const Deso = import('deso-protocol');
const bip39 = import('bip39');
// import axios from 'axios';
// const key = keygen(process.env.APP_KEY)

// const signAndSubmit = async () => {
// const postTransaction: { TransactionHex: string } = await axios.post(
// 'https://node.deso.org/api/v0/submit-post'
// );
// }

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


const makeBet = async () => {
  // const deso = await Deso;
  const a = await generateKeyFromSource({ mnemonic: process.env.APP_KEY ?? '' })
  console.log(a)
  // deso.signTx('temp',)
}
makeBet()
