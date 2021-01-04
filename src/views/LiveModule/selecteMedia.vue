<template>
<div class="select-video">
  <el-dialog
    title="选择音视频"
    @closed="closeHandler"
    :visible.sync="dialogVisible"
    :close-on-click-modal=false
    :close-on-press-escape=false
    :before-close="handleClose"
    width="880px">
    <div class="search"  v-show="total || isSearch">
      <el-input placeholder="请输入音视频名称" v-model.trim="keyWords" @change="searchHandler" clearable>
        <i class="el-icon-search el-input__icon"
        @click="searchHandler"
          slot="suffix"
        >
        </i>
      </el-input>
      <el-button type="primary" @click="uploadHandler" round size="medium">上传</el-button>
    </div>
    <el-table
      ref="docList"
      :data="docList"
      tooltip-effect="dark"
      style="width: 100%"
      height="300"
      v-show="total"
      v-loadMore="moreLoadData"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
       width="210"
        label="音视频名称">
          <template slot-scope="scope">
            <span class="mediaName">
              <!-- <i></i> -->
              {{fontNumber(scope.row.name)}}
            </span>
          </template>
        </el-table-column>
      <el-table-column
        prop="created_at"
        label="上传日期"
        width="180">
      </el-table-column>

      <el-table-column
        label="时长"
        prop="duration"
        width="120"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        label="进度"
        width="150"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.transcode_status_text }}</span>
          <!-- <el-progress v-if="scope.row.status=='transcoding'" color="#14BA6A" :percentage="scope.row.process" :stroke-width="8" :width="100"></el-progress>
          <span v-else :class="[scope.row.status, 'statusTag']">{{scope.row.status | statusStr}}</span> -->
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="100"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" class="actionBtn" @click="preVidio(scope.row)">预览</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="no-live" v-show="!total">
      <noData :nullType="nullText" :text="text" :height="0">
        <el-button type="primary" v-if="nullText == 'nullData'" @click="uploadHandler" round size="medium">上传</el-button>
      </noData>
    </div>
    <span slot="footer" class="dialog-footer" v-show="total || isSearch">
      <el-button type="primary" @click="handlerConfirm" :disabled="!tableSelect.length" round size="medium" v-preventReClick>确定</el-button>
      <el-button @click="dialogVisible = false" round size="medium">取消</el-button>
    </span>
  </el-dialog>
  <template v-if="showDialog">
    <el-dialog class="vh-dialog" title="预览" :visible.sync="showDialog" width="30%" center
    :close-on-click-modal=false
    :close-on-press-escape=false>
      <video-preview ref="videoPreview" :videoParam='videoParam'></video-preview>
    </el-dialog>
  </template>
</div>
</template>

