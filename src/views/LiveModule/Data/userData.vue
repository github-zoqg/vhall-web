<template>
  <div class="user-data">
    <div class="title-data">
      <pageTitle pageTitle="用户统计">
        <div slot="content">
          1.当日数据更新频率10分钟，建议活动结束后10分钟查看完整数据
          <br />
          2.控制台数据统计为真实数据，不统计虚拟数据
          <br />
          3.当前仅展示观众信息，不展示主持人、嘉宾、助理
        </div>
      </pageTitle>
    </div>
    <title-data :liveDetailInfo="liveDetailInfo"></title-data>
    <div class="active-box">
      <el-tabs
        v-model="activeName"
        @tab-click="handleClick"
        v-if="liveDetailInfo.webinar_state != 4"
      >
        <el-tab-pane label="直播" name="1"></el-tab-pane>
        <el-tab-pane label="回放" name="2"></el-tab-pane>
      </el-tabs>
      <div class="search">
        <el-select
          filterable
          v-model="type"
          @change="changeType"
          v-if="isSwitch"
          style="width: 160px; vertical-align: top; margin-right: 16px"
        >
          <el-option
            v-for="(opt, optIndex) in timeData"
            :key="optIndex"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-date-picker
          v-model="dateValue"
          value-format="yyyy-MM-dd"
          type="daterange"
          unlink-panels
          @change="searchTime"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          prefix-icon="iconfont-v3 saasicon_date"
          :picker-options="pickerOptions"
          v-if="type == '1'"
        />
        <el-select
          filterable
          clearable
          v-model="switchId"
          v-if="type == '2'"
          @change="searchTableList"
        >
          <el-option
            v-for="(opt, optIndex) in switchList"
            :key="optIndex"
            :label="opt.label"
            :value="opt.value"
          />
        </el-select>
        <el-checkbox v-model="checkedValue" @change="searchTableList" style="margin-left: 16px">
          合并同一用户
        </el-checkbox>
        <VhallInput
          class="search-tag"
          placeholder="请输入用户昵称"
          v-clearEmoij
          v-model.trim="title"
          clearable
          @change="searchTableList"
          @keyup.enter.native="searchTableList"
        >
          <i class="el-icon-search el-input__icon" slot="prefix" @click="searchTableList"></i>
        </VhallInput>
        <!-- <el-input class="inputer" v-model.trim="title" placeholder="请输入用户昵称" style="vertical-align: top;margin-left:20px" @clear="searchTableList" @keyup.enter.native="searchTableList"  clearable><i slot="suffix" class="el-input__icon el-icon-search" @click="searchTableList"></i></el-input> -->
        <div class="export-data" v-if="exportPerssion > 0">
          <el-button round size="medium" @click="exportCenterData">导出数据</el-button>
        </div>
      </div>
      <div>
        <table-list
          ref="tableList"
          :manageTableData="tableList"
          :tabelColumnLabel="tabelColumn"
          :isHandle="false"
          :isCheckout="false"
          :totalNum="totalNum"
          @changeTableCheckbox="changeTableCheckbox"
          @getTableList="getTableList"
        ></table-list>
        <noData
          v-show="tableList.length == 0"
          :nullType="'nullData'"
          :text="'暂无数据'"
          :height="100"
        ></noData>
      </div>
    </div>
  </div>
