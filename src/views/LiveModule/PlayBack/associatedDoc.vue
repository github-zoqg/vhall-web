<template>
  <el-dialog
    title="关联文档"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="810px">
    <div class="tabs">
      <div :class="{active: tabs==1}" @click="tabs=1">1.选择文档</div>
      <div :class="{active: tabs==2}" @click="tabs=2">2.生成章节</div>
    </div>
    <template>
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
          prop="name"
          label="文档名称"></el-table-column>
        <el-table-column
          prop="uploadTime"
          label="上传日期"
          width="170">
        </el-table-column>

        <el-table-column
          label="页数"
          prop="pages"
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
      </el-table>
    </template>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false" round size="medium">下一步</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  data(){
    return {
      dialogVisible: false,
      tabs: 1,
      docList: [
        {
          name: '测试文档1',
          uploadTime: '2020-08-19 12:03:09',
          pages: 92,
          status: 'transcoding',
          process: 50
        },
        {
          name: '测试文档2',
          uploadTime: '2020-08-19 12:03:09',
          pages: 92,
          status: 'wating',
          process: 50
        },
        {
          name: '测试文档3',
          uploadTime: '2020-08-19 12:03:09',
          pages: 92,
          status: 'success',
          process: 50
        },
        {
          name: '测试文档4',
          uploadTime: '2020-08-19 12:03:09',
          pages: 92,
          status: 'failer',
          process: 50
        }
      ],
      tableSelect: []
    };
  },
  methods: {
    handleSelectionChange(val){
      this.tableSelect = val;
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
  .tabs{
    width: 100%;
    overflow: hidden;
    margin: 8px 0 24px 0;
    >div{
      width: 50%;
      float: left;
      border-radius: 4px;
      border: 1px solid #E6E6E6;
      border-radius: 4px 0px 0px 4px;
      line-height: 40px;
      height: 40px;
      text-align: center;
      transition: all .2s linear;
      cursor: pointer;
      &:nth-child(1){
        border-right: 0px none;
      }
      &:nth-child(2){
        border-left: 0px none;
      }
      &.active{
        border: 1px solid @red;
        background: @redBg;
        color: @red;
      }
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
</style>
