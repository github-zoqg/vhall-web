<template>
  <div class="protocol--set">
    <div class="protocol--set--main">
      <div class="protocol--set--left">
        <el-form :model="viewingProtocolForm" ref="viewingProtocolForm" :rules="viewingProtocolFormRules" label-width="88px">
          <el-form-item label="观看协议" prop="is_open">
            <div class="switch__box">
              <el-switch
                v-model="viewingProtocolForm.is_open"
                :active-value=1
                :inactive-value=0
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="viewingProtocolForm.is_open ? '已开启，观看直播前展示观看协议' : '开启后，观看直播前展示观看协议'"
              >
              </el-switch>
            </div>
          </el-form-item>
          <el-form-item
            class="margin44"
            label="协议标题"
            prop="title"
          >
            <VhallInput v-model="viewingProtocolForm.title" v-clearEmoij :maxlength="50" class="title-inform" autocomplete="off" :placeholder="`微吼直播观看协议`"  show-word-limit></VhallInput>
          </el-form-item>
          <el-form-item class="margin32" prop="content" :label="`协议内容`">
            <v-editor class="editor-wrap" save-type='live' :placeholder="`请输入协议内容`" :isReturn=true ref="unitImgTxtEditor" v-model="viewingProtocolForm.content"></v-editor>
          </el-form-item>
          <el-form-item label="进入规则" prop="rule">
            <!-- <div class="switch__box"> -->
              <el-radio-group v-model="viewingProtocolForm.rule">
                <el-radio :label="0">同意后进入直播间</el-radio>
                <el-radio :label="1">阅读后进入直播间</el-radio>
                
              </el-radio-group>
            <!-- </div> -->
            
          </el-form-item>
          <el-form-item label="协议声明"  prop="statement_status">
            <div class="switch__box">
              <el-switch
                v-model="viewingProtocolForm.statement_status"
                :active-value=1
                :inactive-value=0
                active-color="#FB3A32"
                inactive-color="#CECECE"
                :active-text="viewingProtocolForm.statement_status ? '已开启，可以添加隐私协议外链' : '开启后，可以添加隐私协议外链'"
              >
              </el-switch>
            </div>
          </el-form-item>

          <el-form-item class="provicy-item" v-show="viewingProtocolForm.statement_status"  prop="statement_content">
            <VhallInput :maxlength="100" class="title-inform" show-word-limit v-model="viewingProtocolForm.statement_content" autocomplete="off"  placeholder="我已阅读并同意" > </VhallInput>
          </el-form-item>
          
          <template v-if="viewingProtocolForm.statement_status">
            <template v-for="(val, key) in statementList" >
              <!-- :prop="'proptocolTitle_'+key" -->
              <el-form-item class="item-title" :key="'title'+key" prop="proptocolTitle_0">
                <template>
                  <VhallInput @input="handleInput($event, key, 'title')" :maxlength="100" class="title-inform" show-word-limit v-model="val.title" autocomplete="off" placeholder="观看协议"  > </VhallInput>
                  <i
                    class="el-icon-remove-outline optIcon"
                    @click="deleteOptions"
                    v-if="statementList && key == 1 && statementList.length == 2"
                  ></i>
                  <i
                    class="el-icon-circle-plus-outline optIcon"
                    v-if="statementList && key == 0 && statementList.length == 1"
                    @click="privacyAdd"
                  ></i>
                </template>
              </el-form-item>
              <el-form-item class="item-link" :key="key" :prop="'proptocolLink_'+key">
                <template>
                  <VhallInput @input="handleInput($event, key, 'link')" :maxlength="100" class="title-inform" show-word-limit v-model="val.link" autocomplete="off" placeholder="请输入http://或https://开头的链接" > </VhallInput>
                </template>
              </el-form-item>
            </template>
            
          </template>
         
          <el-form-item label="">
            <el-button type="primary" round v-preventReClick @click.prevent.stop="protocolSave">保 存</el-button>
          </el-form-item>
        </el-form>
        <div class="hide-white" v-show="!brandConfig"></div>
      </div>
      <!-- 预览区域 -->
      <protocol-preview 
        ref="brandSetPreviewComp" 
        :viewingProtocolForm="viewingProtocolForm" 
        class="brand--preview" 
        :brandType="brandType" 
        :tabType="'signSet'"
        :proptocolTitle_0="viewingProtocolForm.proptocolTitle_0"
        :proptocolTitle_1="viewingProtocolForm.proptocolTitle_1"
      ></protocol-preview>
    </div>
  </div>
</template>

