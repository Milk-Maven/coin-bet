import axios from 'axios';
import * as deso from 'deso-protocol';
import { PostEntryResponse } from '../deso.js';
type DesoBotProps = { seedHex?: string }
// set state that all bots should have
export abstract class BaseBot {
  constructor({ seedHex }: DesoBotProps) {
    const keyPair = deso.keygen(seedHex)
    this.seedHex = keyPair.seedHex
    this.pubKey = deso.publicKeyToBase58Check(keyPair.public)
  }
  public pubKey = ''
  public seedHex = ''
  public selectedNodePath = 'https://node.deso.org/api/v0/'

  public submitPost = async function(req: Partial<deso.SubmitPostRequest>
    & { Body?: string, goldenCalf?: { [key: string]: any } }): Promise<deso.PostEntryResponse> {
    let existingPost: Partial<PostEntryResponse> = {}
    if (req.PostHashHexToModify) {
      existingPost = await BaseBot.getSinglePost({ PostHashHex: req.PostHashHexToModify })
    }
    const transactionEndpoint = 'submit-post'
    const { Body, } = req
    const post = axios.post(this.selectedNodePath + transactionEndpoint, {
      BodyObj: {
        Body,
        VideoURLs: [],
        ImageURLs: []
      },
      UpdaterPublicKeyBase58Check: this.pubKey,
      ParentStakeID: '',
      MinFeeRateNanosPerKB: 1000,
      PostHashHexToModify: '',
      RepostedPostHashHex: '',
      IsHidden: false,
      TransactionFees: [],
      InTutorial: false,
      IsFrozen: false,
      ...existingPost,
      ...req,
      PostExtraData: {
        ...existingPost.PostExtraData,
        ...req.PostExtraData,
        goldenCalf: JSON.stringify({
          ...JSON.parse(existingPost?.PostExtraData?.goldenCalf ?? '{}'),
          ...req.goldenCalf
        })
      }
    }).then(res => {
      return res.data
    }).then((res) => {
      return this.signTransaction({ TransactionHex: res.TransactionHex })
    }).then(async (res) => {
      const a = await this.submitTransaction(res)

      return a?.PostEntryResponse ?? {}
    })
    return post
  }
  public async sendDiamonds(req: Partial<deso.SendDiamondsRequest>): Promise<void> {
    const transactionEndpoint = 'send-diamonds'
    const payload: Partial<deso.SendDiamondsRequest> = {
      SenderPublicKeyBase58Check: this.pubKey,
      ReceiverPublicKeyBase58Check: req.ReceiverPublicKeyBase58Check,
      DiamondPostHashHex: req.DiamondPostHashHex,
      DiamondLevel: req.DiamondLevel,
      MinFeeRateNanosPerKB: 1000
    }
    const sendDiamonds = axios.post(this.selectedNodePath + transactionEndpoint, payload).then(res => {
      return res.data
    }).then((res) => {
      return this.signTransaction({ TransactionHex: res.TransactionHex })
    }).then(async (res) => {
      const a = await this.submitTransaction(res)
      return a?.PostEntryResponse ?? {}
    })
    console.log(sendDiamonds)
    // return sendDiamonds as unknown as deso.SendDiamondsResponse;
  }

  public async signTransaction(postTransaction: { TransactionHex: string }) {
    return await deso.signTx(postTransaction.TransactionHex, this.seedHex, { isDerivedKey: false })
  }
  public async submitTransaction(TransactionHex: string): Promise<deso.SubmitTransactionResponse> {
    const transactionEndpoint = 'submit-transaction';
    const res = await axios.post(this.selectedNodePath + transactionEndpoint, { TransactionHex });
    return res.data as deso.SubmitTransactionResponse;
  }

  public async sendFunds({ RecipientPublicKeyOrUsername, AmountNanos }) {
    const transactionEndpoint = 'send-deso'
    const res = await axios.post(this.selectedNodePath + transactionEndpoint, {
      senderPublicKeyBase58Check: this.pubKey,
      RecipientPublicKeyOrUsername: RecipientPublicKeyOrUsername,
      AmountNanos,
      MinFeeRateNanosPerKB: 1000
    }).then(res => {
      return res.data as deso.SendDeSoResponse;
    }).then(({ TransactionHex }) => this.signTransaction({ TransactionHex }))
      .then((res) => this.submitTransaction(res))
    return res
  }

  public async updateProfile(req: Partial<deso.UpdateProfileRequest> & { goldenCalf?: object }) {
    const profile = await BaseBot.getSingleProfile({ PublicKeyBase58Check: this.pubKey })
    const transactionEndpoint = 'update-profile';
    const request: Partial<deso.UpdateProfileRequest> = {
      ...profile,
      ...req,
      ExtraData: {
        ...profile.ExtraData,
        ...req.ExtraData,
        goldenCalf: {
          ...JSON.parse(profile?.ExtraData?.goldenCalf),
          ...req.goldenCalf
        }
      }
    }
    const res = axios.post(this.selectedNodePath + transactionEndpoint, request).then(res => {
      return res.data as deso.UpdateProfileResponse;
    }).then(({ TransactionHex }) => this.signTransaction({ TransactionHex })).then((res) => this.submitTransaction(res))
    return res;
  }

  public static async getSingleProfile({ PublicKeyBase58Check }) {
    const { Profile } = await deso.getSingleProfile({ PublicKeyBase58Check })
    return Profile
  }


  public static async getSinglePost({ PostHashHex }) {
    const { PostFound } = await deso.getSinglePost({ PostHashHex, CommentOffset: 0, CommentLimit: 20, ThreadLeafLimit: 1, ThreadLevelLimit: 2 })
    return PostFound
  }

  public getInfo = async function() {
    const transactionEndpoint = 'get-single-profile';
    const res: deso.GetSingleProfileResponse = await axios.post(this.selectedNodePath + transactionEndpoint, {
      PublicKeyBase58Check: this.pubKey
    }).then(res => {
      return res.data as deso.GetSingleProfileResponse;
    })
    const { DESOBalanceNanos, Description, PublicKeyBase58Check, Username } = res.Profile
    return { DESOBalanceNanos, seedHex: this.seedHex, PublicKeyBase58Check, Description, Username }
  }

  public waitForSeconds(seconds: number) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Waited for ${seconds} seconds!`);
      }, seconds * 1000); // Convert seconds to milliseconds
    });
  }
}





