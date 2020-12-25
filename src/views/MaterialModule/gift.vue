<template>
  <div class="gift-wrap">
    <pageTitle title="礼物管理">
      <div slot="content">
        1.支持创建免费礼物。观看端最多显示40个礼物<br/>
        2.为保证显示效果，图片尺寸120 *120，文件大小不超过 2MB，格式jpg、gif、png、bmp<br/>
        3.礼物名称不支持特殊字符、表情
      </div>
    </pageTitle>
    <div class="head-operat">
      <el-button type="primary" size="medium" round class="head-btn set-upload" @click="addGift">新建礼物</el-button>
      <el-button
        type="white-primary"
        round
        size="medium"
        :class="{'no-data': selectIds.length <= 0}"
        :disabled="selectIds.length <= 0"
        @click="dialogTipVisible = true">
        批量删除
      </el-button>
      <el-input
        clearable
        @clear="searchGifts"
        @keyup.enter.native="searchGifts"
        class="head-btn fr search"
        v-model.trim="searchName"
        placeholder="请输入礼物名称"
      >
        <i
          style="cursor: pointer;"
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="searchGifts">
        </i>
      </el-input>
    </div>
    <div class="gift-list">
      <el-table
        :cell-class-name="freeFilter"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;margin-bottom: 30px;"
        ref="multipleTable"
        :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
        v-if="total > 0"
        @selection-change="handleSelectionChange">
        <el-table-column
          :selectable="selectHandle"
          type="selection"
          width="55"
          align="left"
        />
        <el-table-column label="图片" width="120px">
          <template slot-scope="scope">
            <div class="gift-cover">
              <img :src="scope.row.img" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="价格" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ `￥${scope.row.price}` }}
          </template>
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
        v-show="total > searchParams.page_size"
        :currentPage="searchParams.page"
        @current-change="currentChangeHandler"
        align="center"></SPagination>
      <null-page text="未搜索到相关内容" nullType="search" v-if="total === 0"></null-page>
    </div>
    <el-dialog
      :title="editParams.gift_id ? '编辑礼物' : '新建礼物'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="468px">
      <el-form label-width="80px" :model="editParams" ref="editParamsForm" :rules="rules">
        <el-form-item label="图片上传" prop="img">
          <upload
            ref="uploadimg"
            :domain_url="domain_url"
            class="giftUpload"
            v-model="editParams.img"
            :on-success="handleuploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            @delete="editParams.img = ''"
            :before-upload="beforeUploadHandler">
            <div slot="tip">
              <p>建议尺寸：120*120px，小于2MB</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
        </el-form-item>
        <el-form-item label="礼物名称" prop="name">
            <el-input v-model.trim="editParams.name" maxlength="10" show-word-limit placeholder="请输入礼物名称"></el-input>
        </el-form-item>
        <el-form-item label="礼物价格" prop="price">
            <el-input v-model.trim="editParams.price" maxlength="10" show-word-limit placeholder="请输入0-9999.99">
              <span style="padding-left: 10px; padding-top: 1px;" slot="prefix">￥</span>
            </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancelEdit" size="medium" round>取 消</el-button>
        <el-button type="primary" v-preventReClick @click="handleUpdateGift"  size="medium" round>确 定</el-button>
      </div>
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
        <el-button @click="handleCancelDelete" v-preventReClick>取 消</el-button>
        <el-button type="primary" @click="handleDeleteGift" v-preventReClick>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle'
