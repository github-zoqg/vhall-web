<template>
  <div class="form-product">
    <el-card>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" maxlength="30" show-word-limit placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="imgUrl">
          <div class="imgList">
            <div class="img-item" v-for="(item, index) in flieList" :key="index">
              <span class="cover-item" v-if="item.cover">封面</span>
              <!-- <img :src="item.url" alt="" v-if="item.url"> -->
              <upload
                class="giftUpload"
                v-model="item.url"
                :on-success="productLoadSuccess"
                :on-progress="uploadProcess"
                :on-error="uploadError"
                :on-preview="uploadPreview"
                :restPic="true"
                :coverPic="!item.cover"
                @delete="formDelete(item)"
                @coverPage="coverPage(item)"
                >
                <p slot="tip">上传图片</p>
              </upload>
            </div>
            <div class="img-item" v-if="flieList.length<4">
               <upload
                class="giftUpload"
                :on-success="productLoadSuccess"
                :on-progress="uploadProcess"
                :on-error="uploadError"
                :on-preview="uploadPreview"
                :restPic="true"
                >
                <p slot="tip">上传图片</p>
              </upload>
            </div>
              <!-- <div class="img-item" v-for="(item, index) in flieList" :key="index">
                <div class="hover-item">
                  <p><i class="el-icon-collection"></i><br/>封面</p>
                  <p><i class="el-icon-delete"></i><br/>删除</p>
                </div>
                <span class="cover-item" v-if="item.cover">封面</span>
                <img :src="item.url" alt="">
              </div>
              <div class="img-item" v-if="flieList.length<4">
                <upload
                  class="giftUpload"
                  :on-success="productLoadSuccess"
                  :on-progress="uploadProcess"
                  :on-error="uploadError"
                  :on-preview="uploadPreview"
                  :restPic="true"
                  >
                  <p slot="tip">上传图片</p>
                </upload>
              </div> -->
          </div>
          <p class="imgText">只能上传jpg/png/gif/bmp格式，不能超过2MB，尺寸：600*600</p>
        </el-form-item>
        <el-form-item label="商品描述" prop="desc">
          <el-input type="textarea" v-model="form.desc" maxlength="140" show-word-limit :autosize="{ minRows: 4}" placeholder="请输入商品描述"></el-input>
        </el-form-item>
        <el-form-item label="商品原价" prop="oldPrice">
          <el-input v-model="form.oldPrice" placeholder="请输入商品原价0.00元"><i slot="suffix">元</i></el-input>
        </el-form-item>
        <el-form-item label="优惠价">
         <el-input v-model="form.price" placeholder="请输入商品优惠价0.00元"><i slot="suffix">元</i></el-input>
        </el-form-item>
        <el-form-item label="商品链接" prop="link">
          <el-input v-model="form.link" placeholder="请输入商品链接"></el-input>
        </el-form-item>
        <el-form-item label="淘口令">
          <el-input v-model="form.taoLink" placeholder="请输入淘口令"></el-input>
        </el-form-item>
        <el-form-item label="店铺链接">
          <el-input v-model="form.storeLink" placeholder="请输入店铺链接"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import upload from '@/components/Upload/main';
export default {
  data() {
    return {
      form: {
        imageUrl: ''
      },
      flieList: [],
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
        imgUrl: [
          { required: true, message: '请选择图片', trigger: 'change' }
        ],
        desc: [
          { type: 'date', required: true, message: '请输入商品描述', trigger: 'blur' }
        ],
        oldPrice: [
          { type: 'date', required: true, message: '请输入商品原价', trigger: 'blur' }
        ],
        link: [
          { required: true, message: '请输入商品链接', trigger: 'blur' }
        ]
      },
    };
  },
  // watch: {

  // },
  components: {
    upload
  },
  methods: {
    productLoadSuccess(res, file){
      console.log(res, file);
      this.form.imageUrl = URL.createObjectURL(file.raw);
      this.flieList.push({
        url: this.form.imageUrl,
        cover: false
      });
      this.flieList[0].cover = true;
      console.log(this.flieList);
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
    // 删除
    formDelete(opt) {
      this.flieList.map((item, index) => {
        if (item.url === opt.url) {
          this.flieList.splice(index, 1);
        }
      });
      let length = this.flieList.length;
      if (opt.cover) {
          this.flieList[length-1].cover = true;
        }
    },
    coverPage(item) {
      this.flieList.map(item => item.cover = false);
      item.cover = true;
    },
    onSubmit() {
      console.log("111111111111");
    }
  }
};
</script>
<style lang="less" scoped>
  .form-product{
    /deep/.el-card__body{
      padding: 48px;
    }
    /deep/.el-form{
      width: 50%;
    }
    .el-form-item {
      margin-bottom: 32px;
      i{
        font-style: normal;
        padding: 0 10px;
        color: #666;
      }
    }
    /deep/.el-upload--picture-card{
      height: 148px;
    }
    .imgList{
      display: flex;
      height: 150px;
      // justify-content: space-between;
      align-items: center;
      .img-item{
        width: 150px;
        height: 150px;
        border: 4px;
        position: relative;
        // border: 1px dashed #ccc;
        margin-right: 10px;
        cursor: pointer;
        .cover-item{
          z-index: 100;
          position: absolute;
          top:0;
          left:0;
          background: #FB3A32;
          border-radius: 4px 0 12px 0;
          color: #fff;
          font-size: 12px;
          display: inline-block;
          text-align: center;
          width: 32px;
          line-height: 22px;
          height: 22px;
        }
        img{
          width: 148px;
          height: 148px;
        }
        .hover-item{
          position: absolute;
          height: 150px;
          width: 150px;
          top:0;
          left:0;
          z-index: 10;
          background:rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          color: #fff;
          i{
            font-size: 28px;
            color: #fff;
          }
          // display: none;
          // &::hover{
          //   display: block;
          // }
        }
        &::hover .hover-item{
          display: block;
        }
      }
    }
    .imgText{
      color: #999;
      font-size: 14px;
      line-height: 25px;
    }
  }
</style>
