<template>
  <div class="dialog-box">
    <VhallDialog
      :title="advInfo.adv_id ? '编辑广告' : '创建广告'"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :lock-scroll=false
      width="468px">
      <el-form label-width="80px" :model="advertisement" ref="advertisementForm" :rules="rules">
      <el-form-item label="推广图片" prop="img_url">
        <div class="img-box">
           <upload
              class="giftUpload"
              v-model="advertisement.img_url"
              :domain_url="domain_url"
              :saveData="{
                path: 'webinars/spread-imgs',
                type: 'image',
              }"
              :on-success="uploadAdvSuccess"
              :on-progress="uploadProcess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              :before-upload="beforeUploadHnadler"
              @delete="deleteImg"
              >
             <div slot="tip">
               <p>建议尺寸：400*225px，小于2M</p>
               <p>支持jpg、gif、png、bmp</p>
             </div>
            </upload>
        </div>
      </el-form-item>
      <el-form-item label="标题" prop="subject">
        <VhallInput v-model.trim="advertisement.subject" :maxlength="15" show-word-limit placeholder="请输入广告标题" autocomplete="off"></VhallInput>
      </el-form-item>
      <el-form-item label="链接" prop="url">
        <VhallInput v-model.trim="advertisement.url" placeholder="请输入广告链接" autocomplete="off" ></VhallInput>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer create-footer">
      <el-button type="primary" size="medium" v-preventReClick :disabled="!(advertisement.subject&&advertisement.url&&advertisement.img_url)" @click="saveAdviseHandle" round>确 定</el-button>
      <el-button  size="medium" @click="dialogVisible = false" round>取 消</el-button>
    </span>
    </VhallDialog>
    <VhallDialog
      title="选择广告"
      :visible.sync="dialogAdverVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
      width="620px">
      <div class="content">
        <div class="search" v-show="total || isSearch">
           <VhallInput class="search-dialog-tag" v-model.trim="advertisementTitle" placeholder="请输入广告标题" style="width: 220px" @keyup.enter.native="changeAdverment" maxlength="50" @clear="changeAdverment" clearable>
            <i slot="suffix" class="iconfont-v3 saasicon_search" @click="changeAdverment" style="cursor: pointer; line-height: 36px;"></i>
          </VhallInput>
          </div>
        <el-scrollbar v-loadMore="moreLoadData" v-show="total">
          <div class="ad-list">
            <div class="ad-item" v-for="(item, index) in adList" :key="index" :class="item.isChecked ? 'active' : ''" @click="choiseAdvisetion(item)">
              <span class="spanImg"> <img :src="`${item.img_url}`" alt=""></span>
              <p>{{ item.subject }}</p>
              <label class="img-tangle" v-show="item.isChecked">
                <i class="el-icon-check"></i>
              </label>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <div class="no-live" v-show="!total">
        <noData :nullType="nullText" :text="text" :height="0">
          <el-button type="primary" v-if="nullText == 'nullData'" round @click="$router.push({path: '/material/advertCard'})" v-preventReClick>创建广告</el-button>
        </noData>
      </div>
      <p class="text" v-show="total || isSearch">当前选中<span>{{ selectChecked.length }}</span>个广告</p>
      <span slot="footer" class="dialog-footer sureBtn" v-show="total || isSearch">
        <el-button type="primary" size="medium" @click="advSaveToWebinar()" :disabled="!selectChecked.length" v-preventReClick round>确 定</el-button>
        <el-button @click="dialogAdverVisible = false" round size="medium">取 消</el-button>
      </span>
    </VhallDialog>
     <VhallDialog
      title="提示"
      :visible.sync="dialogTongVisible"
      :close-on-click-modal="false"
      :lock-scroll=false
      class="zdy-async-dialog"
      width="400px"
    >
      <div class="async__body">
        <div class="async__ctx">
          <p>保存广告同时共享至资料管理，便于其他活动使用？</p>
          <el-checkbox v-model="sureChecked">共享到资料管理</el-checkbox>
        </div>
        <div class="async__footer">
          <el-button type="primary" size="medium" v-preventReClick @click="sureMaterialAdver" round>确 定</el-button>
          <el-button size="medium"  @click="dialogTongVisible=false"  round>取 消</el-button>
        </div>
      </div>
    </VhallDialog>
  </div>
