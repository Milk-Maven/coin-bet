import { BaseBot } from "./bot.js";
import { PostEntryResponse } from "../deso.js";
import { RoundEvent } from "../../shared/utils.js";

export type ConsumerEvent<Response> = RoundEvent<Response>
export type Offering = { offeringOptions: PostEntryResponse[], offering: PostEntryResponse }
export class ConsumerBot extends BaseBot {
  // prolly move this into the client
  // public static async makeSacrifice(req: deso.SendDiamondsRequest | deso.SendDeSoRequest) {
  //   if ('DiamondLevel' in req) {
  //     await this.sendDiamonds(req)
  //   }
  //   if ('AmountNanos' in req) {
  //     await this.sendFunds(req)
  //   }
  //
  // }
}







