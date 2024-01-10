import { OfferingExtraDateRequest, OfferingOptionsExtraDataRequest, PostType } from "../../shared/utils.js";
import { OfferringCreateRequest } from "../../shared/validators.js";
import { BaseBot } from "./bot.js";
import { RoundEvent } from "./static.js";
import { PostEntryResponse } from "../deso.js";

export type ConsumerEvent<Response> = RoundEvent<Response>
export type Offering = { offeringOptions: PostEntryResponse[], offering: PostEntryResponse }
export class ConsumerBot extends BaseBot {
  public async makeOffering(bet: OfferringCreateRequest & { ParentStakeID: string }): Promise<ConsumerEvent<Offering>> {
    try {
      const PostExtraData: OfferingExtraDateRequest = { endDate: bet.endDate, totalOptions: `${bet.outcomes.length}`, postType: PostType.offering, creatorPublicKey: bet.publicKey }
      const offering = await this.submitPost({ // submit offering
        ParentStakeID: bet.ParentStakeID,
        Body: bet.event_description,
        PostExtraData,
      })
      console.log(offering)
      await this.waitForSeconds(1)
      const offeringOptions = await Promise.all(bet.outcomes.map(async (outcome, i) => {
        const PostExtraData: OfferingOptionsExtraDataRequest = {
          option: `${i}`
        }
        console.log({
          ParentStakeID: offering.PostHashHex,
          Body: outcome,
          PostExtraData
        })
        return await this.submitPost(
          {

            ParentStakeID: offering.PostHashHex,
            Body: outcome,
            PostExtraData
          }
        )
      }))

      return { res: { offering, offeringOptions } }

    } catch (e) {
      console.log(Object.keys(e))
      console.log(e.message)
      console.log(e.response?.data)
      return { err: 'eee' }
    }

  }
}







