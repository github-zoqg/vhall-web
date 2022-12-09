<template>
  <div class="select-video">
    <el-dialog
      title="选择音视频"
      @closed="closeHandler"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :before-close="handleClose"
      width="800px"
    >
      <div class="search" v-show="total || isSearch">
        <VhallInput
          placeholder="请输入音视频名称"
          v-model="keyWords"
          v-clearEmoij
          @keyup.enter.native="searchHandler"
          clearable
          @clear="searchHandler"
        >
          <i class="el-icon-search el-input__icon" @click="searchHandler" slot="suffix"></i>
        </VhallInput>
        <!-- <i class="iconfont-v3 saasicon_help_m"></i> -->
        <span class="select-video_tip" v-if="isWarmVideo">直播下最多支持添加10个暖场视频</span>
        <span class="select-video_tip" v-else>为不影响观看，建议文件分辨率在1280*720p及以下</span>
        <el-button type="primary" @click="uploadHandler" round size="medium">上传</el-button>
      </div>
      <div v-if="total || isSearch" style="min-height: 300px">
        <el-table
          ref="docList"
          :data="docList"
          tooltip-effect="dark"
          style="width: 100%"
          max-height="300"
          v-loadMore="moreLoadData"
          @select="handleSelection"
          @select-all="handleAllSelection"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column show-overflow-tooltip label="音视频名称">
            <template slot-scope="scope">
              <span class="mediaName">
                <i
                  class="iconfont-v3 saasyinpinwenjian"
                  v-if="scope.row.msg_url == '.MP3' || scope.row.msg_url == '.MAV'"
                ></i>
                <i class="iconfont-v3 saasshipinwenjian" v-else></i>
                {{ scope.row.name }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="上传日期" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.created_at.substring(0, 16) }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="时长"
            prop="duration"
            width="90"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column label="进度" width="110" show-overflow-tooltip>
            <template slot-scope="scope">
              <span
                class="statusTag"
                :class="scope.row.transcode_status == 1 ? 'success' : 'failer'"
              >
                {{ scope.row.transcode_status_text }}
              </span>
              <!-- <el-progress v-if="scope.row.status=='transcoding'" color="#14BA6A" :percentage="scope.row.process" :stroke-width="8" :width="100"></el-progress>
            <span v-else :class="[scope.row.status, 'statusTag']">{{scope.row.status | statusStr}}</span> -->
            </template>
          </el-table-column>

          <el-table-column
            v-if="isWarmVideo"
            label="转码后大小"
            prop="storage"
            width="100"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column label="操作" width="70" align="left" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-button
                type="text"
                class="actionBtn"
                @click="preVidio(scope.row)"
                v-if="scope.row.transcode_status == 1"
              >
                预览
              </el-button>
            </template>
          </el-table-column>
          <div slot="empty"><noData :nullType="'search'" v-if="!total" :height="50"></noData></div>
        </el-table>
      </div>
      <div class="no-live" v-else>
        <noData :nullType="'nullData'" text="您还未上传过音视频，快来创建吧！" :height="0">
          <el-button type="primary" @click="uploadHandler" round size="medium">上传</el-button>
        </noData>
      </div>
      <div slot="footer" class="dialog-footer" v-show="total || isSearch">
        <div>
          <p v-show="!isVodVideo">
            当前选择
            <b>{{ isWarmVideo ? totalWarmSelect.length : tableSelect.length }}</b>
            个文件
          </p>
        </div>
        <span>
          <el-button
            type="primary"
            @click="handlerConfirm"
            :disabled="isWarmVideo ? !totalWarmSelect.length : !tableSelect.length"
            round
            size="medium"
            v-preventReClick
          >
            确定
          </el-button>
          <el-button @click="closeDialog" round size="medium">取消</el-button>
        </span>
      </div>
    </el-dialog>
    <template v-if="showDialog">
      <el-dialog
        class="vh-saas-dialog"
        title=""
        :visible.sync="showDialog"
        width="30%"
        center
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <video-preview ref="videoPreview" :videoParam="videoParam"></video-preview>
      </el-dialog>
    </template>
  </div>
