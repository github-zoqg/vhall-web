<template>
  <div class="form-product">
    <pageTitle title="创建商品"></pageTitle>
    <div class="add-product">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="商品名称" prop="name">
          <VhallInput v-model.trim="form.name" maxlength="30" show-word-limit placeholder="请输入商品名称"></VhallInput>
        </el-form-item>
        <el-form-item label="商品图片" prop="img_id">
          <div class="imgList">
            <div class="img-item" v-for="(item, index) in fileList" :key="index">
              <span class="cover-item" v-if="item.cover">封面</span>
              <!-- <img :src="item.url" alt="" v-if="item.url"> -->
              <upload
                class="giftUpload"
                v-model="item.url"
                :domain_url="item.domain_url"
                :on-success="productLoadSuccess"
                :on-progress="uploadProcess"
                :on-error="uploadError"
                :on-preview="uploadPreview"
                :restPic="true"
                @resetImage="resetPic(item)"
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
                :before-upload="beforeUploadHandler"
                :restPic="true"
                >
                <p slot="tip">上传图片</p>
              </upload>
            </div>
          </div>
          <p class="imgText">只能上传jpg/png/gif/bmp格式，不能超过2MB，建议尺寸：600*600px</p>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
          <VhallInput type="textarea" v-model.trim="form.description" maxlength="140" show-word-limit :autosize="{ minRows: 4}" placeholder="请输入商品描述"></VhallInput>
        </el-form-item>
        <el-form-item label="商品原价" prop="price">
          <el-input v-model.trim="form.price" placeholder="请输入商品原价0-99999999.99元" maxlength="11" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"><span style="padding-left:6px; padding-top: 1px;" slot="prefix">￥</span><i slot="suffix">元</i></el-input>
        </el-form-item>
        <el-form-item label="优惠价" prop="discount_price">
         <el-input v-model.trim="form.discount_price" placeholder="请输入商品优惠价0-99999999.99元" maxlength="11" onkeyup="this.value= this.value.match(/\d+(\.\d{0,2})?/) ? this.value.match(/\d+(\.\d{0,2})?/)[0] : ''"><span style="padding-left: 6px; padding-top: 1px;" slot="prefix">￥</span><i slot="suffix">元</i></el-input>
        </el-form-item>
        <el-form-item label="商品链接" prop="url">
          <el-input v-model.trim="form.url" placeholder="请输入商品链接"></el-input>
        </el-form-item>
        <el-form-item label="淘口令">
          <el-input v-model.trim="form.tao_password" placeholder="请输入淘口令"></el-input>
        </el-form-item>
        <el-form-item label="店铺链接" prop="shop_url">
          <el-input v-model.trim="form.shop_url" placeholder="请输入店铺链接"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" round class="length152" @click="onSubmit">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import upload from '@/components/Upload/main';
