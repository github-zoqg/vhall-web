<template>
  <div class="user-data">
    <div class="title-data">
      <span>用户统计</span>
      <el-tooltip effect="dark" placement="right-start">
        <div slot="content">
          1.当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据<br />2.控制台数据统计为真实数据，不统计虚拟数据
        </div>
        <el-button
          circle
          icon="el-icon-question"
          class="button-tip"
        ></el-button>
      </el-tooltip>
    </div>
    <title-data :isStatus="status"></title-data>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="直播" name="live"></el-tab-pane>
      <el-tab-pane label="回放" name="relive"></el-tab-pane>
      <search-area
        ref="searchArea"
        :placeholder="placeholder"
        :searchAreaLayout="searchAreaLayout"
        @onSearchFun="getTableList('search')"
        >
      </search-area>
      <table-list
      ref="tableList"
        :manageTableData="tableList"
        :tabelColumnLabel="tabelColumn"
        :isHandle="isHandle"
        :totalNum="totalNum"
        @changeTableCheckbox="changeTableCheckbox"
        @getTableList="getTableList"
      >
    </table-list>
    </el-tabs>
  </div>
</template>
<script>
import titleData from './components/title';
export default {
  data() {
    return {
      status: 1,
      totalNum: 100,
      isHandle: false,
      activeName: 'live',
      placeholder: '搜索用户昵称',
      searchAreaLayout: [
        {
          type: "3",
          key: "searchIsTime",
          options: [
            {
              label: '按时间筛选',
              value: '1'
            },
            {
              label: '按场次筛选',
              value: '2'
            }
          ]
        },
        {
          type: "1"
        },
        {
          type: "2",
          key: "searchDate",
        },
        {
          key: "searchTitle",
        }
      ],
      tableList: [
        {
          user: '张三',
          icon: 'el-icon-s-tools',
          ip: '1.119.193.26',
          phone: '13701128773',
          revice: "手机",
          emails: 'w1h@vhall.com',
          area: '北京',
          time: '2020-09-08 00:00:13',
          timer: '30:00:00'
        },
        {
          user: '李四',
          icon: 'el-icon-phone-outline',
          ip: '1.119.193.26',
          phone: '13701128773',
          revice: "电脑",
          emails: 'w1h@vhall.com',
          area: '上海',
          time: '2020-09-08 00:00:16',
          timer: '50:00:00'
        }
      ],
      tabelColumn:[
        {
          label: '用户信息',
          key: 'user',
          width: 120
        },
        {
          label: '手机号',
          key: 'phone',
          width: 120
        },
        {
          label: '邮箱',
          key: 'emails',
          width: 150
        },
        {
          label: '进入时间',
          key: 'time',
        },
        {
          label: '观看时长（分）',
          key: 'timer',
          width: 120
        },
        {
          label: '观看终端',
          key: 'revice',
           width: 100
        },
         {
          label: '地理位置',
          key: 'area',
          width: 100
        },
        {
          label: 'IP地址',
          key: 'ip',
          width: 120
        }
      ]
    };
  },
  components: {
    titleData
  },
  methods: {
    getTableList(params) {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
      if (params === 'search') {
        pageInfo.pageNum= 1;
        // 如果搜索是有选中状态，取消选择
        // this.$refs.tableList.clearSelect();
      }
      let obj = Object.assign({}, pageInfo, formParams);
      console.log(obj);
    },
    changeTableCheckbox(val) {
      console.log(val);
    },
    handleClick(tab) {
      this.activeName = tab.name;
      // tab切换时搜索的值和分页的值都重置
      this.$refs.searchArea.searchParams = {};
      this.$refs.searchArea.searchParams.searchIsTime = '1',
      this.$refs.searchArea.isActive = 1;
      this.$refs.tableList.pageInfo.pageNum = 1;
      this.getTableList();
    }
  }
};
</script>
<style lang="less" scoped>
.user-data {
  padding: 0;
  /deep/.el-button {
    border: none;
    background: transparent;
  }
  /deep/.el-button.is-circle {
    padding: 3px;
  }
  .title-data {
    margin: 20px 0;
    text-align: left;
    line-height: 30px;
    span {
      font-size: 22px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #1a1a1a;
    }
    .button-tip {
      vertical-align: top;
    }
  }
}
</style>
