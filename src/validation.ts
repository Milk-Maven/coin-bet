
import { z, TypeOf } from 'zod';

export const betCreateValidation = z.object({
  greeting: z.string(),
  event_description: z.string(),
  outcomes: z.array(z.string()),
  explainer: z.string(),
});

export type BetCreate = TypeOf<typeof betCreateValidation>;


export const betGetValidation = z.object({
  PostHashHex: z.string(),
  OptionPostHashHex: z.array(z.string()),
  PosterPublicKeyBase58Check: z.string()

});

export type BetGet = TypeOf<typeof betGetValidation>;
