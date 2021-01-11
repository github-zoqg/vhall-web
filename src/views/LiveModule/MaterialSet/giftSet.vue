<template>
  <div class="live-gift-wrap">
    <pageTitle title="礼物管理">
      <div slot="content">
        1.支持创建免费礼物，观看端最多显示40个礼物
        <br>
        2.为保证显示效果，建议尺寸：120*120px, 文件大小不超过2MB,格式jpg、gif、png、bmp
        <br>
        3.礼物名称不支持特殊字符、表情
      </div>
    </pageTitle>
    <div class="head-operat">
      <el-button type="primary" round class="head-btn set-upload" @click="addGift" size="medium">创建礼物</el-button>
      <el-button
        round
        class="head-btn set-upload"
        @click="handleAddGift" size="medium">
        资料库
      </el-button>
      <el-button
        round
        class="head-btn set-upload"
        :class="{'no-data': batchDelete}"
        :disabled="batchDelete"
        @click="handleBatchDelete" size="medium">
        批量删除
      </el-button>
      <VhallInput
        @keyup.enter.native="searchGifts"
        clearable
        @clear="searchGifts"
        class="head-btn fr search"
        v-model.trim="searchName"
        autocomplete="off"
        placeholder="请输入礼物名称"
      >
        <i
          style="cursor: pointer; line-height: 36px;"
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="searchGifts">
        </i>
      </VhallInput>
    </div>
    <el-card class="gift-list">
      <el-table
        @select-all="onSelectAll"
        :cell-class-name="freeFilter"
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
            <div class="gift-cover">
              <img :src="scope.row.image_url" alt="" />
            </div>
          </template>
        </el-table-column>
        <el-table-column label="名称" prop="name" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="价格" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="gift-price">
              {{ `￥${scope.row.price}` }}
            </span>
          </template>
        </el-table-column>
        <!-- 暂时不支持,隐藏 -->
        <!-- <el-table-column label="显示">
           <template slot-scope="scope">
             <el-switch v-model="scope.row.status" active-color="#FC5659" inactive-color="#CECECE" @change="changeGiftStatu(scope.row.status, scope.row.gift_id)"></el-switch>
           </template>
        </el-table-column> -->
        <el-table-column label="操作" align="left" width="120">
          <template slot-scope="scope" v-if="scope.row.source_status == 1">
            <el-button class="btns" type="text" @click="handleEditGift(scope.row)">编辑</el-button>
            <el-button class="btns" type="text" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <SPagination
        :total="total"
        v-show="total > searchParams.page_size"
        :currentPage="searchParams.page"
        :page-size="searchParams.page_size"
        @current-change="currentChangeHandler"
        align="center"></SPagination>
      <null-page text="未搜索到相关内容" nullType="search" v-if="total === 0"></null-page>
    </el-card>
    <el-dialog
      :title="editParams.gift_id ? '编辑礼物' : '创建礼物'"
      :visible.sync="dialogVisible"
      v-if="dialogVisible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      custom-class="create-gift"
      width="468px">
      <el-form label-width="80px" :model="editParams" ref="editParamsForm" :rules="rules">
        <el-form-item label="图片上传" prop="img">
          <upload
            ref="uploadimg"
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
            @delete="editParams.img = ''"
           >
            <div slot="tip">
              <p>建议尺寸：120*120px，小于2MB</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
        </el-form-item>
        <el-form-item label="礼物名称" prop="name">
            <VhallInput v-model.trim="editParams.name" show-word-limit :maxlength="10" autocomplete="off"  placeholder="请输入礼物名称"></VhallInput>
        </el-form-item>
        <el-form-item label="礼物价格" prop="price">
            <VhallInput @input="handleInput" v-model.trim.number="editParams.price" autocomplete="off"  show-word-limit :maxlength="10" placeholder="请输入0-9999.99">
              <span style="padding-left: 10px; padding-top: 1px;" slot="prefix">￥</span>
            </VhallInput>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="!editParams.name || !editParams.price || !editParams.img" type="primary" size="medium" @click="handleUpdateGift" round>确 定</el-button>
        <el-button size="medium" @click="handleCancelEdit" round>取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="选择礼物"
      width="588px"
      v-if="dialogGiftsVisible"
      :visible.sync="dialogGiftsVisible"
      :close-on-click-modal=false
      :close-on-press-escape=false
      :before-close="handleCloseChooseGift"
      custom-class="choose-gift"
    >
      <VhallInput
        @keyup.enter.native="searchMaterialGift"
        clearable
        @clear="searchMaterialGift"
        class="head-btn search"
        v-model.trim="materiaSearchName"
        autocomplete="off"
        placeholder="请输入礼物名称"
      >
        <i
          style="cursor: pointer;"
          class="el-icon-search el-input__icon"
          slot="suffix"
          @click="searchMaterialGift">
        </i>
      </VhallInput>
      <div class="select-matrial-wrap">
        <div v-show="materiaTableData.length > 4" class="material-box">
          <el-scrollbar style="height:100%" v-loadMore="moreLoadData">
            <div
              v-for="(item, index) in materiaTableData"
              :key='index'
              v-show="item.source_status == 1"
              class="matrial-item"
              :class="{active: item.isChecked}"
              @click.stop="handleChooseGift(index, item)">
              <div class="gift-cover">
                <img :src="item.img" alt>
              </div>
              <div class="gift-info">
                <span class="gift-name">{{item.name}}</span>
                <span class="gift-price">￥{{item.price}}</span>
              </div>
              <!-- <i v-if="item.isChecked" class="el-icon-check"></i> -->
              <label class="img-tangle" v-show="item.isChecked">
                <i class="el-icon-check"></i>
              </label>
            </div>
          </el-scrollbar>
        </div>
        <null-page noSearchText="没有找到相关礼物" nullType="search" v-if="materiaTableData.length === 4"></null-page>
      </div>
      <div class="control">
        <span>当前选中<span class="choosed-num"> {{addGiftsIds.length}} </span>件商品</span>
        <div class="control-btn" style="text-align: right;">
          <el-button @click="chooseGift" type="primary" round :class="{disabled: addGiftsIds.length <= 0}" :disabled="addGiftsIds.length <= 0">确定</el-button>
          <el-button @click="handleCloseChooseGift" round>取消</el-button>
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
import NullPage from '../../PlatformModule/Error/nullPage.vue';