</template>

<script>
  import VideoPreview from '../MaterialModule/VideoPreview/index.vue';
  import noData from '@/views/PlatformModule/Error/nullPage';
  export default {
    props: {
      videoSize: {
        type: String,
        default: ''
      },
      videoType: {
        type: String,
        default: ''
      },
      selectedList: {
        type: Array,
        default: () => []
      },
      isWarmVideo: {
        type: Boolean,
        default: false
      },
      isVodVideo: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        showDialog: false,
        videoParam: {},
        docList: [],
        total: 0,
        isSearch: false, //是否是搜索
        pageInfo: {
          pos: 0,
          limit: 6,
          pageNum: 1
        },
        totalPages: 0,
        totalWarmSelect: [],
        tableSelect: [],
        keyWords: ''
      };
    },
    components: {
      VideoPreview,
      noData
    },
    watch: {
      dialogVisible() {
        //获取资料中心的音视频
        if (this.dialogVisible) {
          this.tableSelect = [];
          this.docList = [];
          this.pageInfo.pageNum = 1;
          this.pageInfo.pos = 0;
          this.getMediaList();
          if (this.isWarmVideo) {
            this.totalWarmSelect = JSON.parse(JSON.stringify(this.selectedList || []));
          }
        } else {
          this.keyWords = '';
          this.pageInfo.pageNum = 1;
          this.pageInfo.pos = 0;
          this.totalWarmSelect = [];
          if (this.docList.length) {
            this.$refs.docList.clearSelection();
          }
        }
      }
    },
    methods: {
      //字数截断显示省略号
      fontNumber(date) {
        const length = date.length;
        const format = date.substring(date.length - 4, date.length);
        if (length > 13) {
          var str = '';
          str = date.substring(0, 13) + '...' + format;
          return str;
        } else {
          return date;
        }
      },
      closeDialog() {
        if (this.docList.length) {
          this.$refs.docList.clearSelection();
        }
        this.dialogVisible = false;
        this.totalWarmSelect = [];
        this.pageInfo.pageNum = 1;
        this.pageInfo.pos = 0;
      },
      handleClose(done) {
        if (this.docList.length) {
          this.$refs.docList.clearSelection();
        }
        this.dialogVisible = false;
        this.totalWarmSelect = [];
        this.pageInfo.pageNum = 1;
        this.pageInfo.pos = 0;
        done();
      },
      moreLoadData() {
        if (this.pageInfo.pageNum >= this.totalPages) {
          return false;
        }
        this.pageInfo.pageNum++;
        this.pageInfo.pos = parseInt((this.pageInfo.pageNum - 1) * this.pageInfo.limit);
        this.getMediaList();
      },
      getMediaList() {
        let params = {
          title: this.keyWords,
          storage: this.videoSize,
          file_type: this.videoType,
          get_no_trans: 1,
          ...this.pageInfo
        };
        this.$fetch('dataVideoList', this.$params(params)).then(res => {
          if (res.code == 200) {
            // 转码状态:0新增排队中 1转码成功 2转码失败 3转码中
            res.data.list.forEach(ele => {
              switch (ele.transcode_status) {
                case '0':
                  ele.transcode_status_text = '新增排队中';
                  ele.duration = '——';
                  break;
                case '1':
                  ele.transcode_status_text = '转码成功';
                  break;
                case '2':
                  ele.transcode_status_text = '转码失败';
                  ele.duration = '——';
                  break;
                case '3':
                  ele.transcode_status_text = '转码中';
                  ele.duration = '——';
                  break;
                default:
                  ele.transcode_status_text = '新增排队中';
                  ele.duration = '——';
                  break;
              }
            });
            this.docList.push(...res.data.list);
            this.total = res.data.total;
            this.totalPages = Math.ceil(res.data.total / this.pageInfo.limit);
            this.isSearch = this.keyWords ? true : false;
            if (this.isWarmVideo && this.docList.length) {
              this.selectedDefaultList();
            }
          }
        });
      },
      // 默认选中
      selectedDefaultList() {
        this.$nextTick(() => {
          if (this.totalWarmSelect.length) {
            let selectedList = [];
            selectedList = this.totalWarmSelect.map(item => {
              return item.paas_record_id;
            });
            // 如果返回的列表已经选过，就默认选中
            this.docList.forEach(item => {
              if (selectedList.includes(item.paas_record_id)) {
                this.$nextTick(() => {
                  this.$refs.docList.toggleRowSelection(item, true);
                });
              }
            });
          }
        });
      },
      preVidio(rows) {
        this.videoParam = rows;
        this.showDialog = true;
        console.log(rows);
      },
      // 单选
      handleSelection(val, item) {
        if (!this.isWarmVideo || this.selectedList.length == 0) return;
        // 如果是暖场视频并且已经选过暖场视频，才走下面的选中逻辑
        console.log(this.selectedList, item);
        let selectedList = [];
        selectedList = this.totalWarmSelect.map(item => {
          return item.paas_record_id;
        });
        if (selectedList.includes(item.paas_record_id)) {
          // 如果列表存在这个选择的项，就证明取消了选择， 就过滤掉这个
          this.totalWarmSelect = this.totalWarmSelect.filter(
            items => items.paas_record_id != item.paas_record_id
          );
        } else {
          // 如果列表不存在这个选择的项，就证明是新增了
          this.totalWarmSelect.push(item);
        }
      },
      // 全选和取消全选
      handleAllSelection(val) {
        if (!this.isWarmVideo || this.selectedList.length == 0) return;
        // 如果是暖场视频并且已经选过暖场视频，才走下面的选中逻辑
        let selectedList = [];
        selectedList = this.totalWarmSelect.map(item => {
          return item.paas_record_id;
        });
        if (val.length) {
          //如果存在长度，就是全选，然后把列表不存在的都加上
          this.docList.forEach(item => {
            if (!selectedList.includes(item.paas_record_id)) {
              this.totalWarmSelect.push(item);
            }
          });
        } else {
          // 如果不存在长度，就是全都不选，把音视频列表所有的数据去过滤了，只留不存在视频列表的数据
          this.docList.forEach(item => {
            if (selectedList.includes(item.paas_record_id)) {
              this.totalWarmSelect = this.totalWarmSelect.filter(
                items => items.paas_record_id != item.paas_record_id
              );
            }
          });
        }
      },
      // 选择框变化
      handleSelectionChange(val) {
        this.tableSelect = val;
        if (this.isVodVideo) {
          // 如果是点播或者定时直播、默认只能选择一个
          this.docList.forEach(item => {
            if (val.length !== 0) {
              if (item.paas_record_id !== val[[val.length - 1]].paas_record_id) {
                this.$refs.docList.toggleRowSelection(item, false);
              }
            }
          });
        }
        // 如果暖场视频一个视频都没选择过，选择框变化就是选中的数据
        if (this.isWarmVideo && this.selectedList.length == 0) {
          this.totalWarmSelect = val;
        }
      },
      handlerConfirm() {
        // if (this.tableSelect[0].transcode_status != 1) {
        //   this.$message({
        //     message: "只能选择已经转码成功的视频",
        //     showClose: true,
        //     // duration: 0,
        //     type: 'error',
        //     customClass: 'zdy-info-box'
        //   });
        //   return;
        // }
        if (this.isWarmVideo) {
          if (this.totalWarmSelect.length > 10) {
            this.$message.warning('最多添加10个暖场视频');
            return;
          }
          this.$emit('selected', this.totalWarmSelect);
        } else {
          if (this.isVodVideo) {
            // 如果是点播或者定时直播、默认只能选择第一个
            this.$emit('selected', this.tableSelect[0]);
          } else {
            let tableList = [];
            this.tableSelect.map(item => {
              tableList.push(item.id);
            });
            // 如果是插播、只要id
            this.$emit('selected', tableList);
          }
        }
        this.dialogVisible = false;
      },
      closeHandler() {
        // clearSelection
        // this.tableSelect
      },
      searchHandler() {
        this.pageInfo.pageNum = 1;
        this.pageInfo.pos = 0;
        this.docList = [];
        this.getMediaList();
      },
      uploadHandler() {
        this.$confirm('上传资源会离开当前页面，将丢失已编辑信息，是否离开？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        })
          .then(() => {
            this.$parent.isChange = false;
            this.$parent.warmFlag = false;
            this.$emit('closeWarm');
            this.$router.push({ path: '/material/video' });
          })
          .catch(() => {});
      }
    },
    filters: {
      statusStr(val) {
        let str = '';
        switch (val) {
          case 'wating':
            str = '等待转码';
            break;

          case 'success':
            str = '转码成功';
            break;

          case 'failer':
            str = '等待失败';
            break;

          default:
            str = val;
            break;
        }
        return str;
      }
    }
  };