</template>
<script>
  import titleData from './components/title';
  import noData from '@/views/PlatformModule/Error/nullPage';
  import PageTitle from '@/components/PageTitle';
  import { sessionOrLocal } from '@/utils/utils';
  export default {
    data() {
      let _this = this;
      return {
        active: 2,
        totalNum: 0,
        isHandle: false,
        params: {}, //导出的时候用来记录参数
        activeName: '1',
        type: '1',
        switchId: 0,
        dateValue: '',
        timeType: 0,
        checkedValue: false,
        title: '',
        userId: JSON.parse(sessionOrLocal.get('userId')),
        liveDetailInfo: {},
        switchList: [],
        tableList: [],
        isSwitch: true,
        tabelColumn: [
          {
            label: '用户信息',
            key: 'nick_name'
          },
          {
            label: '手机号',
            key: 'phone',
            customTooltip: true
          },
          {
            label: '邮箱',
            key: 'email',
            customTooltip: true
          },
          {
            label: '进入时间',
            key: 'join_time',
            customTooltip: true
          },
          {
            label: '观看时长（分）',
            key: 'watch_duration',
            width: '200px'
          },
          {
            label: '观看终端',
            key: 'watch_type'
          },
          {
            label: '地理位置',
            key: 'watch_provice'
          },
          {
            label: 'IP地址',
            key: 'ip'
          }
        ],
        timeData: [
          {
            label: '按时间筛选',
            value: '1'
          },
          {
            label: '按场次筛选',
            value: '2'
          }
        ],
        pickerOptions: {
          shortcuts: [
            {
              text: '今日',
              onClick(picker) {
                let childrenArray = Array.from(picker.$el.firstChild.firstChild.children);
                childrenArray.forEach(item => {
                  item.style.color = '#666';
                });
                picker.$el.firstChild.firstChild.children[0].style.color = '#FB3A32';
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime());
                start.setTime(start.getTime());
                picker.$emit('pick', [start, end]);
                _this.timeType = 0;
              }
            },
            {
              text: '近7日',
              onClick(picker) {
                let childrenArray = Array.from(picker.$el.firstChild.firstChild.children);
                childrenArray.forEach(item => {
                  item.style.color = '#666';
                });
                picker.$el.firstChild.firstChild.children[1].style.color = '#FB3A32';
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
                _this.timeType = 1;
              }
            },
            {
              text: '近30日',
              onClick(picker) {
                let childrenArray = Array.from(picker.$el.firstChild.firstChild.children);
                childrenArray.forEach(item => {
                  item.style.color = '#666';
                });
                picker.$el.firstChild.firstChild.children[2].style.color = '#FB3A32';
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() - 3600 * 1000 * 24);
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
                _this.timeType = 2;
              }
            }
          ],
          // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
          disabledDate: time => {
            return this.dealDisabledData(time);
          }
        }
      };
    },
    components: {
      titleData,
      noData,
      PageTitle
    },
    created() {
      this.exportPerssion = JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))[
        'data_export'
      ];
      this.initPage();
      this.getLiveDetail();
    },
    watch: {
      active(value) {
        this.active = value;
      }
    },
    mounted() {},
    methods: {
      dealDisabledData(time) {
        return time.getTime() > Date.now(); //设置选择今天以及今天以前的日期
        // return time.getTime() > Date.now() - 8.64e7 //设置选择今天之前的日期（不能选择当天）
      },
      initPage() {
        // 初始化设置日期为今天
        const end = new Date();
        const start = new Date();
        end.setTime(end.getTime());
        start.setTime(start.getTime());
        this.dateValue = [dayjs(start).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD')];
      },
      searchTime() {
        if (this.type == 1) {
          let timeArr = [100475, 100476, 100477];
          let vitimeArr = [100483, 100484, 100485];
          this.$vhall_paas_port({
            k: this.activeName == 1 ? timeArr[this.timeType] : vitimeArr[this.timeType],
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.$route.params.str,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
        }
        this.getTableList('search');
      },
      searchTableList() {
        if (this.checkedValue) {
          this.$vhall_paas_port({
            k: this.activeName == 1 ? 100480 : 100486,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.$route.params.str,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
        }
        if (this.title) {
          this.$vhall_paas_port({
            k: this.activeName == 1 ? 100482 : 100488,
            data: {
              business_uid: this.userId,
              user_id: '',
              webinar_id: this.$route.params.str,
              refer: '',
              s: '',
              report_extra: {},
              ref_url: '',
              req_url: ''
            }
          });
        }
        this.getTableList('search');
      },
      //获取直播详情
      getLiveDetail() {
        // webinar/info调整-正常的信息展示使用 0
        this.$fetch('getWebinarInfo', { webinar_id: this.$route.params.str, is_rehearsal: 0 })
          .then(res => {
            this.liveDetailInfo = res.data;
            if (this.liveDetailInfo.webinar_state != 4) {
              this.getLiveSwitchInfo();
            } else {
              this.isSwitch = false;
              this.activeName = '2';
            }
            this.getTableList();
          })
          .catch(res => {
            this.$message({
              message: res.msg || `获取信息失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            console.log(res);
          });
      },
      // 获取直播场次
      getLiveSwitchInfo() {
        this.switchList = [
          {
            label: `全部`,
            value: 0
          }
        ];
        this.$fetch('getWebinarSwitchList', { webinar_id: this.$route.params.str }).then(res => {
          res.data.switch_list.map((item, index) => {
            this.switchList.push({
              label: `第${index + 1}场`,
              value: item.id
            });
          });
        });
      },
      getTableList(params) {
        let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
        // let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
        let paramsObj = {
          webinar_id: this.$route.params.str,
          switch_id: this.switchId || 0,
          service_names: this.liveDetailInfo.webinar_state == 4 ? '2' : this.activeName,
          start_time: this.dateValue ? this.dateValue[0] : '',
          end_time: this.dateValue ? this.dateValue[1] : '',
          merge_type: this.checkedValue ? 1 : 2,
          nick_name: this.title
        };
        if (params === 'search') {
          pageInfo.pageNum = 1;
          pageInfo.pos = 0;
        }
        let obj = Object.assign({}, pageInfo, paramsObj);
        this.params = paramsObj;
        this.getBaseUserInfo(obj);
      },
      getBaseUserInfo(params) {
        this.$fetch('getUserBaseinfo', this.$params(params)).then(res => {
          this.tableList = res.data.list;
          this.tableList.map(item => {
            item.watch_provice = `${item.watch_provice}-${item.watch_city}`;
          });
          this.totalNum = res.data.total;
        });
      },
      // 导出
      exportCenterData() {
        this.$fetch('exportUserinfo', this.params)
          .then(res => {
            this.$vhall_paas_port({
              k: this.activeName == 1 ? 100481 : 100487,
              data: {
                business_uid: this.userId,
                user_id: '',
                webinar_id: this.$route.params.str,
                refer: '',
                s: '',
                report_extra: {},
                ref_url: '',
                req_url: ''
              }
            });
            this.$message({
              message: `用户统计数据导出申请成功，请去下载中心下载`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.$EventBus.$emit('saas_vs_download_change');
          })
          .catch(res => {
            this.$message({
              message: res.msg || `用户统计数据导出失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
      },
      changeTableCheckbox(val) {
        console.log(val);
      },
      changeType() {
        this.switchId = '';
        if (this.type == 1) {
          this.initPage();
        } else {
          this.dateValue = '';
        }
        this.$vhall_paas_port({
          k: this.type == 1 ? 100478 : 100479,
          data: {
            business_uid: this.userId,
            user_id: '',
            webinar_id: this.$route.params.str,
            refer: '',
            s: '',
            report_extra: {},
            ref_url: '',
            req_url: ''
          }
        });
        this.getTableList('search');
      },
      handleClick(tab) {
        this.activeName = tab.name;
        // tab切换时搜索的值和分页的值都重置
        this.isSwitch = tab.name == '2' ? false : true;
        let queryDocument = document.querySelectorAll('.el-picker-panel__shortcut');
        if (queryDocument.length > 0) {
          queryDocument[0].style.color = '#fb3a32';
          queryDocument[1].style.color = '#666';
          queryDocument[2].style.color = '#666';
        }
        this.initPage();
        this.type = '1';
        this.title = '';
        this.checkedValue = false;
        this.switchId = '0';
        this.getTableList('search');
      }
    }
  };
</script>
<style lang="less">
  .el-picker-panel__shortcut:nth-of-type(1) {
    color: #fb3a32;
  }
  .el-picker-panel__shortcut:nth-of-type(2) {
    color: #666;
  }
</style>
<style lang="less" scoped>
  .user-data {
    padding: 0;
    .container-box {
      margin-bottom: 24px;
    }
    /deep/.el-button.is-circle {
      padding: 3px;
    }
    .search {
      padding: 0 24px;
      margin: 24px 0;
      position: relative;
      /deep/.el-input__inner {
        border-radius: 18px;
        height: 36px;
        background: transparent;
      }
      /deep/.el-range-input {
        background: transparent;
        width: 43%;
      }
      /deep/.el-date-editor .el-range__icon {
        line-height: 29px;
      }
      /deep/.el-date-editor .el-range__close-icon {
        line-height: 28px;
        width: 20px;
      }
      /deep/.el-input__icon {
        line-height: 36px;
      }
      .export-data {
        position: absolute;
        right: 24px;
        top: 0;
      }

      .search-tag {
        margin-left: 20px;
        width: 180px !important;
        /deep/ .el-input__icon {
          line-height: 36px;
        }
        /deep/.el-input__inner {
          border-radius: 20px;
          height: 36px;
          padding-right: 30px !important;
        }
        /deep/ .el-input__prefix {
          cursor: pointer;
        }
      }
    }
    .data-list {
      padding: 0 24px;
    }
    /deep/.el-select {
      // width:130px!important;
    }

    @media screen and (max-width: 1920px) {
      .search-tag /deep/.el-input {
        width: 160px !important;
      }
    }
    /deep/.el-tabs__item {
      height: 56px;
      line-height: 56px;
    }
    /deep/.el-date-editor {
      width: 220px !important;
      /deep/ input {
        width: 72px;
      }
    }
    .title-data {
      margin: 20px 0;
      text-align: left;
      line-height: 30px;
      i {
        padding: 4px;
        font-size: 14px;
      }
      span {
        font-size: 22px;
        font-family: @fontSemibold;
        font-weight: 600;
        color: #1a1a1a;
      }
      // .button-tip {
      //   vertical-align: top;
      // }
    }
    .active-box {
      padding: 24px 0;
      border-radius: 4px;
      background: #fff;
      padding-top: 1px;
    }
  }
</style>
