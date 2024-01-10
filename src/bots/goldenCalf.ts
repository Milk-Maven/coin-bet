import { PostType, StartWeekRequest } from '../../shared/utils.js';
import { OfferringCreateRequest } from '../../shared/validators.js';
import { PostEntryResponse } from '../deso.js';
import { BaseBot } from './bot.js';
import * as deso from 'deso-protocol';

import dotenv from 'dotenv'
import { RoundEvent } from './static.js';
dotenv.config();
export type CalfEvent<Response> = RoundEvent<Response>
type Retire = { retiredWeek: PostEntryResponse, nextCurrentDate: string }
type Start = { startedWeek: PostEntryResponse, }
export class GoldenCalfBot extends BaseBot {
  constructor() {
    super({ seedHex: process.env.APP_SEED_HEX as string })
  }
  public async switchToBidding(bet: OfferringCreateRequest): Promise<void> { //TODO move top three post from community to correct spot 
    console.log(bet)
  }
  public async startWeek(payload: Pick<StartWeekRequest, 'description'>, nextCurrentWeek: string,): Promise<CalfEvent<Start>> {
    //first post of its type? set it to zero
    let err = 'unable to start week'
    try {
      const PostExtraData: Omit<StartWeekRequest, 'description'> = {
        'postType': PostType.startWeek,
        'currentWeek': nextCurrentWeek,
        'latestWeek': 'true'
      }
      return await this.submitPost({
        Body: payload.description,
        PostExtraData,
      }).then(async () => {
        err = 'unable to get updated week' + ' nextCurrentWeek'
        await this.waitForSeconds(2)

        const week = await this.getCurrentWeek()
        const res: Start = { startedWeek: week.res }
        return { res }
      }).catch(() => { return { err } }
      )
    } catch {
      return { err }
    }
  }

  public async getCurrentWeek(): Promise<CalfEvent<PostEntryResponse>> {
    let post: PostEntryResponse;
    try {
      const res = await deso.getPostsForUser({ PublicKeyBase58Check: this.pubKey, "NumToFetch": 20, })
      post = res.Posts.find(p => {
        const week: StartWeekRequest = p.PostExtraData as StartWeekRequest
        return week.latestWeek === 'true'
      })
      if (post === undefined) {
        post = res.Posts.reduce((latest, post) => {
          return Number(post.PostExtraData?.currentWeek) > Number(latest.PostExtraData?.currentWeek) ? post : latest;
        }, res.Posts[0]);
      }
    } catch {
      return { err: 'failed to get current week' }
    }

    if (post === undefined) {
      return { err: 'failed to get current week' }
    }
    return { res: post }
  }

  public async retireCurrentWeek(): Promise<CalfEvent<Retire>> {
    const { err, res } = await this.getCurrentWeek()
    if (err) {
      return { err: 'failed to get current week' }

    }
    const response = { res: { retiredWeek: res, nextCurrentDate: (1 + Number(res.PostExtraData.currentWeek)) + "" } }
    return this.submitPost({
      Body: res.Body,
      PostHashHexToModify: res.PostHashHex,
      PostExtraData: { ...res.PostExtraData, latestWeek: 'false' }
    }).then(() => { return response })
      .catch(() => { return { err: 'retiring latest week failed' } })
  }
}

