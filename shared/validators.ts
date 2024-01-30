import { type TypeOf, z } from 'zod';
import { PostType } from './utils.js';

export const CalfProfileValidation = z.object({
  calfWeeks: z.record(z.string()).optional(),
  currentWeekHashHex: z.string().optional()
});
export type CalfProfileGame = TypeOf<typeof CalfProfileValidation>;
// current week state
export const CalfWeekValidation = z.object({
  offerings: z.record(z.string()),
  latestWeek: z.boolean()
});
export type CalfWeekGame = TypeOf<typeof CalfWeekValidation>;
// offering state
export const CalfOfferingValidation = z.object({
  endDate: z.string(),
  creatorPublicKey: z.string(),
  options: z.array(z.string()),
  winningOption: z.string(),
  Body: z.string()
});
export type CalfOfferingGame = TypeOf<typeof CalfOfferingValidation>;
// sacrifice
export const CalfSacrificeValidation = z.object({
  sacrifices: z.record(z.object({
    amountNanos: z.string(), diamonds: z.array(z.object({ diamondLevel: z.string() }))
    // DiamondSenderProfile: ProfileEntryResponse | null;
  }))
})
export type CalfSacrificeGame = TypeOf<typeof CalfSacrificeValidation>;
// export type CalfSacrificeGame = {
//   [publicKey: string]: { amountNanos, diamonds: DiamondSenderResponse[] }
// }

// export const offeringCreateValidation = z.object({
//   event_description: z.string().min(10).refine((data) => data !== '', { message: 'Event description is required' }),
//   outcomes: z.array(
//     z.string()
//   ).refine((data) => {
//     return data[0]?.length && data[1]?.length
//   }, {
//
//     message: 'At least two outcomes are required',
//   }),
//   endDate: z.string().refine((data) => {
//     // Check if the value is a valid ISO string
//     return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3}Z?)?$/.test(data);
//   }, { message: 'Invalid end date format' }),
//   publicKey: z.string().min(10)
// });

// Example usage

// export const offeringRequestValidation = z.object({
//   PostHashHax: z.string(),
//   OptionPostHashHex: z.array(z.string()),
//   PosterPublicKeyBase58Check: z.string()
//
// });
//
export const sacrificeDiamondsRequestValidation = z.object({
  TransactionHex: z.string(),
  DiamondPostHashHex: z.string(),
  SenderPublicKeyBase58Check: z.string()

});

export const sacrificeDesoRequestValidation = z.object({
  TransactionHex: z.string(),
  AmountNanos: z.string(),
  SenderPublicKeyBase58Check: z.string(),
  PostHashHax: z.string()
});

export type SacrificeDesoRequest = TypeOf<typeof sacrificeDesoRequestValidation>;
export type SacrificeDiamondRequest = TypeOf<typeof sacrificeDiamondsRequestValidation>;

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



export const offeringExamples: Readonly<CalfOfferingGame[]> = [
  {
    endDate: "399 BCE",
    creatorPublicKey: "SocratesPublicKey1",
    options: ["Accusation of Corrupting Youth", "Impiety Charges"],
    winningOption: "Death by Hemlock",
    Body: "Socrates accepts his fate with philosophical calmness, asserting the importance of questioning and introspection.",
  },
  {
    endDate: "420 BCE",
    creatorPublicKey: "SocratesPublicKey2",
    options: ["Criticism from Sophists", "Debate with Gorgias"],
    winningOption: "Philosophical Discourse",
    Body: "Socrates engages in dialectical discussions to challenge sophistry, emphasizing the pursuit of knowledge over rhetorical skills.",
  },
  {
    endDate: "415 BCE",
    creatorPublicKey: "SocratesPublicKey3",
    options: ["Athenian Public's Disapproval", "Association with Critias"],
    winningOption: "Ostracism",
    Body: "Socrates faces public disapproval and ostracism, highlighting the tension between his ideas and societal norms.",
  },
  {
    endDate: "411 BCE",
    creatorPublicKey: "SocratesPublicKey4",
    options: ["Political Instability in Athens", "Fall of the Thirty Tyrants"],
    winningOption: "Transition to Democratic Rule",
    Body: "Socrates witnesses political turmoil, raising questions about the role of philosophy in times of societal upheaval.",
  },
  {
    endDate: "406 BCE",
    creatorPublicKey: "SocratesPublicKey5",
    options: ["Cynical Criticism from Diogenes", "Conflict with Antisthenes"],
    winningOption: "Philosophical Dialogues",
    Body: "Socrates engages with critics like Diogenes and Antisthenes, fostering intellectual discourse within the philosophical community.",
  },
  {
    endDate: "399 BCE",
    creatorPublicKey: "SocratesPublicKey6",
    options: ["Defiance of Jury's Verdict", "Justification of Actions"],
    winningOption: "Acceptance of Death Sentence",
    Body: "Socrates refuses to compromise his philosophical principles, choosing death over betraying his beliefs during the trial.",
  },
  {
    endDate: "406 BCE",
    creatorPublicKey: "SocratesPublicKey7",
    options: ["Erosion of Influence", "Impact of Plato's Academy"],
    winningOption: "Legacy in Philosophical Thought",
    Body: "Socrates' teachings continue to influence philosophy, despite challenges to his immediate societal standing.",
  },
  {
    endDate: "410 BCE",
    creatorPublicKey: "SocratesPublicKey8",
    options: ["Allegations of Atheism", "Conflict with Anaxagoras"],
    winningOption: "Philosophical Defense",
    Body: "Socrates defends his theological ideas, emphasizing reason and questioning traditional beliefs in the face of accusations.",
  },
  {
    endDate: "403 BCE",
    creatorPublicKey: "SocratesPublicKey9",
    options: ["Post-Peloponnesian War Challenges", "Impact on Intellectual Climate"],
    winningOption: "Philosophical Inquiry",
    Body: "Socrates navigates the aftermath of the war, contributing to intellectual developments that shape post-war Athens.",
  },
  {
    endDate: "398 BCE",
    creatorPublicKey: "SocratesPublicKey10",
    options: ["Rivalry with Protagoras", "Competing Philosophical Schools"],
    winningOption: "Philosophical Debates",
    Body: "Socrates engages in intellectual debates with contemporaries, addressing rival philosophical perspectives.",
  },
];
