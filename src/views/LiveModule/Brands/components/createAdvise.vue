<template>
  <div class="dialog-box">
    <VhallDialog
      :title="`${title}广告推荐`"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="468px">
      <el-form label-width="80px" :model="advertisement" ref="advertisementForm" :rules="rules">
      <el-form-item label="推广图片" prop="img_url">
        <div class="img-box">
          <!-- <img :src="advertisement.img_url" alt="" v-if=""> -->
           <upload
              class="giftUpload"
              v-model="advertisement.img_url"
              :domain_url="domain_url"
              :saveData="{
                path: 'saas/webinars/spread-imgs/',
                type: 'image',
              }"
              :on-success="uploadAdvSuccess"
              :on-progress="uploadProcess"
              :on-error="uploadError"
              :on-preview="uploadPreview"
              @handleFileChange="handleFileChange"
              :before-upload="beforeUploadHnadler"
              @delete="advertisement.img_url = ''"
              >
              <p slot="tip">推荐尺寸：400*225px，小于2MB <br> 支持jpg、gif、png、bmp</p>
            </upload>
        </div>
      </el-form-item>
      <el-form-item label="标题" prop="subject">
        <el-input v-model="advertisement.subject" maxlength="15" show-word-limit placeholder="请输入广告标题"></el-input>
      </el-form-item>
      <el-form-item label="链接" prop="url">
        <el-input v-model="advertisement.url" placeholder="请输入广告链接"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveAdviseHandle" round>确 定</el-button>
      <el-button @click="dialogVisible = false" round>取 消</el-button>
    </span>
    </VhallDialog>
    <VhallDialog
      title="选择广告推荐"
      :visible.sync="dialogAdverVisible"
      :close-on-click-modal="false"
      width="565px">
      <div class="content">
        <div class="search"><el-input v-model="advertisementTitle" placeholder="请输入广告标题" style="width: 220px" suffix-icon="el-icon-search"></el-input></div>
        <el-scrollbar>
          <div class="ad-list">
            <div class="ad-item" v-for="(item, index) in adList" :key="index" :class="item.isChecked ? 'active' : ''" @click="choiseAdvisetion(item)">
              <img :src="`${baseImgUrl}${item.img_url}`" alt="">
              <p>{{ item.subject }}</p>
              <label class="img-tangle" v-show="item.isChecked">
                <i class="el-icon-check"></i>
              </label>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="advSaveToWebinar(null)" round>确 定</el-button>
        <el-button @click="dialogAdverVisible = false" round>取 消</el-button>
      </span>
    </VhallDialog>
  </div>
</template>
<script>
import upload from '@/components/Upload/main';
import Env from "@/api/env";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogAdverVisible: false,
      advertisementTitle: '',
      baseImgUrl: Env.staticLinkVo.uploadBaseUrl,
      selectChecked: [],
      rules: {
        subject: [
          { required: true, message: '请输入广告标题', trigger: 'blur' },
        ],
        img_url: [
          { required: true, message: '请选择推广图片', trigger: 'change' }
        ],
        url: [
          { required: true,  message: '请输入广告链接', trigger: 'blur' }
        ],
      },
      domain_url: '',
      advertisement: {
        is_sync: 0,
        img_url: '',
        url: '',
        subject: null
      },
      adList: []
    };
  },
  props: {
    title:{
      type: String,
      default: '创建'
    },
    advInfo:{
      type: Object
    }
  },
  components: {
    upload
  },
  watch: {
    title() {
      if (this.title === '编辑') {
        this.$set(this.advertisement, 'img_url', this.advInfo.img_url);
        this.domain_url = this.advInfo.img_url;
        console.log(this.domain_url, this.advertisement.img_url, '广告推荐图片地址');
        this.$set(this.advertisement, 'subject', this.advInfo.subject);
        this.$set(this.advertisement, 'url', this.advInfo.url);
        this.$set(this.advertisement, 'adv_id', this.advInfo.adv_id);
      } else {
        this.clearForm();
      }
    }
  },
  // created() {
  //  /* if(this.dialogAdverVisible) {
  //     this.activityData();
  //   }*/
  // },
  methods: {
    clearForm() {
      this.$set(this.advertisement, 'img_url', '');
      this.$set(this.advertisement, 'subject', '');
      this.$set(this.advertisement, 'url', '');
      this.$set(this.advertisement, 'adv_id', '');
    },
    saveAdviseHandle() {
      this.$refs.advertisementForm.validate((valid) => {
        if (valid) {
          if (this.$route.params.str) {
            // 直播-新建广告
            this.createAdv();
          } else {
            // 资料库中广告推荐，默认不同步到资料库
            this.advertisement.is_sync = 0;
            this.createAdvAndsync(0);
          }
        }
      });
    },
    createAdv() {
      this.$confirm('是否同步到资料库?', '提示', {
          confirmButtonText: '同步',
          cancelButtonText: '不同步',
          customClass: 'zdy-message-box',
          type: 'warning'
        }).then(() => {
          this.advertisement.is_sync = 1;
          this.createAdvAndsync(1);
        }).catch(() => {
         this.advertisement.is_sync = 0;
         this.createAdvAndsync(0);
        });
    },
    createAdvAndsync(type) {
      let url = this.title === '编辑' ? 'updateAdv' : 'createAdv';
      if(this.$route.params.str) {
        this.advertisement.webinar_id = this.$route.params.str;
      }
      this.$fetch(url, this.advertisement).then(res => {
        if (res && res.code === 200) {
          this.dialogVisible = false;
          if (type) {
            this.advSaveToWebinar(res.data.adv_info.adv_id);
          }
          this.$message.success(`${this.title === '编辑' ? '修改' : '创建'}成功`);
          // 获取列表数据
          this.$emit('reload');
        }
      });
    },
    activityData() {
      this.$fetch('getAdvList', this.$params({
        keyword: this.advertisementTitle,
        pos: 0,
        limit: 6,
      })).then(res => {
        if(res && res.code === 200) {
          let adList = res.data.adv_list;
          adList.map(item => {
            item.isChecked = false;
          });
          this.adList = adList;
        } else {
          this.adList = [];
        }
      });
    },
    choiseAdvisetion(items) {
      items.isChecked = !items.isChecked;
    },
    // 从资料库保存到活动
    advSaveToWebinar(id) {
      if (!id) {
        this.selectChecked = this.adList.filter(item => item.isChecked).map(item => item.adv_id);
        if (this.selectChecked.length < 1) {
          this.dialogAdverVisible = false;
          return;
        } else {
          id = this.selectChecked.join(',');
        }
      }
      let params = {
        webinar_id: this.$route.params.str,
        adv_ids: id
      }
      this.$fetch('advSaveToWebinar', params).then(res => {
        this.$message.info(res.msg);
        this.$emit('reload');
      })
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
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`图片上传失败`);
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
   /deep/.el-upload{
     border: 1px solid #ccc;
   }
   .content{
     padding-bottom: 20px;
     .search{
       height: 40px;
       margin-bottom: 18px;
       /deep/.el-input__inner{
         border-radius: 20px;
       }
     }
     .ad-list{
       display: flex;
      //  justify-content: space-between;
      //  align-items: center;
       flex-wrap: wrap;
       max-height: 300px;
       .ad-item{
         width: 150px;
         margin-bottom: 20px;
         background: #F7F7F7;
         position: relative;
         margin-right: 15px;
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
         img{
           width:145px;
           height: 93px;
         }
         p{
           color:#1A1A1A;
           font-size: 14px;
           line-height: 20px;
           font-weight: 400px;
           padding-right: 5px;
         }
       }
     }
   }
</style>
