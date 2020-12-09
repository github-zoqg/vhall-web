<template>
  <div class="prize-create">
    <VhallDialog
      :title="`${title}奖品`"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="468px">
      <el-form :model="prizeForm" :rules="rules" ref="prizeForm" label-width="80px">
        <el-form-item label="图片上传">
          <upload
            class="giftUpload"
            v-model="prizeForm.img_path"
            :domain_url="prizeForm.img_path"
            :on-success="prizeLoadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :before-upload="beforeUploadHandler">
            <p slot="tip">推荐尺寸：120*120px，小于2MB<br/> 支持jpg、gif、png、bmp</p>
          </upload>
        </el-form-item>
        <el-form-item label="奖品名称" prop="prize_name">
            <el-input v-model="prizeForm.prize_name" maxlength="10" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="surePrize" round  :disabled="!prizeForm.prize_name">确 定</el-button>
        <el-button @click.prevent.stop="dialogVisible = false" round>取 消</el-button>
      </span>
    </VhallDialog>
    <VhallDialog
      title="资料库选择"
      :visible.sync="dialogPrizeVisible"
      :close-on-click-modal="false"
      width="588px">
     <div class="prizeList">
       <div class="search">
         <el-input v-model="prizeForm.name" placeholder="请输入奖品名称" suffix-icon="el-icon-search" style="width:220px"></el-input>
       </div>
       <el-scrollbar>
         <div class="prize">
           <div class="prize-item" v-for="(item, index) in list" :key="index" :class="item.isChecked ? 'active' : ''" @click="choisePrize(item)">
             <img src="@/common/images/avatar.jpg" alt="">
             <div class="prize-title">
               <h1>{{item.name}}</h1>
               <p>{{item.type}}</p>
             </div>
             <label class="img-tangle" v-show="item.isChecked">
              <i class="el-icon-check"></i>
            </label>
           </div>
         </div>
       </el-scrollbar>
       <div class="prize-check"><span>当前选中 <b>{{ checkedList.length }}</b> 件奖品</span></div>
       <div class="dialog-footer">
        <el-button type="primary" @click="surePrize" round>确 定</el-button>
        <el-button @click.prevent.stop="dialogPrizeVisible = false" round>取 消</el-button>
       </div>
     </div>
    </VhallDialog>
  </div>
</template>
<script>
import upload from '@/components/Upload/main';
export default {
  data() {
    return {
      dialogVisible: false,
      dialogPrizeVisible: false,
      checkedList: [],
      prizeForm: {
        source: 1,
        img_path: '',
        prize_name: ''
      },
       rules: {
        prize_name: [
          { required: true, message: '请输入奖品名称', trigger: 'blur' }
        ]
      },
      list: [
        {
          name: '请输入奖品名称1',
          type: '001',
          isChecked: false
        },
        {
          name: '请输入奖品名称2',
          type: '002',
          isChecked: false
        },
        {
          name: '请输入奖品名称3',
          type: '003',
          isChecked: false
        },
        {
          name: '请输入奖品名称4',
          type: '004',
          isChecked: false
        },
        {
          name: '请输入奖品名称5',
          type: '005',
          isChecked: false
        },
        {
          name: '请输入奖品名称6',
          type: '006',
          isChecked: false
        }
      ]
    };
  },
  computed: {
    title() {
      if (this.prizeInfo.prize_id) {
        this.$set(this.prizeForm, 'img_path', this.prizeInfo.img_path);
        this.$set(this.prizeForm, 'prize_name', this.prizeInfo.prize_name);
        this.$set(this.prizeForm, 'prize_id', this.prizeInfo.prize_id);
        this.$set(this.prizeForm, 'source', 1);
        return '编辑';
      } else {
        this.prizeResetForm();
        return '新建';
      }
    }
  },
  props: ['prizeInfo'],
  components: {
    upload
  },
  methods: {
    prizeResetForm() {
      this.prizeForm = {
        source: 1,
        img_path: '',
        prize_name: ''
      }
    },
    surePrize() {
      this.$refs.prizeForm.validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          let url = this.title === '编辑' ? 'editPrize' : 'createPrize';
          this.$fetch(url, this.prizeForm).then(res => {
            console.log(res.data, '111111111111');
            this.$message.success(`${this.title === '编辑' ? '修改' : '新建'}成功`);
            this.$emit('getTableList');
          })
          console.log('新建奖品');
        } else {
          return false;
        }
      });
    },
    prizeLoadSuccess(res, file){
      console.log(res, file);
      // this.prizeForm.imageUrl = URL.createObjectURL(file.raw);
      this.prizeForm.img_path = res.data.file_url;
      // this.fileList.push({
      //   url: this.form.imageUrl,
      //   cover: false
      // });
      // if (!this.fileList.some(item => item.cover)) {
      //   this.fileList[0].cover = true;
      // }
      // // 生成图片 ID 添加到 imgIdArr 中
      // this.generateImgId(this.form.imageUrl);
      // console.log(this.fileList);
    },
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
      let imgSrc = window.URL.createObjectURL(file);
      let img = new Image();
      img.src = imgSrc;
      let that = this; // onload 里面不能用this
      img.onload = function () {
        // 我在这里就可以获取到图片的宽度和高度了 img.width 、img.height
        if (img.width > img.height) {
          that.imgType = 'widthMore';
        } else if (img.width < img.height) {
          that.imgType = 'heightMore';
        } else {
          that.imgType = 'default';
        }
      };
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`封面上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    cancelPeize() {
      this.dialogVisible = false;
      this.$refs[prizeForm].resetFields();
    },
    choisePrize(item) {
      item.isChecked = !item.isChecked;
      let arr = [];
      arr = this.list.filter(items => items.isChecked);
      this.checkedList = arr;
    }
  }
};
</script>
<style lang="less" scoped>
.prize-create{
  /deep/.el-input__inner{
    border-radius: 18px;
    height: 36px;
    background: transparent;
  }
  .prizeList{
    padding-bottom: 24px;
    .search{
      margin-bottom: 16px;
    }
    .prize{
      max-height: 300px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      .prize-item{
        width: 256px;
        height: 96px;
        display: flex;
        background: #F7F7F7;
        margin-bottom: 12px;
        border-radius: 4px;
        cursor: pointer;
        position: relative;
        img{
          width: 72px;
          height: 66px;
          margin: 15px 12px;
        }
        .prize-title{
          margin-top: 15px;
          h1{
            font-weight: 400;
            font-size: 14px;
            color: #1A1A1A;
            line-height: 30px;
          }
          p{
            color: #666;
            // line-height: 30px;
          }
        }
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
      }
    }
    .prize-check{
     span{
       color: #666;
       padding-right: 250px;
       b{
         color: #FB3A32;
       }
     }
      margin: 12px 0 24px 0;
    }
  }
}
</style>
