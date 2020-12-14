<template>
  <div class="data-detail">
    <pageTitle :title='title'></pageTitle>
    <div class="interact-detail">
      <el-card>
        <div class="search-box">
          <span v-if="title==='聊天' || title==='问答'">
            <el-button round> 批量删除</el-button>
            <el-date-picker
              v-model="searchTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              @change="changeDate"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width: 240px"
            />
          </span>
        <span class="search-export">
          <el-button round> 导出数据</el-button>
        </span>
          <!-- <search-area
            ref="searchArea"
            :searchAreaLayout="searchAreaLayout"
            :placeholder="placeholder"
            @onSearchFun="getTableList('search')"
            @onExportData="exportData"
            @deletedChecked="deletedChecked"
          >
          </search-area> -->
        </div>
        <!-- <div class="search-export">
          <el-button round> 导出数据</el-button>
        </div> -->
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
      </el-card>
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
      searchTime: null,
      seleteAllOptionList: [],
      totalNum: 100,
      tableList: [
        {
          sort: '1',  //排名
          id: '1233454555',
          liveName: "哈哈哈哈哈", //昵称
          wacthPeople: '123',
          wacthNum: '124',
          num: '1',
          people: '20',
          title: '今天周一',
          content: '我是问卷1',
          timeLang: '30:00:00'
        },
        {
          sort: '2',
          id: '123789000',
          liveName: '嘻嘻嘻',
          wacthPeople: '111',
          wacthNum: '222',
          title: '明天周二',
          num: '2',
          people: '30',
          content: '我是问卷2',
          timeLang: '50:00:00'
        }
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
          key: 'name',
          width: 120
        },
        {
          label: '身份',
          key: 'card',
          width: 120
        },
        {
          label: '发送时间',
          key: 'time',
          width: 120
        },
        {
          label: '消息内容',
          key: 'liveName',
        },
        {
          label: '审核状态',
          key: 'status',
          width: 120
        },
        {
          label: '接收方',
          key: 'revice',
           width: 120
        },
      ],
      // 问答
      questColumn: [
         {
          label: '问答',
          key: 'type',
        },
        {
          label: '问答内容',
          key: 'content',
        },
        {
          label: '发送时间',
          key: 'time',
        },
        {
          label: '私密',
          key: 'seract',
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
          key: 'num',
          width: 120
        },
        {
          label: '推送问卷内容',
          key: 'content',
          width: 120
        },
        {
          label: '问卷标题',
          key: 'title',
        },
        {
          label: '填写人数',
          key: 'people',
          width: 120
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
          width: 120
        },
        {
          label: '推送抽奖时间',
          key: 'time',
          width: 120
        },
        {
          label: '抽奖方式',
          key: 'method',
        },
        {
          label: '实际中奖人数',
          key: 'people',
          width: 120
        },
        {
          label: '实际奖品',
          key: 'stausa',
          width: 120
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
      ]
    };
  },
  mounted() {
    this.title = this.$route.query.title;
    this.changeColumn(this.title);
  },
  methods: {
    changeColumn(title) {
      switch (title) {
        case '邀请排名':
          this.isCheckout = false;
          this.placeholder = '请输入用户昵称';
          this.tabelColumn= this.inviteColumn;
          this.tableRowBtnFun = this.inviteBtnFun;
          this.searchAreaLayout = this.inviteAreaLayout;
          break;
        case '签到':
          this.isCheckout = false;
          this.tabelColumn= this.signColumn;
          this.tableRowBtnFun = this.inviteBtnFun;
          this.searchAreaLayout = this.signAreaLayout;
          break;
        case '聊天':
          this.isCheckout = true;
          this.placeholder = '请输入聊天内容';
          this.tabelColumn= this.chatColumn;
          this.tableRowBtnFun = this.chatBtnFun;
          this.searchAreaLayout = this.chatAreaLayout;
          break;
        case '问答':
          this.isCheckout = true;
          this.tabelColumn= this.questColumn;
          this.tableRowBtnFun = this.chatBtnFun;
          this.searchAreaLayout = this.questAreaLayout;
          this.getRecordList();
          break;
        case '抽奖':
          this.isCheckout = false;
          this.tabelColumn= this.drawColumn;
          this.placeholder = '请输入搜索内容';
          this.tableRowBtnFun = this.inviteBtnFun;
          this.searchAreaLayout = this.questnaireAreaLayout;
          break;
        case '问卷':
          this.isCheckout = false;
          this.placeholder = '请输入问卷标题';
          this.tabelColumn= this.questnaireColumn;
          this.tableRowBtnFun = this.questnaireBtnFun;
          this.searchAreaLayout = this.questnaireAreaLayout;
          break;
        case '发群红包':
          this.tabelColumn= this.packetColumn;
          this.isCheckout = false;
          this.tableRowBtnFun = this.inviteBtnFun;
          this.searchAreaLayout = this.signAreaLayout;
          break;
        default:
          break;
      }
    },
    changeDate() {

    },
    onHandleBtnClick(val) {
      console.log(val);
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    getRecordList() {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let params = {
        room_id: this.$route.query.roomId
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
        console.log(res.data.list, '11111111111111111');
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
.interact-detail {
  margin-top: 32px;
  /*/deep/.el-card {
    .padding48-40();
  }
  /deep/.el-card__body {
    padding: 0;
  }*/
}
.search-box{
  margin-bottom: 20px;
  /deep/.el-input__inner{
    border-radius: 18px;
    height: 40px;
    margin-left: 15px;
  }
}
.search-export{
  float: right;
  // margin-bottom: 20px;
}
</style>
