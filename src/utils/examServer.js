/**
 * 考试服务
 * @returns
 */

import fetchData from '@/api/fetch';

const examServer = {
  mount(...args) {
    return examInstance.mount(...args)
  },
  // 统计答题人数
  getExamAnserCount(params) {
    console.log("🚀 ~ file: examServer.js ~ line 19 ~ getExamPushedList ~ examInstance", examInstance)
    return examInstance.api.getExamAnserCount(params)
  },
  // 已推送列表
  getExamPushedList(params) {
    return examInstance.api.getExamPushedList(params)
  },
  // 互动统计-明细汇总
  getExamPaperSummary(params) {
    console.log("🚀 ~ file: examServer.js ~ line 23 ~ getExamPaperSummary ~ params", params)
    return examInstance.api.getExamPaperSummary(params)
  },
  // 考试排名
  getExamRankList(params) {
    return examInstance.api.getExamUserPerformances(params)
  }
}

let examInstance = {}

function createExamInstance() {
  return new Promise(async (resolve) => {
    if (examInstance instanceof ExamTemplateServer) {
      resolve(examInstance)
    } else {
      const { data: examToken } = await fetchData('getExamToken')
      examInstance = new ExamTemplateServer({
        role: 1,
        accountInfo: {
          ...examToken,
          // platform: 17
          platform: 7
        }
      })
      resolve(examInstance)
    }
  })
}
Object.keys(examServer).forEach(key => {
  const method = examServer[key]
  examServer[key] = async (...args) => {
    if (examInstance instanceof ExamTemplateServer) {
      return method.call(examInstance, ...args)
    } else {
      return await createExamInstance().then(() => {
        return method.call(examInstance, ...args)
      })
    }
  }
})

export default examServer;


