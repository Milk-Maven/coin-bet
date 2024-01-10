// import { PostType, StartWeekRequest } from "../shared/utils.js"
// import { GoldenCalfBot, } from "./bots/goldenCalf.js"

// const goldenCalfBot = new GoldenCalfBot()
// const consumerBot = new ConsumerBot({})
// export const testStartWeekInit = async () => {
//   return goldenCalfBot.startWeek({ description: 'start week create' }, true).then(res => {
//     const PostExtraData: Omit<StartWeekRequest, 'description'> = res.PostExtraData as StartWeekRequest
//     return {
//       title: 'startWeekInit',
//       bodyMatch: res.Body === 'start week create',
//       postTypeMatch: PostExtraData.postType === PostType.startWeek,
//       latestWeek: PostExtraData.latestWeek === 'true',
//       currentWeekMatch: PostExtraData.currentWeek === '0'
//     }
//   })
// }
//
// export const testStartWeekAfter = async () => {
//   const currentWeek = await goldenCalfBot.getCurrentWeek()
//   const oldPostExtraData = currentWeek.PostExtraData as Omit<StartWeekRequest, 'description'>
//   return goldenCalfBot.startWeek({ description: `this week should be ${Number(oldPostExtraData.currentWeek) + 1}` }).then(res => {
//     const PostExtraData: Omit<StartWeekRequest, 'description'> = res.PostExtraData as StartWeekRequest
//     return {
//       title: 'startWeekInAfter',
//       bodyMatch: `this week should be ${PostExtraData.currentWeek}`,
//       postTypeMatch: PostExtraData.postType === PostType.startWeek,
//       latestWeek: PostExtraData.latestWeek === 'true',
//       currentWeekMatch: PostExtraData.currentWeek === (Number(oldPostExtraData.currentWeek) + 1) + ''
//     }
//   })
// }
//
// export const testOfferingsForStartWeek = async () => {
//   // const currentWeek = await c.getCurrentWeek()
// }
//
// export const runTest = async () => {
//   const results = [await testStartWeekAfter()]
//   return results
// }
