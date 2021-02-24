<template>
  <div class="live--data">
    <!-- 搜索 -->
    <div class="list--search">
      <!-- 日期选择器 -->
      <el-date-picker
        v-model="query.timeStr"
        value-format="yyyy-MM-dd"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        style="width: 240px"
        prefix-icon="iconfont-v3 saasicon_date"
        :picker-options="pickerOptions"
        @change="queryList"
      />
      <VhallInput placeholder="请输入活动标题" v-model="query.title"
                clearable
                v-clearEmoij
                @keyup.enter.native="queryList"
                @clear="queryList">
        <i class="el-icon-search el-input__icon" slot="prefix" @click="queryList"></i>
      </VhallInput>
      <el-button size="medium" round @click="downloadHandle">导出数据</el-button>
    </div>
    <!-- 数据 -->
    <div class="list--data">
      <table-list
        ref="sonTab"
        :isHandle=false
        :isCheckout=false
        :manageTableData="dataDao.list"
        :tabelColumnLabel="sonTableColumn"
        :totalNum="dataDao.total"
        :needPagination=true
        @getTableList="getUserPayDetail"
      >
      </table-list>
      <!-- 无消息内容 -->
      <null-page  class="search-no-data" :height="0" v-if="dataDao && dataDao.total === 0"></null-page>
    </div>
  </div>
</template>

<script>
import NullPage from '../../PlatformModule/Error/nullPage.vue';
import {sessionOrLocal} from "@/utils/utils";
export default {
  name: "liveData.vue",
  components: {
    NullPage
  },
  data() {
    return {
      sonVo: {
        vip_info: {}
      },
      query: {
        title: '',
        timeStr: null,
        pos: 0,
        limit: 10,
        pageNumber: 1
      },
      dataDao: {
        total: 0,
        list: []
      },
      isHandle: false, // 是否有操作项
      sonTableColumn: [],
      pickerOptions: {
        // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate: (time) => {
          return this.dealDisabledData(time);
        }
      }
    };
  },
  methods: {
    dealDisabledData(time) {
      // 设置选择的日期小于当前的日期,小于返回true,日期不可选
      // return time.getTime() < Date.now() - 8.64e7
      //return time.getTime() < Date.now() - 8.64e7;//设置选择今天以及今天之后的日
      return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
      //return time.getTime() < Date.now();//设置选择今天之后的日期（不能选择当天时间）
      // return time.getTime() > Date.now() - 8.64e7 //设置选择今天之前的日期（不能选择当天）
      // 设置当天23：59：59可选
      // let currentTime = this.getNowMonthDay() + ` 23:59:59`
      // return time.getTime() > new Date(currentTime).getTime()
    },
    queryList() {
      this.query.pos = 0;
      this.query.pageNumber = 1;
      this.query.limit = 10;
      // 表格切换到第一页
      try {
        this.$refs.sonTab.pageInfo.pageNum = 1;
        this.$refs.sonTab.pageInfo.pos = 0;
      } catch (e) {
        console.log(e);
      }
      this.getUserPayDetail();
    },
    getUserPayDetail(row) {
      if (row) {
        this.query.pos = row.pos;
        this.query.pageNumber = row.pageNum;
        this.query.limit = 10;
      }
      let parentId = JSON.parse(sessionOrLocal.get('userInfo')).parent_id;
      let params = {
        // account_id: this.$route.params.str, // b端账号id
        child_user_id: parentId == 0 ? '' : this.$route.params.str,
        type: 1, // 1：仅父账号  2：父账号+子账号 注：若是查具体某个子账号的，也传递1
        pos: this.query.pos,
        limit: this.query.limit,
        subject: this.query.title,
      };
      if (this.query.timeStr) {
        params.start_time = this.query.timeStr[0] || '';
        params.end_time = this.query.timeStr[1] || '';
      }
      this.$fetch(this.sonVo.vip_info.type > 0 ? 'getBusinessList' : 'getAccountList', this.$params(params)).then(res=>{
        if (res.data) {
          this.dataDao = {
            total: res.data.total || 0,
            list: res.data.list || []
          };
        }
      }).catch(e=>{
        console.log(e);
        this.dataDao = {
          total: 0,
          list: []
        };
      });
    },
    downloadHandle() {
      let parentId = JSON.parse(sessionOrLocal.get('userInfo')).parent_id;
      let params = {
        // account_id: this.$route.params.str, // 子账号内容，传递子账号数据
        child_user_id: parentId == 0 ? '' : this.$route.params.str,
        subject: this.query.title,
        // pos: 0,
        // limit: 999999, // TODO 跟凯南约定，固定写死，下载99万数据
        type: 1
      };
      if (this.query.timeStr) {
        params.start_time = this.query.timeStr[0] || '';
        params.end_time = this.query.timeStr[1] || '';
      }
      this.$fetch(this.sonVo.vip_info.type > 0 ? 'exportFlowDetail' : 'exportOnlineDetail', this.$params(params)).then(res=>{
        this.$message({
          message: `下载申请成功，请去下载中心下载该项`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.$EventBus.$emit('saas_vs_download_change');
      }).catch(res => {
        this.$message({
          message: res.msg || `下载申请失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    },
    initComp(sonVo) {
      this.sonVo = sonVo;
      // 初始化设置日期为最近一周
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 1);
      this.query.timeStr = [this.$moment(start).format('YYYY-MM-DD'), this.$moment(end).format('YYYY-MM-DD')];
      // 设置表格头
      this.sonTableColumn = [
        {
          label: '直播ID',
          key: 'webinar_id',
          width: 200
        },
        {
          label: '直播标题',
          key: 'subject',
          width: 'auto'
        },
        {
          label: '消耗时间',
          key: 'pay_date',
          width: 200
        },
        {
          label: `${this.sonVo.vip_info.type > 0 ? '消耗流量（GB）' : '最高并发（方）'}`,
          key: `${this.sonVo.vip_info.type > 0 ? 'webinar_flow' : 'webinar_max_uv'}`,
          width: 150
        }
      ]

      this.$nextTick(() => {
        this.getUserPayDetail();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.live--data {
  /* .padding41-40(); */
  padding: 24px 24px 0 24px;
}
.search-no-data {
  padding-top: 100px;
  /deep/.search {
    padding-bottom: 0;
  }
}
.list--search{
  .flex-display();
  .justify(flex-start);
  .align(center);
  margin-bottom: 20px;
  /deep/.el-input__inner{
    border-radius: 18px;
    height: 36px;
    background: transparent;
    padding-right: 50px;
    &.el-date-editor--daterange {
      padding-right: 10px;
    }
  }
  /deep/.el-range__close-icon {
    margin-bottom: 5px;
    // line-height: 36px;
  }
  /deep/.el-input__suffix{
    top: 0px;
  }
  .el-input{
    margin-left: 12px;
    width: 220px;
    /deep/ .el-input__prefix{
      cursor: pointer;
      /deep/ .el-input__icon{
        // width: auto;
        // margin-right: 5px;
        line-height: 36px;
      }
    }
  }

  .el-button {
    margin-left: auto;
  }
}
/deep/.el-table .cell {
  line-height: 25px;
}
</style>
