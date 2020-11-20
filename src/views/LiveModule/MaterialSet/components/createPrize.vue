<template>
  <div class="prize-create">
    <el-dialog
      title="创建奖品"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="468px">
      <el-form :model="prizeForm" :rules="rules" ref="prizeForm" label-width="80px">
        <el-form-item label="图片上传">
          <upload
            class="giftUpload"
            v-model="prizeForm.imageUrl"
            :on-success="handleuploadSuccess"
            :on-progress="uploadProcess"
            :on-error="uploadError"
            :on-preview="uploadPreview"
            :before-upload="beforeUploadHnadler">
            <p slot="tip">推荐尺寸：120*120px，小于2MB<br/> 支持jpg、gif、png、bmp</p>
          </upload>
        </el-form-item>
        <el-form-item label="奖品名称" prop="name">
            <el-input v-model="prizeForm.name" maxlength="10" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="surePrize" round size="medium" :disabled="!prizeForm.name">确 定</el-button>
        <el-button @click="cancelPeize" round size="medium">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog
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
       <div class="btnSure">
        <span>当前选中 <b>{{ checkedList.length }}</b> 件奖品</span>
        <el-button type="primary" @click="surePrize" round size="medium">确 定</el-button>
        <el-button @click="cancelPeize" round size="medium">取 消</el-button>
       </div>
     </div>
    </el-dialog>
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
        imageUrl: '',
        name: ''
      },
       rules: {
        name: [
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
  components: {
    upload
  },
  methods: {
    surePrize() {
      this.$refs[prizeForm].validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          console.log('新建奖品');
        } else {
          return false;
        }
      });
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
    .btnSure{
     span{
       color: #666;
       padding-right: 250px;
       b{
         color: #FB3A32;
       }
     }
      margin-top: 24px;
    }
  }
}
</style>