export default {
  name: "giftSize",
  data() {
    return {
      webinar_id: this.$route.params.str,
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
        page_size: 6,
        page: 1
      },
      maxPage: 0,
      defaultImgHost: `http:${Env.staticLinkVo.uploadBaseUrl}`,
      searchName: '',
      materiaSearchName: '',
      editParams: {
        gift_id: '',
        img: '',
        name: '',
        price: ''
      },
      dialogVisible: false, // 新建礼品
      dialogGiftsVisible: false, // 显示资料库添加礼品
      shareMaterial: false, // 是否分享到资料库
      deleteId: '',
      // openGiftIds: [], // 显示礼物列表
      selectIds:[], // 批量操作
      addGiftsIds: [], // 添加礼物
      addedGiftsIds: [], // 已选择礼物id
      resultAddGifts: [], // 保存的礼物
      domain_url: '',
      rules: {
        name: [
          { required: true, validator: this.validTitle, trigger: 'blur' }
        ],
        img: [
          { required: true, message: '请输入礼物图片', trigger: 'change' }
        ],
        price: [
          { required: true,  message: '请输入礼物价格', trigger: 'blur' }
        ],
      },
      isWebinarLiving: false
    };
  },
  watch: {
    total(newVal, oldVal) {
      if (newVal == 4 && newVal != oldVal) {
        this.$nextTick(() => {
          document.querySelector('.gift-list .el-table__header-wrapper th .el-checkbox__original').setAttribute('disabled', 'true')
          document.querySelector('.gift-list .el-table__header-wrapper th .el-checkbox').className += ' is-disabled';
          document.querySelector('.gift-list .el-table__header-wrapper th .el-checkbox__input').className += ' is-disabled';
        })
      } else {
        this.$nextTick(() => {
          document.querySelector('.gift-list .el-table__header-wrapper th .el-checkbox__original').setAttribute('disabled', 'false')
          document.querySelector('.gift-list .el-table__header-wrapper th .el-checkbox').className = 'el-checkbox'
          document.querySelector('.gift-list .el-table__header-wrapper th .el-checkbox__input').className = 'el-checkbox__input'
        })
      }
    }
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
  mounted() {},
  methods: {
    moreLoadData() {
      if (this.materiaSearchParams.page >= this.maxPage) {
        return false;
      }
      this.materiaSearchParams.page ++ ;
      this.queryMateriaGifts();
    },
    handleInput(value) {
      if (value != '') {
        if (value.indexOf('.') > -1) {
          console.log(value.length, value.indexOf('.'))
          if (value.length - value.indexOf('.') > 3) {
            this.$message.warning('价格最多支持两位小数')
          }
          this.editParams.price = value.slice(0, value.indexOf('.') + 3)
        } else {
          this.editParams.price = value
        }
      }
    },
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
          this.addedGiftsIds = this.tableData.map((item) => item.id)
        }
      })
    },
    searchGifts() {
      this.getTableList(true)
    },
    selectHandle(row) {
      return !(row.source_status == 0);
    },
    // 全选方法
    onSelectAll() {
      if(this.total == 4) {
        this.$refs.multipleTable.clearSelection()
      }
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
      this.$refs.editParamsForm.validateField('img');
    },
    // 上传失败处理
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`礼物上传失败`);
    },
    // 上传预览
    uploadPreview(file){
      // console.log('uploadPreview', file);
    },
    // 上传格式校验
    beforeUploadHandler(file){
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
        this.$message.error('上传礼物图片大小不能超过 2MB!');
        return false;
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
      this.domain_url = this.editParams.img
      this.dialogVisible = true
    },
    // 新建
    addGift () {
      if (this.addedGiftsIds.length >= 40) {
        this.$message.warning('已达到最大个数限制，请删除后再进行创建/添加')
        return false;
      }
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
            // 编辑
            this.handleEdit()
          } else {
            // 创建
            this.handleCreate()
          }
        }
      });
    },
    // 编辑
    handleEdit () {
      this.$confirm('对礼物的更改会同步到资料库，确定保存当前更改？', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
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
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
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
      this.$refs.uploadimg.domainUrl = ''
    },
    // 选择资料库礼品添加
    handleAddGift () {
      this.dialogGiftsVisible = true
      this.queryMateriaGifts()
    },
    // 获取资料库礼物数据
    queryMateriaGifts (isSearch) {
      if (isSearch) {
        this.materiaSearchParams.page = 1
      }
      const opts = {
        limit: this.materiaSearchParams.page_size,
        pos: this.materiaSearchParams.page_size * (this.materiaSearchParams.page - 1)
      }
      this.materiaSearchName && (opts.name = this.materiaSearchName)
      this.$fetch('shareGiftList', opts).then((res) => {
        if (res.code == 200 && res.data) {
          res.data.list.length > 0 && res.data.list.forEach((item, index) => {
            item.isChecked = false
            // if (this.addGiftsIds.length > 0) {
            //   this.addGiftsIds.map(addItem => {
            //     if(addItem == item.gift_id) {
            //       item.isChecked = true
            //     }
            //   })
            // }
          })

          if (this.materiaSearchParams.page_size * (this.materiaSearchParams.page - 1) === 0) {
            this.materiaTableData = res.data.list;
          } else {
            this.materiaTableData.push(...res.data.list)
          }

          this.materialTotal = res.data.total
          this.maxPage = Math.ceil(res.data.total / this.materiaSearchParams.page_size);
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
    materialPageChange (val) {
      this.materiaSearchParams.page = val;
      this.queryMateriaGifts()
    },
    async handleBatchDelete() {
      const isWebinarLiving = await this.isCanDelete()
      if (isWebinarLiving) {
        this.$message.warning('正在直播中，请直播结束后操作！')
        return false;
      }
      this.$confirm('观众端礼物显示将受到影响, 确认删除?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.handleBatchDeletion()
      })
    },
    // 删除礼品
    async handleDelete (data) {
      const isWebinarLiving = await this.isCanDelete()
      if (isWebinarLiving) {
        this.$message.warning('正在直播中，请直播结束后操作！')
        return false;
      }
      this.deleteId = data.id

      this.$confirm('观众端礼物显示将受到影响, 确认删除?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.handleDeleteGift()
      }).catch(() => {
        this.deleteId = ''
      })
    },
    handleDeleteGift () {
      const resData = this.tableData.filter(curItem => curItem.id != this.deleteId)
      this.tableData = resData
      this.addedGiftsIds = this.tableData.map(item => item.id)

      this.chooseGift()

      this.deleteId = ''
    },
    isCanDelete () {
      return new Promise(resolve => {
        this.$fetch('getWebinarInfo', {
          webinar_id: this.webinar_id
        }).then(res => {
          // 活动直播中不支持删除礼物
          resolve(res.data.webinar_state == 1)
        })
      })
    },
    // 批量删除
    async handleBatchDeletion () {
      this.selectIds.forEach((item, index) => {
        const resData = this.tableData.filter(curItem => curItem.id != item)
        this.tableData = resData
        this.materiaTableData.forEach(meterialItem => {
          if (meterialItem.gift_id == item) {
            meterialItem.isChecked = false
          }
        })
      })
      this.addedGiftsIds = this.tableData.map(item => item.id)
      this.chooseGift()
      this.selectIds = []
    },
    // 选择奖品添加
    handleChooseGift (index, gift) {
      if (!this.materiaTableData[index].isChecked) {
        this.resultAddGifts = [...(new Set([...this.addedGiftsIds, ...this.addGiftsIds]))]
        if (this.resultAddGifts.length >= 40) {
          this.$message.warning('已达到最大个数限制，请删除后再进行创建/添加')
          return false;
        }
        this.addGiftsIds.push(Number(this.materiaTableData[index].gift_id))
      }
      this.materiaTableData[index].isChecked = !this.materiaTableData[index].isChecked
    },
    chooseGift() {
      this.resultAddGifts = [...(new Set([...this.addedGiftsIds, ...this.addGiftsIds]))]
      this.$fetch('setRelevance', {
        gift_ids: this.resultAddGifts.join(','),
        room_id: this.room_id
      }).then(res => {
        this.handleCloseChooseGift()
        this.getTableList()
      })
    },
    handleCloseChooseGift () {
      this.addGiftsIds = []
      this.materiaSearchParams.page = 1
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
.gift-cover{
  display: inline-block;
  width: 80px;
  height: 80px;
  margin: 3px 0;
  background: #FFFFFF;
  border-radius: 4px;
  border: 1px solid #E6E6E6;
  img {
    width: 100%;
    height: 100%;
    object-fit: scale-down;
  }
}
.live-gift-wrap{
  /deep/ .create-gift .el-dialog__footer {
    padding-top: 0;
  }
  /deep/ .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before {
    content: '*';
    color: #FB3A32;
    margin-right: 4px;
  }
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
    /deep/ .el-input__suffix-inner .el-input__icon {
      line-height: 36px;
    }
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
    /deep/.el-button--default {
      background: transparent;
      &:hover {
        background: #FB3A32;
        border: 1px solid #FB3A32;
      }
      &:active {
        background: #E2332C;
        border: 1px solid #E2332C;
      }
      &.is-disabled {
        border: 1px solid #E6E6E6;
        background: transparent;
        color: #B3B3B3;
        &:hover,&:active {
          background: transparent;
        }
      }
    }
  }
  .gift-list{
    width: 100%;
    box-shadow: none;
    border: none;
    .gift-price{
      color: #FB3A32;
    }
    /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner {
      background: #e6e6e6;
    }
  }
  /deep/.el-dialog__wrapper {
    .dialog-footer {
      display: inline-block;
      width: 100%;
    }
  }
  /deep/.el-dialog{
    border-radius: 4px;
    position: relative;
  }
  .select-matrial-wrap {
    box-sizing: border-box;
    width: 100%;
    height: 328px;
    padding: 16px 0 0 32px;
    overflow: hidden;
    /deep/ .null-page {
      margin-top: 110px!important;
    }
    .material-box {
      height: 318px;
      margin-bottom: 10px;
    }
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
      width: 256px;
      height: 96px;
      background: #F5F5F5;
      border-radius: 4px;
      padding: 11px;
      border: 1px solid #F5F5F5;
      margin-bottom: 12px;
      &:nth-child(2n + 1) {
        margin-right: 12px;
      }
      .gift-cover{
        float: left;
        width: 72px;
        height: 72px;
        border-radius: 4px;
        border: 1px solid #e6e6e6;
        margin: 0;
        img{
          width: 100%;
          height: 100%;
          object-fit: scale-down;
        }
      }
      .gift-info{
        float: left;
        width: auto;
        height: 100%;
        margin-left: 12px;
        font-size: 14px;
        font-family: @fontRegular;
        font-weight: 400;
        .gift-name{
          display: block;
          font-size: 14px;
          color: #1a1a1a;
          line-height: 20px;
          margin-top: 15px;
        }
        .gift-price{
          display: block;
          font-size: 14px;
          color: #666666;
          line-height: 20px;
          margin-top: 4px;
        }
      }
      &:hover{
        cursor: pointer;
      }
      .img-tangle{
        position: absolute;
        right: 0;
        top:0;
        width: 0;
        height: 0;
        border: 10px solid transparent;
        border-right-color: #FB3A32;
        border-top-color: #FB3A32;
        i{
          color:#fff;
          position: absolute;
          top: -8px;
          right:-11px;
          font-size: 10px;
        }
      }
    }
    .matrial-item.active{
      border: 1px solid #fb3a32;
      position: relative;
      box-shadow: 0px 6px 12px 0px rgba(251, 58, 50, 0.16);
    }
  }
  .pageBox{
    margin-bottom: 20px;
  }
  .control{
    padding: 24px 32px;
    width: 100%;
    position:relative;
    &>span {
      display: inline-block;
      line-height: 36px;
    }
    /deep/ .disabled{
      opacity: 0.5;
    }
    .control-btn {
      float: right;
      /deep/ .el-button.is-round {
          padding: 7px 33px;
      }
    }
    .choosed-num {
      color: #FB3A32;
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
/deep/ .choose-gift {
  .el-dialog__title {
    line-height: 24px;
  }
  .el-dialog__body {
    padding: 0;
  }
  .head-btn.el-input {
    width: 220px;
    height: 36px;
    margin-left: 32px;
    .el-input__inner {
      border-radius: 18px;
      border: 1px solid #CCC;
    }
  }
}
</style>
