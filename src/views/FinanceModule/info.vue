<template>
  <div class="finance-info">
    <div class="title-data">
      <span>财务总览</span>
      <div class="detail" v-if="buttonList.includes('details')" @click="goAccountDetail">订单明细</div>
    </div>
    <div class="version-info">
      <version-info ref="versionInfo"></version-info>
    </div>
    <div class="statistical-line">
        <div class="serach-line">
          <span>用量统计</span>
        <el-tooltip effect="dark" placement="right" v-tooltipMove>
          <div slot="content" v-if="versionType">
            1.{{ versionType == 1 ? '数据更新频率：直播使用流量1小时更新，回放/点播使用流量1小时更新' : '数据更新频率为1小时'}}<br>2.删除活动或者删除子账号，不影响已统计的历史数据
          </div>
          <div slot="content" v-else>
           1.数据更新频率：天，不支持查看当日数据<br>2.并发只针对直播状态的活动，观看回放和点播时不消耗并发<br>3.删除活动或者删除子账号，不影响已统计的历史数据
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
          <el-select filterable v-model="lineType" style="width: 160px;marginLeft:15px" @change="getSearchLineList" v-if="type">
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
          <lint-charts :lineDataList="lintData" :type="parseInt(versionType)"></lint-charts>
        </div>
    </div>
    <div class="statistical-line">
      <div class="serach-line">
        <span>消费账单</span>
        <el-tooltip effect="dark" placement="right" v-tooltipMove>
          <div slot="content" v-if="versionType==1">
           数据更新频率：直播使用流量1小时更新，回放/点播使用流量1小时更新，短信消耗实时更新，<br>删除活动或者删除子账号，不影响已统计的历史数据
          </div>
          <div slot="content" v-if="versionType==2">
           1.时长统计每小时更新一次<br>2.时长套餐按人/分钟进行时长消耗<br>3.删除活动或者删除子账号，不影响已统计的历史数据<br>4.时长消耗保留2位小数，累计/直播/回放使用时长为实际消耗，与列表中的时长存在误差，但扣费以实际消耗为准
          </div>
          <div slot="content" v-else>
           1.数据更新频率10分钟，建议活动结束10分钟后查看完整数据<br>2.并发只针对直播状态的活动，观看回放和点播时不消耗并发<br>3.删除活动或者删除子账号，不影响已统计的历史数据
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
            :picker-options="pickerOptionsTwo"
            style="width: 240px"
          />
          <VhallInput v-model="subject"  placeholder="请输入活动名称" class="search-tag" style="width: 220px;marginLeft:15px;"  @keyup.enter.native="getSearchList" maxlength="50" @clear="getSearchList" v-clearEmoij clearable>
            <i slot="prefix" class="el-icon-search el-input__icon" @click="getSearchList" style="cursor: pointer;line-height: 36px;"></i>
          </VhallInput>
          <el-select filterable v-model="accountType" style="width: 160px;marginLeft:15px" @change="getTypeList" v-if="type">
            <el-option
              v-for="(opt, optIndex) in versionList"
              :key="optIndex"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <el-select filterable v-model="trendType" style="width: 160px;marginLeft:15px" @change="getTypeList" v-if="showSmsModule">
            <el-option
              v-for="(opt, optIndex) in [{
                label: '套餐消费',
                value: 'other'
              },{
                label: '短信消费',
                value: 'sms'
              }]"
              :key="optIndex"
              :label="opt.label"
              :value="opt.value"
            />
          </el-select>
          <div class="export-data">
            <el-button round  size="medium" @click="exportAccount">导出数据</el-button>
          </div>
        </div>
      <div :class="['content-grid', showSmsModule && smsInfo && smsInfo.sms >= 0 ? 'include_sms' : '']" v-if="!versionType">
         <div class="grid-item">
          <div class="grid-content">
            <p>累计直播（个）</p>
            <el-tooltip effect="dark" placement="right" v-tooltipMove>
              <div slot="content">
                筛选条件内创建的活动总数
              </div>
             <i class="iconfont-v3 saasicon_help_m"></i>
            </el-tooltip>
            <h1 class="custom-font-barlow">{{ trendData.webinar_num || 0 }}</h1>
          </div>
        </div>
        <div class="grid-item">
          <div class="grid-content">
            <p>最高并发（方）</p>
            <h1 class="custom-font-barlow">{{ trendData.max_uv || 0 }}</h1>
          </div>
        </div>
        <div class="grid-item" v-if="showSmsPanel">
          <div class="grid-content">
            <p>短信消耗(条)</p>
            <h1 class="custom-font-barlow">{{ smsInfo.sms || 0 }}</h1>
          </div>
        </div>
      </div>
      <div :class="['content-grid', showSmsPanel ? 'include_sms' : '']" v-else>
        <div class="content-item">
          <div class="grid-content">
            <p>累计活动（个）</p>
            <el-tooltip effect="dark" placement="right" v-tooltipMove>
              <div slot="content">
                筛选条件内{{versionType == 1 ? '创建的' : ''}}活动总数，包含直播+点播活动
              </div>
             <i class="iconfont-v3 saasicon_help_m"></i>
            </el-tooltip>
            <h1 class="custom-font-barlow">{{ trendData.webinar_num || 0 }}</h1>
          </div>
        </div>
        <div class="content-item">
          <div class="grid-content">
            <p>{{ versionType == 1 ? '累计使用流量（GB）' : '累计使用时长（分钟）'}}</p>
              <el-tooltip effect="dark" placement="right" v-tooltipMove>
              <div slot="content">
                {{ versionType == 1 ? '筛选条件内的直播使用流量+回放使用流量的总和' : '筛选条件内的直播使用时长+回放使用时长的总和'}}
              </div>
              <i class="iconfont-v3 saasicon_help_m"></i>
            </el-tooltip>
            <h1 class="custom-font-barlow">{{ versionType == 1 ? trendData.total_flow || 0 : trendData.total_duration || 0 }}</h1>
          </div>
        </div>
        <div class="content-item">
          <div class="grid-content">
            <p>{{ versionType == 1 ? '直播使用流量（GB）' : '直播使用时长（分钟）'}}</p>
              <el-tooltip effect="dark" placement="right" v-tooltipMove>
                <div slot="content">
                  {{ versionType == 1 ? '筛选条件内的直播使用流量汇总，包含视频直播、互动直播、音频直播消耗的总流量' : '筛选条件内的直播时长使用量的汇总，包含直播时长+角色观看时长+观看暖场时长'}}
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </el-tooltip>
            <h1 class="custom-font-barlow">{{ versionType == 1 ? trendData.live_flow || 0 : trendData.live_duration || 0}}</h1>
          </div>
        </div>
        <div class="content-item">
          <div class="grid-content">
            <p>{{ versionType == 1 ? '回放使用流量（GB）' : '回放使用时长（分钟）'}}</p>
              <el-tooltip effect="dark" placement="right" v-tooltipMove>
                <div slot="content">
                  {{ versionType == 1 ? '筛选条件内的回放使用流量汇总，包含回放、点播消耗的总流量' : '筛选条件内的回放时长使用量的汇总，包含回放、点播的总时长'}}
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </el-tooltip>
            <h1 class="custom-font-barlow">{{ versionType == 1 ? trendData.vod_flow || 0 : trendData.vod_duration || 0}}</h1>
          </div>
        </div>
        <div class="content-item" v-if="showSmsPanel">
          <div class="grid-content">
            <p>短信消耗(条)</p>
            <h1 class="custom-font-barlow">{{ smsInfo.sms || 0 }}</h1>
          </div>
        </div>
      </div>
      <div class="list_info">
        <table-list
          ref="accountTableList"
          :manageTableData="trendType == 'sms' ? tableCmsList : tableList"
          :tabelColumnLabel="trendType == 'sms' ? tableCmsColumn : tableColumn"
          :isCheckout="false"
          :isHandle="false"
          :totalNum="trendType == 'sms' ? cmsTotalNum : totalNum"
          @getTableList="getAccountList"
          >
        </table-list>
        <noData :nullType="'nullData'" v-if="trendType == 'sms' ? !cmsTotalNum : !totalNum" :text="'暂无数据'"></noData>
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
      buttonList: [],
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
        vod_flow: 1231234434,
        total_duration: 1232432,
        live_duration: 1232432,
        vod_duration: 1232432,
      },
      time: '',
      versionType: '',
      trendType: 'other', // 默认查询套餐情况，兼容知学云不要短信功能
      lineParams: {},
      dataParams: {},
      totalNum: 0,
      cmsTotalNum: 0,
      vm: {},
      status: 0,
      tableList: [],
      tableCmsList: [],
      tableColumn: [], // 消费表格
      tableCmsColumn: [], // 消息表格
      smsInfo: null, // 消息对象
      pickerOptions: {
        // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate: (time) => {
          return this.dealDisabledData(time);
        }
      },
      pickerOptionsTwo: {
        // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate: (time) => {
          return this.dealDisabledDataTwo(time);
        }
      }
    };
  },
  computed: {
    showSmsModule: function () {
      const userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
      const isNoticeMessage = JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))['message_notice'];
      // 不是知学云账号 & 开启了 短信通知配置项权限
      return userInfo.user_extends.extends_remark != 1 && isNoticeMessage == 1;
    },
    showSmsPanel () {
      return  this.showSmsModule && ((this.smsInfo && this.smsInfo.sms) || this.trendType == 'sms')
    }
  },
  filters:{
    formatMoney
  },
  created() {
    this.parentId = JSON.parse(sessionOrLocal.get('userInfo')).parent_id;
    this.childNum = JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))['child_num_limit'];
    this.userId = JSON.parse(sessionOrLocal.get("userId"));
    this.getVersion();
    if (this.parentId == 0 && this.childNum == 1) {
      this.type = true;
    }
  },
  mounted() {
    this.initPage();
  },
  beforeRouteLeave(to, from, next) {
    if (this.status && this.versionType != 2) {
      this.vm.close();
    }
    next();
  },
  methods: {
    dealDisabledData(time) {
      return time.getTime() > Date.now() - 8.64e7 //设置选择今天之前的日期（不能选择当天）
    },
    dealDisabledDataTwo(time) {
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
    getVersion() {
      this.$fetch('getVersionInfo', { user_id: this.userId}).then(res => {
        this.versionType = parseInt(res.data.type)
        if (res.data.type == 2) {
          this.buttonList = res.data.duration.buttons;
        } else{
          this.buttonList = res.data.concurrency ? res.data.concurrency.buttons : res.data.flow.buttons;
        }
        this.getLineList();
        this.getAccountList();
        // 格式化表格
        this.compareTableColumns()
        this.status = res.data.arrears.total_fee
        if (this.status) {
          this.initPayMessage(res.data.arrears);
        }
      }).catch(e=>{
        console.log(e);
      });
    },
    compareTableColumns() {
      const defaultColumns = [
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
        }
      ]
      if (this.trendType == 'sms') {
        defaultColumns[5] = {
          label: '短信消耗（条）',
          key: 'sms',
          width: 150
        }
        this.tableCmsColumn = defaultColumns
      } else {
        this.getColumns(defaultColumns, this.versionType)
      }
    },
    getColumns(defaultColumns, versionType) {
      if (versionType == 1) {
        this.tableColumn = defaultColumns.concat({
          label: '消耗流量（GB）',
          key: 'webinar_flow',
          width: 150
        })
      } else if (versionType == 2) {
        this.tableColumn = defaultColumns.concat({
          label: '消耗时长（分钟）',
          key: 'webinar_duration',
          width: 150
        })
      } else {
        this.tableColumn = defaultColumns.concat({
          label: '最高并发（方）',
          key: 'webinar_max_uv',
          width: 150
        })
      }
    },
    getSearchLineList() {
      this.$vhall_paas_port({
        k: this.lineType == 1 ? 100697 : 100698,
        data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      this.getLineList()
    },
    // 用量统计数据
    getLineList() {
      let paramsObj = {
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
      let url = this.versionType == 1 ? 'getFlowLineInfo' : this.versionType == '2' ? 'getTimeLineInfo' : 'getTrendLineInfo';
      this.$fetch(url, obj).then(res =>{
        this.lintData = res.data.list;
      }).catch(e=>{
        console.log(e);
      });
    },
    // 获取并发-最高  流量-活动个数
    getOnlinePay(obj) {
      let url = this.versionType == 1 ? 'getFlowPayInfo' : this.versionType == '2' ? 'getDurationInfo' :  'getTrendHighInfo';
      this.$fetch(url, obj).then(res =>{
        this.trendData = res.data || {};
      }).catch(e=>{
        console.log(e);
      });
    },
    getTypeList() {
      this.$vhall_paas_port({
        k: this.accountType == 1 ? 100700 : 100701,
        data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      this.getAccountList('search')
    },
    getSearchList() {
      if (this.subject) {
        this.$vhall_paas_port({
          k: 100699,
          data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
      }
      this.getAccountList('search')
    },
    // 订单明细
    goAccountDetail() {
      this.$vhall_paas_port({
        k: 100695,
        data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      this.$router.push({
        path: '/finance/infoDetail'
      });
    },
    // 获取消费账单列表
    getAccountList(params) {
      let pageInfo = this.$refs.accountTableList.pageInfo;
      let paramsObj = {
        subject: this.subject,
        type: this.accountType || 1
      };
      if (params == 'search') {
        pageInfo.pos= 0;
        pageInfo.pageNum = 1;
      }
      if (this.accountSearchDate) {
        paramsObj['start_time'] = this.accountSearchDate[0];
        paramsObj['end_time'] = this.accountSearchDate[1];
      } else {
        paramsObj['start_time'] = '';
        paramsObj['end_time'] = '';
      }
      this.dataParams = this.$params(paramsObj);
      let obj = Object.assign({}, pageInfo, paramsObj);

      this.getOnlinePay(this.$params(this.dataParams));
      this.getUserSmsPay(this.$params(this.dataParams));
      // 格式化表格头
      this.compareTableColumns()
      this.$nextTick(() => {
        if (this.trendType == 'sms') {
          // 获取短信消耗明细
          this.getUserSmsPayByPage(this.$params(obj));
        } else {
          // 获取流量消耗明细
          this.getDataList(this.$params(obj));
        }
      })
    },
    // 流量消费等查询
    getDataList(obj) {
      let url = this.versionType == 1 ? 'getBusinessList' : this.versionType == 2 ? 'getDurationList' : 'getAccountList';
      this.$fetch(url, obj).then(res =>{
        let costList = res.data.list;
        this.totalNum = res.data.total;
         costList.map(item => {
            item.typeText = item.type == 1 ? '主账号' : '子账号';
            item.typePay = item.pay_type >= 0 && item.pay_type <= 4 ? ['', '并发', '流量', '时长', '短信'][item.pay_type] : ''
          });
        this.tableList = costList;
      }).catch(e=>{
        console.log(e);
      });
    },
    // 短信消耗总数查询
    getUserSmsPay(obj) {
      this.$fetch('getUserSmsPay', obj).then(res =>{
        this.smsInfo = res.data;
      }).catch(e=>{
        console.log(e);
      });
    },
    // 短信分页查询
    getUserSmsPayByPage(obj) {
      this.$fetch('getUserSmsPayByPage', obj).then(res =>{
        let costList = res.data.list;
        this.cmsTotalNum = res.data.total;
         costList.map(item => {
            item.typeText = item.type == 1 ? '主账号' : '子账号';
            item.typePay = item.pay_type >= 0 && item.pay_type <= 4 ? ['', '并发', '流量', '时长', '短信'][item.pay_type] : ''
          });
        this.tableCmsList = costList;
      }).catch(e=>{
        console.log(e);
      });
    },
    getOrderArrear() {
      let params = {
        user_id: this.userId,
        type: this.versionType == 1 ? 1 : 2
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
    initPayMessage(info) {
      if (this.versionType == 2) {
        this.$message({
          showClose: true,
          duration: 0,
          dangerouslyUseHTMLString: true,
          message: '您的时长资源已用尽，请联系专属客服充值',
          type: 'warning'
        });
        return
      }
      let that = this;
      let flow = info.flow
      let extendFee = info.extend
      let total = flow < 0 ? `${ flow } G` : `${ extendFee } 方`
      let text  = `您有${ this.versionType == 1 ? '流量' : '并发'}欠费${info.total_fee}元未支付(${total})`
      this.vm = this.$message({
        showClose: true,
        duration: 0,
        dangerouslyUseHTMLString: true,
        message: '<p style="color:#1A1A1A">' + text + '<span id="openList" style="color:#FA9A32;cursor: pointer;padding-left:10px">请立即支付</span></p>',
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
      let url = this.versionType == 1 ? 'exportFlow' :  this.versionType == 2 ? 'exportDuration' : 'exportOnline';
      this.$fetch(url, this.lineParams).then(res => {
        this.$vhall_paas_port({
          k: 100696,
          data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.$message({
          message: `${this.versionType == 1 ? '流量' : this.versionType == 2 ? '时长' : '并发'}用量统计导出申请成功，请去下载中心下载`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.$EventBus.$emit('saas_vs_download_change');
      }).catch(res => {
        this.$message({
          message: res.msg || `${this.versionType == 1 ? '流量' : this.versionType == 2 ? '时长' : '并发'}用量统计导出失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    },
    // 导出消费账单
    exportAccount() {
      let url = ''
      if (this.trendType == 'sms') {
        // 短信导出
        url = 'exportUserSmsPayDetail'
      } else {
        url = this.versionType == 1 ? 'exportFlowDetail' : this.versionType == 2 ? 'exportDurationDetail' : 'exportOnlineDetail';
      }
      this.$fetch(url, this.dataParams).then(res => {
        this.$vhall_paas_port({
          k: 100702,
          data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
       this.$message({
        message: `${this.trendType == 'sms' ? '短信' : (this.versionType == 1 ? '流量' : this.versionType == 2 ? '时长' : '并发')}消费账单导出申请成功，请去下载中心下载`,
        showClose: true,
        // duration: 0,
        type: 'success',
        customClass: 'zdy-info-box'
       });
       this.$EventBus.$emit('saas_vs_download_change');
      }).catch(res => {
        this.$message({
          message: res.msg || `${this.trendType == 'sms' ? '短信' : (this.versionType == 1 ? '流量' : this.versionType == 2 ? '时长' : '并发')}消费账单导出失败`,
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
<style lang="less">
  .el-tooltip__popper {
    max-width: 600px;
    line-height: 17px;
  }
</style>

<style lang="less" scoped>
// /deep/.el-tooltip__popper {
//     max-width: 350px;
//   }
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
    }
    // /deep/.el-select__caret .el-input__icon{
    //   line-height: 36px;
    // }
    .search-tag{
      /deep/.el-input__inner{
        padding-right: 30px!important;
      }
      /deep/.el-input__icon {
          line-height: 36px;
        }
        /deep/.el-input__prefix{
          cursor: pointer;
        }
    }
    /deep/.el-icon-arrow-up, .is-reverse{
      line-height: 36px;
    }
    /deep/.el-range-editor.el-input__inner{
      padding: 1px 10px;
    }
    /deep/.el-date-editor .el-range-separator{
      padding: 2px 5px;
    }
  }
  .title-data {
      margin: 0 0 20px 0;
      text-align: left;
      line-height: 30px;
      position: relative;
      span{
        font-size: 22px;
        font-family: @fontSemibold;
        font-weight: 600;
        color: #1a1a1a;
      }
      .detail{
        position: absolute;
        top:0;
        right:0;
        color:#3B67F9;
        font-size: 14px;
        cursor: pointer;
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
    &.include_sms {
      .content-item {
        width: 19%;
      }
      .grid-item{
        width: 33%;
      }
    }
    .grid-content{
      margin: 24px 16px;
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
