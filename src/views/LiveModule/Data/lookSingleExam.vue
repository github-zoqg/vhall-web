<template>
  <div class="single-exam-detail">
    <!-- 上半部分区间 -->
    <div class="single-exam-detail__header">
      <p class="exam-webinar-title">xxxx快问快答标题名称</p>
      <div class="single-exam-detail__data">
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="7">
            <div class="grid-content">
              <span>查看人数</span>
              <el-tooltip effect="dark" placement="right" v-tooltipMove>
                <div slot="content">
                  主办方推送快问快答至观看端，仅查看题目未进行作答的人数，人数排重
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </el-tooltip>
              <h3 class="custom-font-barlow">
                <count-to :startVal="0"
                  :endVal="examData.showNum"
                  :duration="1500"
                  v-if="examData.showNum >= 0">
                </count-to>
              </h3>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content">
              <span>答题人数</span>
              <el-tooltip effect="dark" placement="right" v-tooltipMove>
                <div slot="content">
                  主办方推送快问快答至观看端，参与答题的人数（包含主动交卷、人工及系统收卷），人数排重
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </el-tooltip>
              <h3 class="custom-font-barlow">
                <count-to :startVal="0"
                  :endVal="examData.submitNum"
                  :duration="1500"
                  v-if="examData.submitNum >= 0">
                </count-to>
              </h3>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content">
              <span>满分率</span>
              <el-tooltip effect="dark" placement="right" v-tooltipMove>
                <div slot="content">
                  （满分人数 / 提交人数）*100%
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </el-tooltip>
              <h3 class="custom-font-barlow">
               <span>{{examData.percent}}%，</span>
               <count-to :startVal="0"
                  :endVal="examData.total"
                  :duration="1500"
                  v-if="examData.total >= 0">
                </count-to><span>人</span>
              </h3>
            </div>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="space-around">
          <el-col :span="7">
            <div class="grid-content">
              <span>最高分</span>
              <h3 class="custom-font-barlow">
                {{examData.maxScore}}
              </h3>
            </div>
          </el-col>
          <el-col :span="7">
            <div class="grid-content">
              <span>最低分</span>
              <h3 class="custom-font-barlow">
                {{examData.minScore}}
              </h3>
            </div>
          </el-col>
          <el-col :span="10">
            <div class="grid-content">
              <span>平均分</span>
              <el-tooltip effect="dark" placement="right" v-tooltipMove>
                <div slot="content">
                  本次答题的总分数 / 答题人数
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </el-tooltip>
              <h3 class="custom-font-barlow">
                {{examData.advScore}}
              </h3>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- 下半部分区间 -->
    <div class="single-exam-detail__list">
      <!-- 全部无结果 -->
      <div class="all-no-data" v-if="isNullData">
        <null-page nullType="nullData" text="暂无成绩排名数据" :height="0"></null-page>
      </div>
      <!-- 全部有结果 -->
      <div class="all-yes-data" v-else>
        <!-- 搜索 -->
        <div class="list--search">
          <div class="list--search--title">
            <span>成绩排名</span>
            <vh-tooltip v-tooltipMove :visible-arrow="false" placement="right-start">
              <div slot="content">
                <p>1.成绩排名按照得分展示，未设置分数时按照正确率展示<p>
                <p>2.得分或者正确率相同时，按照答题用时排名</p>
                <p>3.得分、正确率、答题用时相同时，按照用户提交答题时间排序</p>
                <p>4.用时：用户开始答题至提交答题所用时间</p>
                <p>5.主动交卷：用户自己点击提交为主动交卷</p>
              </div>
              <i class="iconfont-v3 saasicon_help_m tip"></i>
            </vh-tooltip>
          </div>
          <VhallInput placeholder="请输入用户姓名" v-model="query.keyword"
            clearable
            @clear="initQueryList"
            class="search-query"
            @input="checkoutList"
            v-clearEmoij
            @keyup.enter.native="initQueryList">
            <i class="el-icon-search el-input__icon" slot="prefix" @click="initQueryList"></i>
          </VhallInput>
          <el-select placeholder="全部数据" round v-model="query.dataType" @change="initQueryList" style="width:102px">
            <el-option value="">全部数据</el-option>
            <el-option
              v-for="item in [{
                label: '1',
                value: '有效数据'
              }, {
                label: '0',
                value: '无效数据'
              }]"
              :key="'data_' + item.label"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button size="medium" round @click="downloadHandle">导出</el-button>
        </div>
        <!-- 表格与分页 -->
        <table-list
          ref="tableList"
          :isHandle=true
          :isCheckout=false
          :manageTableData="resultVo.list||[]"
          :tabelColumnLabel="tableColumns"
          :totalNum="resultVo.total||0"
          :tableRowBtnFun="tableRowBtnFun"
          :needPagination=true
          width="150px"
          max-height="auto"
          scene="singleExam"
          @getTableList="getExamScoreList"
          @onHandleBtnClick="onHandleBtnClick"
        >
        </table-list>
    </div>
    </div>
  </div>
