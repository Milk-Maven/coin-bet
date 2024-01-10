import axios from 'axios';
import * as deso from 'deso-protocol';
type DesoBotProps = { seedHex?: string }
// set state that all bots should have
export class BaseBot {
  constructor({ seedHex }: DesoBotProps) {
    const keyPair = deso.keygen(seedHex)
    this.seedHex = keyPair.seedHex
    this.pubKey = deso.publicKeyToBase58Check(keyPair.public)
  }
  public pubKey = ''
  public seedHex = ''


  public selectedNodePath = 'https://node.deso.org/api/v0/'

  public submitPost = function(req: Partial<deso.SubmitPostRequest> & { Body: string }): Promise<deso.PostEntryResponse> {
    let submitPostResponse: deso.SubmitPostResponse
    const transactionEndpoint = 'submit-post'
    const { Body, ...extra } = req
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
      IsFrozen: false, ...extra
    }).then(res => {
      console.log(Object.keys(res))
      submitPostResponse = res.data as deso.SubmitPostResponse;
      return submitPostResponse
    }).then((res) => {
      return this.signTransaction({ TransactionHex: res.TransactionHex })
    }).then(async (res) => {
      const a = await this.submitTransaction(res)
      return a?.PostEntryResponse ?? {}
    })
    return post
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
    })
      .then(({ TransactionHex }) => this.signTransaction({ TransactionHex })).then((res) => this.submitTransaction(res))
    return res
  }
  public async updateProfile({ NewUsername, NewDescription }) {
    const transactionEndpoint = 'update-profile';
    const res = axios.post(this.selectedNodePath + transactionEndpoint, {
      UpdaterPublicKeyBase58Check: this.pubKey,
      NewUsername,
      MinFeeRateNanosPerKB: 1000,
      NewCreatorBasisPoints: 100,
      NewDescription,
      "NewStakeMultipleBasisPoints": 12500
    }).then(res => {
      return res.data as deso.UpdateProfileResponse;
    }).then(({ TransactionHex }) => this.signTransaction({ TransactionHex })).then((res) => this.submitTransaction(res))
    return res;
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





