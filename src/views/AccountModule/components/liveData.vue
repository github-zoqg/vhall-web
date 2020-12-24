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
        :clearable=false
        @change="queryList"
      />
      <el-input placeholder="请输入活动标题" v-model.trim="query.title"
                clearable
                @keyup.enter.native="queryList"
                @clear="queryList">
        <i class="el-icon-search el-input__icon" slot="suffix" @click="queryList"></i>
      </el-input>
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
        v-if="dataDao.total > 0 && dataDao.list.length > 0"
      >
      </table-list>
      <!-- 无消息内容 -->
      <null-page v-else></null-page>
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
      sonTableColumn: [
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
          label: '最高并发（方）',
          key: 'webinar_max_uv',
          width: 200
        }
      ]
    };
  },
  methods: {
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
      let params = {
        account_id: sessionOrLocal.get('userId'), // b端账号id
        type: 1, // 1：仅父账号  2：父账号+子账号 注：若是查具体某个子账号的，也传递1
        pos: this.query.pos,
        limit: this.query.limit,
        subject: this.query.title,
      };
      if (this.query.timeStr) {
        params.start_time = this.query.timeStr[0] || '';
        params.end_time = this.query.timeStr[1] || '';
      }
      this.$fetch(this.sonVo.vip_info.type > 0 ? 'getBusinessList' : 'getAccountList', params).then(res=>{
        if (res && res.code === 200 && res.data) {
          this.dataDao = res.data;
        }
      }).catch(e=>{
        console.log(e);
      });
    },
    downloadHandle() {
      let params = {
        account_id: this.$route.params.str, // 子账号内容，传递子账号数据
        subject: this.query.title,
        pos: 0,
        limit: 999999, // TODO 跟凯南约定，固定写死，下载99万数据
        type: 1
      };
      if (this.query.timeStr) {
        params.start_time = this.query.timeStr[0] || '';
        params.end_time = this.query.timeStr[1] || '';
      }
      this.$fetch(this.sonVo.vip_info.type > 0 ? 'exportFlowDetail' : 'exportOnlineDetail', params).then(res=>{
        if (res && res.code === 200) {
          this.$message.success('下载申请成功，请去下载中心下载该项！');
          this.$EventBus.$emit('saas_vs_download_change');
        } else {
          this.$message.error(res.msg);
        }
      }).catch(e=>{
        console.log(e);
      });
    },
    initComp(sonVo) {
      this.sonVo = sonVo;
      // 初始化设置日期为最近一周
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      this.query.timeStr = [this.$moment(start).format('YYYY-MM-DD'), this.$moment(end).format('YYYY-MM-DD')];
      this.$nextTick(() => {
        this.getUserPayDetail();
      });
    }
  }
};
</script>

<style lang="less" scoped>
.live--data {
  .padding41-40();
}
.list--search{
  .flex-display();
  .justify(flex-start);
  .align(center);
  margin-bottom: 20px;
  .el-select{
    margin-right: 20px;
    /deep/ .el-input__inner{
      user-select: none;
      border-radius: 50px;
      font-size: 14px;
      color: #666666;
      height: 36px;
      line-height: 36px;
    }
  }
  .el-input{
    margin-left: 24px;
    width: 270px;
    /deep/ .el-input__inner{
      border-radius: 20px;
      height: 36px;
    }
    /deep/ .el-input__suffix{
      cursor: pointer;
      /deep/ .el-input__icon{
        line-height: 36px;
      }
    }
  }
  .el-button {
    margin-left: auto;
  }
}
</style>
