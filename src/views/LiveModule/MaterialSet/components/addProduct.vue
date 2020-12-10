<template>
  <div class="form-product">
    <el-card>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="form.name" maxlength="30" show-word-limit placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品图片" prop="imgIdArr">
          <div class="imgList">
            <div class="img-item" v-for="(item, index) in fileList" :key="index">
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
            <div class="img-item" v-if="fileList.length<4">
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
              <!-- <div class="img-item" v-for="(item, index) in fileList" :key="index">
                <div class="hover-item">
                  <p><i class="el-icon-collection"></i><br/>封面</p>
                  <p><i class="el-icon-delete"></i><br/>删除</p>
                </div>
                <span class="cover-item" v-if="item.cover">封面</span>
                <img :src="item.url" alt="">
              </div>
              <div class="img-item" v-if="fileList.length<4">
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
        <el-form-item label="商品描述" prop="description">
          <el-input type="textarea" v-model="form.description" maxlength="140" show-word-limit :autosize="{ minRows: 4}" placeholder="请输入商品描述"></el-input>
        </el-form-item>
        <el-form-item label="商品原价" prop="price">
          <el-input v-model="form.price" placeholder="请输入商品原价0.00元"><i slot="suffix">元</i></el-input>
        </el-form-item>
        <el-form-item label="优惠价">
         <el-input v-model="form.discount_price" placeholder="请输入商品优惠价0.00元"><i slot="suffix">元</i></el-input>
        </el-form-item>
        <el-form-item label="商品链接" prop="url">
          <el-input v-model="form.url" placeholder="请输入商品链接"></el-input>
        </el-form-item>
        <el-form-item label="淘口令">
          <el-input v-model="form.tao_password" placeholder="请输入淘口令"></el-input>
        </el-form-item>
        <el-form-item label="店铺链接">
          <el-input v-model="form.shop_url" placeholder="请输入店铺链接"></el-input>
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
    // 商品图片验证
    const imgValidate = (rule, value, callback) => {
      if (value && value.length === 0) {
        callback(new Error('请选择图片'));
      } else {
        callback && callback();
      }
    };
    return {
      editGoodInfo: {},
      isEdit: !!this.$route.query.goodId,
      imgIdMap: new Map(),
      form: {
        imgIdArr: [],
        imageUrl: '',
        url: ''
      },
      fileList: [],
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
        ],
        imgIdArr: [
          { required: true, validator: imgValidate, trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入商品描述', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入商品原价', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入商品链接', trigger: 'blur' }
        ]
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.getGoodInfo();
    }
  },
  // watch: {

  // },
  components: {
    upload
  },
  methods: {
    getGoodInfo() {
      this.$fetch('goodsInfoGet', {
        webinar_id: this.$route.params.str,
        goods_id: this.$route.query.goodId
      }).then(res => {
        this.form = {
          ...res.data,
          ...this.form,
          url: res.data.good_url,
        };
        this.fileList = res.data.img_list.map(item => {
          return {
            url: item.img_url,
            cover: item.is_cover === '1'
          };
        });
        // 图片 ID 处理
        res.data.img_list.forEach(item => {
          this.form.imgIdArr.push(item.img_id);
          this.imgIdMap.set(item.img_url, item.img_id);
        });
      }).catch(err => {
        console.log(err);
      });
    },
    productLoadSuccess(res, file){
      console.log(res, file);
      this.form.imageUrl = res.data.file_url;
      this.fileList.push({
        url: this.form.imageUrl,
        cover: false
      });
      if (!this.fileList.some(item => item.cover)) {
        this.fileList[0].cover = true;
      }
      // 生成图片 ID 添加到 imgIdArr 中
      this.generateImgId(this.form.imageUrl);
      console.log(this.fileList);
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
      // 从 id 数组中删除
      console.log(this.imgIdMap);
      const id = this.imgIdMap.get(opt.url);
      this.delImg(id);
      this.form.imgIdArr.map((item, index) => {
        if (item === id) {
          this.form.imgIdArr.splice(index, 1);
        }
      });
      this.imgIdMap.delete(opt.url);

      this.fileList.map((item, index) => {
        if (item.url === opt.url) {
          this.fileList.splice(index, 1);
        }
      });
      let length = this.fileList.length;
      if (length > 0 && opt.cover) {
        this.fileList[length-1].cover = true;
        this.coverPage(this.fileList[length-1]);
      }
    },
    // 删除商品图片
    delImg(id) {
      this.$fetch('goodsImgDel', {
        webinar_id: this.$route.params.str,
        goods_id: this.$route.query.goodId,
        img_id: id
      }).then(res => {
        console.log(this.fileList);
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    },
    coverPage(item) {
      const id = this.imgIdMap.get(item.url);
      this.$fetch('goodsSetCover', {
        webinar_id: this.$route.params.str,
        goods_id: this.$route.query.goodId,
        img_id: id
      }).then(res => {
        this.fileList.map(item => item.cover = false);
        item.cover = true;
        console.log(this.fileList);
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    },
    // 生成图片id
    generateImgId(image_url) {
      this.$fetch('goodsImgIdCreate', {
        webinar_id: this.$route.params.str,
        goods_id: this.$route.query.goodId,
        image_url
      }).then(res => {
        this.form.imgIdArr.push(res.data.img_id);
        this.imgIdMap.set(image_url, res.data.img_id);
      }).catch(err => {
        this.$message.error(`图片ID生成失败！`);
        console.log(err);
      });
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const obj = {
            ...this.form,
            img_id: this.form.imgIdArr,
            webinar_id: this.$route.params.str
          };
          let url;
          if (this.$route.query.goodId) {
            obj.goods_id = this.$route.query.goodId;
            url = 'goodsUpdate';
          } else {
            url = 'goodsCreate';
          }
          this.$fetch(url, obj).then(res => {
            this.$router.push({
              name: 'productSet',
              params: {
                str: this.$route.params.str
              }
            });
          }).catch(err => {
            this.$message.error('保存失败！');
          });
        } else {
          this.$message.error('请检查填写格式！');
        }
      });


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
