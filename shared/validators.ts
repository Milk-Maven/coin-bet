
import { TypeOf, z } from 'zod';
import { PostType } from './utils.js';

export const offeringCreateValidation = z.object({
  event_description: z.string().min(10).refine((data) => data !== '', { message: 'Event description is required' }),
  outcomes: z.array(
    z.string()
  ).refine((data) => {
    console.log(data)
    return data[0]?.length && data[1]?.length
  }, {

    message: 'At least two outcomes are required',
  }),
  endDate: z.string().refine((data) => {
    // Check if the value is a valid ISO string
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3}Z?)?$/.test(data);
  }, { message: 'Invalid end date format' }),
  publicKey: z.string().min(10)
});

// Example usage

export const offeringGetValidation = z.object({
  PostHashHex: z.string(),
  OptionPostHashHex: z.array(z.string()),
  PosterPublicKeyBase58Check: z.string()

});

export type OfferringCreateRequest = TypeOf<typeof offeringCreateValidation>;
export type OfferingGetRequest = TypeOf<typeof offeringGetValidation>;

export const endpoints = {
  betNew: 'bet/new',
  betGet: 'bet/get'
}

export const startWeekValidation = z.object({
  description: z.string(), // welcome to week three of the golden calf's trial. Until x/xx/xx/ users can submit an offering at gc.com. The top 3 choosen posts will be selected on x/xx/xx. Users can then vote on the option which they think is correct. Below the golden calf will post submissions from the app that users can directly vote on through their feed.
  latestWeek: z.literal('true').or(z.literal('false')),
  currentWeek: z.string(),
  postType: z.literal(PostType.startWeek)

});

export type StartWeekRequest = TypeOf<typeof startWeekValidation>;




