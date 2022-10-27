<template>
  <div class="single-exam-detail">
    <!-- 上半部分区间 -->
    <div class="single-exam-detail__header">
      <p class="exam-webinar-title">{{ examData.title }}</p>
      <div class="single-exam-detail__data">
        <vh-row type="flex" class="row-bg" justify="space-around">
          <vh-col :span="7">
            <div class="grid-content">
              <span>查看人数</span>
              <vh-tooltip effect="dark" placement="right" v-tooltipMove>
                <div slot="content">
                  主办方推送快问快答至观看端，仅查看题目未进行作答的人数，人数排重
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </vh-tooltip>
              <h3 class="custom-font-barlow">
                <count-to :startVal="0"
                  :endVal="examData.check_num"
                  :duration="1500"
                  v-if="examData.check_num >= 0">
                </count-to>
              </h3>
            </div>
          </vh-col>
          <vh-col :span="7">
            <div class="grid-content">
              <span>答题人数</span>
              <vh-tooltip effect="dark" placement="right" v-tooltipMove>
                <div slot="content">
                  主办方推送快问快答至观看端，参与答题的人数（包含主动交卷、人工及系统收卷），人数排重
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </vh-tooltip>
              <h3 class="custom-font-barlow">
                <count-to :startVal="0"
                  :endVal="examData.answer_num"
                  :duration="1500"
                  v-if="examData.answer_num >= 0">
                </count-to>
              </h3>
            </div>
          </vh-col>
          <vh-col :span="10">
            <div class="grid-content">
              <span>满分率</span>
              <vh-tooltip effect="dark" placement="right" v-tooltipMove>
                <div slot="content">
                  （满分人数 / 提交人数）*100%
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </vh-tooltip>
              <h3 class="custom-font-barlow">
               <span>{{examData.full_score_rate}}%，</span>
               <count-to :startVal="0"
                  :endVal="examData.full_score_count"
                  :duration="1500"
                  v-if="examData.full_score_count >= 0">
                </count-to><span>人</span>
              </h3>
            </div>
          </vh-col>
        </vh-row>
        <vh-row type="flex" class="row-bg" justify="space-around">
          <vh-col :span="7">
            <div class="grid-content">
              <span>最高分</span>
              <h3 class="custom-font-barlow">
                {{examData.max_score}}
              </h3>
            </div>
          </vh-col>
          <vh-col :span="7">
            <div class="grid-content">
              <span>最低分</span>
              <h3 class="custom-font-barlow">
                {{examData.min_score}}
              </h3>
            </div>
          </vh-col>
          <vh-col :span="10">
            <div class="grid-content">
              <span>平均分</span>
              <vh-tooltip effect="dark" placement="right" v-tooltipMove>
                <div slot="content">
                  本次答题的总分数 / 答题人数
                </div>
                <i class="iconfont-v3 saasicon_help_m"></i>
              </vh-tooltip>
              <h3 class="custom-font-barlow">
                {{examData.avg_score}}
              </h3>
            </div>
          </vh-col>
        </vh-row>
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
          <VhallInput placeholder="请输入用户姓名" v-model="query.user_name"
            clearable
            @clear="initQueryList"
            class="search-query"
            @input="checkoutList"
            v-clearEmoij
            @keyup.enter.native="initQueryList">
            <i class="el-icon-search el-input__icon" slot="prefix" @click="initQueryList"></i>
          </VhallInput>
          <vh-select placeholder="全部数据" round v-model="query.status" @change="initQueryList" style="width:102px">
            <vh-option value="">全部数据</vh-option>
            <vh-option
              v-for="item in [{
                label: '有效数据',
                value: '1'
              }, {
                label: '无效数据',
                value: '0'
              }]"
              :key="'data_' + item.label"
              :label="item.label"
              :value="item.value">
            </vh-option>
          </vh-select>
          <vh-button type="info" ghost @click="downloadHandle" size="medium" borderRadius="50">导出全部数据</vh-button>
        </div>
        <!-- 表格与分页 -->
        <div class="tab-content">
          <vh-table ref="tableList" :data="resultVo.list"
            tooltip-effect="dark"
            style="width: 100%"
            :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
          >
            <vh-table-column
              align="left"
              v-for="(item, index) in tableColumns"
              :key="index"
              :width="item.width"
              :label="item.label"
              :show-overflow-tooltip="!item.customTooltip"
            >
              <template slot-scope="scope">
                <div class="icon-status" v-if="item.key === 'is_initiative'">
                  {{ scope.row.is_initiative == 1 ? '是' : '否' }}
                </div>
                <div class="icon-status" v-else-if="item.key === 'use_time'">
                  {{ scope.row.use_time }} <!-- 转换时间 -->
                </div>
                <div class="icon-status" v-else-if="item.key === 'user_name'">
                  {{ scope.row.user_name }} <!-- 配合头像 -->
                </div>
                <span v-else>{{ scope.row[item.key] || '-' }}</span>
              </template>
            </vh-table-column>
            <vh-table-column
              label="操作"
              align="left"
              class="btn-rows"
              fixed="right"
              width="210">
              <template slot-scope="scope">
                <vh-button borderRadius="4" type="text" plain size="mini" class="zdy-theme-gray" @click="openScoreDialog(scope.row)">查看成绩</vh-button>
                <vh-button borderRadius="4" type="text" plain size="mini" class="zdy-theme-gray" @click="editDataStatus(scope.row)" v-if="scope.row.status > 0">标记无效</vh-button>
                <vh-button borderRadius="4" type="text" plain size="mini" class="zdy-theme-gray" @click="resetExamStatus(scope.row)" v-else>还原数据</vh-button>
              </template>
            </vh-table-column>
            <div slot="empty"></div>
          </vh-table>
          <null-page :nullType="'nullData'" :height=52 v-if="resultVo.total<=0" :text="'暂未搜索到您想要的内容'"></null-page>
        </div>
        <SPagination
          :total="resultVo.total"
          :currentPage="query.pageNumber"
          @current-change="currentChangeHandler"
          align="center"
          v-if="resultVo.total > query.limit">
        </SPagination>
      </div>
    </div>
    <!-- 个人成绩单 -->
    <vh-dialog width="800px"
      title="成绩单"
      :visible.sync="transcriptVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      append-to-body>
      <transcript ref="transition" :select="currentRow" v-if="transcriptVisible"></transcript>
    </vh-dialog>
  </div>