<script>
import VideoPreview from '../MaterialModule/VideoPreview/index.vue';
import noData from '@/views/PlatformModule/Error/nullPage';
export default {
  props: ['videoSize', 'videoType'],
  data(){
    return {
      dialogVisible: false,
      showDialog: false,
      videoParam: {},
      docList: [],
      total: 0,
      nullText: 'nullData',
      isSearch: false, //是否是搜索
      text: '您还上传过音视频，快来创建吧！',
      pageInfo: {
        pos: 0,
        limit: 6,
        pageNum: 1
      },
      totalPages: 0,
      tableSelect: [],
      keyWords:''
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
        this.getMediaList();
      } else {
        this.keyWords = '';
        this.pageInfo.pageNum = 1;
      }
    }
  },
  methods: {
    //字数截断显示省略号
    fontNumber (date) {
      const length = date.length
      const format = date.substring(date.length-4, date.length)
      if (length > 13) {
        var str = ''
        str = date.substring(0, 13) + '...'+format
        return str
      } else {
        return date
      }
    },
    handleClose(done) {
      this.pageInfo.pageNum = 1;
      done();
    },
    moreLoadData() {
      if (this.pageInfo.pageNum >= this.totalPages) {
        return false;
      }
      this.pageInfo.pageNum ++ ;
      this.pageInfo.pos = parseInt((this.pageInfo.pageNum - 1) * this.pageInfo.limit);
      this.getMediaList();
    },
    getMediaList() {
      let params = {
        title: this.keyWords,
        storage: this.videoSize,
        file_type: this.videoType,
        ...this.pageInfo
      }
      this.$fetch('dataVideoList', this.$params(params)).then(res=>{
        if(res.code == 200){
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
                ele.duration = '——'
                break;
              case '3':
                ele.transcode_status_text = '转码中';
                ele.duration = '——'
                break;
              default:
                ele.transcode_status_text = '新增排队中';
                ele.duration = '——'
                break;
            }
          });
          this.docList.push(...res.data.list);
          this.total = res.data.total;
          this.totalPages = Math.ceil(res.data.total / this.pageInfo.limit);
          if (this.keyWords) {
            this.nullText = 'search';
            this.text = '';
            this.isSearch = true;
          } else {
            this.nullText = 'nullData';
            this.text = '您还上传过音视频，快来创建吧！';
            this.isSearch = false;
          }
        }
      });
    },
    preVidio(rows) {
      this.videoParam = rows;
      this.showDialog = true;
      console.log(rows);
    },
    handleSelectionChange(val){
      this.tableSelect = val;
      this.docList.forEach((item) => {
        if (val.length !== 0) {
          if (item.paas_record_id !== val[[val.length - 1]].paas_record_id) {
            this.$refs.docList.toggleRowSelection(item, false);
          }
        }
      });
    },
    handlerConfirm(){
      if (this.tableSelect[0].transcode_status != 1) {
        this.$message.error('只能选择已经转码成功的视频');
        return;
      }
      this.$emit('selected', this.tableSelect[0]);
      this.dialogVisible = false;
    },
    closeHandler(){
      // clearSelection
      // this.tableSelect
    },
    searchHandler(){
      this.pageInfo.pageNum = 1;
      this.docList = [];
      this.getMediaList();
    },
    uploadHandler(){
      this.$confirm('上传资源会离开当前页面，将丢失已编辑信息，是否离开？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(()=>{
        this.$router.push({path: "/material/video"});
      }).catch(()=>{});
    }
  },
  filters: {
    statusStr(val){
      let str= '';
      switch (val) {
        case 'wating':
          str='等待转码';
          break;

        case 'success':
          str='转码成功';
          break;

        case 'failer':
          str='等待失败';
          break;

        default:
          str=val;
          break;
      }
      return str;
    }
  }
};
</script>

<style lang="less" scoped>
  @red: #FB3A32;
  @redBg: #FFEBEB;
  .select-video {
    max-width: 800px;
    .el-dialog {
      max-width: 800px;
    }
  }
  .statusTag{
    &::before{
      content: '';
      width: 8px;
      height: 8px;
      border-radius: 50%;
      display: inline-block;
      margin-right: 6px;
    }
    &.wating::before{
      background:#FA9A32;
    }
    &.success::before{
      background:#14BA6A;
    }
    &.failer::before{
      background:#FB3A32;
    }
  }
  .mediaName{
    font-size: 14px;
    color: #1A1A1A;
    i{
      display: inline-block;
      width: 20px;
      height: 20px;
      background: #10D3A8;
      border-radius: 4px;
      margin-right: 12px;
      vertical-align: middle;
    }
  }
  .el-button--text.actionBtn{
    color: #1A1A1A;
    &:hover{
      color: #FB3A32;
    }
  }
  .search{
    margin-bottom: 16px;
    .el-input{
      width: 220px;
      /deep/ .el-input__inner{
        height: 36px;
      }
      .el-input__suffix{
        i{
          line-height: 36px;
        }
      }
    }
    .el-button{
      float: right;
    }
  }
  /deep/ .el-table__header{
    th{
      background: #F7F7F7;
    }
  }
</style>