</template>
<script>
import upload from '@/components/Upload/main';
import Env from "@/api/env";
import noData from '@/views/PlatformModule/Error/nullPage';
export default {
  data() {
    const linkValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入广告链接'));
      } else {
        if (!this.linkCodeMatch(value)) {
          callback && callback('请输入正确的广告链接');
        } else {
          callback();
        }
      }
    };
    const nameValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入广告标题'));
      } else {
        if (value.length > 15) {
          callback && callback('广告标题在15个字符以内');
        } else {
          callback();
        }
      }
    };
    return {
      dialogVisible: false,
      dialogAdverVisible: false,
      dialogTongVisible: false,
      advertisementTitle: '',
      baseImgUrl: Env.staticLinkVo.uploadBaseUrl,
      selectChecked: [],
      total: 0,
      sureChecked: true,
      nullText: 'nullData',
      isSearch: false, //是否是搜索
      text: '您还没有广告，快来创建吧！',
      rules: {
        subject: [
          { required: true, validator: nameValidate, trigger: 'blur' },
        ],
        img_url: [
          { required: true, message: '请选择推广图片', trigger: 'change' }
        ],
        url: [
          { required: true,  validator: linkValidate, trigger: 'blur' }
        ],
      },
      domain_url: '',
      advertisement: {
        is_sync: 0,
        img_url: '',
        url: '',
        subject: null
      },
      advertPageInfo: {
        pos: 0,
        limit: 6,
        page: 1
      },
      maxPage: 0,
      adList: []
    };
  },
  props: {
    advInfo:{
      type: Object
    },
    maxTotal:{
      type: Number
    }
  },
  components: {
    upload,
    noData
  },
  watch: {
    dialogVisible() {
      if (this.dialogVisible) {
        this.editShow();
      } else {
        this.advertisement = {};
        this.domain_url = '';
        this.clearForm();
        this.$refs['advertisementForm'].resetFields();
      }
    },
    dialogAdverVisible() {
      if (this.dialogAdverVisible) {
        this.advertPageInfo = {
          pos: 0,
          limit: 6,
          page: 1
        };
        this.selectChecked = [];
        this.activityData();
      } else {
        this.adList = [];
        this.selectChecked = [];
        this.advertisementTitle = '';
      }
    },
    dialogTongVisible() {
      if (this.dialogTongVisible) {
        this.sureChecked = true;
      }
    }
  },
  methods: {
    handleClose(done) {
      this.advertPageInfo.page = 1;
      done();
    },
    editShow() {
      if (this.advInfo.adv_id) {
        this.domain_url = this.advInfo.img_url;
        this.$nextTick(()=>{
          this.$set(this.advertisement, 'img_url', this.advInfo.img_url);
          this.$set(this.advertisement, 'subject', this.advInfo.subject);
          this.$set(this.advertisement, 'url', this.advInfo.url);
          this.$set(this.advertisement, 'adv_id', this.advInfo.adv_id);
        })
      } else {
        this.clearForm();
      }
    },
    clearForm() {
      this.$set(this.advertisement, 'img_url', '');
      this.$set(this.advertisement, 'subject', '');
      this.$set(this.advertisement, 'url', '');
      this.$set(this.advertisement, 'adv_id', '');
    },
    // 验证链接
    linkCodeMatch(value) {
      let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+).*?/g;
      if (!reg.test(value)) {
        return false;
      } else {
        return true;
      }
    },
    saveAdviseHandle() {
      this.$refs.advertisementForm.validate((valid) => {
        if (valid) {
          if (this.$route.params.str) {
            // 直播-新建广告
            if (this.advInfo.adv_id) {
              this.createAdvAndsync(0);
            } else {
              this.dialogTongVisible = true;
            }
          } else {
            // 资料库中广告推荐，默认不同步到资料库
            // this.advertisement.is_sync = 0;
            this.createAdvAndsync(0);
          }
        }
      });
    },
    sureMaterialAdver() {
      if (this.sureChecked) {
        // 同步资料库
          // this.advertisement.is_sync = 1;
          this.createAdvAndsync(1);
      } else {
        // 不同步资料库
        // this.advertisement.is_sync = 0;
        this.createAdvAndsync(0);
      }
    },
    createAdv() {
      this.$confirm('是否同步到资料库?', '提示', {
          confirmButtonText: '同步',
          cancelButtonText: '不同步',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          this.advertisement.is_sync = 1;
          this.createAdvAndsync(1);
        }).catch(() => {

        });
    },
    createAdvAndsync(type) {
      let url = this.advertisement.adv_id ? 'updateAdv' : 'createAdv';
      this.advertisement.is_sync = type;
      if(this.$route.params.str) {
        this.advertisement.webinar_id = this.$route.params.str;
      }
      let params = Object.assign({}, this.advertisement) ;
      params.img_url = this.$parseURL(params.img_url).path;
      this.$fetch(url, params).then(res => {
        if (res && res.code === 200) {
          this.dialogVisible = false;
          this.dialogTongVisible = false;
          this.advertisement = {};
          this.clearForm();
          this.$message({
            message: `${this.advInfo.adv_id ? '修改' : '创建'}成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          // 获取列表数据
          this.$emit('reload');
        } else {
          this.dialogVisible = true;
          this.$message({
            message: `链接格式不正确`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        }
      }).catch(() => {
        this.dialogVisible = true;
        this.$message({
          message: res.msg || `${this.advInfo.adv_id ? '修改' : '创建'}失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    },
    moreLoadData() {
      if (this.advertPageInfo.page >= this.maxPage) {
        return false;
      }
      this.advertPageInfo.page ++ ;
      this.advertPageInfo.pos = parseInt((this.advertPageInfo.page - 1) * this.advertPageInfo.limit);
      this.activityData();
    },
    activityData() {
      if (this.advertisementTitle) {
          this.nullText = 'search';
          this.text = '';
          this.isSearch = true;
        } else {
          this.nullText = 'nullData';
          this.text = '您还没有广告，快来创建吧！';
          this.isSearch = false;
        }
      this.$fetch('getAdvList', this.$params({
        keyword: this.advertisementTitle,
        ...this.advertPageInfo
      })).then(res => {
        if(res && res.code === 200) {
          let adList = res.data.adv_list;
          this.total = res.data.total;
          adList.map(item => {
            item.isChecked = false;
          });
          this.adList.push(...adList);
          this.maxPage = Math.ceil(res.data.total / this.advertPageInfo.limit);
        } else {
          this.adList = [];
        }
      });
    },
    changeAdverment() {
      this.advertPageInfo = {
        pos: 0,
        limit: 6,
        page: 1
      }
      this.adList = [];
      this.selectChecked = [];
      this.activityData();
    },
    choiseAdvisetion(items) {
      items.isChecked = !items.isChecked;
      this.selectChecked = this.adList.filter(item => item.isChecked).map(item => item.adv_id);
    },
    // 从资料库保存到活动
    advSaveToWebinar(id) {
      if (this.maxTotal + this.selectChecked.length > 50) {
        this.$message({
          message: `广告推荐个数已达到最大个数限制，请删除后再进行添加`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
      let params = {
        webinar_id: this.$route.params.str,
        adv_ids: this.selectChecked.join(',')
      }
      this.$fetch('advSaveToWebinar', params).then(res => {
        if (res.code == 200) {
          this.$message({
            message: `选择广告成功`,
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          this.dialogAdverVisible = false;
          this.selectChecked = [];
          this.adList.map(item => {
            item.isChecked = false;
          });
          this.$emit('reload');
        } else {
          this.$message({
            message: `选择广告失败`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        }
      })
    },
    // 删除
    deleteImg() {
      this.advertisement.img_url = '';
      this.domain_url = '';
    },
    uploadAdvSuccess(res, file) {
      console.log(res, file);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.advertisement.img_url = file_url;
        this.domain_url = domain_url;
      }
      // 触发验证
      this.$refs.advertisementForm.validateField('img_url');
    },
    beforeUploadHnadler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      console.log(typeArr, '??????????')
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message({
          message: `推广图片只能是 ${typeList.join('、')} 格式`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: `推广图片大小不能超过 2M`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message({
        message: `推广图片上传失败`,
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    handleFileChange(file) {
      console.log(file);
      // this.handleuploadSuccess(file);
    }
  }
};
</script>
<style lang="less" scoped>
.dialog-box {
  .search-dialog-tag {
    /deep/.el-input__inner {
      border-radius: 20px;
      height: 36px;
      padding-right: 50px!important;
    }
    /deep/ .el-input__suffix {
      .el-input__suffix-inner {
        i {
          margin-right: 5px;
          line-height: 36px;
          cursor: pointer;
        }
      }
      /deep/ .el-input__icon {
        width: auto;
      }
    }
  }
  /deep/.el-dialog {
    border-radius: 4px;
    // padding-bottom: 15px;
  }
  /deep/.el-dialog__title {
    // font-size: 16px;
    font-weight: 500;
    color: #1A1A1A;
  }
  /deep/.saasicon_shangchuan::before {
    font-size: 44px;
  }
  /deep/.img-box ,/deep/.el-upload{
    width: 324px;
    height: 130px;
  }
  /deep/.el-input__inner{
   padding: 0 12px;
  }
  /deep/.el-input__count-inner {
    color: #999;
  }
  /*  /deep/.el-dialog__body{
    padding-bottom: 40px;
  } */
  /deep/.noPic {
    width: 324px !important;
    height: 130px !important;
    background: #F7F7F7;
    /deep/.saasicon_shangchuan::before {
      color: #999;
      }
  }
  /deep/.el-dialog__footer {
    padding-top: 0!important;
  }
}
   /deep/.el-upload{
     border: 1px solid #ccc;
   }
   .content{
     padding-bottom: 50px;
     position: relative;
     .search{
       height: 40px;
       margin-bottom: 18px;
       /deep/.el-input__inner{
         border-radius: 20px;
       }
       .el-input__suffix{
         right: 8px;
       }
     }
     .ad-list{
       display: flex;
      //  justify-content: space-between;
      //  align-items: center;
       flex-wrap: wrap;
       height: 310px;
      //  overflow: auto;
       .ad-item{
          width: 165px;
          margin-bottom: 12px;
          background: #F7F7F7;
          position: relative;
          margin-right: 15px;
          height: 150px;
          border: 1px solid transparent;
          // background-size: 100% 100%;
          // animation: gradientBG 15s ease infinite;
          // padding: 10px 10px;
          // box-sizing: border-box;
          // position: relative;
          border-radius: 4px;
          &.active{
            background: #FFFFFF;
            box-shadow: 0px 6px 12px 0px rgba(251, 58, 50, 0.16);
            border: 1px solid #FB3A32;
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
        .spanImg{
          display: block;
          width: 163px;
          height: 93px;
          background: #1A1A1A;
          border-radius: 4px 4px 0 0;
          img{
           width:100%;
           height:100%;
           object-fit: scale-down;
         }
        }
         p{
           padding: 10px 0 0 5px;
           color:#1A1A1A;
           font-size: 14px;
           line-height: 20px;
           font-weight: 400px;
         }
       }
     }
   }
  .sureQuestion{
    padding-bottom: 24px;
    .textPrize{
      padding-left: 50px;
      p{
        font-size: 16px;
        color: #1A1A1A;
        padding-bottom: 15px;
      }
      /deep/.el-checkbox__label{
        color: #666;
      }
      /deep/.el-checkbox__input.is-checked+.el-checkbox__label{
        color: #666;
      }
      /deep/.el-checkbox__input.is-checked .el-checkbox__inner{
        background-color: #FB3A32;
        border-color: #FB3A32;
      }
    }
    .dialog-footer{
      text-align: center;
      margin-top: 20px;
    }
  }
  .text{
       margin-top: 10px;
      position: absolute;
      bottom: 40px;
       span{
         color: #FB3A32;
         padding: 0 5px;
       }
     }
  .sureBtn{
    position: absolute;
    right: 32px;
    bottom: 24px;
  }
</style>
