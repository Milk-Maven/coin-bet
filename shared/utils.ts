export const endpoints = {
  betNew: 'bet/new',
  betGet: 'bet/get'
}

export function checkCondition(condition: boolean, errorMessage: string): void {
  if (!condition) {
    throw new Error(errorMessage);
  }
}

