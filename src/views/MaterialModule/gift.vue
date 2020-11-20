<template>
  <div class="question-wrap">
    <pageTitle title="礼物">
      <div slot="content">
        1.上传单个文件最大2G，文件标题不能带有特殊字符和空格
        <br>
        2.上蔟韩视频格式支持RMVB、MP4、AVI、WMV、MKV、FLV、MOV；上传音频格式支持MP3、WAV
        <br>
        3.上传的视频，不支持剪辑和下载
      </div>
    </pageTitle>
    <div class="head-operat">
      <el-button type="primary" round class="head-btn set-upload" @click="addGift">新建礼物</el-button>
      <el-button round class="head-btn set-upload">批量删除</el-button>
      <search-area class="head-btn fr search"
        ref="searchArea"
        :placeholder="'请输入礼物名称'"
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
    <el-dialog
    title="新建礼物"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="468px">
    <el-form :model="formData" ref="ruleForm">
      <el-form-item label="图片上传">
        <upload
          class="giftUpload"
          v-model="imageUrl"
          :on-success="handleuploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          :before-upload="beforeUploadHnadler">
          <p slot="tip">推荐尺寸：160*160px，小于2MB<br/> 支持jpg、gif、png、bmp</p>
        </upload>
      </el-form-item>
       <el-form-item label="礼物名称">
          <el-input v-model="formData.title" maxlength="10" show-word-limit style="width:336px"></el-input>
      </el-form-item>
       <el-form-item label="礼物价格">
          <el-input v-model="formData.title" maxlength="10" show-word-limit prefix-icon="el-icon-meney" style="width:336px"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false" round size="medium">确 定</el-button>
      <el-button @click="dialogVisible = false" round size="medium">取 消</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
export default {
  name: "prize",
  data() {
    return {
      dialogVisible: false,
      formData: {},
      imageUrl: '',
      total: 100,
      searchAreaLayout: [
        {
          questionName: ''
        }
      ],
      tabelColumn: [
        {
          label: '礼物图片',
          key: 'img',
        },
        {
          label: '奖品名称',
          key: 'name',
        },
        {
          label: '价格',
          key: 'price',
        },
        {
          label: '显示',
          key: 'watch',
        }
      ],
      tableRowBtnFun: [
       {name:'编辑', methodName: 'edit'},{name:'删除', methodName: 'del'}
      ],
      tableData: [
        {
          watch: false,
          name: '请输入000',
          price: '99.99',
          img: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        },
        {
          watch: true,
          name: '请输入111',
          price: '99.99',
          img: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100'
        }
      ]
    };
  },
  components: {
    PageTitle,
    upload
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
    // 新建礼物
    addGift() {
      this.dialogVisible = true;
    }
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
  /deep/.el-upload--picture-card{
    width:83%;
  }
  .head-operat{
    margin-bottom: 20px;
    .head-btn{
      display: inline-block;
      border-radius: 20px;
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
