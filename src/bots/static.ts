
import DB from 'simple-json-db';
import { ConsumerBot, ConsumerEvent, Offering } from './consumer.js';
import { CalfEvent, GoldenCalfBot, SnapShot } from './goldenCalf.js';
import { offeringExamples } from '../../shared/validators.js';
import { PostEntryResponse } from '../deso.js';
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

type Bid = { message: string, payload: { offerings: ConsumerEvent<Offering>[], currentWeek: CalfEvent<PostEntryResponse> } }
async function makeOffering(amount: number): Promise<RoundEvent<Bid>> {
  const goldenCalfBot = new GoldenCalfBot()
  const bots = getConsumerBots(amount)
  const currentWeek = await goldenCalfBot.getCurrentWeek()
  const offerings = await Promise.all(bots.map(async (bot, i) => {
    return await bot.makeOffering({ ParentStakeID: currentWeek.res.PostHashHex, event_description: offeringExamples[i].event_description, publicKey: bot.pubKey, endDate: offeringExamples[i].endDate, outcomes: offeringExamples[i].outcomes })
  }));
  return { res: { message: 'offerings succuessfully made', payload: { offerings, currentWeek } } }
}

type RunStartWeek = { message: string, payload: PostEntryResponse }
async function startWeek({ description }): Promise<RoundEvent<RunStartWeek>> {
  const calf = new GoldenCalfBot()
  const retire = await calf.retireCurrentWeek()
  if (retire.err) return { err: retire.err }

  const start = await calf.startWeek({ description: description }, retire.res.nextCurrentDate)
  console.log(start)
  if (start.err) return { err: start.err }

  return { res: { message: 'week started successfully', payload: start.res.startedWeek } }
}

type RunEnd = { message: string, payload: {} }
async function endWeek(): Promise<RoundEvent<RunEnd>> {
  const calf = new GoldenCalfBot()
  const retire = await calf.retireCurrentWeek()

  if (retire.err) return { err: retire.err }

  return { res: { message: '', payload: {} } }
}

type RunPay = { message: string, payload: {} }
export async function payWeek(): Promise<RoundEvent<RunPay>> {
  // const calf = new GoldenCalfBot()

  return { res: { message: '', payload: {} } }
}

type RunSnapShot = { message: string, payload: SnapShot }
export async function getSnapshot(): Promise<RoundEvent<RunSnapShot>> {
  const calf = new GoldenCalfBot()
  const snapshot = await calf.getSnapshot()
  if (snapshot.err) return { err: snapshot.err }
  return { res: { message: 'get snapshot successful', payload: snapshot.res } }
}


export type RoundEvent<Response> = { res?: Response, err?: string }



export const game = { startWeek, makeOffering, getSnapshot, endWeek, payWeek }