import upload from '@/components/Upload/main'
import SPagination from '@/components/Spagination/main'
import { debounce } from "@/utils/utils"
import NullPage from '../PlatformModule/Error/nullPage.vue';

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
      pos: 0,
      selectIds:[],
      defaultImgHost: `http:${Env.staticLinkVo.uploadBaseUrl}`,
      searchName: '',
      editParams: {
        gift_id: '',
        img: '',
        name: '',
        price: ''
      },
      domain_url: '',
      dialogTipVisible: false,
      dialogVisible: false,
      deleteId: '',
      rules: {
        name: [
          { required: true, validator: this.validTitle, trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请选择推广图片', trigger: 'change' }
        ],
        price: [
          { required: true,  message: '请输入礼物价格', trigger: 'blur' }
        ],
      },
    };
  },
  components: {
    PageTitle,
    upload,
    SPagination,
    NullPage
  },
  created() {
    this.getTableList()
  },
  methods: {
    validTitle(rule, value, callback) {
      const reg = /[^\w\u4e00-\u9fa5]/g;
      if (!value) {
        return callback ? callback(new Error('请输入礼物名称')) : false
      } else if (reg.test(value)) {
        return callback ? callback(new Error('请输入正确的礼物名称')) : false
      }else{
        if (callback) {
          callback()
        } else {
          return true
        }
      }
    },
    freeFilter({row}) {
      if(row.source_status == 0){
        return "mycell"
      }
    },
    searchGifts() {
      this.searchParams.page = 1
      this.pos = 0;
      this.getTableList(true)
    },
    selectHandle(row) {
      return !(row.source_status == 0);
    },
    // 获取礼物列表
    getTableList (isSearch) {
      const opts = {
        limit: this.searchParams.page_size,
        pos: this.pos
      }
      this.searchName && (opts.name = this.searchName)
      this.$fetch('shareGiftList', opts).then((res) => {
        if (res.code == 200 && res.data) {
          this.tableData = res.data.list
          // if (isSearch) {
          //   const resultData = []
          //   this.tableData.forEach(item => {
          //     if(item.name.indexOf(this.searchName) != -1) {
          //       resultData.push(item)
          //     }
          //   })
          //   this.tableData = resultData
          // }
          // this.currentTableData = this.tableData.filter((item, index) => {
          //   return index < (this.searchParams.page * this.searchParams.page_size) && index >= (this.searchParams.page - 1) * this.searchParams.page_size
          // })
          this.total = res.data.total
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
        this.$refs.editParamsForm.validateField('img');
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
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`文件格式不支持，请检查图片`);
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 2MB!');
        return false;
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
      this.domain_url = this.editParams.img
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
      this.$refs.editParamsForm.validate((valid) => {
        if (valid) {
          let price = Number(this.editParams.price)
          if (price || price == 0) {
            if (price < 0 || price > 9999.99) {
              this.$message.error('价格必须介于0-9999.99之间')
              return
            }
            price=Math.floor(price*100)/100;
            this.editParams.price = price.toFixed(2)
          } else {
            this.$message.error('请输入正确礼物价格')
            return
          }
          if(this.editParams.gift_id) {
            this.handleEdit()
          } else {
            this.handleCreate()
          }
        }
      });
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
      this.$refs.uploadimg.domainUrl = ''
    },
    // 删除礼品
    handleDelete (data) {
      this.dialogTipVisible = true
      this.selectIds = []
      this.selectIds.push(data.gift_id)
    },
    handleDeleteGift () {
      debounce(() => {
        this.$fetch('deleteGift', {
          gift_ids: this.selectIds.join(',')
        }).then((res) => {
          if (res.code == 200) {
            this.$message.success('删除成功')
            this.getTableList()
            this.selectIds = []
            this.dialogTipVisible = false
          }
        }).catch((e) => {
            this.$message.error('删除失败')
        })
      }, 100)
    },
    handleCancelDelete () {
      this.dialogTipVisible = false
    },
    // 翻页
    currentChangeHandler (val) {
      this.searchParams.page = val;
      this.pos = (val - 1) * this.searchParams.page_size;
      this.getTableList();
      // 切换table显示的内容
      // this.currentTableData = this.tableData.filter((item, index) => {
      //   return index < (this.searchParams.page * this.searchParams.page_size) && index >= (this.searchParams.page - 1) * this.searchParams.page_size
      // })
    }
  },
};
</script>

<style lang="less" scoped>
.gift-cover{
  display: inline-block;
  width: 80px;
  height: 80px;
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid #E6E6E6;
  img {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
  }
}
.gift-wrap{
  /deep/ .mycell .el-checkbox {
    display: none
  }
  /deep/.el-upload{
    border: 1px solid #ccc;
  }
  height: 100%;
  width: 100%;
  /deep/.el-card__body{
    width: 100%;
    padding: 32px 24px;
  }
  /deep/.el-upload--picture-card{
    width:100%;
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
    .layout--right--main();
    .padding41-40();
  }
}
</style>
