
import DB from 'simple-json-db';
import { ConsumerBot } from './consumer.js';
import { GoldenCalfBot } from './goldenCalf.js';
import { OfferringCreateRequest } from '../../shared/validators.js';
import { PostEntryResponse } from '../deso.js';
import { RunOffering, RoundEvent, RunEnd, RunPay, RunSnapShot } from '../../shared/utils.js';
const db = new DB("./db.json", { syncOnWrite: true });
export const getResultsSnapshot = async (PostHashHex: string) => {
  console.log(PostHashHex)
}
export function desoToNanos(deso: number) {
  const nanosPerDeso = 1000000;

  const nanos = deso * nanosPerDeso;

  return nanos;
}
type ConsumerBotMetaData = {
  DESOBalanceNanos: number;
  seedHex: string;
  PublicKeyBase58Check: string;
  Description: string;
  Username: string;
};

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

async function makeOffering(offerringCreateRequest: OfferringCreateRequest): Promise<RoundEvent<RunOffering>> {
  const goldenCalfBot = new GoldenCalfBot()
  const { res, err } = await goldenCalfBot.makeOffering({ event_description: offerringCreateRequest.event_description, publicKey: goldenCalfBot.pubKey, endDate: offerringCreateRequest.endDate, outcomes: offerringCreateRequest.outcomes })
  if (err) return { err }
  const { offering, offeringOptions } = res
  return { res: { message: 'offerings succuessfully made', payload: { offering, offeringOptions } } }
}

type RunStartWeek = { message: string, payload: PostEntryResponse }
async function startWeek({ description }): Promise<RoundEvent<RunStartWeek>> {
  const calf = new GoldenCalfBot()
  const retire = await calf.retireCurrentWeek()
  if (retire.err) return { err: retire.err }

  const start = await calf.startWeek({ description: description }, retire.res.nextCurrentDate)
  if (start.err) return { err: start.err }

  return { res: { message: 'week started successfully', payload: start.res.startedWeek } }
}

async function endWeek(): Promise<RoundEvent<RunEnd>> {
  const calf = new GoldenCalfBot()
  const retire = await calf.retireCurrentWeek()

  if (retire.err) return { err: retire.err }

  return { res: { message: '', payload: { end: '' } } }
}

export async function payWeek(): Promise<RoundEvent<RunPay>> {
  // const calf = new GoldenCalfBot()

  return { res: { message: '', payload: { payments: [] } } }
}

export async function getSnapshot(): Promise<RoundEvent<RunSnapShot>> {
  const calf = new GoldenCalfBot()
  const snapshot = await calf.getSnapshot()
  if (snapshot.err) return { err: snapshot.err }
  return { res: { message: 'get snapshot successful', payload: snapshot.res } }
}





export const game = { startWeek, makeOffering, getSnapshot, endWeek, payWeek }
