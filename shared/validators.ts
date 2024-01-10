
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



export const offeringExamples: Readonly<OfferringCreateRequest[]> = [
  {
    event_description: 'Marketing Workshop',
    outcomes: ['Brand Awareness', 'Lead Generation'],
    endDate: '2024-02-15T17:00:00Z',
    publicKey: 'pqrst98765',
  },
  {
    event_description: 'Artificial Intelligence Symposium',
    outcomes: ['AI Applications', 'Ethical Considerations', 'Innovation'],
    endDate: '2024-03-20T14:30:00',
    publicKey: 'uvwxy12345',
  },
  {
    event_description: 'Productivity Hackathon',
    outcomes: ['Efficiency Boost', 'Creative Solutions', 'Team Collaboration'],
    endDate: '2024-04-10T12:45:00Z',
    publicKey: 'zabcd67890',
  },
  {
    event_description: 'Web Development Summit',
    outcomes: ['Front-end Technologies', 'Back-end Solutions', 'Security Practices'],
    endDate: '2024-05-05T09:30:00',
    publicKey: 'efghi23456',
  },
  {
    event_description: 'Leadership Panel Discussion',
    outcomes: ['Inspiring Leadership', 'Diversity and Inclusion', 'Effective Communication'],
    endDate: '2024-06-18T16:15:00Z',
    publicKey: 'jklmn34567',
  },
  {
    event_description: 'Environmental Sustainability Forum',
    outcomes: ['Climate Change Awareness', 'Green Initiatives', 'Policy Advocacy'],
    endDate: '2024-07-22T11:00:00',
    publicKey: 'opqrs78901',
  },
  {
    event_description: 'Fitness and Nutrition Challenge',
    outcomes: ['Healthy Habits', 'Nutritional Education', 'Fitness Achievements'],
    endDate: '2024-08-30T13:45:00Z',
    publicKey: 'tuvwx56789',
  },
  {
    event_description: 'Cybersecurity Workshop',
    outcomes: ['Data Protection', 'Cyber Threat Intelligence', 'Incident Response'],
    endDate: '2024-09-12T15:30:00',
    publicKey: 'yzabc12345',
  },
  {
    event_description: 'Innovation Expo',
    outcomes: ['Technology Showcases', 'Start-up Pitches', 'Investor Networking'],
    endDate: '2024-10-05T10:15:00Z',
    publicKey: 'defgh23456',
  },
  {
    event_description: 'Project Management Bootcamp',
    outcomes: ['Project Planning', 'Agile Methodologies', 'Stakeholder Management'],
    endDate: '2024-11-08T18:00:00',
    publicKey: 'ijklm78901',
  },
  // Add more examples as needed...
];
