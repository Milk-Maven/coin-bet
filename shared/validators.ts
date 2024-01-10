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



export const offeringExamples: Readonly<OfferringCreateRequest[]> = [{
  event_description: "Norse Ragnarok - End of the World",
  outcomes: ["Fimbulwinter", "Twilight of the Gods", "Serpent's Wrath"],
  endDate: "2024-01-30T12:00:00Z",
  publicKey: "PublicKey1",
},
{
  event_description: "Mayan Apocalypse - End of the World",
  outcomes: ["Solar Cataclysm", "Harmony Restoration", "Earthly Transformation"],
  endDate: "2024-02-28T12:00:00Z",
  publicKey: "PublicKey2",
},
{
  event_description: "Greek Titanomachy - End of the World",
  outcomes: ["Olympian Triumph", "World Renewal", "Chaos Unleashed"],
  endDate: "2024-03-31T12:00:00Z",
  publicKey: "PublicKey3",
},
{
  event_description: "Hindu Kali Yuga - End of the World",
  outcomes: ["Cosmic Rebirth", "Dharma Restoration", "Eternal Strife"],
  endDate: "2024-04-30T12:00:00Z",
  publicKey: "PublicKey4",
},
{
  event_description: "Egyptian Apocalypse - End of the World",
  outcomes: ["Judgment of Osiris", "Rebirth of Ra", "Anarchy of Set"],
  endDate: "2024-05-31T12:00:00Z",
  publicKey: "PublicKey5",
},
{
  event_description: "Norse Fimbulwinter - End of the World",
  outcomes: ["Ice Age", "Eternal Darkness", "Frost Giants' Dominion"],
  endDate: "2024-06-30T12:00:00Z",
  publicKey: "PublicKey6",
},
{
  event_description: "Aztec Ollin Tonatiuh - End of the World",
  outcomes: ["Solar Cataclysm", "Earthquakes", "Age of Rebirth"],
  endDate: "2024-07-31T12:00:00Z",
  publicKey: "PublicKey7",
},
{
  event_description: "Japanese Kurozuka - End of the World",
  outcomes: ["Demon Onslaught", "Celestial Chaos", "Spiritual Harmony"],
  endDate: "2024-08-31T12:00:00Z",
  publicKey: "PublicKey8",
},
{
  event_description: "Celtic Prophecy - End of the World",
  outcomes: ["Elemental Upheaval", "Otherworldly Invasion", "Druidic Renewal"],
  endDate: "2024-09-30T12:00:00Z",
  publicKey: "PublicKey9",
},
{
  event_description: "Chinese Apocalyptic Fire - End of the World",
  outcomes: ["Inferno", "Dragon's Fury", "Benevolent Phoenix"],
  endDate: "2024-10-31T12:00:00Z",
  publicKey: "PublicKey10",
},
{
  event_description: "Babylonian Tiamat's Wrath - End of the World",
  outcomes: ["Cosmic Chaos", "Beastly Onslaught", "Marduk's Victory"],
  endDate: "2024-11-30T12:00:00Z",
  publicKey: "PublicKey11",
},
{
  event_description: "Inuit Qivittoq's Return - End of the World",
  outcomes: ["Spiritual Reckoning", "Arctic Desolation", "Ancestral Blessing"],
  endDate: "2024-12-31T12:00:00Z",
  publicKey: "PublicKey12",
},
{
  event_description: "Polynesian Rangi and Papa - End of the World",
  outcomes: ["Primordial Chaos", "Island Catastrophe", "Celestial Harmony"],
  endDate: "2025-01-31T12:00:00Z",
  publicKey: "PublicKey13",
},
{
  event_description: "Mesoamerican Xiuhtecuhtli's Rage - End of the World",
  outcomes: ["Solar Devastation", "Volcanic Eruption", "Quetzalcoatl's Blessing"],
  endDate: "2025-02-28T12:00:00Z",
  publicKey: "PublicKey14",
},
{
  event_description: "Sumerian Kur's Awakening - End of the World",
  outcomes: ["Underworld Unleashed", "Eternal Night", "Enlil's Justice"],
  endDate: "2025-03-31T12:00:00Z",
  publicKey: "PublicKey15",
},
{
  event_description: "African Nyambe's Judgment - End of the World",
  outcomes: ["Celestial Tribunal", "Nature's Wrath", "Ancestral Blessings"],
  endDate: "2025-04-30T12:00:00Z",
  publicKey: "PublicKey16",
},
{
  event_description: "Roman Prodigium Aquilae - End of the World",
  outcomes: ["Eagle's Prophecy", "Imperial Downfall", "Pax Romana Resurrection"],
  endDate: "2025-05-31T12:00:00Z",
  publicKey: "PublicKey17",
},
{
  event_description: "Hawaiian Pele's Fury - End of the World",
  outcomes: ["Volcanic Apocalypse", "Oceanic Catastrophe", "Lava Goddess's Blessing"],
  endDate: "2025-06-30T12:00:00Z",
  publicKey: "PublicKey18",
},
{
  event_description: "Slavic Nav - End of the World",
  outcomes: ["World Tree's Collapse", "Slavic Deities' Clash", "Slavic Renaissance"],
  endDate: "2025-07-31T12:00:00Z",
  publicKey: "PublicKey19",
},
{
  event_description: "Aboriginal Dreamtime's Unraveling - End of the World",
  outcomes: ["Dreamtime Dissolution", "Spiritual Anarchy", "Nature's Rebirth"],
  endDate: "2025-08-31T12:00:00Z",
  publicKey: "PublicKey20",
}];
