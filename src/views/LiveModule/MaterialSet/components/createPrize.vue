<template>
  <div class="prize-create">
    <VhallDialog
      :title="`${title}奖品`"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="468px">
      <el-form :model="prizeForm" :rules="rules" ref="prizeForm" label-width="80px">
        <el-form-item label="图片上传" required>
          <upload
            class="giftUpload"
            v-model="prizeForm.img_path"
            :domain_url="prizeForm.img_path"
            :on-success="prizeLoadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            @delete="deleteImg"
            :before-upload="beforeUploadHandler">
            <div slot="tip">
              <p>建议尺寸：120*120px，小于2M</p>
              <p>支持jpg、gif、png、bmp</p>
            </div>
          </upload>
        </el-form-item>
        <el-form-item label="奖品名称" prop="prize_name">
            <VhallInput v-model.trim="prizeForm.prize_name" maxlength="10" show-word-limit></VhallInput>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="surePrize" round  :disabled="!prizeForm.prize_name" v-preventReClick>确 定</el-button>
        <el-button @click.prevent.stop="dialogVisible = false" round>取 消</el-button>
      </span>
    </VhallDialog>
    <VhallDialog
      title="资料库选择"
      :visible.sync="dialogPrizeVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
      width="588px">
     <div class="prizeList">
       <div class="search" v-show="total || isSearch">
         <el-input v-model.trim="keyword" placeholder="请输入奖品名称" suffix-icon="el-icon-search" @change="inputChange" style="width:220px" clearable></el-input>
       </div>
       <div v-show="total">
        <el-scrollbar v-loadMore="moreLoadData">
         <div class="prize">
           <div class="prize-item" v-for="(item, index) in list" :key="index" :class="item.isChecked ? 'active' : ''" @click.stop="choisePrize(item)">
             <img :src="item.img_path" alt="">
             <div class="prize-title">
               <h1>{{item.prize_name}}</h1>
               <p>{{item.prize_id}}</p>
             </div>
             <label class="img-tangle" v-show="item.isChecked">
              <i class="el-icon-check"></i>
            </label>
           </div>
         </div>
       </el-scrollbar>
       </div>
        <div class="no-live" v-show="!total">
          <noData :nullType="nullText" :text="text" :height="50">
            <el-button type="primary" v-if="nullText == 'nullData'" round  @click.prevent.stop="dialogVisible == true" v-preventReClick>创建抽奖</el-button>
          </noData>
        </div>
       <div class="prize-check" v-show="total || isSearch"><span>当前选中 <b>{{ checkedList.length }}</b> 件奖品</span></div>
       <div class="dialog-footer" v-show="total || isSearch">
        <el-button size="medium" type="primary" @click="sureChoisePrize" v-preventReClick round :disabled="!checkedList.length">确 定</el-button>
        <el-button size="medium" @click.prevent.stop="dialogPrizeVisible = false" v-preventReClick round>取 消</el-button>
       </div>
     </div>
    </VhallDialog>
    <VhallDialog
      title="提示"
      :visible.sync="dialogTongVisible"
      :close-on-click-modal="false"
      :before-close="handleClose"
      width="400px"
    >
      <div class="surePrize">
        <div class="textPrize">
          <p>确定保存当前奖品？</p>
          <el-checkbox v-model="sureChecked">共享到资料管理</el-checkbox>
        </div>
        <div class="dialog-footer">
          <el-button size="medium" type="primary" @click="sureMaterialPrize" round>确 定</el-button>
          <el-button size="medium"  @click="dialogTongVisible=false"  round>取 消</el-button>
       </div>
      </div>
    </VhallDialog>
  </div>
