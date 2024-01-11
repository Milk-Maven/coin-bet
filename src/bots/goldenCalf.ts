import { PostType, StartWeekRequest, Start, CalfEvent, SnapShot, OfferingExtraDateRequest, Offering, OfferingOptionsExtraDataRequest } from '../../shared/utils.js';
import { OfferringCreateRequest } from '../../shared/validators.js';
import { PostEntryResponse } from '../deso.js';
import { BaseBot } from './bot.js';
import * as deso from 'deso-protocol';

import dotenv from 'dotenv'
dotenv.config();
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
        err = 'unable to get updated week ' + nextCurrentWeek
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

  public async getOfferingsForCurrentWeek(): Promise<CalfEvent<PostEntryResponse[]>> {
    try {
      const { res, err } = await this.getCurrentWeek()
      if (err) return { err }
      let CommentOffset = 0
      let offerings: PostEntryResponse[] = []
      while (CommentOffset < res.CommentCount) {
        console.log({ 'PostHashHex': res.PostHashHex, CommentOffset, CommentLimit: 20, ThreadLeafLimit: 1, ThreadLevelLimit: 2 })
        const { PostFound } = await deso.getSinglePost({ 'PostHashHex': res.PostHashHex, CommentOffset, CommentLimit: 20, ThreadLeafLimit: 1, ThreadLevelLimit: 2 })
        if (PostFound.Comments) {
          offerings = [...offerings, ...PostFound.Comments]
        }
        CommentOffset = CommentOffset + 20
      }
      // get all real offerings
      offerings = offerings.filter(c => {
        const extraData = c.PostExtraData as OfferingExtraDateRequest
        c.PosterPublicKeyBase58Check === this.pubKey && extraData.postType === PostType.offering
      })

      return { res: [] }

    } catch (e) {
      return { err: 'failed to get offerings ' + e.message }
    }

    return { res: [] }
  }
  public async updateCurrentWeek(payload) {
    const { res, err } = await this.getCurrentWeek();
    if (err) { return { err } }
    const post = await this.submitPost({ PostHashHexToModify: res.PostHashHex, Body: res.Body, PostExtraData: { ...res.PostExtraData, ...payload } })
    console.log(post)


    return { res: {} }
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
    } catch (e) {
      return { err: 'failed to get current week: ' + e.message }
    }

    if (post === undefined) {
      return { err: 'failed to get current week: post response came back undefined' }
    }
    return { res: post }
  }

  public async retireCurrentWeek(): Promise<CalfEvent<{ retiredWeek: PostEntryResponse, nextCurrentDate: string }>> {
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
  public async getSnapshot(): Promise<CalfEvent<SnapShot>> {
    const { res, err } = await this.getCurrentWeek()

    if (err) {
      return { err }
    }
    const offerings = await this.getOfferingsForCurrentWeek()
    if (offerings.err) {
      return { err: offerings.err }
    }

    return { res: { currentWeek: res, offerings: [], sacrifice: {} as PostEntryResponse } }
  }

  public async makeOffering(bet: OfferringCreateRequest): Promise<CalfEvent<Offering>> {
    try {

      const { res, err } = await this.getCurrentWeek()
      if (err) return { err }
      const PostExtraData: OfferingExtraDateRequest = { endDate: bet.endDate, totalOptions: `${bet.outcomes.length}`, postType: PostType.offering, creatorPublicKey: bet.publicKey }
      let offering = await this.submitPost({ // submit offering
        ParentStakeID: res.PostHashHex,
        Body: bet.event_description,
        PostExtraData,
      })
      await this.waitForSeconds(1)

      const offerings = JSON.stringify([...JSON.parse(res.PostExtraData.offerings), offering.PostHashHex])

      await this.submitPost({ PostHashHexToModify: offering.ParentStakeID, Body: res.Body, PostExtraData: { ...res.PostExtraData, offerings } })

      await this.waitForSeconds(1)
      const offeringOptions = await Promise.all(bet.outcomes.map(async (outcome, i) => {
        const PostExtraData: OfferingOptionsExtraDataRequest = {
          option: `${i}`
        }
        return await this.submitPost(
          {
            ParentStakeID: offering.PostHashHex,
            Body: outcome,
            PostExtraData
          }
        )
      }))
      const offeringHashHex = offeringOptions.map(option => {
        return { PostHashHex: option.PostHashHex }
      })
      offering = await this.submitPost({ PostHashHexToModify: offering.PostHashHex, Body: offering.Body, PostExtraData: { ...offering.PostExtraData, optionPublicKeys: JSON.stringify(offeringHashHex) } })
      return { res: { offering, offeringOptions } }

    } catch (e) {
      return { err: e }
    }

  }
}

