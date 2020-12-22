<template>
  <div class="prize-card">
    <pageTitle title="抽奖">
      <div slot="content">
        1.上传单个文件最大2G，文件标题不能带有特殊字符和空格
        <br>
        2.上蔟韩视频格式支持RMVB、MP4、AVI、WMV、MKV、FLV、MOV；上传音频格式支持MP3、WAV
        <br>
        3.上传的视频，不支持剪辑和下载
      </div>
    </pageTitle>
    <el-card>
       <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="领奖页设置" name="first">
          <div class="give-item">
            <div class="give-prize">
              <el-form :model="givePrizeForm" ref="ruleForm" label-width="100px" @keydown.enter.prevent>
                  <el-form-item v-for="(item, index) in givePrizeList" :key="index" :label="item.field" :ref="`${item.field_key}`" :contenteditable="Boolean(item.is_system) ? false : 'plaintext-only'" >
                    <el-input v-model="givePrizeForm[item.field_key]" type="text" :placeholder="`请输入${item.field}`" v-if="Boolean(item.is_system)" readonly></el-input>
                        <el-input v-model="givePrizeForm[item.field_key]"  type="textarea" :placeholder="`请输入${item.field}`" :autosize="{ minRows: 4}" v-else readonly></el-input>
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
                  <el-button type="primary" round @click="sureGivePrize">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="give-show">
              <div class="give-people">
                <h3>领奖<i class="el-icon-close"></i></h3>
                <el-scrollbar>
                  <div class="give-msg">
                    <el-form :model="givePrizeForm">
                      <el-form-item v-for="(item, index) in givePrizeList" :key="index">
                        <el-input v-model="givePrizeForm.file" readonly type="text" :placeholder="`请输入${item.field}`" v-if="Boolean(item.is_system)"></el-input>
                        <el-input v-model="givePrizeForm.other" readonly type="textarea" :placeholder="`请输入${item.field}`" v-else></el-input>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-scrollbar>
                <div class="sureBtn"><el-button type="primary" round>确定</el-button></div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="抽奖页设置" name="second">
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
                    <el-input v-model="formData.title" maxlength="10" placeholder="请输入抽奖标题" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="文字说明">
                    <el-input v-model="formData.description" maxlength="20" placeholder="正在进行抽奖" show-word-limit></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" round @click="lotterySave">保存</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="give-show">
              <div class="give-people">
                <h3>{{ formData.title }}<i class="el-icon-close"></i></h3>
                <div class="prize-show" :style="`backgroundImage: url(${backgroundImg})`">
                </div>
                <div class="sureBtn">{{ formData.description }}</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="奖品设置" name="third">
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
        adressCheced: false
      },
      action: `${process.env.VUE_APP_BASE_URL}/v3/vss/lottery/save-prize-image`,
      total: 100,
      length: 0,
      isChecked: 0,
      prizeImgList: [require('../../../common/images/gif/prize03.gif'), require('../../../common/images/gif/prize01.gif'), require('../../../common/images/gif/prize02.gif')],
      prizeUrl: ['http://t-alistatic01.e.vhall.com/upload/sys/img_url/e0/2b/e02b57d63947b5ec20c57c144686cd7d.gif', 'http://t-alistatic01.e.vhall.com/upload/sys/img_url/47/2a/472ab6904c58829ebcf91d801e146945.gif', 'http://t-alistatic01.e.vhall.com/upload/sys/img_url/12/80/12806c4743aec43498cef45ea732c977.gif'],
      givePrizeList: [
        {
          is_system: 1,
          field: '姓名',
          field_key: 'name',
          is_required: true,
          rank: 1,
        },
        {
          is_system: 1,
          field: '手机号',
          field_key: 'phone',
          is_required: true,
          rank: 2,
        },
        {
          is_system: 1,
          field: '地址',
          field_key: 'adress',
          is_required: false,
          rank: 3,
        },
        {
          is_system: 0,
          field: '自定义1',
          field_key: 'user_define_100',
          is_required: false,
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
    };
  },
  components: {
    PageTitle,
    upload,
    // createPrize,
    prizeList
  },
  mounted() {
    this.getGivePrize();
    // this.getReward()
  },
  methods: {
    // 抽奖页面获取信息
    lotteryGet () {
      let params = {
        webinar_id: this.$route.params.str,
      }
      this.$fetch('getLivePrizeInfo', params).then(res => {
        this.previewSrc = res.data.img_path || '';
        this.backgroundImg = res.data.img_path || prizeImgList[0];
        if (res.data.img_path) {
          this.isChecked = 10;
        } else {
          this.isChecked = 0;
        }
        this.formData.description = res.data.description;
        this.formData.title = res.data.title;
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
      this.$fetch('savePrizeInfo', this.$params(params)).then(res => {
        this.$message.success('保存成功')
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
        rank: this.givePrizeList.length + 97,
      });
    },
    deleteGivePrize(index) {
      this.givePrizeList.splice(index, 1);
    },
    // 获取领奖页信息
    getGivePrize() {
      this.$fetch('getDrawPrizeInfo', {webinar_id: this.$route.params.str}).then(res => {
        this.givePrizeList = res.data;
        this.givePrizeList.map(item => {
          item.is_required = Boolean(item.is_required);
        })
        // if (res.data.length) {
        //   this.givePrizeList = res.data;
        //   this.givePrizeList.map(item => {
        //     item.is_required = Boolean(item.is_required);
        //   })
        // }
      })
    },
    // 保存领奖页信息
    sureGivePrize() {
      console.log('refssss',this.$refs);
      let nameList = ['姓名','地址', '手机号'];
      this.givePrizeList.map((item, index) => {
        if (!item.is_system) {
          item.field =  this.$refs[this.givePrizeList[index].field_key][0].$el.childNodes[0].innerHTML;
          if (nameList.includes(item.field)) {
            this.$message.error('输入名字不能相同');
            this.isError = true;
          } else {
            nameList.push(item.field);
            this.isError = false;
          }
        }
      })
      if (this.isError) {
        return;
      }
      // this.givePrizeList.forEach((item, index)=>{
      //   if (!item.is_system) {
      //     item.field =  this.$refs[this.givePrizeList[index].field_key][0].$el.childNodes[0].innerHTML;
      //    if (nameList.includes(item.field)) {
      //      this.$message.error('输入名字不能相同');
      //      return false;
      //    } else {
      //      nameList.push(item.field);
      //    }
      //   }
      // })
      this.$fetch('saveDrawPrizeInfo', {webinar_id: this.$route.params.str,data:JSON.stringify(this.givePrizeList)}).then(res => {
        if (res.code == 200) {
          this.$message.success('保存成功');
        }
      })
    },
    handleClick(tab) {
      this.activeName = tab.name;
      switch (tab.index) {
        case '0':
          this.getGivePrize()
          break
        case '1':
           this.lotteryGet()
          break
      }
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
          // text-align: center;
          width: 180px;
          margin: auto;
          text-align: center;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          /deep/.el-button{
            margin-top: 25px;
          }
        }
        .give-msg{
          text-align: center;
          margin: auto;
          max-height: 170px;
          padding:20px;
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
</style>
