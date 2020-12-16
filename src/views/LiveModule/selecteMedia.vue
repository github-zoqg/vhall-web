<template>
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
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        label="音视频名称">
          <template slot-scope="scope">
            <span class="mediaName">
              <i></i>
              {{scope.row.name}}
            </span>
          </template>
        </el-table-column>
      <el-table-column
        prop="uploadTime"
        label="上传日期"
        width="170">
      </el-table-column>

      <el-table-column
        label="时长"
        prop="duation"
        width="70"
        show-overflow-tooltip>
      </el-table-column>

      <el-table-column
        label="进度"
        width="180"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-progress v-if="scope.row.status=='transcoding'" color="#14BA6A" :percentage="scope.row.process" :stroke-width="8" :width="100"></el-progress>
          <span v-else :class="[scope.row.status, 'statusTag']">{{scope.row.status | statusStr}}</span>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="60"
        show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" class="actionBtn">预览{{scope.a}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handlerConfirm" :disabled="!tableSelect.length>0" round size="medium">确定</el-button>
      <el-button @click="dialogVisible = false" round size="medium">取消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data(){
    return {
      dialogVisible: false,
      docList: [
        {
          name: '直播历年数据分析报告解析问….mp3',
          uploadTime: '2020-08-19 12:03:09',
          duation: "09:20:59",
          status: 'transcoding',
          process: 50
        },
        {
          name: '东方明珠证实闪电击中塔.flv',
          uploadTime: '2020-08-19 12:03:09',
          duation: "09:20:59",
          status: 'wating',
          process: 50
        },
        {
          name: '直播历年数据分析报告解析问….mp3',
          uploadTime: '2020-08-19 12:03:09',
          duation: "09:20:59",
          status: 'success',
          process: 50
        },
        {
          name: '东方明珠证实闪电击中塔.flv',
          uploadTime: '2020-08-19 12:03:09',
          duation: "09:20:59",
          status: 'transcoding',
          process: 50
        },
      ],
      tableSelect: [],
      keyWords:''
    };
  },
  methods: {
    handleSelectionChange(val){
      this.tableSelect = val;
    },
    handlerConfirm(){
      this.$emit('selected', this.tableSelect[0]);
      this.dialogVisible = false;
    },
    closeHandler(){
      // clearSelection
      // this.tableSelect
    },
    searchHandler(){

    },
    uploadHandler(){
      this.$confirm('上传资源会离开当前页面，将丢失已编辑信息，是否离开？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box'
      }).then(()=>{
        this.$router.push({path: "/material-video"});
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
