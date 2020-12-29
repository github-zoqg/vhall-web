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
    <title-data :liveDetailInfo="liveDetailInfo"></title-data>
    <el-card>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="直播" name="1"></el-tab-pane>
        <el-tab-pane label="回放" name="2"></el-tab-pane>
        <div class="search">
          <search-area
            ref="searchArea"
            :placeholder="placeholder"
            :active="active"
            @onExportData="exportCenterData()"
            :searchAreaLayout="searchAreaLayout"
            @onSearchFun="getTableList('search')"
            >
          </search-area>
        </div>
        <table-list
          ref="tableList"
          :manageTableData="tableList"
          :tabelColumnLabel="tabelColumn"
          :isHandle="false"
          :isCheckout="false"
          :totalNum="totalNum"
          @changeTableCheckbox="changeTableCheckbox"
          @getTableList="getTableList"
          >
        </table-list>
      </el-tabs>
    </el-card>

  </div>
</template>
<script>
import titleData from './components/title';
import { getRangeDays } from '@/utils/general';
export default {
  data() {
    return {
      status: 2,
      active: 2,
      totalNum: 100,
      isHandle: false,
      params: {}, //导出的时候用来记录参数
      activeName: '1',
      liveDetailInfo: {},
      switchList: [],
      placeholder: '搜索用户昵称',
      searchAreaLayout: [],
      tableList: [],
      tabelColumn:[
        {
          label: '用户信息',
          key: 'userName',
        },
        {
          label: '手机号',
          key: 'phone',
        },
        {
          label: '邮箱',
          key: 'email',
        },
        {
          label: '进入时间',
          key: 'join_time',
        },
        {
          label: '观看时长（分）',
          key: 'watch_duration',
        },
        {
          label: '观看终端',
          key: 'watch_type',
        },
         {
          label: '地理位置',
          key: 'watch_provice',
        },
        {
          label: 'IP地址',
          key: 'ip',
        }
      ],
      searchArea:[
         {
          type: "3",
          key: "searchIsTime",
          options: [
            {
              label: '按时间筛选',
              value: '1',
            },
            {
              label: '按场次筛选',
              value: '2',
            },
          ]
        },
        {
          type: "3",
          key: "switchId",
          options: []
        }
      ],
      searchLayout: [
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
          type: "1",
          options: [
            {
              title: '今日',
              active: 2,
            },
            {
              title: '近7日',
              active: 3,
            },
            {
              title: '近30日',
              active: 4,
            }
          ]
        },
        {
          type: "2",
          key: "searchTime",
        },
        {
          type: "7",
          key: "merge_type",
          name: '合并同一用户'
        },
        {
          key: "searchTitle",
        }
      ],
      searchVodOut: [
        {
          type: "1",
          active: 2,
          options: [
            {
              title: '全部',
              active: 1,
            },
            {
              title: '今日',
              active: 2,
            },
            {
              title: '近7日',
              active: 3,
            },
            {
              title: '近30日',
              active: 4,
            }
          ]
        },
        {
          type: "2",
          key: "searchTime",
        }
      ]
    };
  },
  components: {
    titleData
  },
  created() {
    this.getLiveDetail();
  },
  mounted() {
  },
  methods: {
    //获取直播详情
    getLiveDetail() {
      this.$fetch('getWebinarInfo', {webinar_id: this.$route.params.str}).then(res=>{
        this.liveDetailInfo = res.data;
        if (this.liveDetailInfo.webinar_state != 4) {
          this.searchAreaLayout = this.searchLayout;
          this.getLiveSwitchInfo();
        } else {
          this.searchAreaLayout = this.searchVodOut;
        }
        this.getTableList();
      }).catch(error=>{
        this.$message.error(`获取信息失败,${error.errmsg || error.message}`);
        console.log(error);
      });
    },
    // 获取直播场次
    getLiveSwitchInfo() {
      this.$fetch('getWebinarSwitchList', {webinar_id: this.$route.params.str}).then(res => {
        this.switchList = res.data.switch_list.map((item, index) => {
          return {
            label: `第${index + 1}场`,
            value: item.id
          }
        });
      })
    },
    getTableList(params) {
      this.params = {};
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
      let paramsObj = {
        webinar_id: this.$route.params.str,
        switch_id: formParams.switchId || 0,
        service_names: this.activeName,
        merge_type: formParams.merge_type ? 1 : 2,
        end_time: getRangeDays(1)
      };
      if (this.active!= 1) {
        paramsObj.start_time = getRangeDays(this.active);
      }
      if (this.liveDetailInfo.webinar_state != 4) {
        if (formParams.searchIsTime == 2) {
            formParams.searchTime = '';
            this.searchArea.map(item => {
              item.key === 'switchId' ? item.options = this.switchList : []
            })
            this.searchAreaLayout = this.searchArea;
          } else {
            this.searchAreaLayout = this.searchLayout;
            paramsObj.switch_id = 0;
          }
        }
      if (params === 'search') {
        pageInfo.pageNum= 1;
        pageInfo.pos= 0;
        // 如果搜索是有选中状态，取消选择
        this.$refs.tableList.clearSelect();
      }
      for (let i in formParams) {
        if (i === 'searchTime' && formParams.searchTime) {
          paramsObj['start_time'] = formParams[i][0];
          paramsObj['end_time'] = formParams[i][1];
        } else {
          paramsObj[i] = formParams[i];
        }
      }
      let obj = Object.assign({}, pageInfo, paramsObj);
      this.params = obj;
      this.getBaseUserInfo(obj);
    },
    getBaseUserInfo(params) {
      this.$fetch('getUserBaseinfo', params).then(res => {
        this.tableList = res.data.list;
        this.tableList.map(item => {
          item.userName = `${item.nick_name == null ? '' : item.nick_name}${item.w_name == null ? '' : item.w_name}`;
        })
        this.totalNum = res.data.total;
      });
    },
    // 导出
    exportCenterData() {
      this.$fetch('exportUserinfo', this.params).then(res => {
        if (res.code == 200) {
          this.$message.success(`用户统计数据导出申请成功，请去下载中心下载`);
          this.$EventBus.$emit('saas_vs_download_change');
        } else {
          this.$message.error(`用户统计数据${res.msg}`);
        }
      })
    },
    changeTableCheckbox(val) {
      console.log(val);
    },
    handleClick(tab) {
      this.activeName = tab.name;
      // tab切换时搜索的值和分页的值都重置
      this.$refs.searchArea.searchParams = {};
      this.$refs.searchArea.searchParams.searchIsTime = '1',
      this.$refs.tableList.pageInfo.pageNum = 1;
      this.$refs.tableList.pageInfo.pos = 0;
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
  .search{
    margin-top: 30px;
  }
  .title-data {
    margin: 20px 0;
    text-align: left;
    line-height: 30px;
    span {
      font-size: 22px;
      font-family: @fontSemibold;
      font-weight: 600;
      color: #1a1a1a;
    }
    .button-tip {
      vertical-align: top;
    }
  }
}
</style>
