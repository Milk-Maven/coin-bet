import axios from 'axios';
import { BaseBot } from './bot.js'
import * as deso from 'deso-protocol';
import { PostEntryResponse } from '../deso.js';
// incase one needs to raw dog a signature without a bot
export class UtilBot extends BaseBot {
  public static selectedNodePath = 'https://node.deso.org/api/v0/'

  public static async signTransaction(postTransaction: { TransactionHex: string, seedHex: string }) {
    return await deso.signTx(postTransaction.TransactionHex, postTransaction.seedHex, { isDerivedKey: false })
  }

  public static async submitTransaction(TransactionHex: string): Promise<deso.SubmitTransactionResponse> {
    const transactionEndpoint = 'submit-transaction';
    const res = await axios.post(this.selectedNodePath + transactionEndpoint, { TransactionHex });
    return res.data as deso.SubmitTransactionResponse;
  }
  public static async getDiamondsSendersForPost({ PostHashHex, DiamondCount }: deso.PartialWithRequiredFields<deso.PostEntryResponse, 'PostHashHex'>) {
    let Offset = 0
    let diamondPosts: deso.DiamondSenderResponse[] = []
    while (Offset < DiamondCount) { // pagination loop to get all comments
      const { DiamondSenders } = await deso.getDiamondsForPost({ PostHashHex, Limit: 20, Offset })
      if (DiamondSenders) {
        diamondPosts = [...diamondPosts, ...DiamondSenders]
      }
      Offset = Offset + 20
    }
    return diamondPosts ?? []
  }
  public static async getSinglePost({ PostHashHex }: { PostHashHex: string }) {
    const { PostFound } = await deso.getSinglePost({ PostHashHex, CommentOffset: 0, CommentLimit: 20, ThreadLeafLimit: 1, ThreadLevelLimit: 2 })
    return PostFound
  }

  public static async getSingleProfile({ PublicKeyBase58Check }) {
    const { Profile } = await deso.getSingleProfile({ PublicKeyBase58Check })
    return Profile
  }

  public static async getCommentsForPost({ PostHashHex }: deso.PartialWithRequiredFields<deso.PostEntryResponse, 'CommentCount'>, filter?: (p: PostEntryResponse) => boolean) {
    let CommentOffset = 0
    let posts: deso.PostEntryResponse[] = []
    console.log('here')


    const { PostFound } = await deso.getSinglePost({ 'PostHashHex': PostHashHex, CommentOffset, CommentLimit: 20, ThreadLeafLimit: 1, ThreadLevelLimit: 2 })
    while (CommentOffset < PostFound.CommentCount) { // pagination loop to get all comments
      const { PostFound } = await deso.getSinglePost({ 'PostHashHex': PostHashHex, CommentOffset, CommentLimit: 20, ThreadLeafLimit: 1, ThreadLevelLimit: 2 })

      if (PostFound.Comments) {
        posts = [...posts, ...PostFound.Comments]
      }
      CommentOffset = CommentOffset + 20
    }
    return filter ? posts.filter(filter) : posts
  }
}
