import { PostEntryResponse, ProfileEntryResponse, } from "deso-protocol";
import { UtilBot } from "./util.js";
import { TypeOf, z } from "zod";

// profile state
export const CalfProfileValidation = z.object({
  calfWeek: z.record(z.string()),
});
export type CalfProfileGame = TypeOf<typeof CalfProfileValidation>;
export type CalfProfile = {
  profile: ProfileEntryResponse,
  game: CalfProfileGame
}
// current week state
export const CalfWeekValidation = z.object({
  offerings: z.record(z.string()),
  latestWeek: z.union([z.literal('true'), z.literal('false')])
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

export async function getCalfState({ PublicKeyBase58Check }) {
  // get profile
  console.log('getprofile')
  const profilePost = await UtilBot.getSingleProfile({ PublicKeyBase58Check });

  const gameProfile: CalfProfileGame = CalfProfileValidation.parse(profilePost.ExtraData)

  const calfProfile: CalfProfile = {
    profile: profilePost, game: gameProfile
  }
  // get currentWeek
  const weekPost = await UtilBot.getSinglePost({ PostHashHex: calfProfile.game.calfWeek });
  const gameWeek: CalfWeekGame = CalfWeekValidation.parse(weekPost.PostExtraData)
  const calfWeek: CalfWeek = {
    post: weekPost,
    game: gameWeek
  }
  const weekOfferings = await UtilBot.getCommentsForPost({ PostHashHex: weekPost.PostHashHex, CommentCount: 0 });
  const calfOfferings = weekOfferings.map(post => {
    const game: CalfOfferingGame = CalfOfferingValidation.parse(post.PostExtraData)
    return { post, game }
  })
  return {
    calfProfile, calfWeek, calfOfferings
  }
}