</template>
<script>
import NullPage from '../../PlatformModule/Error/nullPage.vue';
import CountTo from 'vue-count-to';
export default {
  data() {
    return {
      vm: null,
      loading: false,
      examData: {
        showNum: 0, // 查看人数
        submitNum: 0, // 答题人数
        percent: 0, // 满分率
        total: 0, // 总人数
        maxScore: 0, // 最高分
        minScore: 0, // 最低分
        advScore: 0 // 平均分
      },
      query: {
        dataType: '',
        keyword: '',
        pos: 0,
        limit: 20,
        pageNumber: 1
      },
      resultVo: {
        total: 0,
        list: []
      },
      tableColumns: [
        {
          label: '排名',
          key: 'name',
          width: 'auto'
        },
        {
          label: '参会ID',
          key: 'nick_name',
          width: 'auto'
        },
        {
          label: '姓名',
          key: 'phone',
          width: 'auto',
          customTooltip: true
        },
        {
          label: '手机号',
          key: 'phone',
          width: 'auto'
        },
        {
          label: '得分',
          key: 'phone',
          width: 'auto'
        },
        {
          label: '正确率',
          key: 'phone',
          width: 'auto'
        },
        {
          label: '用时',
          key: 'phone',
          width: 'auto'
        },
        {
          label: '主动交卷',
          key: 'phone',
          width: 'auto'
        }
      ],
      tableRowBtnFun: [
        {
          name: "查看成绩",
          methodName: 'openScoreDialog'
        },
        {
          name: "标记无效",
          methodName: 'editDataStatus'
        },
        {
          name: "还原数据",
          methodName: 'resetExamStatus'
        },
      ]
    };
  },
  computed: {
    isNullData() {
      return false;
    }
  },
  components: {
    CountTo,
    NullPage
  },
  mounted() {
    this.initComp()
  },
  methods: {
    //文案提示问题
    messageInfo(msg, type) {
      if (this.vm) {
        this.vm.close();
      }
      this.vm = this.$message({
        showClose: true,
        message: msg,
        type: type,
        customClass: 'zdy-info-box'
      })
    },
    checkoutList(newValue) {
      if(!newValue){
        this.initQueryList()
      }
    },
    // 查询快问快答 - 统计人数
    getSingleExamData() {
      let params = {}
      this.$fetch('getDataCenterInfo', this.$params(params)).then(res =>{
        this.examData = res.data;
      }).catch(e=>{
        console.log(e);
      }).finally(()=>{
      });
    },
    // 查询成绩排名
    getExamScoreList(row) {
      if (row) {
        this.query.pos = row.pos;
        this.query.pageNumber = row.pageNum;
      }
      let params = {
        pos: this.query.pos,
        limit: this.query.limit,
        keyword: this.query.keyword,
        dataType: this.query.dataType
      };
      this.loading = true;
      this.$fetch('getSonList', this.$params(params)).then(res => {
        this.loading = false;
        let result = res && res.code === 200 && res.data ? res.data : {
          total: 0,
          list: []
        };
        (result.list || []).map(item => {
        });
        this.resultVo = dao;
      }).catch(e => {
        this.loading = false;
        this.resultVo = {
          total: 0,
          list: []
        };
      });
    },
    // 查询成绩排名 - 默认
    initQueryList() {
      this.query.pos = 0;
      this.query.pageNumber = 1;
      this.query.limit = 10;
      // 表格切换到第一页
      try {
        this.$refs.tableList.pageInfo.pageNum = 1;
        this.$refs.tableList.pageInfo.pos = 0;
      } catch (e) {
        console.log(e);
      }
      this.getExamScoreList();
    },
    // 导出
    downloadHandle() {},
    // 查看成绩
    openScoreDialog() {},
    // 标记无效
    editDataStatus(that, {rows}) {
      that.$confirm('「标记无效」后，当前数据默认不计入统计分析和成绩排名中，确定标为无效数据？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        that.$fetch('editDataStatus', {
          id: rows.id
        }).then(res => {
          that.messageInfo('标记成功', 'success')
          that.initQueryList();
        }).catch(e => {
        })
      }).catch(() => {
      });
    },
    // 还原数据
    resetExamStatus(that, {rows}) {
      that.$confirm('「还原数据」后，当前数据重新计入统计分析和成绩排名中，确定进行还原？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        that.$fetch('resetExamStatus', {
          id: rows.id
        }).then(res => {
          that.messageInfo('还原成功', 'success')
          that.initQueryList();
        }).catch(e => {
        })
      }).catch((res) => {
        that.messageInfo(res.msg || '还原失败', 'error')
      });
    },
    // 表格操作列回调函数， val表示每行
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    // 界面初始化方法入口
    initComp() {
      this.getSingleExamData();
      this.initQueryList();
    }
  }
};
</script>
<style lang="less" scoped>
.single-exam-detail {
  /deep/.saasicon_help_m {
    color: #999999;
    &:hover {
      color: #666666;
    }
  }
  .single-exam-detail__header {
    padding: 24px 32px;
    background: #fff;
    border-radius: 4px;
    .exam-webinar-title {
      font-size: 16px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #1a1a1a;
      text-align: left;
      padding: 12px 0 18px 12px;
      border-bottom: 1px solid #eaeaea;
      padding: 4px 0 12px 0;
      margin-bottom: 24px;
    }
    .row-bg {
      margin: 12px 28px 64px 28px;
    }
    .bg-purple {
      margin-bottom: 26px;
    }
    .activeJustify{
      justify-content: space-around;
    }
    .grid-content {
      text-align: left;
      >span {
        font-size: 14px;
        font-family: @fontRegular;
        color: #999;
        margin: 0;
      }
      i{
        font-size: 14px;
        padding: 0 2px;
      }
      h3{
        padding-top: 6px;
        font-size: 28px;
        font-weight: bold;
        color: #1a1a1a;
        span{
          font-size: 28px;
          font-weight: bold;
          color: #1a1a1a;
          margin: 0;
        }
      }
    }
  }
  .single-exam-detail__list {
    margin-top: 24px;
    padding: 24px 32px;
    background: #fff;
    border-radius: 4px;
    // 初始化查询子账号列表信息
    .all-no-data {
      /* 基于外边框已经有距离： padding: 24px 24px 40px 24px; */
      padding-top: 30px;
      margin-top: 110px;
    }
    /deep/.all-yes-data {
      .data-list {
        .el-table {
          margin-bottom: 40px;
          .cell{
            line-height: 25px;
          }
        }
      }
    }
    .search-no-data {
      padding-top: 148px;
      .search {
        padding-bottom: 0;
      }
    }
    /deep/.list--search {
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .el-select {
        width: 100px;
        margin-right: 20px;
        .el-input__inner {
          user-select: none;
          border-radius: 50px;
          font-size: 14px;
          color: #666666;
          height: 36px;
          line-height: 36px;
        }
        .el-select__caret.el-input__icon.el-icon-arrow-up{
          line-height: 36px;
        }
      }
      .search-query {
        width: 220px;
        margin-left: auto;
        margin-right: 20px;
        .el-input__icon {
          line-height: 36px;
        }
        .el-input__inner {
          border-radius: 20px;
          height: 36px;
          padding-right: 30px !important;
        }

        .el-input__prefix {
          cursor: pointer;
        }
      }
    }
  }
}
</style>