import PageTitle from '@/components/PageTitle';
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
    // 商品链接
    const linkValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入商品链接'));
      } else {
        if (!this.linkCodeMatch(value)) {
          callback && callback('请输入正确得商品链接地址');
        } else {
          callback();
        }
      }
    };
    // 店铺链接
    const shopValidate = (rule, value, callback) => {
      if (value) {
        if (!this.linkCodeMatch(value)) {
          callback && callback('请输入正确得店铺链接地址');
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    // 商品原价
    const priceValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入商品原价'));
      } else {
        if (value <= 0 || value > 99999999.99) {
          callback && callback('价格必须大于0且小于99999999.99');
        } else {
          callback();
        }
      }
    };
    // 商品优惠价
    const priceCountValidate = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请输入商品优惠价'));
      } else {
        if (value <= 0 || value > 99999999.99) {
          callback && callback('价格必须大于0且小于99999999.99');
        } else {
          if (value - this.form.price > 0) {
            callback && callback('商品优惠价必须小于或等于商品原价');
          } else {
            callback();
          }
        }
      }
    }
    return {
      editGoodInfo: {},
      isReset: false,
      resetImgItem: {},
      defaultCover: 0, //设置默认封面的id
      isEdit: !!this.$route.query.goodId,
      imgIdMap: new Map(),
      form: {
        img_id: [],
        imageUrl: '',
        url: '',
        shop_url: ''
      },
      fileList: [],
      rules: {
        name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        img_id: [
          { required: true, validator: imgValidate, trigger: 'change' }
        ],
        description: [
          { required: true, message: '请输入商品描述', trigger: 'blur' }
        ],
        price: [
          { required: true, validator: priceValidate, trigger: 'blur' }
        ],
        discount_price: [
          { required: true, validator: priceCountValidate, trigger: 'blur' }
        ],
        url: [
          { required: true, validator: linkValidate, trigger: 'blur'},
        ],
        shop_url: [
          { required: false, validator: shopValidate, trigger: 'blur'},
        ]
      },
    };
  },
  created() {
    if (this.isEdit) {
      this.getGoodInfo();
    }
  },
  components: {
    upload,
    PageTitle
  },
  methods: {
    // 验证商品链接和店铺链接
    linkCodeMatch(value) {
      let reg = /(http|https):\/\/[\w\-_]+(\.[\w\-_]+).*?/g;
      if (!reg.test(value)) {
        return false;
      } else {
        return true;
      }
    },
    getGoodInfo() {
      this.$fetch('goodsInfoGet', {
        webinar_id: this.$route.params.str,
        goods_id: this.$route.query.goodId
      }).then(res => {
        this.form = {
          ...res.data,
          ...this.form,
          url: res.data.goods_url
        };
        this.fileList = res.data.img_list.map(item => {
          this.form.img_id.push(item.img_id);
          return {
            domain_url: item.img_url,
            cover: item.is_cover ? true : false,
            url: item.img_url,
            img_id: item.img_id
          };
        });
        // 图片 ID 处理
        // res.data.img_list.forEach(item => {
        //   this.form.img_id.push(item.img_id);
        //   // this.imgIdMap.set(item.img_url, item.img_id);
        // });
      }).catch(err => {
        console.log(err);
      });
    },
    resetPic(item) {
      this.resetImgItem = item;
      this.isReset = true;
    },
    productLoadSuccess(res, file){
      console.log(res, file);
      let imageUrl = res.data.file_url;
      let domain_url = res.data.domain_url;
      // 生成图片 ID 添加到 imgIdArr 中
      this.generateImgId(imageUrl, domain_url);
      console.log(this.fileList);
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传封面图片只能是 ${typeList.join('、')} 格式!`);
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传封面图片大小不能超过 2MB!');
        return false;
      }
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
      // const id = this.imgIdMap.get(opt.url);
      // // this.delImg(id);
      // this.form.imgIdArr.map((item, index) => {
      //   if (item === id) {
      //     this.form.imgIdArr.splice(index, 1);
      //   }
      // });
      // this.imgIdMap.delete(opt.url);

      this.fileList.map((item, index) => {
        if (item.img_id === opt.img_id) {
          this.fileList.splice(index, 1);
          this.form.img_id.splice(index, 1);
        }
      });
      let length = this.fileList.length;
      if (length > 0 && opt.cover) {
        this.fileList[length-1].cover = true;
      }
    },
    // 删除商品图片
    delImg(id) {
      this.$fetch('goodsImgDel', {
        webinar_id: this.$route.params.str,
        goods_id: this.$route.query.goodId || '',
        img_id: id
      }).then(res => {
        console.log(this.fileList);
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    },
    coverPage(item) {
      this.fileList.map(item => item.cover = false);
      item.cover = true;
      // const id = this.imgIdMap.get(item.url);
      // this.$fetch('goodsSetCover', {
      //   webinar_id: this.$route.params.str,
      //   goods_id: this.$route.query.goodId,
      //   img_id: id
      // }).then(res => {
      //   this.fileList.map(item => item.cover = false);
      //   item.cover = true;
      //   console.log(this.fileList);
      //   console.log(res);
      // }).catch(err => {
      //   console.log(err);
      // });
    },
    // 生成图片id
    generateImgId(image_url, domain_url) {
      this.$fetch('goodsImgIdCreate', {
        webinar_id: this.$route.params.str,
        // goods_id: this.$route.query.goodId,
        image_url
      }).then(res => {
       if(res.code == 200 && res.data) {
        if (this.isReset) {
          // 如果是重置图片
          this.fileList.map((item, index) => {
            if (item.img_id === this.resetImgItem.img_id) {
              this.form.img_id.splice(index, 1, res.data.img_id);
              item.url = image_url;
              item.domain_url = domain_url;
              item.cover = this.resetImgItem.cover;
              item.img_id = res.data.img_id;
            }
          });
        } else {
          this.fileList.push({
            url: image_url,
            domain_url: domain_url,
            cover: false,
            img_id: res.data.img_id
          });
          this.form.img_id.push(res.data.img_id);
        }
        if (!this.fileList.some(item => item.cover)) {
          this.fileList[0].cover = true;
        }
        this.isReset = false;
        this.resetImgItem = {};
       }
        // this.imgIdMap.set(image_url, res.data.img_id);
      }).catch(err => {
        this.$message.error(`图片ID生成失败！`);
        console.log(err);
      });
    },
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.defaultCover = this.fileList.filter(item => item.cover).map(item => item.img_id).join(',');
          // this.form.imgIdArr = this.fileList.map(item => item.img_id);
          const obj = {
            ...this.form,
            webinar_id: this.$route.params.str,
            cover_id: this.defaultCover
          };
          let url;
          if (this.$route.query.goodId) {
            obj.goods_id = this.$route.query.goodId;
            url = 'goodsUpdate';
          } else {
            url = 'goodsCreate';
          }
          this.$fetch(url, this.$params(obj)).then(res => {
            if (res.code == 200 && res.data) {
              this.$message.success(this.$route.query.goodId ? '修改成功' : '创建成功');
              this.$router.push({
                path: `/live/productSet/${this.$route.params.str}`
              });
            } else {
               this.$message.error(res.msg || '保存失败！');
            }
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
      width: 60%;
    }
    /deep/.el-input, .el-textarea{
      width: 640px;
    }
    /deep/.el-input__count{
      bottom: 8px;
      line-height: 20px;
    }
    /deep/.el-input__inner, /deep/.el-textarea__inner{
      padding: 5px 12px;
    }
    /deep/.el-input--prefix .el-input__inner {
      padding-left: 24px;
    }
    .add-product{
      background: #fff;
      padding: 24px 32px;
      border-radius: 4px;
    }
    .el-form-item {
      margin-bottom: 32px;
      i{
        font-style: normal;
        padding: 0 10px;
        color: #666;
      }
      &:last-child{
        margin: 40px 0;
      }
    }
    /deep/.el-upload--picture-card{
      height: 148px;
    }
    /deep/.el-textarea .el-input__count{
      font-size: 14px;
      color: #666;
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
          width: 40px;
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
        &:hover .hover-item{
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
