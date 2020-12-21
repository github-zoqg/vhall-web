<template>
  <div class="data-detail">
    <pageTitle :title='title'></pageTitle>
    <div class="operaBox">
      <div class="searchBox">
        <el-input
          :placeholder="placeholder"
          v-if="title=='邀请排名'"
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
        <el-button size="medium" round v-if="title==='聊天' || title==='问答'" @click="deleteAll(null)">批量删除</el-button>
      </div>
      <span><el-button size="medium" round @click="exportData">导出数据</el-button></span>
    </div>
    <div class="interact-detail" v-if="false">
      <el-table
        :data="tableList"
        :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
        row-key="id"
        @selection-change="qeTableCheckbox"
        :default-expand-all="false"
        :tree-props="{children: 'answer'}">
        <el-table-column
        :reserve-selection="true"
        type="selection"
        width="55"
        align="left"
      />
        <el-table-column
          prop="name"
          width="120"
          label="问答"
          >
        </el-table-column>
        <el-table-column
          prop="content"
          label="问答内容"
          >
        </el-table-column>
        <el-table-column
          prop="created_at"
          label="发送时间">
        </el-table-column>
        <el-table-column
          prop="is_open"
          width="120"
          label="私密">
        </el-table-column>
        <el-table-column
          prop="statusText"
          label="状态">
        </el-table-column>
        <el-table-column
          width="120"
          label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="interact-detail">
      <table-list
        ref="tableList"
        :manageTableData="tableList"
        :tabelColumnLabel="tabelColumn"
        :tableRowBtnFun="tableRowBtnFun"
        :isCheckout="isCheckout"
        :totalNum="totalNum"
        :width="120"
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
import { textToEmoji } from '@/tangram/libs/chat/js/emoji';
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
      params: {},
      seleteAllOptionList: [],
      seleteAnwerList: [], //答案
      seleteQuestionList: [],//问题
      totalNum: 100,
      tableList: [
      ],
      tabelColumn:[],
      // 邀请排名
      inviteColumn: [
        {
          label: '排名',
          key: 'index',
        },
        {
          label: '昵称',
          key: 'nick_name',
        },
        {
          label: '邀请人数',
          key: 'num',
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
          width:100
        },
        {
          label: '发送时间',
          key: 'date_time',
        },
        {
          label: '消息内容',
          key: 'imgOrText',
        },
        {
          label: '接收方',
          key: 'revice',
          width:100
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
          key: 'statusText',
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
          key: 'index',
        },
        {
          label: '推送签到时间',
          key: 'created_at',
        },
        {
          label: '签到人数',
          key: 'count',
        }
      ],
      // 抽奖
      drawColumn: [
        {
          label: '序号',
          key: 'index',
        },
        {
          label: '推送抽奖时间',
          key: 'create_time',
        },
        {
          label: '抽奖方式',
          key: 'lottery',
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
          key: 'index',
          width: 80
        },
        {
          label: '发红包时间',
          key: 'created_at',
        },
        {
          label: '支付方式',
          key: 'method',
        },
        {
          label: '红包金额',
          key: 'money',
        },
        {
          label: '红包个数',
          key: 'num',
          width: 120
        },
        {
          label: '红包类型',
          key: 'type',
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
          methodName: 'chatDetele',
        }
      ],
      anwerBtnFun: [
        {
          name: '删除',
          methodName: 'anwerDetele',
        }
      ],
      questnaireBtnFun: [
        {
          name: '查看',
          methodName: 'lookDetail',
          path: '/live/lookSingleQuestion',
        }
      ]
    };
  },
  mounted() {
    this.title = this.$route.query.title;
    this.webinarId = this.$route.query.id;
    this.roomId = this.$route.query.roomId;
    this.changeColumn(this.title);
  },
  methods: {
    emojiToText (content) {
      return textToEmoji(content).map(c => {
        return c.msgType == 'text'
          ? c.msgCont
          : `<img width="24" src="${c.msgImage}" border="0" />`;
      }).join(' ');
    },
    changeColumn(title) {
      this.params = {};
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
          this.tableRowBtnFun = this.anwerBtnFun;
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
          this.getRedpacketList();
          break;
        default:
          break;
      }
    },
    changeDate() {
      if(this.title === '问答') {
        this.getRecordList();
      } else {
        this.chatInfo();
      }
    },
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    // 邀请排名
    inviteInfo() {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let params = {
        webinar_id: this.webinarId,
        keyword: this.searchText,
        ...pageInfo,
      }
      this.$fetch('getInviteListInfo', this.$params(params)).then(res => {
        this.tableList = res.data.list;
        this.tableList.map((item, index) => {
          item.index = index + 1;
        })
        this.totalNum = res.data.total;
      });
    },
    // 聊天
    chatInfo() {
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
          // let contImg = this.emojiToText(item.data.text_content) || this.emojiToText(item.data.barrage_txt);
          if((/\[|\]/g).test(item.data.barrage_txt)) {
            item.chatEmoji = this.emojiToText(item.data.barrage_txt) || '';
          } else {
            item.chatEmoji = '';
          }
          item.chatText = item.data.text_content || '';
          if (item.data.image_urls) {
            item.chatImg = this.chartsImgs(item.data.image_urls);
          } else {
            item.chatImg = '';
          }
          item.imgOrText = item.chatText + item.chatEmoji + item.chatImg;
          item.revice = '主持人';
        })
        this.totalNum = res.data.total;
      });
    },
    chartsImgs(list) {
      let arr = '';
      if (list.length) {
        list.map(item => {
          arr = `<img width="100" width="100"  src="${item}" border="0" />`;
        }).join(' ')
      }
      return arr;
    },
    //删除聊天（二次确认）
    chatConfirmSure(id) {
      this.$confirm('确定要删除该文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box'
        }).then(() => {
          let obj = {
            msg_id: id,
            room_id: this.roomId
          }
          this.$fetch('deleteChatList', obj).then(res => {
            this.$message.success('删除成功');
            this.chatInfo();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 聊天删除
    chatDetele(that, { rows }) {
      that.chatConfirmSure(rows.msg_id);
    },
    // 批量删除(问答和聊天)
    deleteAll(id) {
      if (this.title === '聊天') {
        if (this.seleteAllOptionList.length < 1) {
          this.$message.error('请选择要操作的对象');
        } else {
          id = this.seleteAllOptionList.join(',');
          this.chatConfirmSure(id);
        }
      } else {
          if (this.seleteAnwerList.length < 1 && this.seleteQuestionList.length < 1) {
            this.$message.error('请选择要操作的对象')
          } else {
            this.recordAllDelete();
          }
      }
    },
    // 问答批量删除
    recordAllDelete() {
      this.$confirm('确定要删除该文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box'
        }).then(() => {
          let obj = {
            ques_ids: this.seleteQuestionList.join(','),
            answer_ids: this.seleteAnwerList.join(','),
            room_id: this.roomId
          }
          this.$fetch('deleteAllRecodrder', this.$params(obj)).then(res => {
            this.$message.success('删除成功');
            this.getRecordList();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
     // 问答单个删除
    anwerDetele(that, {rows}) {
      that.$confirm('确定要删除该文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          type: 'warning'
        }).then(() => {
          let obj = {
            id: rows.id,
            type: rows.name === '问' ? 2 : 1,
            room_id: that.roomId
          }
          that.$fetch('deleteRecodrder', obj).then(res => {
            that.$message.success('删除成功');
            that.getRecordList();
          });
        }).catch(() => {
          that.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    //签到
    signInfoList(){
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let params = {
        room_id: this.roomId
      }
      let obj = Object.assign({}, pageInfo, params);
      this.$fetch('getSignList', obj).then(res => {
        this.tableList = res.data.list;
        this.tableList.map((item, index) => {
          item.index = index + 1;
        })
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
      this.params = params;
      let obj = Object.assign({}, pageInfo, params);
      this.$fetch('getPrizeListInfo', obj).then(res => {
        this.tableList = res.data.list;
        this.tableList.map((item, index) => {
          item.index = index + 1;
          item.lottery = this.lotteryType(item.lottery_type);
        })
        this.totalNum = res.data.total;
      });
    },
    lotteryType(type) {
      if (type == 1) {
        return '全体参会用户';
      } else if (type == 2) {
        return '参与问卷的参会者';
      } else if (type == 3) {
        return '参与签到的参会者';
      } else if (type == 4) {
        return '全体观众';
      } else if (type == 5) {
        return '已登录观众';
      } else if (type == 6) {
        return '参与问卷的观众';
      } else {
        return '参与签到的观众';
      }

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
      this.tableList = [];
      let obj = Object.assign({}, pageInfo, params);
      this.params = obj;
      this.$fetch('getRecodrderList', obj).then(res => {
        this.params.start_time = res.data.start_time;
        this.params.end_time = res.data.end_time;
        // this.tableList = res.data.list;
        // this.tableList.map(item => {
        //   item.statusText = item.status == 1 ? '不处理' : item.status == 2 ? '转给主持人 即语音回复' : item.status == 3 ? '文字回复' : '未处理';
        //   item.name = '问';
        //   if (item.answer.length) {
        //     item.answer[0].name = '答';
        //     item.answer[0].is_open = item.answer[0].is_open == 1 ? '公开' : '私密';
        //   }
        // })
        let tableList = res.data.list;
        tableList.map((item, index) => {
          item.statusText = item.status == 1 ? '不处理' : item.status == 2 ? '转给主持人 即语音回复' : item.status == 3 ? '文字回复' : '未处理';
          item.name = '问';
          this.tableList.push(item);
          if (item.answer.length) {
            item.answer.map(opt => {
              opt.is_open = opt.is_open == 1 ? '公开' : '私密';
              opt.name = '答';
              this.tableList.push(opt);
            })
          }
        })
        this.totalNum = res.data.total;
      })
    },
    // 问答删除
    handleDelete(item) {
      this.$confirm('确定要删除该文件吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box'
        }).then(() => {
          let obj = {
            id: item.id,
            type: item.name === '问' ? 2 : 1,
            room_id: this.roomId
          }
          this.$fetch('deleteRecodrder', obj).then(res => {
            this.$message.success('删除成功');
            this.getRecordList();
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    // 红包列表
    getRedpacketList() {
      let pageInfo = this.$refs.tableList.pageInfo;
      pageInfo.pos = pageInfo.pageNum;
      let formParams = {
        webinar_id: this.webinarId
      }
      let obj = Object.assign({}, pageInfo, formParams);
      this.$fetch('getRedpacketList', obj).then(res => {
        this.tableList = res.data.data;
        this.totalNum = res.data.total;
        this.tableList.map((item, index) => {
          item.method = item.pay_channel == 1 ? '微信' : item.pay_channel == 2 ? '支付宝' : item.pay_channel == 3 ? '余额支付' : '其它';
          item.type = item.type === 1 ? '均分红包' : '拼手气';
          item.index = index + 1;
        })
      });
    },
    getTableList(params) {
      this.changeColumn(this.title);
    },
    // 导出明细
    reportDetail(that, {rows}) {
      if (that.title === '发群红包') {
        that.exportRedpacketDetailInfo(rows.id, rows.type);
      } else if (that.title === '签到') {
        that.exportDetailSignInfo(rows.id);
      } else if (that.title === '邀请排名') {
        that.exportInviteDetailInfo(rows.invite_id);
      } else {
        that.exportPrizeDetailInfo(rows);
      }
    },
    changeTableCheckbox(val) {
      if (this.title === '聊天') {
        this.seleteAllOptionList = val.map(item => item.msg_id);
      } else {
        this.seleteAnwerList = val.filter(item => item.name == '答').map(item => item.id);
        this.seleteQuestionList = val.filter(item => item.name == '问').map(item => item.id);
      }

    },
    exportData() {
      switch (this.title) {
        case '邀请排名':
          this.exportInviteInfo();
          break;
        case '签到':
          this.exportSignInfo();
          break;
        case '聊天':
          this.exportChatInfo();
          break;
        case '问答':
          this.exportRecordInfo();
          break;
        case '抽奖':
          this.exportPrizeInfo();
          break;
        case '问卷':
          this.exportQuestionInfo();
          break;
        case '发群红包':
          this.exportRedpacketInfo();
          break;
        default:
          break;
      }
    },
    // 邀请详情导出
    exportInviteDetailInfo(id) {
       this.$fetch('exportDetailInvite', {webinar_id: this.webinarId, join_id: id }).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    // 邀请导出
    exportInviteInfo() {
      this.$fetch('exportInvite', {webinar_id: this.webinarId}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    // 聊天
    exportChatInfo() {
      this.$fetch('exportChat', {room_id: this.roomId}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    // 问答
    exportRecordInfo() {
      this.$fetch('exportRecodrder', this.params).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    // 签到
    exportSignInfo() {
      this.$fetch('exportSign', {room_id: this.roomId}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    exportDetailSignInfo(id) {
      this.$fetch('exportDetailSign',{room_id: this.roomId, sign_id: id}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    // 问卷
    exportQuestionInfo() {
      this.$fetch('exportSurvey',{room_id: this.roomId}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    // 抽奖
    exportPrizeInfo() {
      this.$fetch('exportLottery', this.params).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    // 抽奖单个
    exportPrizeDetailInfo(item) {
      this.$fetch('exportDetailLottery',{webinar_id: this.webinarId}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    // 发群红包
    exportRedpacketInfo() {
      this.$fetch('exportRedpacket',{webinar_id: this.webinarId}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
     // 发群红包---导出明细
    exportRedpacketDetailInfo(uuid, type) {
      this.$fetch('exportDetailRedpacket',{webinar_id: this.webinarId, red_packet_uuid: uuid, type: type}).then(res => {
        this.$message.success('导出申请成功，请去下载中心下载');
      })
    },
    // 问卷查看
    lookDetail(that, val) {
      let rows = val.rows;
      that.$router.push({path: `${val.path}/${that.webinarId}`, query: {surveyId: rows.survey_id, subject: rows.subject, number: rows.filled_number}});
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
.interact-detail {
  .layout--right--main();
  .min-height();
  padding: 32px 24px 40px 24px;
   /deep/.el-table td, .el-table th{
    padding: 15px 0;
  }
  /deep/.el-button.el-button--text{
    color: #1A1A1A;
    border: 0;
    &:hover{
      color: #FB3A32;
    }
  }
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
  /deep/.el-button{
    background: transparent;
    &:hover{
      background: #fb3a32;
      span{
        color: #fff;
      }
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
