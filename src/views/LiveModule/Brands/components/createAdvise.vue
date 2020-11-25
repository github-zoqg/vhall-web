<template>
  <div class="dialog-box">
    <VhallDialog
      title="创建广告推荐"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="468px">
      <el-form label-width="80px" :model="advertisement" :rules="rules">
      <el-form-item label="推广图片" prop="imgUrl">
        <div class="img-box">
           <upload
              class="giftUpload"
              v-model="advertisement.imgUrl"
              >
              <p slot="tip">推荐尺寸：400*225px，小于2MB <br> 支持jpg、gif、png、bmp</p>
            </upload>
        </div>
      </el-form-item>
      <el-form-item label="标题" prop="title">
        <el-input v-model="advertisement.title" maxlength="15" show-word-limit placeholder="请输入广告标题"></el-input>
      </el-form-item>
      <el-form-item label="链接" prop="link">
        <el-input v-model="advertisement.link" placeholder="请输入广告链接"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false" round>确 定</el-button>
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
              <img src="../../../../common/images/avatar.jpg" alt="">
              <p>{{ item.name }}</p>
              <label class="img-tangle" v-show="item.isChecked">
                <i class="el-icon-check"></i>
              </label>
            </div>
          </div>
        </el-scrollbar>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogAdverVisible = false" round>确 定</el-button>
        <el-button @click="dialogAdverVisible = false" round>取 消</el-button>
      </span>
    </VhallDialog>
  </div>
</template>
<script>
import upload from '@/components/Upload/main';
export default {
  data() {
    return {
      dialogVisible: false,
      dialogAdverVisible: false,
      advertisementTitle: '',
      rules: {
        title: [
          { required: true, message: '请输入广告标题', trigger: 'blur' },
        ],
        imgUrl: [
          { required: true, message: '请选择推广图片', trigger: 'change' }
        ],
        link: [
          { type: 'date', required: true, message: '请输入广告链接', trigger: 'blur' }
        ],
      },
      advertisement: {},
      adList: [
        {
          name: '1多屏协同戴森多功能吸尘器时日五',
          isChecked: false
        },
        {
          name: '2多屏协同戴森多功能吸尘器时日五',
          isChecked: false
        },
        {
          name: '3多屏协同戴森多功能吸尘器时日五',
          isChecked: false
        },
        {
          name: '4多屏协同戴森多功能吸尘器时日五',
          isChecked: false
        },
        {
          name: '5多屏协同戴森多功能吸尘器时日五',
          isChecked: false
        },
        {
          name: '6多屏协同戴森多功能吸尘器时日五',
          isChecked: false
        },
        {
          name: '7多屏协同戴森多功能吸尘器时日五',
          isChecked: false
        }
      ]
    };
  },
  components: {
    upload
  },
  methods: {
    choiseAdvisetion(items) {
      this.adList.map(item => {
       item.isChecked = false;
       items.isChecked = true;
      });
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
       justify-content: space-between;
       align-items: center;
       flex-wrap: wrap;
       height: 300px;
       .ad-item{
         width: 165px;
         margin-bottom: 20px;
         background: #F7F7F7;
         position: relative;
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
