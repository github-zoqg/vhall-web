<template>
  <div class="live-gift-wrap">
    <pageTitle title="礼物管理">
      <div slot="content">
        1.为保证显示效果, 图片尺寸160*160, 文件大小不超过200k,格式jpg、gif、png
        <br>
        2.礼物名称不支持特殊字符、表情
      </div>
    </pageTitle>
    <div class="head-operat">
      <el-button type="primary" round class="head-btn set-upload" @click="addGift">新建礼物</el-button>
      <el-button
        round
        class="head-btn set-upload"
        @click="handleAddGift">
        资料库
      </el-button>
      <el-button
        round
        class="head-btn set-upload"
        :class="{'no-data': batchDelete}"
        :disabled="batchDelete"
        @click="batchDialogTipVisible = true">
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
          :selectable="selectHandle"
          width="55"
          align="left"
        />
        <el-table-column label="图片">
          <template slot-scope="scope">
            <img class="gift-cover" :src="defaultImgHost + scope.row.image_url">
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="价格" prop="price" show-overflow-tooltip>
        </el-table-column>
        <!-- 暂时不支持,隐藏 -->
        <!-- <el-table-column label="显示">
           <template slot-scope="scope">
             <el-switch v-model="scope.row.status" active-color="#FC5659" inactive-color="#CECECE" @change="changeGiftStatu(scope.row.status, scope.row.gift_id)"></el-switch>
           </template>
        </el-table-column> -->
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
        :page-size="searchParams.page_size"
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
            :domain_url="domain_url"
            :saveData="{
               path: 'interacts/gift-imgs',
               type: 'image',
            }"
            :on-success="handleuploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :before-upload="beforeUploadHandler"
            @delete="editParams.img === ''"
           >
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
    <el-dialog
      title="提示"
      width="400px"
      :visible.sync="batchDialogTipVisible"
      :close-on-click-modal="false"
      :before-close="handleCancelBatchDelete"
    >
      <span>观众端礼物显示将受到影响, 确认删除?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleCancelBatchDelete">取 消</el-button>
        <el-button type="primary" @click="handleBatchDeletion">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择礼物"
      width="620px"
      :visible.sync="dialogGiftsVisible"
      :close-on-click-modal="false"
      :before-close="handleCloseChooseGift"
    >

      <el-input
        class="head-btn fr search"
        v-model="materiaSearchName"
        placeholder="请输入礼物名称"
        prefix-icon="el-icon-search"
        @keyup.enter.native="searchMaterialGift"
      />
      <div class="select-matrial-wrap">
        <div
          v-for="(item, index) in materiaTableData"
          :key='index'
          class="matrial-item"
          :class="{active: item.isChecked}"
          @click.stop="handleChooseGift(index, item)">
          <div class="gift-cover">
            <img :src="defaultImgHost + item.img" alt>
          </div>
          <div class="gift-info">
            <span class="gift-name">{{item.name}}</span>
            <span class="gift-price">￥{{item.price}}</span>
          </div>
          <i v-if="item.isChecked" class="el-icon-check"></i>
        </div>
      </div>
      <div class="control">
        <span>当前选中{{addGiftsIds.length}}件商品</span>
        <div class="control-btn">
          <el-button @click="chooseGift" class="add-btn" :class="{disabled: addGiftsIds.length <= 0}" :disabled="addGiftsIds.length <= 0">确定</el-button>
          <el-button @click="handleCloseChooseGift" class="cancel-btn">取消</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle'
import upload from '@/components/Upload/main'
import SPagination from '@/components/Spagination/main'
import Env from "@/api/env";

