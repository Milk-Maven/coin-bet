
export const endpoints = {
  offering: 'game/make',
  sacrifice: 'game/sacrifice',
  start: 'game/start',
  init: 'game/init',
  end: 'game/end',
  snapshot: 'game/snapshot',
  pay: 'game/pay',
  resetState: 'game/reset-state'
}

export function verify(condition: boolean, errorMessage: string): void {
  if (!condition) {
    throw new Error(errorMessage);
  }
}
export const PUB_KEY: Readonly<string> = 'BC1YLgJ6FWVz9GKQwktGmgRQ7DDFZj65ZhyxTGiSGnCGcYX4Hhx2VaY'

export type PartialWithRequiredFields<T, K extends keyof T> = Partial<T> & Pick<T, K>;
// extra data types
export type OfferingExtraDateRequest = {
  endDate: string,
  totalOptions: string
  postType: PostType.offering
  creatorPublicKey: string

};

export type OfferingOptionsExtraDataRequest = {
  option: string
};

// Request
export enum SacrificePayment { DiamondLevel = 'DiamondLevel', AmountNanos = 'AmountNanos' }



export enum PostType { offering = 'offering', startWeek = 'startWeek', option = 'option', pay = 'pay' }
export type StartWeekRequest = {
  description: string, // welcome to week three of the golden calf's trial. Until x/xx/xx/ users can submit an offering at gc.com. The top 3 choosen posts will be selected on x/xx/xx. Users can then vote on the option which they think is correct. Below the golden calf will post submissions from the app that users can directly vote on through their feed.
  latestWeek: 'true'
  currentWeek: string
  postType: PostType.startWeek
};

//bots
// export type ConsumerEvent<Response> = RoundEvent<Response>
// export type RoundEvent<Response> = { res?: Response, err?: string }
// export type CalfEvent<Response> = RoundEvent<Response>

//app Responses
// export type Start = { startedWeek: PostEntryResponse, }
// export type End = { end: string, }
// export type Offering = { offeringOptions: PostEntryResponse[], offering: PostEntryResponse }
// export type Pay = { payments: string[] }
// export type Sacrifice = { updatedOffering: PostEntryResponse }
//app actions
//
// export type RunStart = { message: string, payload: Start }
// export type RunOffering = { message: string, payload: { offeringOptions: PostEntryResponse[], offering: PostEntryResponse } }
// export type RunEnd = { message: string, payload: End }
// export type RunPay = { message: string, payload: Pay }
// export type RunSnapShot = { message: string, payload: Pay }
// export type RunMakeSacrifice = { message: string, payload: Sacrifice }


