import { PostType, Start, CalfEvent, OfferingExtraDateRequest, Offering, OfferingOptionsExtraDataRequest, PartialWithRequiredFields, } from '../../shared/utils.js';
import { OfferringCreateRequest } from '../../shared/validators.js';
import { PostEntryResponse } from '../deso.js';
import { BaseBot } from './bot.js';
import * as deso from 'deso-protocol';

import dotenv from 'dotenv'
import { UtilBot } from './util.js';
import { CalfOfferingGame, CalfProfileGame, CalfWeekGame } from './calfState.js';
dotenv.config();
export class GoldenCalfBot extends BaseBot {
  util = UtilBot;
  constructor() {
    super({ seedHex: process.env.APP_SEED_HEX as string })
  }

  public async switchToBidding(bet: OfferringCreateRequest): Promise<void> { //TODO move top three post from community to correct spot 
    console.log(bet)
  }

  public async startWeek(payload: { description: string }, nextCurrentWeek: string,): Promise<CalfEvent<Start>> {
    let err = 'unable to start week'
    try {
      const goldenCalf: CalfWeekGame = {
        offerings: {},
      }
      return await this.submitPost({
        Body: payload.description,
        goldenCalf,
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

  public async getOfferingsByWeek({ PostHashHex }: PartialWithRequiredFields<deso.PostEntryResponse, 'PostHashHex'>): Promise<CalfEvent<PostEntryResponse[]>> {
    try {
      const offerings: PostEntryResponse[] = await this.util.getCommentsForPost({ PostHashHex, CommentCount: 0 }, p => {
        const extraData = p.PostExtraData as OfferingExtraDateRequest
        return p.PosterPublicKeyBase58Check === this.pubKey && extraData.postType === PostType.offering
      })
      // get all real offerings: from golden calf account AND post type is offering
      return { res: offerings }

    } catch (e) {
      return { err: 'failed to get offerings ' + e.message }
    }
  }

  // depricated
  // public async updateCurrentWeek(payload) {
  //   const { res, err } = await this.getCurrentWeek();
  //   if (err) { return { err } }
  //   const post = await this.submitPost({ PostHashHexToModify: res.PostHashHex, Body: res.Body, PostExtraData: { ...res.PostExtraData, ...payload } })
  //   console.log(post)
  //
  //   return { res: {} }
  // }

  public async getCurrentWeek(): Promise<CalfEvent<PostEntryResponse>> {
    let post: PostEntryResponse;
    try {
      const res = await deso.getPostsForUser({ PublicKeyBase58Check: this.pubKey, "NumToFetch": 20, })
      post = res.Posts.find(p => {
        const week: CalfProfileGame = p.PostExtraData?.goldenCalf as unknown as CalfProfileGame
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
      return { err: 'retirecurrentweek: failed to get current week' }

    }
    const response = { res: { retiredWeek: res, nextCurrentDate: (1 + Number(res.PostExtraData.currentWeek)) + "" } }
    return this.submitPost({
      Body: res.Body,
      PostHashHexToModify: res.PostHashHex,
      goldenCalf: { latestWeek: 'false' }
    }).then(() => { return response })
      .catch((e) => {
        console.log(e)
        return { err: 'retiring latest week failed' }
      }
      )
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

  public async setProfileState(state: Partial<CalfProfileGame>) {
    this.updateProfile({ goldenCalf: state })
  }
  public async setWeekState(state: Partial<CalfWeekGame>) {
    this.submitPost({ goldenCalf: state, })
  }
  public async setOferringState(state: Partial<CalfOfferingGame>) {
    this.submitPost({ goldenCalf: state })
  }
  // public async getSacrifice({ PostHashHex }: PartialWithRequiredFields<deso.PostEntryResponse, 'PostHashHex'>): Promise<CalfEvent<{ sacrifice: PostEntryResponse }>> {
  //   const sacrifice = await deso.getSinglePost({ PostHashHex })
  //   return { res: { sacrifice: sacrifice.PostFound } }
  // }

  // public async getSacrificesForOffering({ PostHashHex }: PartialWithRequiredFields<deso.PostEntryResponse, 'PostHashHex'>) {
  //   const res = await this.util.getCommentsForPost({ PostHashHex, CommentCount: 0 }, (p) => {
  //     const PostExtraData: SacrificeExtraDataRequest = p.PostExtraData as 
  //     return !!PostExtraData
  //   })
  //   return res;
  // }
}

