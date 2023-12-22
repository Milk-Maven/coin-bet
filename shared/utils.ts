
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
};

export type OfferingOptionsExtraDataRequest = {
  option: string
};

