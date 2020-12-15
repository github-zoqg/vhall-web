<template>
  <div class="data-detail">
    <pageTitle :title='title'></pageTitle>
    <div class="operaBox">
      <div class="searchBox">
        <el-input
          :placeholder="placeholder"
          v-if="title=='聊天' || title=='邀请排名'"
          style="margin-right: 20px;"
          v-model="searchText">
          <i
            class="el-icon-search el-input__icon"
            slot="suffix">
          </i>
        </el-input>
        <el-date-picker
          v-model="searchTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          @change="changeDate"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          style="width: 240px;margin-right: 20px;"
          v-if="title==='聊天' || title==='问答'"
        />
        <el-button size="medium" round>批量删除</el-button>
      </div>
      <span><el-button size="medium" round>导出数据</el-button></span>
    </div>
    <div class="interact-detail">
      <table-list
        ref="tableList"
        :manageTableData="tableList"
        :tabelColumnLabel="tabelColumn"
        :tableRowBtnFun="tableRowBtnFun"
        :isCheckout="isCheckout"
        :totalNum="totalNum"
        @changeTableCheckbox="changeTableCheckbox"
        @onHandleBtnClick="onHandleBtnClick"
        @getTableList="getTableList"
      >
      </table-list>
    </div>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle';
export default {
  components: {
    PageTitle,
  },
  data() {
    return {
      isCheckout: false,
      placeholder: '',
      title: '',
      webinarId: '',
      roomId: '',
      searchTime: null,
      searchText: '',
      seleteAllOptionList: [],
      totalNum: 100,
      tableList: [
      ],
      tabelColumn:[],
      // 邀请排名
      inviteColumn: [
        {
          label: '排名',
          key: 'sort',
          width: 120
        },
        {
          label: '昵称',
          key: 'liveName',
        },
        {
          label: '邀请人数',
          key: 'wacthPeople',
          width: 120
        }
      ],
      // 聊天
      chatColumn: [
        {
          label: '昵称',
          key: 'nickname',
        },
        {
          label: '身份',
          key: 'name',
        },
        {
          label: '发送时间',
          key: 'date_time',
        },
        {
          label: '消息内容',
          key: 'content',
        },
        {
          label: '审核状态',
          key: 'status',
        },
        {
          label: '接收方',
          key: 'revice',
        },
      ],
      // 问答
      questColumn: [
         {
          label: '问答',
          key: 'name',
        },
        {
          label: '问答内容',
          key: 'content',
        },
        {
          label: '发送时间',
          key: 'created_at',
        },
        {
          label: '私密',
          key: 'is_open',
        },
        {
          label: '状态',
          key: 'status',
        }
      ],
      // 问卷
      questnaireColumn: [
        {
          label: '序号',
          key: 'survey_id',
        },
        {
          label: '推送问卷时间',
          key: 'send_time',
        },
        {
          label: '问卷标题',
          key: 'subject',
        },
        {
          label: '填写人数',
          key: 'filled_number',
        },
      ],
      // 签到
      signColumn: [
        {
          label: '序号',
          key: 'sort',
          width: 120
        },
        {
          label: '推送签到时间',
          key: 'liveName',
        },
        {
          label: '签到人数',
          key: 'wacthPeople',
          width: 120
        }
      ],
      // 抽奖
      drawColumn: [
        {
          label: '序号',
          key: 'num',
        },
        {
          label: '推送抽奖时间',
          key: 'create_time',
        },
        {
          label: '抽奖方式',
          key: 'lottery_type',
        },
        {
          label: '实际中奖人数',
          key: 'num',
        },
        {
          label: '实际奖品',
          key: 'prize_name',
        }
      ],
      // 发群红包
      packetColumn: [
         {
          label: '序号',
          key: 'num',
          width: 120
        },
        {
          label: '发红包时间',
          key: 'time',
          width: 120
        },
        {
          label: '支付方式',
          key: 'method',
        },
        {
          label: '红包金额',
          key: 'money',
          width: 120
        },
        {
          label: '红包个数',
          key: 'ge',
          width: 120
        },
        {
          label: '红包类型',
          key: 'type',
          width: 120
        }
      ],
      tableRowBtnFun: [],
      inviteBtnFun: [
        {
          name: '导出明细',
          methodName: 'reportDetail',
        }
      ],
      chatBtnFun: [
        {
          name: '删除',
          methodName: 'detele',
        }
      ],
      questnaireBtnFun: [
        {
          name: '查看',
          methodName: 'lookDetail',
          path: '/lookSingleQuestion',
        }
      ],
      searchAreaLayout:[],
      inviteAreaLayout:[
        {
          key: 'nameTitle'
        }
      ],
      chatAreaLayout: [
        {
          type: 5,
          key: 'allChecked'
        },
        {
          type: 2,
          key: 'searchDate'
        },
        {
          key: 'nameTitle'
        }
      ],
      questAreaLayout: [
        {
          type: 5
        },
        {
          type: 2,
          key: 'searchDate'
        }
      ],
      signAreaLayout: [
        {
          type: 2,
          key: 'searchDate'
        }
      ],
      questnaireAreaLayout: [
        {
          type: 2,
          key: 'searchDate'
        },
        {
          key: 'nameTitle'
        }
      ],
    };
  },
  mounted() {
    this.title = this.$route.query.title;
    this.webinarId = this.$route.query.id;
    this.roomId = this.$route.query.roomId;
    this.changeColumn(this.title);
  },
  methods: {
    changeColumn(title) {
      switch (title) {
        case '邀请排名':
          this.isCheckout = false;
          this.tabelColumn= this.inviteColumn;
          this.tableRowBtnFun = this.inviteBtnFun;
          this.placeholder = '搜索用户昵称';
          this.inviteInfo();
          break;
        case '签到':
          this.isCheckout = false;
          this.tabelColumn= this.signColumn;
          this.tableRowBtnFun = this.inviteBtnFun;
          this.signInfoList();
          break;
        case '聊天':
          this.isCheckout = true;
          this.placeholder = '请输入聊天内容';
          this.tabelColumn= this.chatColumn;
          this.tableRowBtnFun = this.chatBtnFun;
          this.chatInfo();
          break;
        case '问答':
          this.isCheckout = true;
          this.tabelColumn= this.questColumn;
          this.tableRowBtnFun = this.chatBtnFun;
          this.getRecordList();
          break;
        case '抽奖':
          this.isCheckout = false;
          this.tabelColumn= this.drawColumn;
          this.tableRowBtnFun = this.inviteBtnFun;
          this.prizeList();
          break;
        case '问卷':
          this.isCheckout = false;
          this.tabelColumn= this.questnaireColumn;
          this.tableRowBtnFun = this.questnaireBtnFun;
          this.getQuestionInfo();
          break;
        case '发群红包':
          this.tabelColumn= this.packetColumn;
          this.isCheckout = false;
          this.tableRowBtnFun = this.inviteBtnFun;
          break;
        default:
          break;
      }
    },
    changeDate() {
      if(this.title === '问答') {
        this.getRecordList();
      }
    },
    onHandleBtnClick(val) {
      console.log(val);
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    // 邀请排名
    inviteInfo() {
      // 少了一个搜索参数
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let params = {
        webinar_id: this.webinarId,
        ...pageInfo,
      }
      this.$fetch('getInviteListInfo', params).then(res => {
        this.tableList = res.data.list;
        this.totalNum = res.data.total;
      });
    },
    // 聊天
    chatInfo() {
      // 少了一个搜索参数
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let params = {
        room_id: this.roomId
      };
      if (this.searchTime) {
        pageInfo.pos = 0;
        pageInfo.pageNum= 1;
        this.$refs.tableList.clearSelect();
        params.start_time = this.searchTime[0];
        params.end_time = this.searchTime[1];
      }
      let obj = Object.assign({}, pageInfo, params);
      this.$fetch('getChatListInfo', obj).then(res => {
        this.tableList = res.data.list;
        this.tableList.map(item => {
          item.name = item.role_name == 1 ? '主持人' : item.role_name == 2 ? '观众' : item.role_name == 3 ? '助理' : '助理';
          item.content = item.data.text_content || item.data.barrage_txt;
        })
        this.totalNum = res.data.total;
      });
    },
    //签到
    signInfoList(){
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let params = {
        room_id: this.roomId
      }
      let obj = Object.assign({}, pageInfo, params);
      this.$fetch('getSignInfo', obj).then(res => {
        this.tableList = res.data.list;
        this.totalNum = res.data.total;
      });
    },
    // 问卷
    getQuestionInfo() {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let params = {
        room_id: this.roomId
      }
      let obj = Object.assign({}, pageInfo, params);
      this.$fetch('getSurveyUsageInfo', obj).then(res => {
        this.tableList = res.data.list;
        this.totalNum = res.data.total;
      });
    },
    // 抽奖
    prizeList() {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let params = {
        webinar_id: this.webinarId
      }
      let obj = Object.assign({}, pageInfo, params);
      this.$fetch('getPrizeListInfo', obj).then(res => {
        this.tableList = res.data.list;
        this.totalNum = res.data.total;
      });
    },
    // 回答
    getRecordList() {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let params = {
        room_id: this.roomId
      };
      if (this.searchTime) {
        pageInfo.pos = 0;
        pageInfo.pageNum= 1;
        this.$refs.tableList.clearSelect();
        params.start_time = this.searchTime[0];
        params.end_time = this.searchTime[1];
      }
      let obj = Object.assign({}, pageInfo, params);
      this.$fetch('getRecodrderList', obj).then(res => {
        let tableList = res.data.list;
        console.log()
        tableList.map((item, index) => {
          item.statusText = item.status == 1 ? '不处理' : item.status == 2 ? '转给主持人 即语音回复' : item.status == 3 ? '文字回复' : '未处理';
          item.name = '问';
          this.tableList.push(item);
          if (item.answer.length) {
            item.answer[0].is_open = item.answer[0].is_open == 1 ? '公开' : '私密';
            item.answer[0].name = '答';
            this.tableList.push(item.answer[0]);
          }
        })
        this.totalNum = res.data.total;
        console.log(this.tableList, '??????????????????');
      })
    },
    getTableList(params) {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      // let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
      // if (params === 'search') {
      //   pageInfo.pageNum= 1;
      //   // 如果搜索是有选中状态，取消选择
      //   // this.$refs.tableList.clearSelect();
      // }
      let obj = Object.assign({}, pageInfo, formParams);
      console.log(obj);
    },
    // 批量删除
    deletedChecked() {
      console.log('请删除');
    },
    changeTableCheckbox(val) {
      let idList = [];
      this.seleteAllOptionList = val.map(item => idList.push(item.id));
      console.log(this.seleteAllOptionList);
    },
    exportData() {
      console.log("111111111111", '请导出数据');
    },
    // 问卷查看
    lookDetail(that, val) {
      console.log(val.rows);
      that.$router.push({path: val.path});
    }
  }
};
</script>
<style lang="less" scoped>
.title-data {
  span{
    font-size: 22px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #1a1a1a;
  }
}
/deep/.el-range-editor .el-range-input {
    background: transparent;
  }
  /deep/.el-button{
    background: transparent;
    &:hover{
      background: #fb3a32;
      span{
        color: #fff;
      }
    }
  }
.interact-detail {
  .layout--right--main();
  .min-height();
  padding: 32px 24px 40px 24px;
}

.operaBox{
  overflow: hidden;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  .searchBox{
    display: flex;
    &:first-child{
      margin-right: 20px;
    }
  }
  // &.flex-between {
  //   float: unset;
  //   .flex-display();
  //   .justify(space-between);
  // }
  .el-link {
    margin-left: 20px;
  }
  .searchBox{
   /* float: right;*/
    .el-input{
      width: 220px;
      .el-input__icon{
        cursor: pointer;
      }
      /deep/ .el-input__icon{
        line-height: 36px;
      }
    }
    /deep/ .el-input__inner{
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
    }
  }
}
.search-export{
  float: right;
}
</style>
