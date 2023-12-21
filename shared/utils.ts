
export const endpoints = {
  offeringCreate: 'offering/create',
  offeringGet: 'offering/get'
}

export function checkCondition(condition: boolean, errorMessage: string): void {
  if (!condition) {
    throw new Error(errorMessage);
  }
}

