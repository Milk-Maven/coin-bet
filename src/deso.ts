import * as deso from 'deso-protocol';
import axios from 'axios';
import dotenv from 'dotenv'
import { OfferringCreateRequest, OfferingGetRequest } from '../shared/validators.js';
import { PostType, type OfferingExtraDateRequest, type OfferingOptionsExtraDataRequest, StartWeekRequest } from '../shared/utils.js'
dotenv.config();

const seedHex = process.env.APP_SEED_HEX;
const keyPair = deso.keygen(seedHex)
const pubKey = deso.publicKeyToBase58Check(keyPair.public)
const signTransaction = (postTransaction: { TransactionHex: string }) => {
  return deso.signTx(postTransaction.TransactionHex, seedHex, { isDerivedKey: false })
}
export type PostEntryResponse = deso.PostEntryResponse;
export const getOffering = async ({ PostHashHex, OptionPostHashHex, PosterPublicKeyBase58Check }: OfferingGetRequest) => {
  console.log(OptionPostHashHex, PosterPublicKeyBase58Check, PostHashHex)
}

export const makeOffering = async (bet: OfferringCreateRequest): Promise<void> => {
  const PostExtraData: OfferingExtraDateRequest = { endDate: bet.endDate, totalOptions: `${bet.outcomes.length}`, postType: PostType.offering, creatorPublicKey: bet.publicKey }
  const success = await submitPost({ // submit offering 
    UpdaterPublicKeyBase58Check: pubKey,
    BodyObj: {
      Body: bet.event_description,
      VideoURLs: [],
      ImageURLs: []
    },
    PostExtraData,
  }).then(signTransaction).then(submitTransaction).then((a) => {
    // now that the transaction exists reply with the options 
    return Promise.all(bet.outcomes.map((outcome, i) => {
      const PostExtraData: OfferingOptionsExtraDataRequest = {
        option: `${i}`
      }
      return submitPost(
        {
          UpdaterPublicKeyBase58Check: pubKey,
          ParentStakeID: a.PostEntryResponse.PostHashHex,
          BodyObj: {
            Body: outcome,
            VideoURLs: [],
            ImageURLs: []
          },
          PostExtraData
        }
      )
    }))
  }).then(res => {
    return Promise.all(res.map(signTransaction))
  }).then(signatures => { return Promise.all(signatures.map(submitTransaction)) })
  console.log(success)
}

export const getCurrentWeek = async () => {
  const res = await deso.getPostsForUser({ PublicKeyBase58Check: pubKey, "NumToFetch": 20, })
  const post = res.Posts.find(p => {
    const week: StartWeekRequest = p.PostExtraData as StartWeekRequest
    return week.latestWeek === 'true'
  })
  return post
}

export const retireCurrentWeek = async () => {
  const currentWeek = await getCurrentWeek()
  return submitPost({
    BodyObj: {
      Body: currentWeek.Body,
      VideoURLs: [],
      ImageURLs: []
    }, UpdaterPublicKeyBase58Check: pubKey, 'PostHashHexToModify': currentWeek.PostHashHex, PostExtraData: { ...currentWeek.PostExtraData, latestWeek: 'false' }
  }
  ).then(signTransaction)
    .then(submitTransaction).then(() => currentWeek.PostExtraData as StartWeekRequest)
}

export const startWeek = async (payload: Pick<StartWeekRequest, 'description'>, init = false) => {
  //first post of its type? set it to zero
  const newCurrentWeek = init ? '0' : (1 + Number((await retireCurrentWeek()).currentWeek)) + ""
  const PostExtraData: Omit<StartWeekRequest, 'description'> = {
    'postType': PostType.startWeek,
    'currentWeek': newCurrentWeek,
    'latestWeek': 'true'
  }
  return await submitPost({
    UpdaterPublicKeyBase58Check: pubKey,
    BodyObj: {
      Body: payload.description,
      VideoURLs: [],
      ImageURLs: []
    },
    PostExtraData,
  }).then(signTransaction)
    .then(submitTransaction)
    .then(getCurrentWeek)
    .then((startWeek) => {
      const week: StartWeekRequest = startWeek.PostExtraData as StartWeekRequest
      return {
        success: week.currentWeek === newCurrentWeek, startWeek
      }
    })
}

export const getResultsSnapshot = async (PostHashHex: string) => {
  console.log(PostHashHex)
  // const diamonds = await deso.getDiamondsForPost({ PostHashHex, 'Limit': 100 })
  // diamonds.DiamondSenders[0].
}

//   const success = await submitPost({ // submit offering 
//     UpdaterPublicKeyBase58Check: pubKey,
//     BodyObj: {
//       Body: payload.description,
//       VideoURLs: [],
//       ImageURLs: []
//     },
//     PostExtraData,
//   }).then(postTransaction => {
//     return deso.signTx(postTransaction.TransactionHex, seedHex, { isDerivedKey: false })
//   })
// }

const selectedNodePath = 'https://node.deso.org/api/v0/'
export const submitPost = (req: Partial<deso.SubmitPostRequest>): Promise<deso.SubmitPostResponse> => {
  const transactionEndpoint = 'submit-post'
  const post = axios.post(selectedNodePath + transactionEndpoint, {
    MinFeeRateNanosPerKB: 1500,
    PostHashHexToModify: '',
    RepostedPostHashHex: '',
    IsHidden: false,
    TransactionFees: [],
    InTutorial: false,
    IsFrozen: false, ...req
  }).then(res => {
    return res.data as deso.SubmitPostResponse;
  })
  return post
}

export const submitTransaction = (TransactionHex: string): Promise<deso.SubmitTransactionResponse> => {
  const transactionEndpoint = 'submit-transaction';
  return axios.post(selectedNodePath + transactionEndpoint, TransactionHex).then(res => {
    return res.data as deso.SubmitTransactionResponse;
  })
}

export const waitForSeconds = (seconds: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Waited for ${seconds} seconds!`);
    }, seconds * 1000); // Convert seconds to milliseconds
  });
}

