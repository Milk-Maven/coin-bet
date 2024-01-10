import { OfferingExtraDateRequest, OfferingOptionsExtraDataRequest, PostType, RoundEvent } from "../../shared/utils.js";
import { OfferringCreateRequest } from "../../shared/validators.js";
import { BaseBot } from "./bot.js";
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
      await this.waitForSeconds(1)
      const offeringOptions = await Promise.all(bet.outcomes.map(async (outcome, i) => {
        const PostExtraData: OfferingOptionsExtraDataRequest = {
          option: `${i}`
        }
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
      return { err: e }
    }

  }
}







