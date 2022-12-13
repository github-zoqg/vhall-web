<template>
  <div class="account-income">
    <pageTitle pageTitle="账户收益">
      <!-- TODO:支付牌照问题 -->
      <div slot="content">
        1.账户收益包含直播收益和红包收益
        <br />
        2.直播收益：观众对主办方打赏的金额，包含门票、打赏、礼物道具
        <br />
        3.红包收益：作为观众身份抢到主办方发送的红包，以及主办方发送红包后未被领取完，会退款到红包收益
        <br />
        4.删除活动不影响已统计的历史数据
      </div>
    </pageTitle>
    <div class="detail" @click="accountDetail">提现明细</div>
    <el-row :gutter="10">
      <el-col :span="12" style="padding-right: 0">
        <div class="live-come">
          <h3>直播收益</h3>
          <div class="live-all">
            <div class="all-come">
              <p>
                总收益
                <span class="moneyUnit">(元)</span>
              </p>
              <h1 class="custom-font-barlow">{{ incomeInfo.live_income | formatMoney }}</h1>
            </div>
            <div class="all-come">
              <!-- TODO:支付牌照问题 -->
              <p>
                可用金额
                <span class="moneyUnit">(元)</span>
                <span class="withdraw" @click="cash('直播')">
                  {{ incomeInfo.in_live_withdraw ? '提现中' : '提现' }}
                </span>
                <el-tooltip effect="dark" placement="right" v-tooltipMove>
                  <div slot="content">
                    Q1: 平台提现额度为多少？
                    <br />
                    A1: 平台余额1元以上方可提现。线上最大支持单笔提现额度为800元。
                    <br />
                    应国家税务局要求，个人用户单次提现超过800元将产生个人所得税，
                    <br />
                    请发送以下资料至：finance@vhall.com
                    <br />
                    ●
                    个人用户：系统账号、姓名、身份证号、银行账户姓名、账号、开户行、提现类型（直播收益或红包收益）
                    <br />
                    ● 公司用户：系统账号、营业执照扫描件加盖公章、银行账户名称、账号、开户行
                    <br />
                    *公司/个人信息与银行信息必须对应
                    <br />
                    Q2: 平台提现有手续费么，手续费具体为多少？
                    <br />
                    A2: 平台目前提现付费采用分成模式，平台分成5%
                    <br />
                    Q3: 提现申请后，几天内到账
                    <br />
                    A3: 从提现当天算起，7-15个工作日内到账，最终以实际到账时间为准。
                    <br />
                    Q4: 提现还有什么其他注意事项？
                    <br />
                    A4: 在提现周期内不能再次提现，到账后方可重新进行提现操作
                  </div>
                  <i class="iconfont-v3 saasicon_help_m"></i>
                </el-tooltip>
              </p>
              <h1 class="custom-font-barlow">{{ incomeInfo.live_balance | formatMoney }}</h1>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="12" style="padding-left: 0">
        <div class="money-come">
          <h3>红包收益</h3>
          <div class="live-all">
            <div class="all-come">
              <p>
                总收益
                <span class="moneyUnit">(元)</span>
              </p>
              <h1 class="custom-font-barlow">{{ incomeInfo.red_packet_income | formatMoney }}</h1>
            </div>
            <div class="all-come">
              <!-- TODO:支付牌照问题 -->
              <p>
                可用金额
                <span class="moneyUnit">(元)</span>
                <span class="withdraw" @click="cash('红包')">
                  {{ incomeInfo.in_red_withdraw ? '提现中' : '提现' }}
                </span>
                <el-tooltip effect="dark" placement="right" v-tooltipMove>
                  <div slot="content">
                    Q1: 红包提现额度为多少？
                    <br />
                    A1: 红包余额1元以上方可提现，线上最大支持单笔提现额度为800元。
                    <br />
                    应国家税务局要求，个人用户单次提现超过800元将产生个人所得税，
                    <br />
                    请发送以下资料至：finance@vhall.com
                    <br />
                    ●
                    个人用户：系统账号、姓名、身份证号、银行账户姓名、账号、开户行、提现类型（直播收益或红包收益）
                    <br />
                    ● 公司用户：系统账号、营业执照扫描件加盖公章、银行账户名称、账号、开户行
                    <br />
                    *公司/个人信息与银行信息必须对应
                    <br />
                    Q2: 平台提现有手续费么，手续费具体为多少？
                    <br />
                    A2: 无手续费
                    <br />
                    Q3: 提现申请后，几天内到账
                    <br />
                    A3: 从提现当天算起，7-15个工作日内到账，最终以实际到账时间为准。
                    <br />
                    Q4: 提现还有什么其他注意事项？
                    <br />
                    A4: 在提现周期内不能再次提现，到账后方可重新进行提现操作
                  </div>
                  <i class="iconfont-v3 saasicon_help_m"></i>
                </el-tooltip>
              </p>
              <h1 class="custom-font-barlow">{{ incomeInfo.red_packet_balance | formatMoney }}</h1>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <div class="listTab box-card">
      <el-tabs v-model="activeIndex" @tab-click="handleClick">
        <el-tab-pane label="直播收益明细" name="1"></el-tab-pane>
        <el-tab-pane label="红包收益明细" name="2"></el-tab-pane>
        <div class="search-income">
          <search-area
            :isForbidExport="!tableList.length"
            ref="searchIncome"
            @onExportData="exportAccount()"
            :searchAreaLayout="searchAccount"
            @onSearchFun="getSearchList()"
          ></search-area>
        </div>
        <table-list
          ref="tableIncome"
          :manageTableData="tableList"
          :tabelColumnLabel="tabelColumn"
          :isCheckout="false"
          :isHandle="isHandle"
          :tableRowBtnFun="tableRowBtnFun"
          :totalNum="totalNum"
          :width="100"
          @onHandleBtnClick="onHandleBtnClick"
          @getTableList="getIncomeList"
        ></table-list>
        <noData :nullType="'nullData'" v-if="!totalNum" :text="'暂无数据'"></noData>
      </el-tabs>
    </div>
    <cash-box ref="cashBox" :money="money" :type="type" @onreload="onreload"></cash-box>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import cashBox from './components/cashBox';
  import { sessionOrLocal } from '@/utils/utils';
  import noData from '@/views/PlatformModule/Error/nullPage';
  export default {
    name: 'income',
    data() {
      return {
        activeIndex: '1',
        totalNum: 1,
        money: 0,
        phone: 0,
        type: 0,
        params: {},
        isHandle: true,
        incomeInfo: {},
        searchAccount: [
          {
            type: '2',
            key: 'searchTime'
          },
          {
            key: 'webinar_name'
          }
        ],
        isCheckout: false,
        tableList: [
          {
            webinar_id: '1',
            name: '秒吼吼吼吼',
            total_income: '200',
            ticket_income: '100',
            reward_income: '123',
            gifts_income: '123.00',
            red_packet_user: 'xixiiiiid',
            red_packet_type: '0',
            created_at: '2020-10-01',
            money: '1000.00'
          },
          {
            webinar_id: '2',
            name: '秒吼吼吼222吼',
            total_income: '1000',
            ticket_income: '1000',
            reward_income: '1023',
            gifts_income: '999999',
            red_packet_user: '哈哈哈哈哈',
            red_packet_type: '1',
            created_at: '2020-10-01',
            money: '2000.00'
          }
        ],
        tabelColumn: [],
        liveColumns: [
          {
            label: '活动id',
            key: 'webinar_id',
            width: 130
          },
          {
            label: '标题',
            key: 'name',
            customTooltip: true
          },
          {
            label: '总收益（元）',
            key: 'total_income',
            width: 120
          },
          {
            label: '门票收益（元）',
            key: 'ticket_income',
            width: 135
          },
          {
            label: '打赏收益（元）',
            key: 'reward_income',
            width: 135
          },
          {
            label: '礼物收益（元）',
            key: 'gifts_income',
            width: 135
          }
        ],
        meneyColumns: [
          {
            label: '活动id',
            key: 'webinar_id',
            width: 130
          },
          {
            label: '标题',
            key: 'name',
            customTooltip: true
          },
          {
            label: '发红包用户',
            key: 'red_packet_user',
            width: 300
          },
          {
            label: '红包类型',
            key: 'red_packet',
            width: 135
          },
          {
            label: '领取时间',
            key: 'created_at',
            width: 170
          },
          {
            label: '领取金额（元）',
            key: 'money',
            width: 135
          }
        ],
        tableRowBtnFun: [
          {
            name: '详情',
            methodName: 'detail'
          }
        ]
      };
    },
    components: {
      cashBox,
      PageTitle,
      noData
    },
    created() {
      this.tabelColumn = this.liveColumns;
      this.userId = JSON.parse(sessionOrLocal.get('userId'));
    },
    mounted() {
      this.getIncomeInfo();
      this.getIncomeList();
    },
    watch: {
      activeIndex(value) {
        if (parseInt(value) === 2) {
          this.isHandle = false;
          this.tabelColumn = this.meneyColumns;
        } else {
          this.isHandle = true;
          this.tabelColumn = this.liveColumns;
        }
      }
    },
    methods: {
      getIncomeInfo() {
        this.$fetch('incomeInfo', { user_id: this.userId })
          .then(res => {
            this.incomeInfo = res.data;
          })
          .catch(e => {
            console.log(e);
          });
      },
      onHandleBtnClick(val) {
        let methodsCombin = this.$options.methods;
        methodsCombin[val.type](this, val);
      },
      handleClick(tab) {
        this.activeIndex = tab.name;
        this.$refs.searchIncome.searchParams = {};
        this.$refs.tableIncome.pageInfo.pageNum = 1;
        this.$refs.tableIncome.pageInfo.pos = 0;
        this.getIncomeList();
        this.$vhall_paas_port({
          k: this.activeIndex == 1 ? 100757 : 100758,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
      },
      getSearchList() {
        let formParams = this.$refs.searchIncome.searchParams;
        if (formParams.webinar_name) {
          this.$vhall_paas_port({
            k: this.activeIndex == 1 ? 100761 : 100762,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: '',
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
        }
        this.getIncomeList('search');
      },
      getIncomeList(params) {
        let pageInfo = this.$refs.tableIncome.pageInfo; //获取分页信息
        let formParams = this.$refs.searchIncome.searchParams; //获取搜索参数
        let paramsObj = {};
        if (params === 'search') {
          pageInfo.pageNum = 1;
          pageInfo.pos = 0;
        }
        for (let i in formParams) {
          if (i === 'searchTime' && formParams.searchTime) {
            paramsObj['start_time'] = formParams[i][0];
            paramsObj['end_time'] = formParams[i][1];
          } else {
            paramsObj[i] = formParams[i];
          }
        }
        paramsObj.user_id = this.userId;
        let obj = Object.assign({}, pageInfo, paramsObj);
        this.params = paramsObj;
        let url = this.activeIndex == '1' ? 'liveIncomeList' : 'packetIncomeList';
        this.$fetch(url, obj)
          .then(res => {
            this.totalNum = res.data.total;
            this.tableList = res.data.list;
            if (this.activeIndex == '2') {
              this.rowsList(this.tableList);
            }
            console.log(res);
          })
          .catch(e => {
            console.log(e);
          });
      },
      rowsList(data) {
        data.map(item => {
          item.red_packet = item.red_packet_type == '1' ? '固定金额' : '拼手气';
        });
      },
      cash(title) {
        this.$vhall_paas_port({
          k: title === '直播' ? 100751 : 100755,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
        if (this.incomeInfo.in_live_withdraw || this.incomeInfo.in_red_withdraw) {
          this.$alert('您有进行中的提现，无法再次提现', '提示', {
            confirmButtonText: '知道了',
            lockScroll: false,
            customClass: 'zdy-message-box',
            callback: action => {}
          });
          return;
        }
        if (title === '直播' && parseInt(this.incomeInfo.live_balance) < 1) {
          this.$message.warning('当前余额不足1元，不支持提现');
          return false;
        }
        if (title === '红包' && parseInt(this.incomeInfo.red_packet_balance) < 1) {
          this.$message.warning('当前余额不足1元，不支持提现');
          return false;
        }
        // let flag = this.isBangWeixin();
        this.checkWithdrawalToB(title);
      },
      checkWithdrawalToB(title) {
        this.$fetch('checkWithdrawalToB', {})
          .then(res => {
            if (res && res.code == 200 && res.data) {
              if (res.data.is_oauth == 1) {
                sessionOrLocal.set('cashWechat', JSON.stringify(res.data));
                // 已绑定，且有微信昵称 + 头像，不需要授权
                this.$refs.cashBox.dialogCashVisible = true;
                this.phone = this.userInfo.phone;
                this.money =
                  title === '直播'
                    ? this.incomeInfo.live_balance
                    : this.incomeInfo.red_packet_balance;
                this.type = title === '直播' ? 0 : 1;
              } else {
                // 未绑定 或者 微信昵称 和 头像任一一个未拿取到数据，需要授权
                this.$refs.cashBox.dialogVisible = true;
              }
            } else {
              this.$message.error(res.msg || '检测用户是否登录微信失败');
            }
          })
          .catch(res => {
            console.log(title);
            this.$message.error(res.msg || '检测用户是否登录微信失败');
          });
      },
      onreload() {
        this.getIncomeInfo();
      },
      detail(that, { rows }) {
        if (rows.player == 1) {
          that.$message.warning('flash活动，暂不支持查看！');
          return;
        }
        if (that.activeIndex == 1) {
          that.$vhall_paas_port({
            k: 100763,
            data: {
              business_uid: that.userId,
              user_id: '',
              webinar_id: '',
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
        }

        that.$router.push({
          path: `/finance/incomeDetail/${rows.webinar_id}`
        });
      },
      // 提现明细
      accountDetail() {
        this.$vhall_paas_port({
          k: 100750,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: '',
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.$router.push({
          path: '/finance/accountDetail'
        });
      },
      // 导出收益明细
      exportAccount() {
        let url = this.activeIndex == '1' ? 'exportLiveIncome' : 'exportRedPacket';
        this.$fetch(url, this.params)
          .then(res => {
            this.$vhall_paas_port({
              k: this.activeIndex == 1 ? 100759 : 100760,
              data: {
                business_uid: this.userId,
                user_id: '',
                webinar_id: '',
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            this.$message({
              message: `${
                this.activeIndex == '1' ? '直播' : '红包'
              }收益明细导出申请成功，请去下载中心下载`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.$EventBus.$emit('saas_vs_download_change');
          })
          .catch(res => {
            this.$message({
              message: res.msg || `${this.activeIndex == '1' ? '直播' : '红包'}收益明细导出失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      }
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
  .account-income {
    position: relative;
    .box-card {
      background: #fff;
      padding: 0 0 40px 0;
      border-radius: 4px;
    }
    /deep/.el-tabs__content {
      padding: 0 24px;
    }
    .detail {
      position: absolute;
      top: 8px;
      right: 0;
      color: #3b67f9;
      font-size: 14px;
      cursor: pointer;
    }
    .live-come {
      padding: 24px 32px;
      border-radius: 4px;
      background: #fff;
      // margin-right: 10px;
      height: 170px;
      h3 {
        font-size: 16px;
        color: #1a1a1a;
        font-weight: 400;
        padding-bottom: 26px;
      }
    }
    .live-all {
      display: flex;
      .all-come {
        width: 50%;
        padding-left: 24px;
        p {
          font-size: 14px;
          color: #999;
          font-weight: 400px;
          padding-bottom: 8px;
        }
        h1 {
          font-size: 28px;
          color: #1a1a1a;
          font-weight: bold;
          line-height: 32px;
        }
        .withdraw {
          padding: 2px 8px;
          border-radius: 10px;
          border: 1px solid #fb3a32;
          font-size: 12px;
          color: #fb3a32;
          cursor: pointer;
        }
        .moneyUnit {
          padding: 0 6px 0 8px;
        }
        i {
          font-size: 14px;
          padding: 0 5px;
          color: #1a1a1a;
          &.saasicon_help_m {
            color: #999;
          }
        }
      }
    }
    .money-come {
      margin-left: 16px;
      height: 170px;
      padding: 24px 32px;
      border-radius: 4px;
      background: #fff;
      h3 {
        font-size: 16px;
        color: #1a1a1a;
        font-weight: 400;
        padding-bottom: 26px;
      }
    }
    .listTab {
      margin-top: 24px;
      .search-income {
        margin-top: 32px;
      }
    }
  }
  /deep/.saasicon_help_m {
    color: #999999;
  }
</style>
