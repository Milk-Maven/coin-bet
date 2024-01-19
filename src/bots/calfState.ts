import { DiamondSenderResponse, PostEntryResponse, ProfileEntryResponse } from "deso-protocol";
import { PostType, } from "../../shared/utils.js";
import { UtilBot } from "./util.js";

// State for Game
export type CalfProfile = {
  profile: ProfileEntryResponse,
  game: CalfProfileGame
}
export type CalfProfileGame = {
  calfWeek: { [week: string]: string }
  postType: PostType,
  latestWeek: 'true'
}
export type CalfWeek = {
  post: PostEntryResponse,
  game: CalfWeekGame
}
export type CalfWeekGame = {
  offerings: { [PostHashHex: string]: string },
}
export type CalfOfferingGame = {
  endDate: string,
  totalOptions: string
  postType: PostType.offering
  creatorPublicKey: string
  options: string[]
  winningOption: string
}
export type CalfOffering = {
  post: PostEntryResponse,
  game: CalfOfferingGame
}

export type CalfSacrificeGame = {
  [publicKey: string]: { amountNanos, diamonds: DiamondSenderResponse[] }
}
export type CalfSacrifice = {
  post: PostEntryResponse,
  game: CalfSacrificeGame
}
export async function getCalfState({ PublicKeyBase58Check }) {
  // get profile
  const profilePost = await UtilBot.getSingleProfile({ PublicKeyBase58Check });
  const gameProfile: CalfProfileGame = profilePost.ExtraData as unknown as CalfProfileGame
  const calfProfile: CalfProfile = {
    profile: profilePost, game: gameProfile
  }

  // get currentWeek

  const weekPost = await UtilBot.getSinglePost({ PostHashHex: calfProfile.game.calfWeek });
  const gameWeek: CalfWeekGame = weekPost.PostExtraData as unknown as CalfWeekGame
  const calfWeek: CalfWeek = {
    post: weekPost,
    game: gameWeek
  }

  const weekOfferings = await UtilBot.getCommentsForPost({ PostHashHex: weekPost.PostHashHex, CommentCount: 0 });
  const calfOfferings = weekOfferings.map(post => {
    const game: CalfOfferingGame = post.PostExtraData as unknown as CalfOfferingGame
    return { post, game }
  })

  return {
    calfProfile, calfWeek, calfOfferings
  }
}

