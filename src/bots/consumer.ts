import { BaseBot } from "./bot.js";
import { PostEntryResponse } from "../deso.js";
import { RoundEvent } from "../../shared/utils.js";

export type ConsumerEvent<Response> = RoundEvent<Response>
export type Offering = { offeringOptions: PostEntryResponse[], offering: PostEntryResponse }
export class ConsumerBot extends BaseBot {
}







