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
        @click="handleBatchDeletion">
        批量删除
      </el-button>
      <el-input
        class="head-btn fr search"
        v-model="searchName"
        placeholder="请输入礼物名称"
        suffix-icon="el-icon-search"/>
    </div>
    <el-card class="gift-list">
      <el-table
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%;margin-bottom: 30px;"
        ref="multipleTable"
        :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
        @selection-change="handleSelectionChange">
        <el-table-column
          :reserve-selection="true"
          type="selection"
          width="55"
          align="left"
        />
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
            <el-button class="btns" type="text" @click="handleEditGift(scope.row)">编辑</el-button>
            <el-button class="btns" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <SPagination 
        :total="total"
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

export default {
  name: "gift",
  data() {
    return {
      total: 100,
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
        page_size: 20,
        page: 1
      },
      selectIds:[],
      defaultImgHost: process.env.upload + '/',
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
    // this.getTableList()
  },
  mounted() {
    this.bindEventListener()
  },
  methods: {
    // 监听回车等情况搜索礼物名称
    bindEventListener () {
      let searchBtn = document.querySelector('.el-input__suffix'),
          inputDom = document.querySelector('.el-input__inner')
      inputDom.setAttribute('id', 'customGiftSearchBtn')
      searchBtn && searchBtn.addEventListener('click', () => {
        this.searchParams.gift_name = this.searchName
        this.searchParams.page = 1
        this.getTableList()
      })
       document.onkeydown = (event) => {
        // 搜索框获取焦点时点击回车自动搜搜
        let e = event || window.event;
        if (e && e.keyCode == 13) { //回车键的键值为13
          if (document.activeElement.id == 'customGiftSearchBtn') {
            this.searchParams.gift_name = this.searchName
            this.searchParams.page = 1
            this.getTableList()
          }
        }
      }; 
    },
    // 获取礼物列表
    getTableList () {
      this.$fetch('shareGiftList', {
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
    // 上传进度
    uploadProcess(event, file, fileList){
      // console.log('uploadProcess', event, file, fileList);
    },
    // 上传礼物封面成功
    handleuploadSuccess(res, file){
      console.log(res, file);
      this.editParams.img = URL.createObjectURL(file.raw);
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
        img: process.env.img + '/' + data.img // TODO:
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
        this.editParams.price = this.editParams.price.toFixed(2)
      } else {
        this.$message.error('请输入正确礼物价格')
        return
      }
      this.$fetch('createGiftInfo', {
        ...this.editParams
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success('创建成功')
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
      this.deleteId = data.gift_id
    },
    handleDeleteGift () {
      this.$fetch('deleteGift', {
        gift_id: this.deleteId
      }).then((res) => {
        if (res.code == 200) {
          this.$message.success('删除成功')
          this.deleteId = ''
          this.dialogTipVisible = false
        }
      }).catch((e) => {
          this.$message.error('创建失败')
      })
    },
    handleCancelDelete () {
      this.deleteId = ''
      this.dialogTipVisible = false
    },
    // 批量删除
    handleBatchDeletion () {},
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
