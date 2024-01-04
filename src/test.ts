import { PostType, StartWeekRequest } from "../shared/utils.js"
import { getCurrentWeek } from "./deso.js"
import { startWeek } from "./game.js"

export const testStartWeekInit = async () => {
  return startWeek({ description: 'start week create' }, true).then(res => {
    console.log(res)
    const PostExtraData: Omit<StartWeekRequest, 'description'> = res.PostExtraData as StartWeekRequest
    return {
      title: 'startWeekInit',
      bodyMatch: res.Body === 'start week create',
      postTypeMatch: PostExtraData.postType === PostType.startWeek,
      latestWeek: PostExtraData.latestWeek === 'true',
      currentWeekMatch: PostExtraData.currentWeek === '0'
    }

  })
}


export const testStartWeekAfter = async () => {
  const currentWeek = await getCurrentWeek()
  const oldPostExtraData = currentWeek.PostExtraData as Omit<StartWeekRequest, 'description'>
  return startWeek({ description: `this week should be ${Number(oldPostExtraData.currentWeek) + 1}` }).then(res => {
    const PostExtraData: Omit<StartWeekRequest, 'description'> = res.PostExtraData as StartWeekRequest
    return {
      title: 'startWeekInAfter',
      bodyMatch: `this week should be ${PostExtraData.currentWeek}`,
      postTypeMatch: PostExtraData.postType === PostType.startWeek,
      latestWeek: PostExtraData.latestWeek === 'true',
      currentWeekMatch: PostExtraData.currentWeek === (Number(oldPostExtraData.currentWeek) + 1) + ''
    }

  })
}

export const runTest = async () => {
  const results = [await testStartWeekAfter()]
  return results
}