</template>
<script>
import upload from '@/components/Upload/main';
import noData from '@/views/PlatformModule/Error/nullPage';
export default {
  data() {
    return {
      dialogVisible: false,
      dialogPrizeVisible: false,
      dialogTongVisible: false,
      keyword: '',
      sureChecked: true,
      checkedList: [],
      maxPage: 0,
      total: 0,
      nullText: 'nullData',
      isSearch: false,
      text: '您还没有奖品，快来创建吧！',
      prizePageInfo: {
        pos: 0,
        limit: 6,
        page: 1,
      },
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
      list: []
    };
  },
  computed: {
    title() {
      if (this.prizeInfo.prize_id) {
        this.$set(this.prizeForm, 'img_path', this.prizeInfo.img_path);
        this.$set(this.prizeForm, 'prize_name', this.prizeInfo.prize_name);
        this.$set(this.prizeForm, 'prize_id', this.prizeInfo.prize_id);
        this.$set(this.prizeForm, 'source', this.$parent.source);
        return '编辑';
      } else {
        this.prizeResetForm();
        return '创建';
      }
    }
  },
  props: ['prizeInfo', 'liveTotal'],
  components: {
    upload,
    noData
  },
  watch: {
    dialogPrizeVisible() {
      if (this.dialogPrizeVisible) {
        this.list = [];
        this.checkedList = [];
        this.keyword = '';
        this.prizePageInfo = {
          pos: 0,
          limit: 6,
          page: 1,
        };
        this.getPrizeList();
      } else {
        this.list = [];
        // this.list.map(item => item.isChecked = false)
      }
    }
  },
  methods: {
    handleClose(done) {
      this.checkedList = [];
      this.prizePageInfo.page = 1;
      done();
    },
    prizeResetForm() {
      this.prizeForm = {
        source: this.$parent.source,
        img_path: '',
        prize_name: ''
      }
    },
    surePrize() {
      if (!this.prizeForm.img_path) {
        this.$message.error("请上传图片");
        return;
      }
      this.$refs.prizeForm.validate((valid) => {
        if (valid) {
          if (this.$parent.source == 1) {
            this.materiaPrize();
          } else {
            if (this.title == '创建') {
              this.dialogTongVisible = true;
            } else {
              this.liveSurePrize();
            }
          }
        } else {
          return false;
        }
      });
    },
    // 同步资料库的保存
    sureMaterialPrize() {
      if (this.sureChecked) {
        this.materiaPrize();
        this.liveSurePrize();
        this.dialogTongVisible = false;
      } else {
        // 不保存资料库
        this.liveSurePrize();
        this.dialogTongVisible = false;
      }
    },
    // 资料库保存奖品
    materiaPrize() {
      this.prizeForm.room_id = '';
      this.prizeForm.source = 1;
      this.$fetch('createPrize', this.$params(this.prizeForm)).then(res => {
        if (res.code == 200) {
          this.dialogVisible = false;
          this.$message.success(`资料中心奖品${this.title === '编辑' ? '修改' : '新建'}成功`);
          this.$emit('getTableList');
        } else {
          this.dialogVisible = true;
          this.$message.error(res.msg);
        }
      })
    },
    // 直播下的保存奖品
    liveSurePrize() {
      this.prizeForm.source = 0;
      this.prizeForm.room_id = this.$route.query.roomId || '';
      this.$fetch('createPrize', this.$params(this.prizeForm)).then(res => {
        if (res.code == 200) {
          this.dialogVisible = false;
          this.$message.success(`直播下奖品${this.title === '编辑' ? '修改' : '新建'}成功`);
          this.$emit('getTableList');
        } else {
          this.$message.error(res.msg);
          this.dialogVisible = true;
        }
      })
    },
    sureChoisePrize() {
      if (this.liveTotal + this.checkedList.length > 20) {
        this.$message.error('每个活动最多显示20个奖品，超过20个后无法关联，需要将原有奖品删除')
        return;
      }
      let params = {
        room_id: this.$route.query.roomId,
        prize_id: this.checkedList.join(',')
      }
      this.$fetch('saveLotteryPrize', params).then(res => {
        if (res.code == 200) {
          this.$message.success('选择成功');
          this.dialogPrizeVisible = false;
          this.list.map(item => {
            item.isChecked = false;
          });
          this.list = [];
          this.checkedList = [];
          this.$emit('getTableList');
        } else {
          this.$message.error(res.msg);
        }
      })
    },
    inputChange() {
      this.prizePageInfo = {
        pos: 0,
        page: 1,
        limit: 6
      }
      this.checkedList = [];
      this.list = [];
      this.getPrizeList();
    },
    moreLoadData() {
      if (this.prizePageInfo.page >= this.maxPage) {
        return false;
      }
      this.prizePageInfo.page ++ ;
      this.prizePageInfo.pos = parseInt((this.prizePageInfo.page - 1) * this.prizePageInfo.limit);
      this.getPrizeList();
    },
    getPrizeList() {
      let params = {
        keyword: this.keyword,
        source: 1,
        ...this.prizePageInfo
      }
      this.$fetch('getPrizeList', params).then(res => {
        let adList = res.data.list;
        adList.map(item => {
          item.isChecked = false;
        });
        this.list.push(...adList);
        this.total = res.data.count;
        if (this.keyword) {
        this.nullText = 'search';
        this.text = '';
        this.isSearch = true;
      } else {
        this.nullText = 'nullData';
        this.text = '您还没有奖品，快来创建吧！';
        this.isSearch = false;
      }
        this.maxPage = Math.ceil(res.data.count / this.prizePageInfo.limit);
      })
    },
    deleteImg() {
      this.prizeForm.img_path = '';
    },
    prizeLoadSuccess(res, file){
      console.log(res, file);
      // this.prizeForm.imageUrl = URL.createObjectURL(file.raw);
      // this.prizeForm.img_path = res.data.file_url;
      this.prizeForm.img_path = res.data.domain_url;
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
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传奖品图片只能是 ${typeList.join('、')} 格式!`);
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传奖品图片大小不能超过 2MB!');
        return false;
      }
      return isType && isLt2M;
    },
    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`奖品图片上传失败`);
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
      this.checkedList = this.list.filter(items => items.isChecked).map(item => item.prize_id);
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
  .surePrize{
    padding-bottom: 16px;
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
    }
    .dialog-footer{
      text-align: center;
      margin-top: 20px;
    }
  }
}
</style>
