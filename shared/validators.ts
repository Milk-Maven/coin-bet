import * as zod from 'zod';

import { z } from 'zod';

export const offeringCreateValidation = z.object({
  event_description: z.string().min(10).refine((data) => data !== '', { message: 'Event description is required' }),
  outcomes: z.array(
    z.string()
  ).refine((data) => {
    console.log(data)
    return data[0].length && data[1].length
  }, {

    message: 'At least two outcomes are required',
  }),
  endDate: z.string().refine((data) => {
    // Check if the value is a valid ISO string
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3}Z?)?$/.test(data);
  }, { message: 'Invalid end date format' }),
});

// Example usage

export const offeringGetValidation = zod.z.object({
  PostHashHex: zod.z.string(),
  OptionPostHashHex: zod.z.array(zod.z.string()),
  PosterPublicKeyBase58Check: zod.z.string()

});

export type OfferringCreateRequest = zod.TypeOf<typeof offeringCreateValidation>;
export type OfferingGetRequest = zod.TypeOf<typeof offeringGetValidation>;

export const endpoints = {
  betNew: 'bet/new',
  betGet: 'bet/get'
}
