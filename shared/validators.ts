import * as zod from 'zod';

export const betCreateValidation = zod.z.object({
  greeting: zod.z.string(),
  event_description: zod.z.string(),
  outcomes: zod.z.array(zod.z.string()),
  explainer: zod.z.string(),
});

export type BetCreate = zod.TypeOf<typeof betCreateValidation>;

export const betGetValidation = zod.z.object({
  PostHashHex: zod.z.string(),
  OptionPostHashHex: zod.z.array(zod.z.string()),
  PosterPublicKeyBase58Check: zod.z.string()

});

export type BetGet = zod.TypeOf<typeof betGetValidation>;

export const endpoints = {
  betNew: 'bet/new',
  betGet: 'bet/get'
}
