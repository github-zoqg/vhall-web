<template>
<div>
  <el-dialog
    title="选择音视频"
    @closed="closeHandler"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="880px">
    <div class="search">
      <el-input placeholder="请输入音视频名称" v-model="keyWords">
        <i class="el-icon-search el-input__icon"
          slot="suffix"
          @click="searchHandler">
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
      v-loadMore="moreLoadData"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="音视频名称">
          <template slot-scope="scope">
            <span class="mediaName">
              <!-- <i></i> -->
              {{scope.row.name}}
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
        width="150"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        label="进度"
        width="180"
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
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handlerConfirm" :disabled="!tableSelect.length" round size="medium">确定</el-button>
      <el-button @click="dialogVisible = false" round size="medium">取消</el-button>
    </span>
  </el-dialog>
  <template v-if="showDialog">
    <el-dialog class="vh-dialog" title="预览" :visible.sync="showDialog" width="30%" center>
      <video-preview ref="videoPreview" :videoParam='videoParam'></video-preview>
    </el-dialog>
  </template>
</div>
</template>

<script>
import VideoPreview from '../MaterialModule/VideoPreview/index.vue';
export default {
  props: ['videoSize', 'videoType'],
  data(){
    return {
      dialogVisible: false,
      showDialog: false,
      videoParam: {},
      docList: [],
      pageInfo: {
        pos: 0,
        limit: 5,
        pageNum: 1
      },
      totalPages: 0,
      tableSelect: [],
      keyWords:''
    };
  },
  components: {
    VideoPreview
  },
  watch: {
    dialogVisible() {
      //获取资料中心的音视频
      if (this.dialogVisible) {
        this.tableSelect = [];
        this.docList = [];
        this.getMediaList();
      }
    }
  },
  methods: {
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
          this.totalPages = Math.ceil(res.data.total / this.pageInfo.limit);
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
      this.pageInfo = {
        pageNum: 1,
        pos: 0,
        limit: this.pageInfo.limit
      }
      this.docList = [];
      this.getMediaList();
    },
    uploadHandler(){
      this.$confirm('上传资源会离开当前页面，将丢失已编辑信息，是否离开？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box'
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
