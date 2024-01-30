import DB from 'simple-json-db';
import { ConsumerBot } from './consumer.js';
import { GoldenCalfBot } from './goldenCalf.js';

export type ConsumerBotMetaData = {
  DESOBalanceNanos: number;
  seedHex: string;
  PublicKeyBase58Check: string;
  Description: string;
  Username: string;
};
const db = new DB("./db.json", { syncOnWrite: true });
export function desoToNanos(deso: number) {
  const nanosPerDeso = 1000000;
  const nanos = deso * nanosPerDeso;
  return nanos;
}


export function getConsumerBots(amount: number): ConsumerBot[] {
  const bots: ConsumerBotMetaData[] = db.get('bots');
  const amountToReturn = amount ?? bots.length;
  return bots.slice(0, amountToReturn).map((b: ConsumerBotMetaData) => {
    return new ConsumerBot({ seedHex: b.seedHex })
  })
}

export function generateConsumerBots(goldenCalfBot: GoldenCalfBot) {
  throw 'run this only if you need it! (cost deso to make functional bots)'
  db.get('bots').forEach(async (d) => {
    const bot = new ConsumerBot({})
    await goldenCalfBot.sendFunds({ RecipientPublicKeyOrUsername: bot.pubKey, AmountNanos: desoToNanos(.001) })
    await bot.updateProfile({ NewUsername: d.name + Math.floor(Math.random() * 100000) + "", NewDescription: d.description })
    const res = await bot.getInfo()
    db.set('bots', [...db.get('bots'), res])
  });
}

//TODO
// async function endWeek(): {
//   // const retire = await calf.retireCurrentWeek()
//
//   // if (retire.err) return { err: retire.err }
//
//   return { res: { message: '', payload: { end: '' } } }
// }

//TODO
// export async function payWeek(): Promise<RoundEvent<RunPay>> {
//   // const calf = new GoldenCalfBot()
//
//   return { res: { message: '', payload: { payments: [] } } }
// }

//TODO
export async function gameState() {
  // const payload = await getCalfState({ PublicKeyBase58Check: new GoldenCalfBot().pubKey })
  // return { res: { message: 'get snapshot successful', payload } }
}

// TODO
// export async function makeSacrificeWithDiamonds(req: SacrificeDiamondRequest): Promise<RoundEvent<RunMakeSacrifice>> {
//   const calf = new GoldenCalfBot()
//   const consumer = UtilBot
//   await consumer.submitTransaction(req.TransactionHex)
//   const diamondSender = await consumer.getDiamondsSendersForPost({ PostHashHex: req.DiamondPostHashHex }).then(
//     d => d.find(d => d.DiamondSenderProfile.PublicKeyBase58Check === req.SenderPublicKeyBase58Check))
//   let offering = await consumer.getSinglePost({ PostHashHex: req.DiamondPostHashHex })
//   const sacrifice = { [req.SenderPublicKeyBase58Check]: diamondSender }
//   const PostExtraData = offering.PostExtraData = {
//     ...offering.PostExtraData,
//     diamonds: {
//       ...JSON.parse(offering.PostExtraData?.diamonds),
//       ...sacrifice
//     }
//   }
//   // const goldenCalf 
//   await calf.submitPost({ PostHashHexToModify: req.DiamondPostHashHex, Body: offering.Body, PostExtraData, goldenCalf: {} })
//   offering = await consumer.getSinglePost({ PostHashHex: req.DiamondPostHashHex })
//   return { res: { message: 'made sacrifice successfully', payload: { updatedOffering: offering } } }
// }
// //  Good
// export async function makeSacrificeWithDeso(req: SacrificeDesoRequest) {
//   const calf = new GoldenCalfBot()
//   const consumer = UtilBot
//   await consumer.submitTransaction(req.TransactionHex)
//   let offering = await consumer.getSinglePost({ PostHashHex: req.PostHashHax })
//   const sacrifice = { [req.SenderPublicKeyBase58Check]: { AmountNanos: req.AmountNanos } }
//   const PostExtraData = offering.PostExtraData = {
//     ...offering.PostExtraData,
//     deso: {
//       ...JSON.parse(offering.PostExtraData?.deso),
//       ...sacrifice
//     }
//   }
//   await calf.submitPost({ PostHashHexToModify: req.PostHashHax, Body: offering.Body, PostExtraData, goldenCalf: {} })
//   offering = await consumer.getSinglePost({ PostHashHex: req.PostHashHax })
//   return { res: { message: 'made sacrifice successfully', payload: { updatedOffering: [] } } }
// }
// export async function 

export const game = {
  gameState,
  // endWeek,
  //   payWeek,
}
