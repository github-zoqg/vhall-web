<template>
  <div class="finance-info">
    <div class="title-data">
      <span>财务总览</span>
    </div>
    <div class="version-info">
      <version-info></version-info>
    </div>
    <div class="statistical-line">
        <div class="serach-line">
          <span>用量统计</span>
        <el-tooltip effect="dark" placement="right-start">
          <div slot="content" v-if="versionType">
           数据更新频率：直播使用流量1小时更新，回放/点播使用流量1小时更新
          </div>
          <div slot="content" v-else>
           1.数据更新频率10分钟，建议活动结束10分钟后查看完整数据<br>2.并发只针对直播状态的活动，观看回放和点播时不消耗并发
          </div>
          <i class="iconfont-v3 saasicon_help_m"></i>
        </el-tooltip>
        <div class="search-data">
          <el-date-picker
          v-model="lineSearchDate"
          value-format="yyyy-MM-dd"
          type="daterange"
          @change="getLineList"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          prefix-icon="iconfont-v3 saasicon_date"
          style="width: 240px"
        />
          <el-select filterable clearable v-model="lineType" style="width: 160px;marginLeft:15px" @change="getLineList" v-if="type">
            <el-option
              v-for="(opt, optIndex) in versionList"
              :key="optIndex"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <div class="export-data">
            <el-button round size="medium" @click="exportCenterData">导出数据</el-button>
          </div>
        </div>
          <!-- <search-area
            ref="searchLineLayout"
            :isDate="isLineDate"
            :searchAreaLayout="searchLineLayout"
            @onExportData="exportCenterData()"
            @onSearchFun="getLineList()"
          >
          </search-area> -->
          <lint-charts :lineDataList="lintData" :type="1"></lint-charts>
        </div>
    </div>
    <div class="statistical-line">
      <div class="serach-line">
        <span>消费账单</span>
        <el-tooltip effect="dark" placement="right-start">
          <div slot="content" v-if="versionType">
           数据更新频率：直播使用流量1小时更新，回放/点播使用流量1小时更新
          </div>
          <div slot="content" v-else>
           1.数据更新频率10分钟，建议活动结束10分钟后查看完整数据<br>2.并发只针对直播状态的活动，观看回放和点播时不消耗并发
          </div>
          <i class="iconfont-v3 saasicon_help_m"></i>
        </el-tooltip>
         <div class="search-data">
          <el-date-picker
          v-model="accountSearchDate"
          value-format="yyyy-MM-dd"
          type="daterange"
          prefix-icon="iconfont-v3 saasicon_date"
          @change="getSearchList"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
          style="width: 240px"
        />
        <VhallInput v-model.trim="subject" placeholder="请输入活动名称" style="width: 220px;marginLeft:15px;"  @keyup.enter.native="getSearchList" maxlength="50" @clear="getSearchList" clearable>
          <i slot="suffix" class="iconfont-v3 saasicon_search" @click="getSearchList" style="cursor: pointer;line-height: 36px;"></i>
        </VhallInput>
          <el-select filterable clearable v-model="accountType" style="width: 160px;marginLeft:15px" @change="getSearchList" v-if="type">
            <el-option
              v-for="(opt, optIndex) in versionList"
              :key="optIndex"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <div class="export-data">
            <el-button round  size="medium" @click="exportAccount">导出数据</el-button>
          </div>
        </div>
        <!-- <search-area
            ref="searchDataAccount"
            :isDate="isDate"
            :searchAreaLayout="searchDataAccount"
            @onExportData="exportAccount()"
            @onSearchFun="getAccountList('search')"
        >
        </search-area> -->
      <div class="content-grid" v-if="!versionType">
         <div class="grid-item">
          <div class="grid-content">
            <p>累计直播（个）</p>
            <h1>{{ trendData.webinar_num || 0 }}</h1>
          </div>
        </div>
         <div class="grid-item">
          <div class="grid-content">
            <p>最高并发（方）</p>
            <h1>{{ trendData.max_uv || 0 }}</h1>
          </div>
        </div>
      </div>
      <div class="content-grid" v-else>
        <div class="content-item">
          <div class="grid-content">
            <p>累计活动（个）</p>
            <el-tooltip effect="dark" placement="right-start">
              <div slot="content">
                筛选条件内的活动总数，包含直播+点播活动
              </div>
             <i class="iconfont-v3 saasicon_help_m"></i>
            </el-tooltip>
            <h1>{{ trendData.webinar_num || 0 }}</h1>
          </div>
        </div>
        <div class="content-item">
          <div class="grid-content">
            <p>累计使用流量（GB）</p>
              <el-tooltip effect="dark" placement="right-start">
              <div slot="content">
                筛选条件内的直播使用流量+回放使用流量的总和
              </div>
              <i class="iconfont-v3 saasicon_help_m"></i>
            </el-tooltip>

            <h1>{{ trendData.total_flow || 0 }}</h1>
          </div>
        </div>
        <div class="content-item">
          <div class="grid-content">
            <p>直播使用流量（GB）</p>
              <el-tooltip effect="dark" placement="right-start">
                <div slot="content">
                  筛选条件内的直播使用流量汇总，包含视频直播、互动直播、音频直播消耗的总流量
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </el-tooltip>
            <h1>{{ trendData.live_flow || 0 }}</h1>
          </div>
        </div>
        <div class="content-item">
          <div class="grid-content">
            <p>回放使用流量（GB）</p>
              <el-tooltip effect="dark" placement="right-start">
                <div slot="content">
                  筛选条件内的回放使用流量汇总，包含回放、点播、下载回放视频到本地消耗的总流量
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </el-tooltip>
            <h1>{{ trendData.vod_flow || 0 }}</h1>
          </div>
        </div>
      </div>
      <div class="list_info">
        <table-list
          ref="accountTableList"
          :manageTableData="tableList"
          :tabelColumnLabel="tabelColumn"
          :isCheckout="false"
          :isHandle="false"
          :totalNum="totalNum"
          @getTableList="getAccountList"
          >
        </table-list>
        <noData :nullType="'nullData'" v-if="!totalNum" :text="'暂无数据'"></noData>
      </div>
      </div>
    </div>
  </div>
