<template>
	<div class="download">
    <pageTitle title="下载中心"></pageTitle>
    <div class="download-ctx">
      <el-table
        ref="docList"
        :data="docList"
        tooltip-effect="dark"
        style="width: 100%"
        :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
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
          width="210">
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
          width="260"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button size="mini" type="text">生成</el-button>
            <el-button size="mini" type="text">下载</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  name: "download.vue",
  components: {
    PageTitle
  },
  data() {
    return {
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
    }
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
.download-ctx {
  .layout--right--main;
  .padding41-40;
}
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
.download-ctx {
  /deep/.cell img {
    width: 100px;
    height: 100px;
  }
  /deep/.el-table {
    margin-bottom: 30px;
  }
  /deep/.el-table__header{
    background-color: #FB3A32;
  }
  /deep/.el-table td, .el-table th{
    padding: 10px 0 9px 0;
  }
  .text{
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /deep/.el-button.el-button--text {
    color: #1A1A1A;
    border: 0;
    &:hover{
      color: #FB3A32;
    }
    // /deep/.el-button.text--default {
    //   margin-right: 20px;
    //   color: #999999;
    //   font-size: 14px;
    //   &:last-child {
    //     margin-right: 0;
    //   }
    //   &:hover {
    //     color: #5d81fb;
    //     &:after {
    //       border-bottom: 1px solid #5d81fb;
    //     }
    //   }
    //   &:active {
    //     color: #3157e1;
    //     &:after {
    //       border-bottom: 1px solid #3157e1;
    //     }
    //   }
    //   &:disabled {
    //     color: #9db3fc;
    //     &:after {
    //       border-bottom: 1px solid #9db3fc;
    //     }
    //   }
    // }
  }
  .status-show{
    span{
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 5px;
      margin-top: -3px;
    }
    .active-success {
      background: #14BA6A;
    }
    .active-error {
      background: #FB3A32;
    }
    .active-waiting {
      background: #FA9A32;
    }
  }
}
/deep/.el-button.hide {
  visibility: hidden;
}
</style>