<script>
import Upload from '@/components/Upload/main';
import ProtocolPreview from '../../LiveModule/components/protocolPreview';
import VEditor from '@/components/Tinymce';
export default {
  name: "viewingProtocol.vue",
  props: ['brandConfig', 'tabType'],
  components: {
    Upload,
    ProtocolPreview,
    VEditor
  },
  data() {
    return {
      viewingProtocolForm: {
        title: '',
        statement_status: 1,
        logo_url: null,
        skip_url: null,
        content: '',
        is_open: 0,
        rule: 0,
        statement_content: '我已同意并阅读观看协议',
        statement_info: null,
        proptocolTitle_0: '观看协议',
        proptocolLink_0: '',
        proptocolTitle_1: '',
        proptocolLink_1: ''
      },
      
      brandType: 1,
      domain_url: '',
      firstProptocol: {
        title: '观看协议',
        link: ''
      },
      secondProptocol: {
        title: '观看协议2',
        link: ''
      },
      statementList: [{
        title: '观看协议',
        link: ''
      }],
      viewingProtocolFormRules: {
        skip_url: [
          { required: false, message: '请输入标志链接', trigger: 'blur'},
          // { pattern: /((http|https):\/\/)?[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入正确的标志链接' , trigger: 'blur'}
          { pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入以http://或https://开头的标志链接' , trigger: 'blur'}
        ],
        title: [
          { required: true, max: 50,  message: `请输入标题`, trigger: 'blur' }
        ],
        content: [
          { required: true, max: 1000,  message: `请输入协议内容`, trigger: 'blur' }
        ],
        statement_content: [
          { required: true, max: 100,  message: `请填写协议提示内容`, trigger: 'blur' }
        ],
        proptocolTitle_0: [
          { required: true, max: 100,  message: `请填写协议名称`, trigger: 'blur' }
        ],
        proptocolLink_0: [
          { required: true, max: 100,  message: `请填写协议链接`, trigger: 'blur' },
          { pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入以http://或https://开头的标志链接' , trigger: 'blur'}
        ],
        proptocolTitle_1: [
          { required: true, max: 100,  message: `请填写协议名称`, trigger: 'blur' }
        ],
        proptocolLink_1: [
          { required: true, max: 100,  message: `请填写协议链接`, trigger: 'blur' },
          { pattern: /(http|https):\/\/[\w\-_]+(\.[\w\-_]+).*?/, message: '请输入以http://或https://开头的标志链接' , trigger: 'blur'}
        ],
      }
    };
  },
  mounted(){
    this.$nextTick(() => {
      console.log(this.$refs, 'val')
      setTimeout(()=>{
        this.$refs['viewingProtocolForm'] ? this.$refs['viewingProtocolForm'].resetFields() : ''
      }, 1000)
      
    })
  },
  watch: {
    '$parent.type'() {
      if (this.brandType) {
        this.initComp();
      }
    },
    tabType(newVal, oldVal) {
      
      this.$nextTick(() => {
        console.log(newVal, this.$refs, this.$refs['viewingProtocolForm'], 'val')
        this.$refs['viewingProtocolForm'] ? this.$refs['viewingProtocolForm'].resetFields() : '';
      })
      
    },
  },
  methods: {
    handleInput(value, index, type){
      console.log(value, index)
      let statement_content = this.viewingProtocolForm.statement_content
      if(type === 'title') {
        let titleName = `proptocolTitle_${index}`
        this.viewingProtocolForm[titleName] = value
        if(value && statement_content.indexOf(value) === -1){
          this.statementList[index].title = '';
          this.viewingProtocolForm[titleName] = '';
          let oldValue = value.substring(0, value.length-1)
          console.log(value.substring(0, value.length-1), 'value.substring(0, value.length-1)')
          let viewingProtocolForm = this.viewingProtocolForm
          this.viewingProtocolForm.statement_content = viewingProtocolForm.statement_content.replace(oldValue, '')
        }
        if(index === 0){
          this.viewingProtocolForm.proptocolTitle_0 = value
        }else{
          this.viewingProtocolForm.proptocolTitle_1 = value
        }
          
      }else {
        let linkName = `proptocolLink_${index}`
        this.viewingProtocolForm[linkName] = value
      }
      console.log(this.viewingProtocolForm, 'this.viewingProtocolForm[`proptocolTitle_${index}`]')
    },
    deleteOptions(){
      this.statementList.pop()
      let viewingProtocolForm = this.viewingProtocolForm
      let oldValue = viewingProtocolForm.proptocolTitle_1
      console.log(oldValue, 'value.substring(0, value.length-1)')
      
      this.viewingProtocolForm.statement_content = viewingProtocolForm.statement_content.replace(oldValue, '')
      this.viewingProtocolForm.statement_content = viewingProtocolForm.statement_content.replace('及', '')
      
      this.viewingProtocolForm.proptocolTitle_1 = ''
      this.viewingProtocolForm.proptocolLink_1 = ''

    },
    privacyAdd(){
      let statementObj = {
        title: '观看协议2',
        link: ''
      }
      
      this.statementList.push(statementObj)
      this.viewingProtocolForm.statement_content += '及观看协议2'
      this.viewingProtocolForm.proptocolTitle_1 = '观看协议2'
    },
    handleUploadSuccess(res, file){
      console.log(res, file);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.viewingProtocolForm.logo_url = file_url;
        this.domain_url = domain_url;
      }
      // 触发验证
      this.$refs.viewingProtocolForm.validateField('logo_url');
      try {
        this.$refs.brandSetPreviewComp.signSetVoInfo(this.viewingProtocolForm, this.domain_url);
      } catch (e) {
        console.log(e);
      }
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
          message: `标志图片只能是 ${typeList.join('、')} 格式!`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: `标志图片大小不能超过 2MB!`,
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
        message:  `标志图片上传失败`,
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },
    // 获取活动标记记录
    getProtocol() {
      let params = {
        type: this.brandType,
        webinar_id: this.brandType == 1 ? this.$route.params.str : ''
      }
      this.$fetch('getAgreement', this.$params(params)).then(res => {
        console.log(res);
        if (res && res.code === 200) {
          if (res.data) {
            this.viewingProtocolForm = res.data;
            let statement_info = res.data.statement_info
            this.statementList = statement_info
            statement_info.forEach((item, index)=>{
              let titleName = `proptocolTitle_${index}`
              let linkName = `proptocolLink_${index}`
              this.viewingProtocolForm[titleName] = item.title;
              this.viewingProtocolForm[linkName] = item.link
            })
            console.log(this.viewingProtocolForm, this.statementList, ' this.statementList')
          } else {
            this.$nextTick(() => {
              console.log(newVal, this.$refs, this.$refs['viewingProtocolForm'], 'val')
              if (newVal === 'viewingProtocol') {
                this.$refs['viewingProtocolForm'] ? this.$refs['viewingProtocolForm'].resetFields() : '';
              }
            })
          }
        } else {
          this.$nextTick(() => {
            console.log(newVal, this.$refs, this.$refs['viewingProtocolForm'], 'val')
            if (newVal === 'viewingProtocol') {
              this.$refs['viewingProtocolForm'] ? this.$refs['viewingProtocolForm'].resetFields() : '';
            }
          })
        }
      }).catch(err=>{
        console.log(err);
      });
    },
    initComp() {
      this.brandType = this.$parent.type;
      this.getProtocol();// 获取活动标志内容
    },
    // 保存
    protocolSave() {
      console.log(this.viewingProtocolForm, this.statementList, 'this.statementList')
      this.$refs.viewingProtocolForm.validate((valid) => {
        if(valid) {
          this.viewingProtocolForm.statement_info = JSON.stringify(this.statementList)
          console.log(this.viewingProtocolForm, 'viewingProtocolForm');
          let params = Object.assign(this.viewingProtocolForm, {webinar_id: this.$route.params.str || '', type: this.brandType});
          this.$fetch('saveAgreement', this.$params(params)).then(res => {
            this.$message({
              message:  `保存基本设置成功`,
              showClose: true,
              // duration: 0,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            // 重新获取数据
            // this.getProtocol();
          }).catch(res=>{
            console.log(res);
            this.$message({
              message: res.msg || `保存基本设置失败`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          });
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
.protocol--set {
  padding: 41px 40px 40px 40px;
}
.protocol--set--main {
  .flex-display;
  .justify(space-between);
  .align(flex-start);
}
.protocol--set--left {
  width: 480px;
  position: relative;
  /deep/.el-form-item__label {
    line-height: 40px;
  }
  .hide-white{
    position: absolute;
    width: 100%;
    height: 100%;
    top:0;
    left:0;
    background: rgba(255, 255, 255, 0.5);
    z-index: 9;
  }
}
.brand--preview {
  width: calc(100% - 480px);
  padding-left: 60px;
}
/deep/.el-form-item__label {
  padding: 0 10px 0 0;
  line-height: 20px;
}
/deep/.el-form-item {
  margin-bottom: 32px;
}
/deep/.el-input__inner {
  padding: 0 12px;
}
/deep/.el-switch__label {
  color: #999999;
}
/deep/.el-switch__label.is-active {
  color: #999999;
}
.p-notice {
  font-size: 14px;
  font-family: @fontRegular;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  margin-top: 12px;
}
/* 标志上传 */
.upload__sign {
  /deep/.el-upload--picture-card {
    width: 400px;
    height: 130px;
  }
  /deep/.box > div {
    width: 400px;
    height: 130px;
  }
}
.item--skip__url {
  /deep/.el-input {
    width: 400px;
    border-radius: 4px;
  }
}
.btnGroup{
  text-align: center;
  margin: 40px auto;
  .el-button{
    color:#FB3A32;
    border-color:#FB3A32;
    width: 150px;
    &:hover{
      background: #ffebeb;
    }
  }
  .el-button--primary{
    background:#FB3A32;
    border-color:#FB3A32;
    color: #fff;
    &:hover{
      background: #fc615b;
    }
  }
  .el-button.is-round{
    padding: 10px 23px;
  }
}
.item-title{
  position: relative;
}
.optIcon{
  position: absolute;
  font-weight: bold;
  font-size: 20px;
  color: #666666;
  vertical-align: middle;
  display: none;
  line-height: 34px;
  cursor: pointer;
  display: inline-block;
  right: -26px;
  top: 5px;
}
.title-input-div{
  display: flex;
  align-content: center;
}
</style>