</template>
<script>
import NullPage from '@/views/PlatformModule/Error/nullPage';
import CountTo from 'vue-count-to';
import Transcript from '@/components/Transcript'
export default {
  data() {
    return {
      vm: null,
      loading: false,
      examData: {
        title: '', // 快问快答名称
        check_num: 0, // 查看人数
        answer_num: 0, // 答题人数
        full_score_rate: 0, // 满分率
        full_score_count: 0, // 总人数
        max_score: 0, // 最高分
        min_score: 0, // 最低分
        avg_score: 0 // 平均分
      },
      query: {
        status: '',
        user_name: '',
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
          key: 'rank_no',
          width: 'auto'
        },
        {
          label: '参会ID',
          key: 'join_id',
          width: 'auto'
        },
        {
          label: '姓名',
          key: 'user_name',
          width: 'auto',
          customTooltip: true
        },
        {
          label: '手机号',
          key: 'mobile',
          width: 'auto'
        },
        {
          label: '得分',
          key: 'score',
          width: 'auto'
        },
        {
          label: '正确率',
          key: 'right_rate',
          width: 'auto'
        },
        {
          label: '用时',
          key: 'use_time',
          width: 'auto'
        },
        {
          label: '主动交卷',
          key: 'is_initiative',
          width: 'auto'
        }
      ],
      transcriptVisible: false, // 个人成绩单
      currentRow: null,
    };
  },
  computed: {
    isNullData() {
      return false;
    }
  },
  components: {
    CountTo,
    NullPage,
    Transcript
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
      let params = {
        paper_id: this.$route.query.paper_id
      }
      this.$fetch('getExamSummaryData', this.$params(params)).then(res =>{
        this.examData = res.data;
      }).catch(e=>{
        console.log(e);
      }).finally(()=>{
      });
    },
    // 页码改变按钮事件
    currentChangeHandler(current) {
      this.query.pageNumber = current;
      this.query.pos = parseInt((current - 1) * this.query.limit);
      this.getExamScoreList();
    },
    // 查询成绩排名
    getExamScoreList() {
      let params = {
        paper_id: this.$route.query.paperId,
        pos: this.query.pos,
        limit: this.query.limit,
        user_name: this.query.user_name,
        status: this.query.status,
        is_hidden: 0 // 是否雾化用户名 0.否 1.是
      };
      this.loading = true;
      this.$fetch('getExamScoreList', this.$params(params)).then(res => {
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
        if(this.$refs.tableList) {
          this.$refs.tableList.pageInfo.pageNum = 1;
          this.$refs.tableList.pageInfo.pos = 0;
        }
      } catch (e) {
        console.log(e);
      }
      this.getExamScoreList();
    },
    // 导出
    downloadHandle() {
      this.$fetch('exportExamRank', this.$params({
        paper_id: this.$route.query.paperId,
        webinar_id: this.$route.params.str
      })).then(res => {
        this.$message({
          message: `导出成功，请去下载中心下载`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.$EventBus.$emit('saas_vs_download_change');
      }).catch(res => {
        this.$message({
          message: res.msg || `导出失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    },
    // 查看成绩
    openScoreDialog(row) {
      this.transcriptVisible = true
      // 拼接查看要的ID
      row.room_id = this.$route.query.room_id
      row.webinar_id = this.$route.query.webinar_id
      this.currentRow = row
    },
    // 标记无效
    editDataStatus(rows) {
      this.$confirm('「标记无效」后，当前数据默认不计入统计分析和成绩排名中，确定标为无效数据？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.$fetch('editExamStatus', {
          paper_id: this.$route.query.paperId,
          join_id: rows.join_id,
          status: 0
        }).then(res => {
          if (res.data?.is_success == 1) {
            this.messageInfo('标记成功', 'success')
            this.initQueryList();
          } else {
            this.messageInfo(res.msg || '标记失败', 'error')
          }
        }).catch(e => {
          this.messageInfo(res.msg || '标记失败', 'error')
        })
      }).catch(() => {
      });
    },
    // 还原数据
    resetExamStatus(rows) {
      this.$confirm('「还原数据」后，当前数据重新计入统计分析和成绩排名中，确定进行还原？', '提示', {
        cancelButtonText: '取消',
        confirmButtonText: '确定',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.$fetch('editExamStatus', {
          paper_id: this.$route.query.paperId,
          join_id: rows.join_id,
          status: 1
        }).then(res => {
          if (res.data?.is_success == 1) {
            this.messageInfo('还原成功', 'success')
            this.initQueryList();
          } else {
            this.messageInfo(res.msg || '还原失败', 'error')
          }
        }).catch(res => {
          this.messageInfo(res.msg || '还原失败', 'error')
        })
      }).catch(() => {
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
    padding: 24px 32px 40px 32px;
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
      .vh-select {
        width: 100px;
        margin-right: 20px;
        .vh-input__inner {
          user-select: none;
          border-radius: 50px;
          font-size: 14px;
          color: #666666;
          height: 36px;
          line-height: 36px;
        }
        .vh-select__caret.vh-input__icon.vh-icon-arrow-up{
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
    .pageBox {
      margin-top: 32px;
    }
    // 表格
    .el-table__row {
      /deep/.el-input-group {
        width: 130px;
      }
    }
    /deep/.vh-table__empty-block {
      min-height: 0;
    }
    /deep/.vh-button--text.zdy-theme-red {
      color: #FB2626;
      &:hover {
        color: #D4151C;
      }
    }
    /deep/.vh-button--text.zdy-theme-gray {
      color: rgba(0, 0, 0, 0.65) !important;
      &:hover {
        color: rgba(0, 0, 0, 0.85) !important;
      }
    }
  }
}
</style>
