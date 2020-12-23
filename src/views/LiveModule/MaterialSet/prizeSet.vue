<template>
  <div class="prize-card">
    <pageTitle title="抽奖">
    </pageTitle>
    <el-card>
       <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="抽奖页设置" name="first">
            <div class="give-item">
            <div class="give-prize">
              <el-form :model="formData" ref="ruleForm" label-width="100px">
                <el-form-item label="图片上传">
                  <upload
                    class="giftUpload"
                    v-model="previewSrc"
                    :domain_url="previewSrc"
                    :on-success="prizeLoadSuccess"
                    :on-progress="uploadProcess"
                    :on-error="uploadError"
                    :on-preview="uploadPreview"
                    @delete="deleteImg"
                    :before-upload="beforeUploadHandler">
                    <p slot="tip">推荐尺寸：240*240px，小于2MB <br/> 支持jpg、gif、png、bmp</p>
                  </upload>
                </el-form-item>
                <el-form-item label="模板库">
                    <div class="prize-type">
                      <p :class="isChecked == 0 ? 'active' : ''" @click="changeType(0)">
                        <img src="../../../common/images/gif/prize03.gif" alt="">
                        <label class="img-tangle" v-show="isChecked == 0" >
                          <i class="el-icon-check"></i>
                        </label>
                      </p>
                      <p :class="isChecked == 1 ? 'active' : ''" @click="changeType(1)">
                        <img src="../../../common/images/gif/prize01.gif" alt="" >
                        <label class="img-tangle" v-show="isChecked == 1" >
                          <i class="el-icon-check"></i>
                        </label>
                      </p>
                      <p :class="isChecked == 2 ? 'active' : ''" @click="changeType(2)">
                        <img src="../../../common/images/gif/prize02.gif" alt="">
                        <label class="img-tangle" v-show="isChecked == 2" >
                          <i class="el-icon-check"></i>
                        </label>
                      </p>
                    </div>
                </el-form-item>
                <el-form-item label="抽奖标题">
                    <el-input v-model.trim="formData.title" maxlength="10" placeholder="请输入抽奖标题" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="文字说明">
                    <el-input v-model.trim="formData.description" maxlength="20" placeholder="正在进行抽奖" show-word-limit></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :disabled='isDisabled' round @click="lotterySave">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="give-show">
              <div class="give-people">
                <h3>{{ formData.title || '抽奖' }}<i class="el-icon-close"></i></h3>
                <div class="prize-show" :style="`backgroundImage: url(${backgroundImg})`">
                </div>
                <div class="sureBtn">{{ formData.description || '正在进行抽奖...' }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
         <el-tab-pane label="领奖页设置" name="second">
          <div class="give-item">
            <div class="give-prize">
              <el-form :model="givePrizeForm" ref="ruleForm" label-width="100px" @keydown.enter.prevent>
                  <el-form-item v-for="(item, index) in givePrizeList" :key="index" :label="item.field" :ref="`${item.field_key}`">
                    <el-input v-model="givePrizeForm[item.field_key]" type="text" :placeholder="item.placeholder"></el-input>
                    <div class="isDelete">
                      <i class="el-icon-delete" @click="deleteGivePrize(index)" v-if="!Boolean(item.is_system)"></i>
                      <el-switch
                      v-if="index > 1"
                        v-model="item.is_required"
                        inactive-text="必填">
                      </el-switch>
                    </div>
                </el-form-item>
                <div class="add-prize" @click="addField">
                  <i class="el-icon-plus"></i>
                  添加字段
                </div>
                <el-form-item>
                  <el-button type="primary" round @click="sureGivePrize" :disabled='lotteryPage'>保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="give-show">
              <div class="give-people">
                <h3>领奖<i class="el-icon-close"></i></h3>
                <el-scrollbar class="scroll-bar">
                  <div class="give-msg">
                    <el-form :model="givePrizeForm">
                      <el-form-item v-for="(item, index) in givePrizeList" :key="index">
                        <el-input v-model="givePrizeForm[item.field_key]" readonly type="text" :placeholder="item.placeholder"></el-input>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-scrollbar>
                <div class="sureBtn"><el-button type="primary" round>确定</el-button></div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="third">
           <span slot="label"><i class="el-icon-date"></i>
           奖品设置
            <el-tooltip class="prize--set" effect="dark" placement="right" style="margin-left:5px">
              <i class="el-icon-question ques"></i>
              <div slot="content">
                每个活动最多显示20个奖品，超过20个后无法关联，需要将原有奖品删除
              </div>
          </el-tooltip>
          </span>
          <div class="prize-info">
            <prize-list :source = "'0'" :roomId = '$route.query.roomId'></prize-list>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
import prizeList from '../../MaterialModule/prize'
export default {
  name: 'prizeSet',
  data() {
    return {
      prizeInfoStatus: false,
      backgroundImg: '',
      activeName: 'first',
      formData: {
        title:'',
        description:''
      },
      previewSrc: null,
      givePrizeForm: {
        adressCheced: false,
        name: '',
        phone: '',
        address: '',
        placeholder: ''
      },
      action: `${process.env.VUE_APP_BASE_URL}/v3/vss/lottery/save-prize-image`,
      total: 100,
      length: 0,
      isChecked: 0,
      localImg: 0,
      prizeImgList: [require('../../../common/images/gif/prize03.gif'), require('../../../common/images/gif/prize01.gif'), require('../../../common/images/gif/prize02.gif')],
      prizeUrl: ['http://t-alistatic01.e.vhall.com/upload/sys/img_url/e0/2b/e02b57d63947b5ec20c57c144686cd7d.gif', 'http://t-alistatic01.e.vhall.com/upload/sys/img_url/47/2a/472ab6904c58829ebcf91d801e146945.gif', 'http://t-alistatic01.e.vhall.com/upload/sys/img_url/12/80/12806c4743aec43498cef45ea732c977.gif'],
      givePrizeList: [
        {
          is_system: 1,
          field: '姓名',
          field_key: 'name',
          is_required: true,
          placeholder: '请输入姓名',
          rank: 1,
        },
        {
          is_system: 1,
          field: '手机号',
          field_key: 'phone',
          is_required: true,
          placeholder: '请输入手机号',
          rank: 2,
        },
        {
          is_system: 1,
          field: '地址',
          field_key: 'adress',
          is_required: false,
          placeholder: '请输入地址',
          rank: 3,
        },
        {
          is_system: 0,
          field: '自定义1',
          field_key: 'user_define_100',
          is_required: false,
          placeholder: '',
          rank: 100,
        },
      ],
      prizeForm: {
        name: '',
        imageUrl: ''
      },
      index: 0,
      isError: false,
      rules: {
        name: [
          { required: true, message: '请输入奖品名称', trigger: 'blur' }
        ]
      },
      isLive: false,
      localLottery: { // 抽奖页信息
        description: ''
      },
      lotteryPageMessage: {  // 领奖页信息

      }
    }
  },
  components: {
    PageTitle,
    upload,
    // createPrize,
    prizeList
  },
  computed: {
    isDisabled: function(){
      console.warn(this.localLottery, this.formData, 785);
      if(this.formData.description != this.localLottery.description || this.isChecked != this.localImg || this.formData.title != this.localLottery.title || this.previewSrc != this.localLottery.img_path){
        return false
      }else{
        return true
      }
    },
    lotteryPage: function(){
      console.warn(this.givePrizeForm, 889);
      try {
        this.givePrizeList.forEach(ele=>{
          if(ele.placeholder != this.givePrizeForm[ele.field_key]){
            throw '改变'
          }
        })
      } catch (err) {
        console.warn(err);
        return false
      }
      return true
    }
  },
  async mounted() {
    await this.getActice()
    this.lotteryGet();
  },
  methods: {
    getActice(){
      return new Promise((resolve, reject)=>{
        this.$fetch('getWebinarInfo', {webinar_id: this.$route.params.str}).then(res=>{
          if(res.code == 200){
            if(res.data.webinar_state == 1){
              this.isLive = true
            }
          }else{
            this.$message.warning(res.msg)
          }
          resolve()
        })
      })
    },
    // 抽奖页面获取信息
    lotteryGet () {
      let params = {
        webinar_id: this.$route.params.str,
      }
      this.$fetch('getLivePrizeInfo', params).then(res => {
        if (res.code == 200 && res.data) {
          this.formData.description = res.data.description;
          this.formData.title = res.data.title;
          this.localLottery = res.data
          this.previewSrc = res.data.img_path || '';
          this.backgroundImg = res.data.img_path || this.prizeImgList[0];
          if (res.data.img_path) {
            this.localImg = 10
            this.isChecked = 10;
          } else {
            this.isChecked = 0;
          }
          } else {
            this.backgroundImg = this.prizeImgList[0];
          }
      }).catch((err)=>{
        this.$message.error(err.msg);
      })
    },
    // 抽奖页保存按钮
    lotterySave () {
      if (parseInt(this.isChecked) < 4) {
        this.previewSrc = this.prizeUrl[this.isChecked];
      }
      let params = {
          webinar_id: this.$route.params.str,
          title: this.formData.title,
          img_path: this.previewSrc,
          description: this.formData.description
      }
      if(this.isLive){
        return this.$message.error('当前活动正在开播中，无法更改')
      }
      this.$fetch('savePrizeInfo', this.$params(params)).then(res => {
        if (res.code == 200) {
          this.$message.success('保存成功');
        } else {
          this.$message.error(res.msg ||'保存失败');
        }
      }).catch((err)=>{
        this.$message.error(err.msg)
      })
    },
    changeImg() {
      this.$fetch('uploadImage').then(res => {
        this.$message.success('保存成功')
      }).catch((err)=>{
        this.$message.error(err.msg)
      })
    },
    addField() {
      if(this.givePrizeList.length == 6){
        this.$message.error(`最多只能添加三个自定义选项`);
        return false
      }
      this.index ++;
      this.givePrizeList.push({
        is_system: 0,
        field: `自定义${this.index}`,
        field_key: 'user_define_' + (this.givePrizeList.length + 97),
        is_required: false,
        placeholder: '请输入',
        rank: this.givePrizeList.length + 97,
      });
    },
    deleteGivePrize(index) {
      this.givePrizeList.splice(index, 1);
    },
    // 获取领奖页信息
    getGivePrize() {
      this.$fetch('getDrawPrizeInfo', {webinar_id: this.$route.params.str}).then(res => {
        console.warn(res.data, '获取领奖页信息');
        this.givePrizeList = res.data;
        this.lotteryPageMessage = res.data
        this.givePrizeList.forEach(ele=>{
          this.givePrizeForm[ele.field_key] = ele.placeholder
        })
        this.givePrizeList.map(item => {
          item.is_required = Boolean(item.is_required);
        })
      })
    },
    // 保存领奖页信息
    sureGivePrize() {
      // if(this.isLive){
      //   return this.$message.error('当前活动正在开播中，无法更改')
      // }
      this.givePrizeList.forEach(ele=>{
        console.warn(this.givePrizeForm[ele.field_key], 789, this.givePrizeForm, ele.field_key);
        ele.placeholder = this.givePrizeForm[ele.field_key]
      })
      console.warn(this.givePrizeList);
      this.$fetch('saveDrawPrizeInfo', {webinar_id: this.$route.params.str,data:JSON.stringify(this.givePrizeList)}).then(res => {
        if (res.code == 200) {
          this.$message.success('保存成功');
        } else {
          this.$message.error(res.msg ||'保存失败');
        }
      })
    },
    handleClick(tab) {
      this.activeName = tab.name;
      if (tab.name === 'first') {
        this.lotteryGet();
      } else if (tab.name === 'second') {
        this.getGivePrize();
      }
    },
    deleteImg() {
      this.previewSrc = '';
      this.isChecked = 0;
      this.backgroundImg = this.prizeImgList[0];
    },
    changeType(index) {
      this.isChecked = index;
      this.backgroundImg = this.prizeImgList[index];
    },
     prizeLoadSuccess(res, file){
      console.log('图片上传',res,'ssssss', file);
      this.previewSrc = res.data.domain_url;
      this.isChecked = 10;
      this.backgroundImg = res.data.domain_url;
    },
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`图片只能是 ${typeList.join('、')} 格式!`);
        return false;
      }
      if (!isLt2M) {
        this.$message.error('图片大小不能超过 2MB!');
        return false;
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
    createPrize() {
      this.$refs.createPrize.dialogVisible = true;
    },
    changePrize() {
      this.$refs.createPrize.dialogPrizeVisible = true;
    }
  },
};
</script>

