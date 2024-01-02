
export const endpoints = {
  offeringCreate: 'offering/create',
  offeringGet: 'offering/get'
}

export function checkCondition(condition: boolean, errorMessage: string): void {
  if (!condition) {
    throw new Error(errorMessage);
  }
}
export const PUB_KEY: Readonly<string> = 'BC1YLgJ6FWVz9GKQwktGmgRQ7DDFZj65ZhyxTGiSGnCGcYX4Hhx2VaY'

export type PartialWithRequiredFields<T, K extends keyof T> = Partial<T> & Pick<T, K>;
export type OfferingExtraDateRequest = {
  endDate: string,
  totalOptions: string
  postType: PostType.offering
  creatorPublicKey: string
};

export type OfferingOptionsExtraDataRequest = {
  option: string
};

export enum PostType { offering = 'offering', appSelection = 'selection', appVoting = 'voting' }
export type StartWeekRequest = {
  description: string, // welcome to week three of the golden calf's trial. Until x/xx/xx/ users can submit an offering at gc.com. The top 3 choosen posts will be selected on x/xx/xx. Users can then vote on the option which they think is correct. Below the golden calf will post submissions from the app that users can directly vote on through their feed.
  postType: PostType
  latestWeek: string
  currentWeek: string
  offering1: string
  offering2: string
  offering3: string
};

