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
      <el-button
        round
        class="head-btn set-upload"
        :class="{'no-data': tableData.length <= 0}"
        :disabled="tableData.length <= 0"
        @click="dialogTipVisible = true">
        批量删除
      </el-button>
      <el-input
        @keyup.enter.native="searchGifts"
        class="head-btn fr search"
        v-model="searchName"
        placeholder="请输入礼物名称"
        suffix-icon="el-icon-search"/>
    </div>
    <el-card class="gift-list">
      <el-table
        :data="currentTableData"
        tooltip-effect="dark"
        style="width: 100%;margin-bottom: 30px;"
        ref="multipleTable"
        :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55"
          align="left"
        />
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img class="gift-cover" :src="defaultImgHost + scope.row.img">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="价格" prop="price" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" v-if="scope.row.source_status == 1">
            <el-button class="btns" type="text" @click="handleEditGift(scope.row)">编辑</el-button>
            <el-button class="btns" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <SPagination
        :total="total"
        :page-size="10"
        v-show="total > 10"
        :currentPage="searchParams.page"
        @current-change="currentChangeHandler"
        align="center"></SPagination>
    </el-card>
    <el-dialog
      :title="editParams.gift_id ? '编辑礼物' : '新建礼物'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="468px">
      <el-form>
        <el-form-item label="图片上传">
          <upload
            class="giftUpload"
            v-model="editParams.img"
            :on-success="handleuploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :before-upload="beforeUploadHandler">
            <p slot="tip">推荐尺寸：160*160px，小于2MB<br/> 支持jpg、gif、png、bmp</p>
          </upload>
        </el-form-item>
        <el-form-item label="礼物名称">
            <el-input v-model="editParams.name" maxlength="10" show-word-limit style="width:336px" placeholder="请输入礼物名称"></el-input>
        </el-form-item>
        <el-form-item label="礼物价格">
            <el-input v-model="editParams.price" maxlength="10" show-word-limit prefix-icon="el-icon-meney" style="width:336px" placeholder="￥ 请输入0-9999.99"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleUpdateGift" round>确 定</el-button>
        <el-button @click="handleCancelEdit" round>取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      width="400px"
      :visible.sync="dialogTipVisible"
      :close-on-click-modal="false"
      :before-close="handleCancelDelete"
    >
      <span>观众端礼物显示将受到影响, 确认删除?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelDelete">取 消</el-button>
        <el-button type="primary" @click="handleDeleteGift">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle'
import upload from '@/components/Upload/main'
import SPagination from '@/components/Spagination/main'
import Env from "@/api/env";

export default {
  name: "gift",
  data() {
    return {
      total: 0,
      tableData: [],
      currentTableData: [],
      searchParams: {
        gift_name: '',
        page_size: 10,
        page: 1
      },
      selectIds:[],
      defaultImgHost: `http:${Env.staticLinkVo.uploadBaseUrl}`,
      searchName: '',
      editParams: {
        gift_id: '',
        img: '',
        name: '',
        price: ''
      },
      dialogTipVisible: false,
      dialogVisible: false,
      deleteId: ''
    };
  },
  components: {
    PageTitle,
    upload,
    SPagination
  },
  created() {
    this.getTableList()
  },
  methods: {
    searchGifts() {
      this.getTableList(true)
    },
    // 获取礼物列表
    getTableList (isSearch) {
      this.$fetch('shareGiftList', {
        ...this.searchParams
      }).then((res) => {
        if (res.code == 200 && res.data) {
          if (isSearch) {
            const resultData = []
            this.tableData.forEach(item => {
              if(item.name.indexOf(this.searchName) != -1) {
                resultData.push(item)
              }
            })
            this.tableData = resultData
          } else {
            this.tableData = res.data.list
          }
          this.currentTableData = this.tableData.filter((item, index) => {
            return index < (this.searchParams.page * this.searchParams.page_size) && index >= (this.searchParams.page - 1) * this.searchParams.page_size
          })
          this.total = this.tableData.length
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
    // 上传进度
    uploadProcess(event, file, fileList){
      // console.log('uploadProcess', event, file, fileList);
    },
    // 上传礼物封面成功
    handleuploadSuccess(res, file){
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.editParams.img = file_url;
        this.domain_url = domain_url;
      }
    },
    // 上传失败处理
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`封面上传失败`);
    },
    // 上传预览
    uploadPreview(file){
      // console.log('uploadPreview', file);
    },
    // 上传格式校验
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp'];
      const isType = typeList.includes(file.type.toLowerCase());
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传封面图片只能是 ${typeList.join('、')} 格式!`);
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 2MB!');
      }
      return isType && isLt2M;
    },
    // 打开编辑面板
    handleEditGift (data) {
      this.editParams = {
        gift_id: data.gift_id,
        name: data.name,
        price: data.price,
        img: data.img
      }
      this.dialogVisible = true
    },
    // 新建
    addGift () {
      this.editParams = {
        gift_id: '',
        name: '',
        img: '',
        price: ''
      }
      this.dialogVisible = true
    },
    // 处理编辑新建
    handleUpdateGift () {
      if(this.editParams.gift_id) {
        this.handleEdit()
      } else {
        this.handleCreate()
      }
    },
    // 编辑
    handleEdit () {
      this.$fetch('updateGiftInfo', {
        ...this.editParams
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success('编辑成功')
          this.getTableList()
          this.handleCancelEdit()
        }
      }).catch((e) => {
          this.$message.error('编辑失败')
      })
    },
    // 创建
    handleCreate () {
      let price = Number(this.editParams.price)
      if (price) {
        this.editParams.price = price.toFixed(2)
      } else {
        this.$message.error('请输入正确礼物价格')
        return
      }
      this.$fetch('createGiftInfo', this.$params({
        ...this.editParams
      })).then((res) => {
        if (res.code == 200) {
          this.$message.success('创建成功')
          this.getTableList()
          this.handleCancelEdit()
        }
      }).catch((e) => {
          this.$message.error('创建失败')
      })
    },
    // 取消礼品编辑
    handleCancelEdit () {
      this.editParams.gift_id = ''
      this.editParams.name = ''
      this.editParams.img = ''
      this.editParams.price = ''
      this.dialogVisible = false
    },
    // 删除礼品
    handleDelete (data) {
      this.dialogTipVisible = true
      this.selectIds = []
      this.selectIds.push(data.gift_id)
    },
    handleDeleteGift () {
      this.$fetch('deleteGift', {
        gift_id: this.selectIds.join(',')
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success('删除成功')
          this.getTableList()
          this.selectIds = []
          this.dialogTipVisible = false
        }
      }).catch((e) => {
          this.$message.error('创建失败')
      })
    },
    handleCancelDelete () {
      this.dialogTipVisible = false
    },
    // 翻页
    currentChangeHandler (val) {
      this.searchParams.page = val
      this.getTableList()
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
  /deep/.el-upload--picture-card .box img {
    width: auto
  }
  .head-operat{
    margin-bottom: 20px;
    .head-btn{
      display: inline-block;
      border-radius: 20px;
    }
    .no-data{
      color: #b3b3b3;
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
    /deep/.el-input {
      width: 180px;
      height: 36px;
      input{
        border-radius: 18px;
        border: 1px solid #CCC;
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
  /deep/.el-dialog__wrapper {
    .dialog-footer {
      display: inline-block;
      width: 100%;
      .el-button:first-child{
        float: left;
        margin-left: 20px;
      }
      .el-button:last-child{
        float: right;
        margin-right: 20px;
      }
      &:after{
        clear:both;
      }
    }
  }
}
</style>
