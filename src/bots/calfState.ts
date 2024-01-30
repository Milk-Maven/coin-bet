import { UtilBot } from "./util.js";
import { BaseBot } from "./bot.js";
import { verify } from "../../shared/utils.js";
import { CalfOfferingGame, CalfOfferingValidation, CalfProfileGame, CalfProfileValidation, CalfWeekGame, CalfWeekValidation } from "../../shared/validators.js";

// profile state
export class CalfState extends BaseBot {

  //profile calls
  public async setProfile(state: Pick<CalfProfileGame, 'currentWeekHashHex'>) {
    const profile = await this.getProfile()
    const calfWeeksArray = Object.keys(profile.calfWeeks)
    const updatedProfile: CalfProfileGame = {
      calfWeeks: { ...profile.calfWeeks, [calfWeeksArray.length + 1]: state.currentWeekHashHex },
      currentWeekHashHex: state.currentWeekHashHex || profile.currentWeekHashHex
    }
    return this.updateProfile({ goldenCalf: updatedProfile, })
  }
  public async getProfile(): Promise<CalfProfileGame> {
    const profile = await UtilBot.getSingleProfile({ PublicKeyBase58Check: this.pubKey })
    return CalfProfileValidation.parse(JSON.parse(profile.ExtraData.goldenCalf))
  }

  //week calls
  public async getWeek({ PostHashHex }: { PostHashHex: string | null }): Promise<CalfWeekGame> {
    const profile = await this.getProfile();
    const weekPost = await UtilBot.getSinglePost({ PostHashHex: PostHashHex ?? profile.currentWeekHashHex });
    return CalfWeekValidation.parse(JSON.parse(weekPost.PostExtraData.goldenCalf))
  }

  public async updateWeek({ state, PostHashHexToModify, }: { state: Partial<CalfWeekGame>, PostHashHexToModify: string | null }) {
    const week = PostHashHexToModify ? await this.getWeek({ PostHashHex: PostHashHexToModify }) : {}
    const goldenCalf: CalfWeekGame = { offerings: { ...week.offerings, ...state.offerings, }, latestWeek: state.latestWeek }
    this.updatePost({
      PostHashHexToModify, PostExtraData: { goldenCalf: JSON.stringify(goldenCalf) },
    })
  }

  public async setWeek({ Body }: { Body: string }) {
    return this.submitPost({
      Body,
      PostExtraData: { goldenCalf: JSON.stringify({ latestWeek: true, offerings: {} }) },
    })
  }
  // offering calls
  public async getOfferingsForWeek({ PostHashHex }: { PostHashHex: string }): Promise<CalfOfferingGame[]> {
    const comments = await UtilBot.getCommentsForPost({ PostHashHex, CommentCount: 0 });
    console.log(comments);
    const offerings = comments.map(o => {
      return CalfOfferingValidation.parse(JSON.parse(o.PostExtraData.goldenCalf))
    })
    return offerings;
  }

  public async getOffering({ PostHashHex }: { PostHashHex: string | null }): Promise<CalfOfferingGame> {
    const profile = await this.getProfile();
    const weekPost = await UtilBot.getSinglePost({ PostHashHex: PostHashHex ?? profile.currentWeekHashHex });
    return CalfOfferingValidation.parse(JSON.parse(weekPost.PostExtraData.goldenCalf))
  }

  public async updateOfferingForWeekState({ goldenCalf, PostHashHex }: { PostHashHex: string, goldenCalf: CalfOfferingGame }) {
    const profile = await this.getProfile();
    verify(!!profile.currentWeekHashHex, 'current week not set in profile')
    const offering = await this.updatePost({ // submit offering
      PostHashHexToModify: PostHashHex,
      PostExtraData: {
        goldenCalf: JSON.stringify({ ...goldenCalf })
      },
    })
    return offering;
  }
  public async setOfferingForWeekState({ goldenCalf }: { goldenCalf: CalfOfferingGame }) {
    const profile = await this.getProfile();
    verify(!!profile.currentWeekHashHex, 'current week not set in profile')
    const offering = await this.submitPost({ // submit offering
      ParentStakeID: profile.currentWeekHashHex,
      Body: goldenCalf.Body,
      PostExtraData: {
        goldenCalf: JSON.stringify({ ...goldenCalf })
      },
    })
    const options = goldenCalf.options.map(async o => {
      await this.submitPost({
        ParentStakeID: offering.PostHashHex, Body: o
      })
    })
    await Promise.all(options)
    return { offering, options }
  }
  // sacrifices
}