<style lang="less" scoped>
.prize-card{
  height: 100%;
  /deep/.el-card__body {
    padding:0;
  }
  /deep/.el-switch{
    float: right;
    padding-top: 10px;
  }
  /deep/.el-form-item__label{
    color: #1A1A1A;
  }
  /deep/.el-switch__label.is-active {
    color: #1A1A1A;
}
  .prize-info{
    margin: 18px 24px;
  }
  .prize-list{
    padding: 33px 24px;
    .head-operat{
      margin-bottom: 30px;
    }
  }
  .give-item{
    padding: 40px 24px;
    display: flex;
    /deep/.el-form{
      position: relative;
    }
    .give-prize{
      width: 500px;
      margin-right: 120px;
      .isDelete{
        float: right;
        height: 20px;
        i{
          font-size: 16px;
          vertical-align: top;
          margin: 7px 10px 0 0;
          cursor: pointer;
        }
      }
      /deep/.el-form-item__label{
        height: 40px;
        width: 100px;
        overflow: hidden;
        // text-overflow:ellipsis;
        // white-space: nowrap;
      }
      /deep/.el-button{
        margin-top: 25px;
      }
      &-previewImg {
        width: 240px;
        height: 240px;
      }
    }
    .add-prize{
      position: absolute;
      left: 100px;
      bottom: 85px;
      font-size: 14px;
      color: #3562FA;
      cursor: pointer;
      i{
        color: #3562FA;
        border: 1px dashed #3562FA;
      }
    }
    .give-show{
      width: 326px;
      height: 631px;
      background-image: url('../../../common/images/h5-show-phone.png');
      background-size: cover;
      margin-top: -15px;
      .give-people{
        margin: auto;
        margin-top: 287px;
        width: 290px;
        margin-left: 25px;
        h3{
          text-align: center;
          font-size: 14px;
          height: 40px;
          line-height: 40px;
          color:#1A1A1A;
          border-bottom: 1px solid #E6E6E6;
          i{
            float: right;
            margin-top: 13px;
            margin-right: 15px;
            cursor: pointer;
          }
        }
        .sureBtn{
          width: 180px;
          margin: auto;
          text-align: center;
          color: #FB3A32;
          /deep/.el-button{
            margin-top: 25px;
          }
        }
        .give-msg{
          text-align: center;
          margin: auto;
          height: 170px;
          padding:0 20px;
          p{
            margin-top: 24px;
          }
        }
      }
      .prize-show{
        margin: 10px auto;
        text-align: center;
        // border-radius: 50%;
        width: 200px;
        height: 200px;
        background-size: 100%;
        background-repeat:no-repeat;
        // img{
        //   width: 200px;
        //   height: 200px;
        //   border-radius: 50%;
        // }
      }
    }
    .prize-type{
      // width: 100%;
      display: flex;
      text-align: center;
      justify-content: space-between;
      p{
        width: 120px;
        height: 120px;
        border-radius: 4px;
        border: 1px solid #ccc;
        position: relative;
        &.active{
          border: 1px solid #FB3A32;
          box-shadow: 0px 6px 12px 0px rgba(251, 58, 50, 0.16);
        }
        img{
          width: 100%;
          height: 120px;
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
  }
  .prize-no{
    height: calc(100vh - 260px);
    text-align: center;
    margin-top: 268px;
  }
}
.prize--set{
  // position: absolute;
}
</style>
