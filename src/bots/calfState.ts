import { PostEntryResponse, ProfileEntryResponse, } from "deso-protocol";
import { TypeOf, z } from "zod";
import { UtilBot } from "./util.js";
import { BaseBot } from "./bot.js";
import { verify } from "../../shared/utils.js";

// profile state
export const CalfProfileValidation = z.object({
  calfWeeks: z.record(z.string()).optional(),
  currentWeekHashHex: z.string().optional()
});
export type CalfProfileGame = TypeOf<typeof CalfProfileValidation>;
export type CalfProfile = {
  profile: ProfileEntryResponse,
  game: CalfProfileGame
}
// current week state
export const CalfWeekValidation = z.object({
  offerings: z.record(z.string()),
  latestWeek: z.boolean()
});
export type CalfWeekGame = TypeOf<typeof CalfWeekValidation>;
export type CalfWeek = {
  post: PostEntryResponse,
  game: CalfWeekGame
}
// offering state
export const CalfOfferingValidation = z.object({
  endDate: z.string(),
  totalOptions: z.string(),
  creatorPublicKey: z.string(),
  options: z.array(z.string()),
  winningOption: z.string(),
  Body: z.string()
});
export type CalfOfferingGame = TypeOf<typeof CalfOfferingValidation>;
export type CalfOffering = {
  post: PostEntryResponse,
  game: CalfOfferingGame
}
// sacrifice
export const CalfSacrificeValidation = z.object({
  sacrifices: z.record(z.object({
    amountNanos: z.string(), diamonds: z.array(z.object({ diamondLevel: z.string() }))
    // DiamondSenderProfile: ProfileEntryResponse | null;
  }))
})
export type CalfSacrificeGame = TypeOf<typeof CalfSacrificeValidation>;
// export type CalfSacrificeGame = {
//   [publicKey: string]: { amountNanos, diamonds: DiamondSenderResponse[] }
// }
export type CalfSacrifice = {
  post: PostEntryResponse,
  game: CalfSacrificeGame
}
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
    console.log(profile.ExtraData.goldenCalf)
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
      PostExtraData: { goldenCalf: JSON.stringify({ latestWeek: true }) },
    })
  }
  // offering calls
  public async getOfferingsForWeek({ PostHashHex }: { PostHashHex: string }): Promise<CalfOfferingGame[]> {
    const comments = await UtilBot.getCommentsForPost({ PostHashHex, CommentCount: 0 });
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
