<template>
  <div class="prize-card">
    <pageTitle pageTitle="抽奖">
    </pageTitle>
    <div class="card__body">
       <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="抽奖页设置" name="first">
            <div class="give-item">
            <div class="give-prize">
              <el-form :model="formData" ref="ruleForm" label-width="80px">
                <!-- <el-form-item label="图片上传">
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
                    <div slot="tip">
                      <p>建议尺寸：240*240px，小于2M</p>
                      <p>支持jpg、gif、png、bmp</p>
                    </div>
                  </upload>
                </el-form-item> -->
                <el-form-item label="模板库">
                    <div class="prize-type">
                      <div class="przieImg prizeNoBorder" :class="isChecked == 0 ? 'checkedBorder' : ''">
                        <upload
                          class="giftUpload"
                          v-model="previewSrc"
                          :domain_url="previewSrc"
                          :on-success="prizeLoadSuccess"
                          :on-progress="uploadProcess"
                          :on-error="uploadError"
                          :on-preview="uploadPreview"
                          @delete="deleteImg"
                          @fullCover="changeType(0)"
                          :widthImg="86"
                          :heightImg="88"
                          :isFullCover="false"
                          :before-upload="beforeUploadHandler">
                        </upload>
                        <label  class="img-tangle" v-show="isChecked == 0"><img src="../../../common/images/icon-choose.png" alt=""></label>
                      </div>
                      <p :class="isChecked == 1 ? 'active' : ''" class="przieImg" @click="changeType(1)">
                        <img src="../../../common/images/gif/prize03.gif" alt="">
                        <label  class="img-tangle" v-show="isChecked == 1"><img src="../../../common/images/icon-choose.png" alt=""></label>
                      </p>
                      <p :class="isChecked == 2 ? 'active' : ''" class="przieImg" @click="changeType(2)">
                        <img src="../../../common/images/gif/prize01.gif" alt="" >
                        <label  class="img-tangle" v-show="isChecked == 2"><img src="../../../common/images/icon-choose.png" alt=""></label>
                      </p>
                      <p :class="isChecked == 3 ? 'active' : ''" class="przieImg" @click="changeType(3)">
                        <img src="../../../common/images/gif/prize02.gif" alt="">
                        <label  class="img-tangle" v-show="isChecked == 3"><img src="../../../common/images/icon-choose.png" alt=""></label>
                      </p>
                    </div>
                    <p style="color:#999">建议尺寸：240*240px，小于2M 支持jpg、gif、png、bmp</p>
                </el-form-item>
                <el-form-item label="标题">
                    <VhallInput v-model="formData.title" autocomplete="off" v-clearEmoij :maxlength="10"  placeholder="请输入抽奖标题" show-word-limit></VhallInput>
                </el-form-item>
                <el-form-item label="说明">
                    <VhallInput v-model="formData.description" autocomplete="off" v-clearEmoij :maxlength="20" placeholder="正在进行抽奖" show-word-limit></VhallInput>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary"  round @click="lotterySave" v-preventReClick>保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="give-show">
              <div class="give-people">
                <h3>{{ formData.title || '抽奖' }}</h3>
                <div class="prize-show" :style="`backgroundImage: url(${backgroundImg})`">
                </div>
                <div class="sureBtn">{{ formData.description || '正在进行抽奖' }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
         <el-tab-pane label="领奖页设置" name="second">
          <div class="give-item">
            <div class="give-prize give-live">
              <el-form :model="givePrizeForm" ref="ruleForm" label-width="100px">
                  <el-form-item v-for="(item, index) in givePrizeList" :key="index" :label="item.field" :ref="`${item.field_key}`">
                    <VhallInput v-model="givePrizeForm[item.field_key]" type="text" maxlength="200" :placeholder="item.placeholder"></VhallInput>
                    <div class="isDelete">
                      <i class="iconfont-v3 saasicon-trash" @click="deleteGivePrize(index)" v-if="!Boolean(item.is_system)"></i>
                      <p class="switch__box">
                        <el-switch
                          v-if="index > 0"
                        v-model="item.is_required"
                        inactive-text="必填">
                      </el-switch>
                      </p>
                    </div>
                </el-form-item>
                <div class="add-prize" @click="addField" v-if="givePrizeList.length < 6">
                  <i class="el-icon-plus"></i>
                  添加字段
                </div>
                <el-form-item>
                  <el-button type="primary" round @click="sureGivePrize" v-preventReClick>保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="give-show">
              <div class="give-people">
                <h3>领奖</h3>
                <el-scrollbar class="scroll-bar">
                  <div class="give-msg">
                    <el-form :model="givePrizeForm">
                      <el-form-item v-for="(item, index) in givePrizeList" :key="index">
                        <span class="red" v-if="item.is_required==1">*</span>
                        <el-input v-model="givePrizeForm[item.field_key]" readonly type="text" :placeholder="item.placeholder"></el-input>
                      </el-form-item>
                    </el-form>
                    <div class="sureBtn"><el-button type="primary" v-preventReClick round>确定</el-button></div>
                  </div>
                </el-scrollbar>

              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane name="third">
           <span slot="label">
           奖品设置
            <el-tooltip class="prize--set" effect="dark" placement="right" v-tooltipMove style="margin-left:5px">
              <i class="iconfont-v3 saasicon_help_m"></i>
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
    </div>
    <begin-play :webinarId="$route.params.str"></begin-play>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
import prizeList from '../../MaterialModule/prize';
import beginPlay from '@/components/beginBtn';
import prize0 from './images/prize0.gif'
import prize1 from './images/prize1.gif'
import prize2 from './images/prize2.gif'
import {sessionOrLocal} from "@/utils/utils";
export default {
  name: 'prizeSet',
  data() {
    return {
      prizeInfoStatus: false,
      backgroundImg: '',
      activeName: 'first',
      formData: {
        title:'',
        description:'',
        reDescription: '',
        reTitle: ''
      },
      previewSrc: null,
      givePrizeForm: {
        adressCheced: false,
        name: '',
        phone: '',
        address: '',
        user_define_100: '',
        user_define_101: '',
        user_define_102: '',
        placeholder: ''
      },
      action: `${process.env.VUE_APP_BASE_URL}/v3/vss/lottery/save-prize-image`,
      total: 100,
      length: 0,
      isChecked: 1,
      localImg: 0,
      prizeUrl: [prize0, prize1, prize2],
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
        description: '',
        title: ''
      },
      lotteryrank: 0, // 领奖页信息---最后一条的rank值
      lotteryPageMessage: {  // 领奖页信息

      }
    }
  },
  components: {
    PageTitle,
    upload,
    beginPlay,
    // createPrize,
    prizeList
  },
  computed: {
    isDisabled: function(){
      if(this.formData.description != this.localLottery.description || this.isChecked != this.localImg || this.formData.title != this.localLottery.title || this.previewSrc != this.localLottery.img_path){
        return false
      }else{
        return true
      }
    },
    lotteryPage: function(){
      try {
        this.givePrizeList.forEach((ele, index)=>{
          if(ele.placeholder != this.givePrizeForm[ele.field_key] || ele.is_required != Boolean(this.lotteryPageMessage[index].is_required)){
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
  watch: {
    activeName() {
      if (this.activeName == 'first') {
        this.lotteryGet();
      } else if(this.activeName == 'second') {
        this.getGivePrize();
      }
    }
  },
  created() {
    this.userId = JSON.parse(sessionOrLocal.get("userId"))
    this.backgroundImg = this.prizeUrl[0]
  },
  async mounted() {
    this.activeName = this.$route.query.index || 'first';
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
          this.formData.reDescription = res.data.description;
          this.formData.reTitle = res.data.title;
          this.localLottery = res.data
          if (parseInt(res.data.img_order) > 0) {
            this.isChecked = parseInt(res.data.img_order);
            this.backgroundImg = res.data.img_path;
          } else {
            this.isChecked = 0;
            this.backgroundImg = res.data.img_path;
            this.previewSrc = res.data.img_path;
          }
        }
      }).catch((err)=>{
        this.$message({
          message: err.msg || `获取信息失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    },
    // 抽奖页保存按钮
    lotterySave () {
      let imgUrl = '';
      let k = 100309;
      let arrImg = [100309, 100110, 100311]
      if (parseInt(this.isChecked) > 0) {
        imgUrl = this.prizeUrl[this.isChecked - 1];
        k = arrImg[this.isChecked - 1]
      } else {
        imgUrl = this.previewSrc;
        k = 100312
      }
      let params = {
          webinar_id: this.$route.params.str,
          title: this.formData.title,
          img_path: imgUrl,
          img_order: this.isChecked,
          description: this.formData.description
      }
      this.$fetch('savePrizeInfo', params).then(res => {
        this.$vhall_paas_port({
          k: k,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        if (this.formData.title !== this.formData.reTitle) {
          this.$vhall_paas_port({
            k: 100313,
            data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
        }
        if (this.formData.description !== this.formData.reDescription) {
          this.$vhall_paas_port({
            k: 100314,
            data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
        }
        this.$message({
          message: `保存成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
      }).catch((err)=>{
        this.$message({
          message: err.msg || '保存失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    },
    setPrizePortData() {
      let prizeArr = ['', 100315, 100316, 100317]
      if (this.givePrizeList.length !== this.lotteryPageMessage.length) {
        let len = this.givePrizeList.length - 3
        this.$vhall_paas_port({
          k: 100322,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        this.$vhall_paas_port({
          k: 100323,
          data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {length: len}, ref_url: '', req_url: ''}
        })
      }
      this.givePrizeList.forEach(ele=>{
        if (this.givePrizeForm[ele.placeholder] !== this.lotteryPageMessage[ele.placeholder]) {
          this.$vhall_paas_port({
            k: prizeArr[ele.rank],
            data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
        }
        if (ele.field === '手机号') {
          this.$vhall_paas_port({
            k: ele.is_required ? 100318 : 100319,
            data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
        }
        if (ele.field === '地址') {
          this.$vhall_paas_port({
            k: ele.is_required ? 100320 : 100321,
            data: {business_uid: this.userId, user_id: '', webinar_id: this.$route.params.str, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
        }

      })
      // if (this.givePrizeForm.this.lotteryPageMessage)
    },
    changeImg() {
      this.$fetch('uploadImage').then(res => {
        this.$message({
          message: `保存成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
      }).catch((err)=>{
        this.$message({
          message: err.msg || '保存失败',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    },
    addField() {
      if(this.givePrizeList.length == 6){
        this.$message({
          message: `最多只能添加三个自定义选项`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
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
        this.lotteryrank = res.data[res.data.length - 1].rank
        // 深拷贝一个对象做对比
        this.lotteryPageMessage = JSON.parse(JSON.stringify(res.data))
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
      this.givePrizeList.forEach(ele=>{
        // console.warn(this.givePrizeForm[ele.field_key], 789, this.givePrizeForm, ele.field_key);
        ele.placeholder = this.givePrizeForm[ele.field_key]
      })
      console.warn(this.givePrizeList);
      this.$fetch('saveDrawPrizeInfo', {webinar_id: this.$route.params.str,data:JSON.stringify(this.givePrizeList)}).then(res => {
        this.setPrizePortData()
        this.$message({
          message: `保存成功`,
          showClose: true,
          // duration: 0,
          type: 'success',
          customClass: 'zdy-info-box'
        });
      }).catch((err)=>{
        this.$message({
          message: err.msg || `保存失败`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      })
    },
    handleClick(tab) {
      // this.activeName = tab.name;
      this.$router.push({path: `/live/prizeSet/${this.$route.params.str}`, query: {
        roomId: this.$route.query.roomId,
        index: tab.name
      }})
      // if (tab.name === 'first') {
      //   this.lotteryGet();
      // } else if (tab.name === 'second') {
      //   this.getGivePrize();
      // }
    },
    deleteImg() {
      this.previewSrc = '';
      this.isChecked = 1;
      this.backgroundImg = this.prizeUrl[0];
    },
    changeType(index) {
      this.isChecked = index;
      this.backgroundImg = this.prizeUrl[index - 1];
      if (!index) {
        this.backgroundImg = this.previewSrc;
      }
    },
     prizeLoadSuccess(res, file){
      console.log('图片上传',res,'ssssss', file);
      this.previewSrc = res.data.domain_url;
      this.isChecked = 0;
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
        this.$message({
          message: `文件格式不支持，请检查图片`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: `文件大小超过2M，请检查图片`,
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
        message: `图片上传失败`,
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
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
  .card__body {
    padding:0;
    background: #fff;
    // max-width: 1374px;
    margin: auto;
    border-radius: 4px;
  }
  /deep/.el-switch{
    float: right;
    padding-top: 10px;
    margin-right: 0;
    // /deep/.el-switch__core {
    //   width: 32px!important;
    //   height: 20px;
    // }
    // /deep/.el-switch__core::after {
    //   top: 2px;
    //   width: 14px;
    //   height: 14px;
    // }
  }
  /deep/.el-form-item__label{
    color: #1A1A1A;
  }
  /deep/.el-switch__label.is-active {
    color: #1A1A1A;
}
 /deep/.el-tabs__content{
   min-height: 700px;
 }
  .prize-info{
    margin: 32px 0;
    // .question-list{
    //   padding: 24px 0;
    // }
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
    /deep/.el-input__inner{
      height: 40px;
    }
    /deep/.el-input{
      input {
        padding: 0 12px;
      }
      input::-webkit-input-placeholder{
        color:#999;
        }
    }
    .give-prize{
      width: 480px;
      margin-right: 80px;
      .isDelete{
        float: right;
        height: 20px;
        i{
          font-size: 16px;
          vertical-align: top;
          line-height: 32px;
          cursor: pointer;
        }
      }
      .switch__box{
        display: inline-block;
        padding-left: 5px;
        /deep/.el-switch{
          padding-top: 0px;
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
    .give-live{
      /deep/.el-form-item {
        margin-bottom: 10px;
        &:last-child{
          padding-top: 10px;
        }
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
        // border: 1px dashed #3562FA;
      }
      .el-icon-plus:before {
        font-weight: bolder;
      }
    }
    .give-show{
      width: 370px;
      height: 631px;
      background-image: url('../../../common/images/gif/prize.png');
      background-size: cover;
      margin-top: -25px;
      position: relative;
      .give-show-title{
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 16px;
        color: #666666;
        line-height: 24px;
      }
      .give-people{
        margin: auto;
        margin-top: 275px;
        width: 290px;
        margin-left: 45px;
        h3{
          text-align: center;
          font-size: 14px;
          height: 40px;
          line-height: 40px;
          color:#1A1A1A;
          position: relative;
          i{
            position: absolute;
            top: 12px;
            right: 12px;
            cursor: pointer;
          }
        }
        .sureBtn{
          width: 180px;
          margin: auto;
          text-align: center;
          color: #FB3A32;
          /deep/.el-button{
            // margin-top: 25px;
          }
        }
        .give-msg{
          text-align: center;
          margin: auto;
          height: 260px;
          padding:20px 20px 0;
          width: 94%;
          p{
            margin-top: 24px;
          }
          .red{
            position: absolute;
            left: -15px;
            top: 0;
            display: inline-block;
            color: #fe6a6a;
            margin-right: 10px;
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
        margin-top: 16px;
        background-position: center;
        // img{
        //   width: 200px;
        //   height: 200px;
        //   border-radius: 50%;
        // }
      }
    }
    .prize-type{
      display: flex;
      text-align: center;
      justify-content: space-between;
      .przieImg{
        width: 88px;
        height: 88px;
        border-radius: 4px;
        border: 1px solid #ccc;
        position: relative;
        transition: all 0.15s ease-in;
        &:hover{
          box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        }
        &.active{
          border: 1px solid #FB3A32;
          box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
        }
        img{
          width: 100%;
          height: 100%;
        }
        .img-tangle{
          position: absolute;
          right: 0;
          top:0;
          width: 20px;
          height: 20px;
          font-size: 0;
          img{
            width: 100%;
            height: 100%;
          }
        }
      }
      .prizeNoBorder{
        border: 0;
        /deep/.el-upload--picture-card {
          height: 88px;
        }
        /deep/.el-upload--picture-card .box > div{
          height: 88px;
        }
      }
      .checkedBorder{
        border: 1px solid #FB3A32 !important;
        /deep/.el-upload--picture-card{
          border: 0;
          height: 86px;
        }
      }
      /deep/.el-upload--picture-card{
        // height: 88px;
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
/deep/.saasicon_help_m {
  color: #999999;
}
</style>