</template>

<script>
import versionInfo from '@/components/DataUsage/index';
import lintCharts from '@/components/Echarts/lineEcharts';
import { sessionOrLocal } from '@/utils/utils';
import { formatMoney } from '@/utils/filter';
import noData from '@/views/PlatformModule/Error/nullPage';
// import { getCountDownTime } from '@/utils/general';
export default {
  name: "financeInfo",
  components: {
    versionInfo,
    lintCharts,
    noData
  },
  data() {
    return {
      lintData: [],
      type: false,
      lineType: 1,
      accountType: 1,
      versionList: [
        {
          label: '主账号',
          value: 1,
        },
        {
          label: '主账号+子账号',
          value: 2,
        }
      ],
      subject: '',
      lineSearchDate: '',
      accountSearchDate: '',
      trendData: {
        webinar_num: 12345678,
        total_flow: 901234567,
        live_flow: 212321478,
        vod_flow: 1231234434
      },
      time: '',
      versionType: '',
      lineParams: {},
      dataParams: {},
      totalNum: 1000,
      vm: {},
      status: 0,
      tableList: [],
      tabelColumn: [],
      tabelColumns: [
        {
          label: '消费时间',
          key: 'pay_date',
          width: 120
        },
        {
          label: '活动ID',
          key: 'webinar_id',
          width: 120
        },
        {
          label: '活动名称',
          key: 'subject',
        },
        {
          label: '消费类型',
          key: 'typePay',
          width: 120
        },
        {
          label: '账号类型',
          key: 'typeText',
          width: 120
        },
      ],
      pickerOptions: {
        // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate: (time) => {
          return this.dealDisabledData(time);
        }
      }
    };
  },
  filters:{
    formatMoney
  },
  created() {
    this.parentId = JSON.parse(sessionOrLocal.get('userInfo')).parent_id;
    this.childNum = JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))['child_num_limit'];
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.versionType = JSON.parse(sessionOrLocal.get("versionType"));
    if (!this.versionType) {
      this.tabelColumn = this.tabelColumns.concat({
        label: '最高并发（方）',
        key: 'webinar_max_uv',
        width: 150
      })
    } else {
      this.tabelColumn = this.tabelColumns.concat({
        label: '消耗流量（GB）',
        key: 'webinar_flow',
        width: 150
      })
    }
    if (this.parentId == 0 && this.childNum == 1) {
      this.type = true;
    }
  },
  mounted() {
    this.status = JSON.parse(sessionOrLocal.get("arrears")).total_fee || 0;
    if (this.status) {
      this.initPayMessage();
    }
    this.initPage();
    this.getLineList();
    this.getAccountList();
  },
  beforeRouteLeave(to, from, next) {
    if (this.status) {
      this.vm.close();
    }
    next();
  },
  methods: {
    dealDisabledData(time) {
      return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
    },
    initPage() {
      // 初始化设置日期为最近一周
      const end = new Date();
      const start = new Date();
      end.setTime(end.getTime() - 3600 * 1000 * 24);
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      this.lineSearchDate = [this.$moment(start).format('YYYY-MM-DD'), this.$moment(end).format('YYYY-MM-DD')];
      this.accountSearchDate = [this.$moment(start).format('YYYY-MM-DD'), this.$moment(end).format('YYYY-MM-DD')]
    },
    // 用量统计数据
    getLineList() {
      let paramsObj = {
        account_id: this.userId,
        type: this.lineType || 1
      };
      if (this.lineSearchDate) {
        paramsObj['start_time'] = this.lineSearchDate[0];
        paramsObj['end_time'] = this.lineSearchDate[1];
      }
      let obj = Object.assign({}, paramsObj);
      this.lineParams = obj;
      this.getFlowTrend(obj);
    },
    getFlowTrend(obj) {
      let url = this.versionType == '1' ? 'getFlowLineInfo' : 'getTrendLineInfo';
      this.$fetch(url, obj).then(res =>{
        this.lintData = res.data.list;
      }).catch(e=>{
        console.log(e);
      });
    },
    // 获取并发-最高  流量-活动个数
    getOnlinePay(obj) {
      let url = this.versionType == '1' ? 'getFlowPayInfo' : 'getTrendHighInfo';
      this.$fetch(url, obj).then(res =>{
        this.trendData = res.data || {};
      }).catch(e=>{
        console.log(e);
      });
    },
    getSearchList() {
      this.getAccountList('search')
    },
    // 获取消费账单列表
    getAccountList(params) {
      let pageInfo = this.$refs.accountTableList.pageInfo;
      let paramsObj = {
        account_id: this.userId,
        subject: this.subject,
        type: this.accountType || 1
      };
      if (params == 'search') {
        pageInfo.pos= 0;
        pageInfo.pageNum = 1;
      }
      console.log(this.accountSearchDate, '?????????????')
      if (this.accountSearchDate) {
        paramsObj['start_time'] = this.accountSearchDate[0];
        paramsObj['end_time'] = this.accountSearchDate[1];
      } else {
        paramsObj['start_time'] = '';
        paramsObj['end_time'] = '';
      }
      this.dataParams = this.$params(paramsObj);
      let obj = Object.assign({}, pageInfo, paramsObj);

      this.getOnlinePay(this.$params(obj));
      this.getDataList(this.$params(obj));
    },
    getDataList(obj) {
      let url = this.versionType == '1' ? 'getBusinessList' : 'getAccountList';
      this.$fetch(url, obj).then(res =>{
        let costList = res.data.list;
        this.totalNum = res.data.total;
        costList.map(item => {
          item.typeText = item.type == 1 ? '主账号' : '子账号';
          item.typePay = item.pay_type == 1 ? '并发 ' : '流量';
        });
        this.tableList = costList;
      }).catch(e=>{
        console.log(e);
      });
    },
    getOrderArrear() {
      let params = {
        user_id: this.userId,
        type: this.versionType == '1' ? 1 : 2
      };
      this.$fetch('orderArrears', params).then(res =>{
        if (res.code == 200) {
          this.$router.push({
            path: '/finance/payOrder',
            query: {
              userId: this.userId,
              orderId: res.data.order_id
            }
          });
        }
      }).catch(res =>{
        this.$message({
          message: res.msg || "获取信息失败",
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        console.log(res);
      });
    },
    initPayMessage() {
      let that = this;
      this.vm = this.$message({
        showClose: true,
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: '<p style="color:#1A1A1A">您有流量欠费' + that.status + '元未支付  <span id="openList" style="color:#FA9A32;cursor: pointer;padding-left:10px">立即支付</span></p>',
        type: 'warning'
      });
      let open = document.querySelector('#openList');
      open.addEventListener('click', function(e){
        that.vm.close();
        that.getOrderArrear();
      });
    },
    // 导出用量统计
    exportCenterData() {
      let url = this.versionType == '1' ? 'exportFlow' : 'exportOnline';
      this.$fetch(url, this.lineParams).then(res => {
        this.$message({
          message: `${this.versionType ? '流量' : '并发'}用量统计导出申请成功，请去下载中心下载`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.$EventBus.$emit('saas_vs_download_change');
      }).catch(res => {
        this.$message({
          message: res.msg || `${this.versionType ? '流量' : '并发'}用量统计导出失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    },
    // 导出消费账单
    exportAccount() {
      let url = this.versionType == '1' ? 'exportFlowDetail' : 'exportOnlineDetail';
      this.$fetch(url, this.dataParams).then(res => {
       this.$message({
        message: `${this.versionType ? '流量' : '并发'}消费账单导出申请成功，请去下载中心下载`,
        showClose: true,
        // duration: 0,
        type: 'success',
        customClass: 'zdy-info-box'
       });
       this.$EventBus.$emit('saas_vs_download_change');
      }).catch(res => {
        this.$message({
          message: res.msg || `${this.versionType ? '流量' : '并发'}消费账单导出失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    },
  }
};
</script>

<style lang="less" scoped>
.finance-info{
  .serach-line{
    padding: 24px;
    border-radius: 4px;
    background: #fff;
  }
  .search-data {
    /deep/.el-input__inner{
      border-radius: 18px;
      height: 36px;
      background: transparent;
      padding-left: 12px;
      padding-right: 50px;
    }
     /deep/.el-input__icon {
        // margin-bottom: 5px;
        line-height: 33px;
      }
      /deep/.el-input__suffix{
        top: 0px;
      }
    /deep/.el-range-editor.el-input__inner{
      padding: 1px 10px;
    }
    /deep/.el-date-editor .el-range-separator{
      padding: 2px 5px;
    }
  }
  .title-data {
      margin: 10px 0 20px 0;
      text-align: left;
      line-height: 30px;
      span{
        font-size: 22px;
        font-family: @fontSemibold;
        font-weight: 600;
        color: #1a1a1a;
      }
    }
  .statistical-line {
    text-align: left;
    position: relative;
    margin-top: 20px;
    span {
      display: inline-block;
      font-size: 16px;
      color: #1a1a1a;
      margin-bottom: 10px;
      padding-bottom: 5px;
    }
    i{
      font-size: 14px;
      padding: 0 2px;
    }
  }
  .content-grid{
    width: 100%;
    height:100px;
    margin-bottom: 20px;
    background: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .content-item{
      width: 24%;
      background: #F7F7F7;
      height:100px;
      border-radius: 4px;
    }
    .grid-item{
      width: 49%;
      background: #F7F7F7;
      height:100px;
      border-radius: 4px;
    }
    .grid-content{
      margin: 22px 40px;
      text-align: left;
      h1{
        font-size: 28px;
        color: #1A1A1A;
        line-height: 32px;
        font-weight: bold;
      }
      p{
        font-size: 14px;
        color: #999;
        line-height: 20px;
        display: inline-block;
        i{
          color:#1A1A1A;
        }
      }
    }
  }
  .search-data{
    position: relative;
    padding: 5px 0 20px 0;
    // margin-bottom: 15px;
    .export-data {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

}
/deep/.saasicon_help_m {
  color: #999999;
}
</style>
