<template>
  <div class="question-wrap">
    <pageTitle title="奖品">
      <div slot="content">
        1.上传单个文件最大2G，文件标题不能带有特殊字符和空格
        <br>
        2.上蔟韩视频格式支持RMVB、MP4、AVI、WMV、MKV、FLV、MOV；上传音频格式支持MP3、WAV
        <br>
        3.上传的视频，不支持剪辑和下载
      </div>
    </pageTitle>
    <div class="head-operat">
      <el-button type="primary" round class="head-btn set-upload">新建</el-button>
      <el-button round class="head-btn batch-del">批量删除</el-button>
      <search-area class="head-btn fr search"
        ref="searchArea"
        :isExports='false'
        :searchAreaLayout="searchAreaLayout"
        @onSearchFun="getTableList('search')"
        >
      </search-area>
    </div>
    <el-card class="question-list">
      <table-list ref="tableList" :manageTableData="tableData" :tabelColumnLabel="tabelColumn" :tableRowBtnFun="tableRowBtnFun"
       :totalNum="total" @onHandleBtnClick='onHandleBtnClick' @getTableList="getTableList" @changeTableCheckbox="changeTableCheckbox">
      </table-list>
    </el-card>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  name: "prize",
  data() {
    return {
      total: 100,
      searchAreaLayout: [
        {
          questionName: ''
        }
      ],
      tabelColumn: [
        {
          label: '问卷ID',
          key: 'id',
        },
        {
          label: '奖品图片',
          key: 'img',
        },
        {
          label: '奖品名称',
          key: 'name',
        },
        {
          label: '创建时间',
          key: 'time',
        }
      ],
      tableRowBtnFun: [
        {name:'复制', methodName: 'cope'} ,{name:'编辑', methodName: 'edit'},{name:'删除', methodName: 'del'}
      ],
      tableData: [
        {
          id: '12312413',
          name: '请输入000',
          time: '2020-10-03',
          img: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          id: '1212345',
          name: '请输入111',
          time: '2020-10-12',
          img: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ]
    };
  },
  components: {
    PageTitle
  },
  methods: {
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    getTableList(params) {
      let pageInfo = this.$refs.tableList.pageInfo; //获取分页信息
      let formParams = this.$refs.searchArea.searchParams; //获取搜索参数
      if (params === 'search') {
        pageInfo.pageNum= 1;
        pageInfo.pos= 0;
        // 如果搜索是有选中状态，取消选择
        // this.$refs.tableList.clearSelect();
      }
      let obj = Object.assign({}, pageInfo, formParams);
    },
    // 复制
    cope(that, {rows}) {
      console.log('复制', rows);
    },
    // 编辑
    edit(that, {rows}) {
      console.log('编辑', rows);
    },
    // 删除
    del(that, {rows}) {
      console.log('删除', rows);
    },
    // 选中
    changeTableCheckbox(val) {
      console.log(val);
    },
  },
};
</script>

<style lang="less" scoped>
.question-wrap{
  height: 100%;
  width: 100%;
  .question-list{
    width: 100%;
  }
  /deep/.el-card__body{
    width: 100%;
    padding: 32px 24px;
  }
  .head-operat{
    margin-bottom: 20px;
    .head-btn{
      display: inline-block;
    }
    ::v-deep.set-upload{
      position: relative;
      span{
        input{
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
