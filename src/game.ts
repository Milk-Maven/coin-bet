import { getCurrentWeek, retireCurrentWeek, signTransaction, submitPost, submitTransaction } from "./deso.js"
import { OfferringCreateRequest, OfferingGetRequest } from '../shared/validators.js';
import { PostType, type OfferingExtraDateRequest, type OfferingOptionsExtraDataRequest, StartWeekRequest } from '../shared/utils.js'
export const getOffering = async ({ PostHashHex, OptionPostHashHex, PosterPublicKeyBase58Check }: OfferingGetRequest) => {
  console.log(OptionPostHashHex, PosterPublicKeyBase58Check, PostHashHex)
}

export const makeOffering = async (bet: OfferringCreateRequest): Promise<void> => {
  const PostExtraData: OfferingExtraDateRequest = { endDate: bet.endDate, totalOptions: `${bet.outcomes.length}`, postType: PostType.offering, creatorPublicKey: bet.publicKey }
  const success = await submitPost({ // submit offering 
    Body: bet.event_description,
    PostExtraData,
  }).then(signTransaction).then(submitTransaction).then((a) => {
    // now that the transaction exists reply with the options 
    return Promise.all(bet.outcomes.map((outcome, i) => {
      const PostExtraData: OfferingOptionsExtraDataRequest = {
        option: `${i}`
      }
      return submitPost(
        {
          ParentStakeID: a.PostEntryResponse.PostHashHex,
          Body: outcome,
          PostExtraData
        }
      )
    }))
  }).then(res => {
    return Promise.all(res.map(signTransaction))
  }).then(signatures => { return Promise.all(signatures.map(submitTransaction)) })
  console.log(success)
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
    Body: payload.description,
    PostExtraData,
  }).then(signTransaction)
    .then(submitTransaction)
    .then(getCurrentWeek)
    .then((startWeek) => {
      return startWeek
    })
}

export const getResultsSnapshot = async (PostHashHex: string) => {
  console.log(PostHashHex)
  // const diamonds = await deso.getDiamondsForPost({ PostHashHex, 'Limit': 100 })
  // diamonds.DiamondSenders[0].
}

//   const success = await submitPost({ // submit offering 
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
