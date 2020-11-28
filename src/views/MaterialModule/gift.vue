<template>
  <div class="gift-wrap">
    <pageTitle title="礼物管理">
      <div slot="content">
        1.支持自定义创建35个礼物, 支持创建免费礼物
        <br>
        2.为保证显示效果, 图片尺寸160*160, 文件大小不超过200k,格式jpg、gif、png
        <br>
        3.礼物名称不支持特殊字符、表情
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
        @onSearchFun="searchName('search')"
        >
      </search-area>
    </div>
    <el-card class="gift-list">
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        ref="multipleTable"
        :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
        @selection-change="handleSelectionChange">
        <el-table-column
          :reserve-selection="true"
          type="selection"
          width="55"
          align="left"
        />
        <!-- <el-table-column width="55">
          <template slot-scope="scope">
            <span class="check-box-row">
              <el-checkbox v-model="scope.row.isChecked" @change="selectCheck(scope.$index)"></el-checkbox>
            </span>
          </template>
        </el-table-column> -->
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img class="gift-cover" :src="scope.row.img">
            <!--TODO:-->
            <!-- <img class="gift-cover" :src="defaultImgHost + scope.row.img"> -->
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="价格" prop="price" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" v-if="scope.row.source_status == 1">
            <el-button class="btns" type="text" @click="handleEditAward(scope.row)">编辑</el-button>
            <el-button class="btns" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- <table-list
        ref="tableList"
        :manageTableData="tableData"
        :tabelColumnLabel="tabelColumn"
        :tableRowBtnFun="tableRowBtnFun"
        :totalNum="total"
        @onHandleBtnClick='onHandleBtnClick'
        @getTableList="getTableList"
        @changeTableCheckbox="changeTableCheckbox">
      </table-list> -->
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
      <el-button type="primary" @click="dialogVisible = false" round>确 定</el-button>
      <el-button @click="dialogVisible = false" round>取 消</el-button>
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
      tableData: [ // TODO:
        {
          gift_id: 1,
          name: '请输入000',
          price: '99.99',
          img: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          source_status: '1'
        },
        {
          gift_id: 2,
          name: '请输入111',
          price: '99.99',
          img: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          source_status: '0'
        },
        {
          gift_id: 3,
          name: '请输入111',
          price: '99.99',
          img: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          source_status: '0'
        },
        {
          gift_id: 4,
          name: '请输入111',
          price: '99.99',
          img: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          source_status: '0'
        },
        {
          gift_id: 5,
          name: '请输入111',
          price: '99.99',
          img: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          source_status: '0'
        },
        {
          gift_id: 61,
          name: '请输入111',
          price: '99.99',
          img: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          source_status: '0'
        }
      ],
      searchParams: {
        gift_name: '',
        page_size: 10,
        page: 1
      },
      selectIds:[],
      defaultImgHost: process.env.upload + '/'
    };
  },
  components: {
    PageTitle,
    upload
  },
  created() {
    // this.getTableList()
  },
  methods: {
    // 获取礼物劣列表
    getTableList () {
      this.$fetch(shareGiftList, {
        ...this.searchParams
      }).then((res) => {
        if (res.code == 200 && res.data) {
          this.tableData = res.data.list
        }
      })
    },
    // 处理批量操作
    handleSelectionChange (val) {
      let ids = []
      val.length > 0 && val.forEach((item, index) => {
        ids.push(item.gift_id)
      })
      this.selectIds = ids
      // this.$refs.multipleTable.clearSelection()
    },
    handleEnterGiftName () {

    },
    searchName (val) {
      console.log(1111, this.searchAreaLayout[0], val)
    },

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
.gift-wrap{
  height: 100%;
  width: 100%;
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
  .gift-list{
    width: 100%;
    /deep/.el-table{
      .gift-cover{
        display: inline-block;
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
