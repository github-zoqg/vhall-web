<template>
  <div class="live-gift-wrap">
    <pageTitle pageTitle="礼物管理">
      <div slot="content">
        1.支持创建免费礼物，观看端最多显示40个礼物
        <br>
        2.为保证显示效果，建议尺寸：240*240px, 文件大小不超过<br/>2MB,格式jpg、gif、png、bmp
        <br>
        3.礼物名称不支持特殊字符、表情
      </div>
    </pageTitle>
    <div class="head-operat">
      <el-button type="primary" round class="head-btn set-upload" @click="addGift" size="medium">创建礼物</el-button>
      <el-button
        round
        class="head-btn set-upload transparent-btn"
        @click="handleAddGift" size="white-medium">
        资料库
      </el-button>
      <el-button
        round
        class="head-btn set-upload transparent-btn"
        :class="{'no-data': batchDelete}"
        :disabled="batchDelete"
        @click="handleBatchDelete" size="medium">
        批量删除
      </el-button>
      <VhallInput
        @keyup.enter.native="searchGifts"
        clearable
        v-clearEmoij
        @clear="searchGifts"
        class="head-btn fr search resetRightBrn search-tag"
        v-model="searchName"
        autocomplete="off"
        placeholder="请输入礼物名称"
      >
        <i
          style="cursor: pointer; line-height: 36px;"
          class="el-icon-search el-input__icon"
          slot="prefix"
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
            <el-button v-preventReClick class="btns" type="text" @click="handleEditGift(scope.row)">编辑</el-button>
            <el-button v-preventReClick class="btns" type="text" @click="handleDelete(scope.row)">删除</el-button>
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
            :widthImg="231"
            :heightImg="130"
            :on-success="handleuploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :before-upload="beforeUploadHandler"
            @delete="editParams.img = '', domain_url = ''"
           >
            <div slot="tip">
              <p>建议尺寸：240*240px，小于2MB</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
        </el-form-item>
        <el-form-item label="礼物名称" prop="name">
            <VhallInput v-model="editParams.name" v-clearEmoij show-word-limit :maxlength="10" autocomplete="off"  placeholder="请输入礼物名称"></VhallInput>
        </el-form-item>
        <el-form-item label="礼物价格" prop="price">
          <!-- TODO:支付牌照问题 -->
            <VhallInput @input="handleInput" v-model.trim.number="editParams.price" autocomplete="off" :maxlength="10" placeholder="只允许输入0">
              <i slot="suffix">元</i>
              <!-- <span style="padding-left: 10px; padding-top: 1px;" slot="prefix">￥</span> -->
            </VhallInput>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button :disabled="!editParams.name || !editParams.price || !editParams.img" type="primary" size="medium" @click="handleUpdateGift" round>确定</el-button>
        <el-button size="medium" @click="handleCancelEdit" round>取消</el-button>
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
        class="head-btn search resetRightBrn"
        v-model.trim="materiaSearchName"
        autocomplete="off"
        placeholder="请输入礼物名称"
      >
        <i
          style="cursor: pointer;"
          class="el-icon-search el-input__icon"
          slot="prefix"
          @click="searchMaterialGift">
        </i>
      </VhallInput>
      <div class="select-matrial-wrap">
        <div v-show="!isNull" class="material-box">
          <el-scrollbar style="height:100%" v-loadMore="moreLoadData">
            <template v-for="(item, index) in materiaTableData">
              <div
                :key='index'
                v-if="item.source_status == 1"
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
                <!-- <label class="img-tangle" v-show="item.isChecked">
                  <i class="el-icon-check"></i>
                </label> -->
                <label  class="img-tangle" v-show="item.isChecked"><img src="../../../common/images/icon-choose.png" alt=""></label>
              </div>
            </template>
          </el-scrollbar>
        </div>
        <null-page noSearchText="没有找到相关礼物" nullType="noData" v-if="isNull" :text="'暂无礼物'"></null-page>
      </div>
      <div class="control">
        <span>当前选中<span class="choosed-num"> {{addGiftsIds.length}} </span>件礼物</span>
        <div class="control-btn" style="text-align: right;">
          <el-button @click="chooseGift()" type="primary" round :class="{disabled: addGiftsIds.length <= 0}" :disabled="addGiftsIds.length <= 0">确定</el-button>
          <el-button @click="handleCloseChooseGift" round>取消</el-button>
        </div>
      </div>
    </el-dialog>
    <begin-play :webinarId="$route.params.str" v-if="$route.query.type != 5 && webinarState!=4"></begin-play>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle'