</script>
<style lang="less">
  .el-tooltip__popper {
    max-width: 280px;
    line-height: 17px;
  }
</style>
<style lang="less" scoped>
  @red: #fb3a32;
  @redBg: #ffebeb;
  .select-video {
    max-width: 800px;
    .el-dialog {
      max-width: 800px;
    }
    /deep/.el-dialog__body {
      padding: 0 24px;
    }
    /deep/.el-table__header {
      th {
        background: #f7f7f7;
      }
      width: 100%;
    }
    /deep/.el-table .cell {
      padding-left: 16px;
    }
    /deep/ .el-table__body .el-table__row td:nth-child(2) .cell {
      padding-left: 2px;
    }
    /deep/ thead tr th:nth-child(2) .cell {
      padding-left: 2px;
    }
  }
  .saasicon_help_m {
    padding-left: 5px;
    font-size: 15px;
    color: #999;
  }
  .select-video_tip {
    color: #999;
    padding-left: 5px;
    font-size: 14px;
    vertical-align: text-top;
  }
  .statusTag {
    &::before {
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
    }
    &.wating::before {
      background: #fa9a32;
    }
    &.success::before {
      background: #14ba6a;
    }
    &.failer::before {
      background: #fb3a32;
    }
  }
  .mediaName {
    font-size: 14px;
    color: #1a1a1a;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .iconfont-v3 {
      font-size: 20px;
      margin-top: -3px;
    }
    .saasyinpinwenjian {
      color: #10d3a8;
      // padding-right: 2px;
    }
    .saasshipinwenjian {
      color: #ff733c;
      // padding-right: 2px;
    }
    i {
      display: inline-block;
      width: 20px;
      height: 20px;
      // background: #10D3A8;
      border-radius: 4px;
      // margin-right: 12px;
      vertical-align: middle;
    }
  }
  .el-button--text.actionBtn {
    color: #1a1a1a;
    &:hover {
      color: #fb3a32;
    }
  }
  .search {
    margin-bottom: 16px;
    .el-input {
      width: 220px;
      /deep/ .el-input__inner {
        height: 36px;
        border-radius: 20px;
        padding-right: 50px;
      }
      .el-input__suffix {
        i {
          line-height: 36px;
        }
      }
    }
    .el-button {
      float: right;
    }
  }
  .vh-saas-dialog {
    /deep/ .el-dialog {
      width: 624px !important;
      background: transparent !important;
      border: none;
      box-shadow: none;
    }
    /deep/ .el-dialog__header {
      width: 642px !important;
      padding: 0px;
      height: 55px;
      background: transparent !important;
      border: none;
      color: #fff;
    }
    /deep/ .el-dialog__headerbtn {
      top: 30px;
      right: -18px;
      .el-dialog__close {
        color: #fff;
      }
    }
    /deep/ .el-dialog__body {
      width: 642px;
      height: 361px;
      border-top: 4px solid #000;
      border-bottom: 4px solid #000;
      background: #000;
      border-radius: 4px;
      padding: 0 4px;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: space-between;
    p {
      font-size: 14px;
      color: #666;
      line-height: 36px;
      b {
        color: #fb3a32;
        font-weight: normal;
      }
    }
  }
  /*  /deep/ .el-table__header{
    th{
      background: #F7F7F7;
    }
  } */
</style>
