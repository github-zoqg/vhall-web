/**
 * 考试服务
 * @returns
 */

import fetchData from '@/api/fetch';

const examServer = {
  mount(...args) {
    return examInstance.mount(...args);
  },
  on(evt, handler) {
    examInstance.$on(evt, handler);
  },
  off(evt, handler) {
    examInstance.$off(evt, handler);
  },
  // 统计答题人数
  getExamAnserCount(params) {
    return examInstance.api.getExamAnserCount(params);
  },
  // 已推送列表
  getExamPushedList(params) {
    return examInstance.api.getExamPushedList(params);
  },
  // 互动统计-明细汇总
  getExamPaperSummary(params) {
    return examInstance.api.getExamPaperSummary(params);
  },
  // 考试排名
  getExamRankList(params) {
    return examInstance.api.getExamUserPerformances(params);
  },
  // 修改成绩单有效状态
  markExamTranscript(params) {
    return examInstance.api.changeExamPerformanceStatus(params);
  },
  // 用户成绩
  getExamUserScope(params) {
    return examInstance.api.getExamUserScope(params);
  },
  getExamList(params) {
    return examInstance.api.getExamList(params);
  },
  copyExam(examId) {
    const data = {
      id: examId
    };
    return examInstance.api.copyExam(data);
  },
  delExam(examIds = []) {
    if (!Array.isArray(examIds)) {
      examIds = [examIds];
    }
    let data = {
      ids: examIds.join(',')
    };
    return examInstance.api.delExam(data);
  },
  selectExamFromUser(params) {
    return examInstance.api.selectExamFromUser(params);
  }
};

let examInstance = {};

function createExamInstance() {
  return new Promise(async resolve => {
    if (examInstance instanceof ExamTemplateServer) {
      resolve(examInstance);
    } else {
      const { data: examToken } = await fetchData('getExamToken');
      examInstance = new ExamTemplateServer({
        role: 1,
        accountInfo: {
          ...examToken,
          // platform: 17
          platform: 7
        }
      });
      resolve(examInstance);
    }
  });
}
Object.keys(examServer).forEach(key => {
  const method = examServer[key];
  examServer[key] = async (...args) => {
    if (examInstance instanceof ExamTemplateServer) {
      return method.call(examInstance, ...args);
    } else {
      return await createExamInstance().then(() => {
        return method.call(examInstance, ...args);
      });
    }
  };
});

export default examServer;