import upload from '@/components/Upload/main'
import SPagination from '@/components/Spagination/main'
import Env from "@/api/env";
import NullPage from '../../PlatformModule/Error/nullPage.vue';
import { sessionOrLocal, debounce } from "@/utils/utils";
import beginPlay from '@/components/beginBtn';


export default {
  name: "giftSize",
  data() {
    // 礼物价格
    const priceValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入礼物价格'));
      } else {
        // TODO:支付牌照问题
        if (value != 0) {
          callback && callback('价格必须等于0');
        } else if (value.length - value.indexOf('.') > 3 && value.indexOf('.') > -1) {
          callback && callback('价格最多支持两位小数');
        } else {
          callback();
        }
      }
    };
    return {
      webinar_id: this.$route.params.str,
      userId: JSON.parse(sessionOrLocal.get("userId")),
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
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
          { required: true, validator: priceValidate, trigger: 'blur' }
        ],
      },
      isWebinarLiving: false
    };
  },
  computed: {
    isNull() {
      return !this.materiaTableData.some(item => item.source_status == 1)
    }
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
    NullPage,
    beginPlay
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
    /**
     * 价格格式限制
     * 只能输入数字和小数点；
     * 小数点只能有1个
     * 第一位不能是小数点
     * 第一位如果输入0，且第二位不是小数点，则去掉第一位的0
     * 小数点后保留2位
     */
    handleInput(value) {
      if (value != '') {
        // this.editParams.price = value.replace(/^[0-9]*$/,'')
        // this.editParams.price = value.replace(/[^\d]/g,'')
        let str = value;
        let len1 = str.substr(0, 1);
        let len2 = str.substr(1, 1);
        //如果第一位是0，第二位不是点，就用数字把点替换掉
        if (str.length > 1 && len1 == 0 && len2 != ".") {
          str = str.substr(1, 1);
        }
        //第一位不能是.
        if (len1 == ".") {
          str = "";
        }
        //限制只能输入一个小数点
        if (str.indexOf(".") != -1) {
          let str_ = str.substr(str.indexOf(".") + 1);
          if (str_.indexOf(".") != -1) {
            str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
          }
        }
        //正则替换，保留数字和小数点
        str = str.replace(/[^\d^\.]+/g,'')
        //如果需要保留小数点后两位，则用下面公式
        if (str.indexOf('.') > -1 && str.length - str.indexOf('.') > 3) {
          str = str.slice(0, str.indexOf('.') + 3)
          this.$message({
            message: `价格最多支持两位小数`,
            showClose: true,
            // duration: 0,
            type: 'warning',
            customClass: 'zdy-info-box'
          });
        }
        this.editParams.price =  str;
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
          this.addedGiftsIds = this.tableData.map((item) => item.id)
          if (this.searchName) {
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
        }
      })
    },
    searchGifts() {
      if (this.searchName) {
         this.$vhall_paas_port({
          k: 100404,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
      }
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
      this.$message({
        message:  `礼物上传失败`,
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
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
        this.$message({
          message:  `文件格式不支持，请检查图片`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message:  `上传礼物图片大小不能超过 2M`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      return isType && isLt2M;
    },
    // 打开编辑面板
    handleEditGift (data) {
      debounce(async () => {
        const isWebinarLiving = await this.isCanDelete()
        if (isWebinarLiving) {
          this.$message({
            message: `正在${this._rehearsal_type ? '彩排' : '直播'}中，请${this._rehearsal_type ? '彩排' : '直播'}结束后操作`,
            showClose: true,
            // duration: 0,
            type: 'warning',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        this.editParams = {
          gift_id: data.id,
          name: data.name,
          price: data.price,
          img: data.image_url
        }
        this.domain_url = this.editParams.img
        this.dialogVisible = true
      }, 500)
    },
    // 新建
    addGift () {
      if (this.addedGiftsIds.length >= 40) {
        this.$message({
          message: `已达到最大个数限制，请删除后再进行创建/添加`,
          showClose: true,
          // duration: 0,
          type: 'warning',
          customClass: 'zdy-info-box'
        });
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
              this.$message({
                message:  `价格必须介于0-9999.99之间`,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
              return
            }
            price=Math.floor(price*100)/100;
            this.editParams.price = price.toFixed(2)
          } else {
            this.$message({
              message:  `请输入正确礼物价格`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
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
          ...this.editParams,
          room_id: this.room_id
        }).then((res) => {
          if (res.code == 200) {
            this.$vhall_paas_port({
              k: 100399,
              data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
            })
            this.$message({
              message: `编辑成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.getTableList()
            this.queryMateriaGifts()
            this.handleCancelEdit()
          }
        }).catch((err) => {
            if (err.code == 513001) {
              this.$message({
                message:  `直播中禁止编辑礼物`,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
            } else {
              this.$message({
                message: err.msg,
                showClose: true,
                // duration: 0,
                type: 'error',
                customClass: 'zdy-info-box'
              });
            }
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
            this.$vhall_paas_port({
              k: 100398,
              data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
            })
            this.$message({
              message: `创建成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.getTableList()
            this.handleCancelEdit()
          }
        }).catch((res) => {
          this.$message({
            message: res.msg || `创建失败`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
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
      this.domain_url = ''
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
        this.$message.warning(`正在${this._rehearsal_type ? '彩排' : '直播'}中，请${this._rehearsal_type ? '彩排' : '直播'}结束后操作！`)
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
    handleDelete (data) {
      debounce(async () => {
        const isWebinarLiving = await this.isCanDelete()
        if (isWebinarLiving) {
          this.$message({
            message: `正在${this._rehearsal_type ? '彩排' : '直播'}中，请${this._rehearsal_type ? '彩排' : '直播'}结束后操作`,
            showClose: true,
            // duration: 0,
            type: 'warning',
            customClass: 'zdy-info-box'
          });
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
      }, 500)
    },
    handleDeleteGift () {
      const resData = this.tableData.filter(curItem => curItem.id != this.deleteId)
      this.tableData = resData
      this.addedGiftsIds = this.addedGiftsIds.filter(curItem => curItem != this.deleteId)

      this.chooseGift(1, 2)

      this.total = this.tableData.length
      // 切换table显示的内容
      this.currentTableData = this.tableData.filter((item, index) => {
        return index < (this.searchParams.page * this.searchParams.page_size) && index >= (this.searchParams.page - 1) * this.searchParams.page_size
      })
      if (this.currentTableData.length == 0) {
        this.searchParams.page--
        // 切换table显示的内容
        this.currentTableData = this.tableData.filter((item, index) => {
          return index < (this.searchParams.page * this.searchParams.page_size) && index >= (this.searchParams.page - 1) * this.searchParams.page_size
        })
      }
      this.$message({
        message: `删除成功`,
        showClose: true,
        // duration: 0,
        type: 'success',
        customClass: 'zdy-info-box'
      });
      this.deleteId = ''
    },
    isCanDelete () {
      return new Promise(resolve => {
        // webinar/info调整-直播中不能操作的使用1
        this.$fetch('getWebinarInfo', {
          webinar_id: this.webinar_id
        }).then(res => {
          // 活动直播中不支持删除礼物
          this._rehearsal_type = res.data.rehearsal_type
          resolve(res.data.webinar_state == 1)
        })
      })
    },
    // 批量删除
    async handleBatchDeletion () {
      this.selectIds.forEach((item, index) => {
        const resData = this.tableData.filter(curItem => curItem.id != item)
        this.addedGiftsIds = this.addedGiftsIds.filter(curItem => curItem != item)
        this.tableData = resData
        this.materiaTableData.forEach(meterialItem => {
          if (meterialItem.gift_id == item) {
            meterialItem.isChecked = false
          }
        })
      })
      this.total = this.tableData.length
      // 切换table显示的内容
      this.currentTableData = this.tableData.filter((item, index) => {
        return index < (this.searchParams.page * this.searchParams.page_size) && index >= (this.searchParams.page - 1) * this.searchParams.page_size
      })
      if (this.currentTableData.length == 0) {
        this.searchParams.page--
        // 切换table显示的内容
        this.currentTableData = this.tableData.filter((item, index) => {
          return index < (this.searchParams.page * this.searchParams.page_size) && index >= (this.searchParams.page - 1) * this.searchParams.page_size
        })
      }
      this.chooseGift(1, 1)
      this.selectIds = []
    },
    // 选择奖品添加
    handleChooseGift (index, gift) {
      if (!this.materiaTableData[index].isChecked) {
        this.resultAddGifts = [...(new Set([...this.addedGiftsIds, ...this.addGiftsIds]))]
        if (this.resultAddGifts.length >= 40) {
          this.$message({
            message: `已达到最大个数限制，请删除后再进行创建/添加`,
            showClose: true,
            // duration: 0,
            type: 'warning',
            customClass: 'zdy-info-box'
          });
          return false;
        }
        this.addGiftsIds.push(Number(this.materiaTableData[index].gift_id))
      }
      this.materiaTableData[index].isChecked = !this.materiaTableData[index].isChecked
    },
    chooseGift(isDeleteChoose, index) {
      // index: 1：批量删除   2：删除  3：选择礼物
      this.resultAddGifts = [...(new Set([...this.addedGiftsIds, ...this.addGiftsIds]))]
      this.$fetch('setRelevance', {
        gift_ids: this.resultAddGifts.join(','),
        room_id: this.room_id
      }).then(res => {
        this.$vhall_paas_port({
          k: index === 1 ?  100403: index === 2 ? 100402 : 100401,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.handleCloseChooseGift()
        isDeleteChoose != 1 && this.getTableList()
      })
    },
    handleCloseChooseGift () {
      this.materiaSearchName = ''
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
  /deep/ .el-table__empty-block {
    display: none;
  }
  /deep/ .create-gift {
    .el-dialog__footer {
      padding-top: 0;
    }
    .el-form-item {
      .el-icon-refresh-left,.saasicon_shanchu{
        color: #fff;
      }
      .saasicon_shangchuan{
        color: #999;
      }
    }
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
    height: 130px;
  }
  /deep/.el-form-item {
    .el-input__inner {
      padding: 0 10px;
    }
      i{
        font-style: normal;
        padding: 0 5px;
        color: #666;
      }
    }
  .head-operat{
    margin-bottom: 20px;
    /deep/ .el-input__prefix-inner .el-input__icon {
      line-height: 36px;
    }
    .search-tag{
      float: right;
      width: 220px;
      /* /deep/.el-input__inner{
        border-radius: 18px;
        padding: 0 12px;
      } */
      /deep/ .el-input__icon {
        line-height: 36px;
      }
      /deep/.el-input__inner {
        border-radius: 20px;
        height: 36px;
        padding-right: 30px!important;
      }
      /deep/ .el-input__prefix {
        cursor: pointer;
      }
    }
    .head-btn{
      display: inline-block;
      border-radius: 20px;
    }
    .no-data{
      color: #b3b3b3;
    }
    ::v-deep .set-upload{
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
      height: 36px;
      input{
        border-radius: 18px;
        border: 1px solid #CCC;
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
    height: 324px;
    padding: 16px 0 0 32px;
    overflow: hidden;
    /deep/ .null-page {
      width: 100%;
      height: 100%;
      margin-top: 0!important;
      padding-right: 32px;
      padding-bottom: 16px;
      .search {
        padding-bottom: 0;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
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
      transition: all 0.15s ease-in;
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
        box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
      }
      .img-tangle{
          position: absolute;
          right: -1px;
          top:-1px;
          width: 20px;
          height: 20px;
          font-size: 0;
          img{
            width: 100%;
            height: 100%;
          }
        }
    }
    .matrial-item.active{
      border: 1px solid #fb3a32;
      position: relative;
      box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
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
        padding: 7px 23px;
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
  .resetRightBrn {
    /deep/ .el-input__inner {
      border-radius: 20px;
      height: 36px;
      padding-right: 30px!important;
    }
    /deep/ .el-input__icon {
      line-height: 36px;
    }
    /deep/ .el-input__prefix {
      cursor: pointer;
    }
  }
}
/deep/ .choose-gift {
  .el-dialog__title {
    line-height: 28px;
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
    /deep/ .el-input__icon {
      line-height: 36px;
    }
  }
}
</style>