export default {
  name: "giftSize",
  data() {
    return {
      webinar_id: this.$route.params.webinar_id,
      room_id: this.$route.query.roomId,
      total: 0,
      materialTotal: 100,
      batchDelete: true,
      materiaTableData: [], // 资料库数据
      tableData: [], // 当前活动关联数据
      currentTableData: [], // 当前显示的分页数据
      searchParams: {
        room_id: this.room_id,
        gift_name: '',
        page_size: 10,
        page: 1
      },
      materiaSearchParams: {
        gift_name: '',
        page_size: 20,
        page: 1
      },
      defaultImgHost: `http:${Env.staticLinkVo.uploadBaseUrl}`,
      searchName: '',
      materiaSearchName: '',
      editParams: {
        gift_id: '',
        img: '',
        name: '',
        price: ''
      },
      batchDialogTipVisible: false, // 批量删除提示
      dialogTipVisible: false, // 删除提示
      dialogVisible: false, // 新建礼品
      dialogGiftsVisible: false, // 显示资料库添加礼品
      shareMaterial: false, // 是否分享到资料库
      deleteId: '',
      // openGiftIds: [], // 显示礼物列表
      selectIds:[], // 批量操作
      addGiftsIds: [], // 添加礼物
      domain_url: ''
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
  mounted() {},
  methods: {
    // 获取礼物列表
    getTableList (isSearch) {
      this.$fetch('liveGiftList', {
        room_id: this.room_id
      }).then((res) => {
        if (res.code == 200 && res.data) {
          this.searchParams.page = 1
          this.tableData = res.data.list
          if (isSearch) {
            const resultData = []
            this.tableData.forEach(item => {
              if(item.name.indexOf(this.searchName) != -1) {
                resultData.push(item)
              }
            })
            this.tableData = resultData
          }
          this.total = this.tableData.length
          // 切换table显示的内容
          this.currentTableData = this.tableData.filter((item, index) => {
            return index < (this.searchParams.page * this.searchParams.page_size) && index >= (this.searchParams.page - 1) * this.searchParams.page_size
          })
          this.addGiftsIds = this.tableData.map((item) => item.id)
        }
      })
    },
    searchGifts() {
      this.getTableList(true)
    },
    selectHandle(row) {
      return !(row.source_status == 0);
    },
    // 处理批量操作
    handleSelectionChange (val) {
      let ids = []
      // 只能删除用户自定义
      val.length > 0 && val.forEach((item, index) => {
        if (item.source_status == 1) {
          ids.push(item.id)
        }
      })
      if (ids.length > 0) {
        this.batchDelete = false
      } else {
        this.batchDelete = true
      }
      this.selectIds = ids
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
        gift_id: data.id,
        name: data.name,
        price: data.price,
        img: data.image_url
      }
      this.domain_url = this.defaultImgHost + this.editParams.img
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
      let price = Number(this.editParams.price)
      if (price || price == 0) {
        if (price < 0 || price > 10000) {
          this.$message.error('价格必须介于0-10000之间')
          return
        }
        this.editParams.price = price.toFixed(2)
      } else {
        this.$message.error('请输入正确礼物价格')
        return
      }
      if(this.editParams.gift_id) {
        // 编辑
        this.handleEdit()
      } else {
        // 创建
        this.handleCreate()
      }
    },
    // 编辑
    handleEdit () {
      this.$confirm('对礼物的更改会同步到资料库，确定保存当前更改？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box'
      }).then(() => {
        this.$fetch('updateGiftInfo', {
          ...this.editParams
        }).then((res) => {
          if (res.code == 200) {
            this.$message.success('编辑成功')
            this.getTableList()
            this.queryMateriaGifts()
            this.handleCancelEdit()
          }
        }).catch((e) => {
            this.$message.error('编辑失败')
            this.handleCancelEdit()
        })
      })
    },
    // 创建
    handleCreate () {
      this.$confirm('对礼物的更改会同步到资料库，确定保存当前更改？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box'
      }).then(() => {
        this.$fetch('createWebinarGift', {
          ...this.editParams,
          room_id: this.room_id
        }).then((res) => {
          if (res.code == 200) {
            this.$message.success('创建成功')
            this.getTableList()
            this.handleCancelEdit()
          }
        }).catch((e) => {
            this.$message.error('创建失败')
        })
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
    // 选择资料库礼品添加
    handleAddGift () {
      this.dialogGiftsVisible = true
      this.queryMateriaGifts()
    },
    // 获取资料库礼物数据
    queryMateriaGifts (isSearch) {
      this.$fetch('shareGiftList').then((res) => {
        if (res.code == 200 && res.data) {
          res.data.list.length > 0 && res.data.list.forEach((item, index) => {
            item.isChecked = false
            if (this.addGiftsIds.length > 0) {
              this.addGiftsIds.map(addItem => {
                if(addItem == item.gift_id) {
                  item.isChecked = true
                }
              })
            }
          })
          this.materiaTableData = res.data.list
          if (isSearch) {
            const resultData = []
            res.data.list.forEach(item => {
              if(item.name.indexOf(this.materiaSearchName) != -1) {
                resultData.push(item)
              }
            })
            this.materiaTableData = resultData
          }
          this.materialTotal = this.materiaTableData.length
        }
      })
    },
    // 翻页
    currentChangeHandler (val) {
      if (this.searchParams.page != val) {
        // 不跨页 清空选项
        this.$refs.multipleTable.clearSelection()
      }
      this.searchParams.page = val
      // 切换table显示的内容
      this.currentTableData = this.tableData.filter((item, index) => {
        return index < (this.searchParams.page * this.searchParams.page_size) && index >= (this.searchParams.page - 1) * this.searchParams.page_size
      })
    },
    // 删除礼品
    handleDelete (data) {
      this.dialogTipVisible = true
      this.deleteId = data.id
    },
    handleDeleteGift () {
      const resData = this.tableData.filter(curItem => curItem.id != this.deleteId)
      this.tableData = resData
      this.addGiftsIds = this.tableData.map(item => item.id)
      this.materiaTableData.forEach(meterialItem => {
        if (meterialItem.gift_id == this.deleteId) {
          meterialItem.isChecked = false
        }
      })
      this.chooseGift()

      this.deleteId = ''
      this.dialogTipVisible = false
    },
    handleCancelDelete () {
      this.deleteId = ''
      this.dialogTipVisible = false
    },
    handleCancelBatchDelete () {
      this.selectIds = []
      this.batchDialogTipVisible = false
    },
    // 批量删除
    handleBatchDeletion () {
      this.selectIds.forEach((item, index) => {
        const resData = this.tableData.filter(curItem => curItem.id != item)
        this.tableData = resData
        this.materiaTableData.forEach(meterialItem => {
          if (meterialItem.gift_id == item) {
            meterialItem.isChecked = false
          }
        })
      })
      this.addGiftsIds = this.tableData.map(item => item.id)
      this.chooseGift()
      this.selectIds = []
      this.batchDialogTipVisible = false
    },
    // 修改礼品显示状态
    // changeGiftStatu () {
    //   if (this.changeStatuTimer) clearTimeout(this.changeStatuTimer)
    //   this.changeStatuTimer = setTimeout(() => {
    //     if (arguments[0]) {
    //       if (this.openGiftIds.length <= 40) {
    //         this.openGiftIds.push(arguments[1])
    //       } else {
    //         this.$message.warn('观看端最多显示40个礼物')
    //       }
    //     } else {
    //       this.openGiftIds.splice(this.openGiftIds.indexOf(arguments[1]), 1)
    //     }
    //   }, 300)
    // },
    // 选择奖品添加
    handleChooseGift (index, gift) {
      // 默认礼物不支持取消关联
      if(gift.source_status == 0) {
        this.$message.warning('默认礼物不支持取消关联')
        return false;
      }
      if (!this.materiaTableData[index].isChecked) {
        this.addGiftsIds.push(Number(this.materiaTableData[index].gift_id))
      } else {
        let num = this.addGiftsIds.indexOf(Number(this.materiaTableData[index].gift_id))
        this.addGiftsIds.splice(num, 1)
      }
      this.materiaTableData[index].isChecked = !this.materiaTableData[index].isChecked
    },
    chooseGift() {
      this.$fetch('setRelevance', {
        gift_ids: this.addGiftsIds.join(','),
        room_id: this.room_id
      }).then(res => {
        this.handleCloseChooseGift()
        this.getTableList()
      })
    },
    handleCloseChooseGift () {
      this.dialogGiftsVisible = false
    },
    // 检索奖品库礼物
    searchMaterialGift () {
      this.queryMateriaGifts(true)
    },
    // 新建添加到资料库
    handelShareMarterial () {
      this.shareMaterial = !this.shareMaterial
    }
  }
};
</script>

<style lang="less" scoped>
.live-gift-wrap{
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
  /deep/.el-dialog{
    border-radius: 8px;
    position: relative;
  }
  .select-matrial-wrap {
    box-sizing: border-box;
    width: 100%;
    height: 500px;
    padding: 24px 28px;
    overflow-y: auto;
    .head-btn{
      width: 100%;
      /deep/.el-input__inner{
        width: 240px;
        margin-left: 18px;
      }
      /deep/.el-input__prefix{
        margin-left: 18px;
      }
    }
    .matrial-item {
      display: inline-block;
      width: 232px;
      height: 92px;
      margin: 6px;
      background: #F5F5F5;
      border-radius: 4px;
      padding: 12px;
      border: 1px solid #fff;
      .gift-cover{
        display:inline-block;
        width: 70px;
        height: 70px;
        img{
          display: inline-block;
          width: 70px;
          height: 70px;
          border-radius: 4px;
        }
      }
      .gift-info{
        display: inline-block;
        width: auto;
        height: 100%;
        vertical-align: top;
        margin-left: 12px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        .gift-name{
          display: block;
          color: #222222;
          line-height: 20px;
          width: 120px;
        }
        .gift-price{
          display: block;
          font-size: 16px;
          color: #FC5659;
          line-height: 22px;
          margin-top: 4px;
        }
      }
      &:hover{
        cursor: pointer;
      }
      .el-icon-check {
        position: absolute;
        bottom: 2px;
        right: 3px;
        color: #fff;
        z-index: 2;
        font-size: 16px;
        font-weight: 800;
      }
    }
    .matrial-item.active{
      border: 1px solid #FC5659;
      position: relative;
      &:after{
        content: '';
        display: block;
        position: absolute;
        bottom: 0px;
        right: 0px;
        width: 22px;
        height: 22px;
        background: red;
      }
    }
  }
  .pageBox{
    /deep/.el-pagination__total, /deep/.el-pagination__jump {
      display: none;
    }
    margin-bottom: 20px;
  }
  .control{
    padding-top: 30px;
    padding-bottom: 32px;
    width: 100%;
    position:relative;
    &>span {
      display: inline-block;
      position: absolute;
      top: 43px;
      left: 20px;
    }
    /deep/.add-btn, .cancel-btn{
      width: 80px;
      height: 34px;
      background: #FC5659;
      border-radius: 4px;
      border: 1px solid #F3545B;
      text-align: center;
      padding: 0px;
      margin: 0p;
      line-height: 34px;
    }
    .add-btn{
      margin-left: 191px ;
      color: #fff;
    }
    /deep/ .disabled{
      opacity: 0.5;
    }
    .cancel-btn{
      border: 1px solid #888888;
      background: #fff;
    }
  }
  .share-material{
    &:hover{
      cursor: pointer;
    }
    .square{
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 6px;
      border: 1px solid #FC5659;
      background: #fff;
      margin-right: 4px;
      margin-top: 5px;
    }
    .active{
      background: #FC5659;
    }
  }
}
</style>
