<template>
  <div class="editBox">
    <pageTitle :title="`${$route.query.title || '创建'}专题`"></pageTitle>
    <el-form :model="formData" ref="ruleForm" :rules="rules" v-loading="loading" label-width="100px">
      <el-form-item label="专题标题:" prop="title">
        <el-input v-model.trim="formData.title" maxlength="100" placeholder="请输入专题标题" show-word-limit></el-input>
      </el-form-item>
      <el-form-item label="专题封面:">
        <upload
          v-model="imageUrl"
          :domain_url="domain_url"
          :saveData="{
             path: 'webinars/subject-imgs',
             type: 'image',
          }"
          :on-success="handleUploadSuccess"
          :on-progress="uploadProcess"
          :on-error="uploadError"
          :on-preview="uploadPreview"
          @delete="deleteImg"
          :before-upload="beforeUploadHnadler">
          <div slot="tip">
            <p>建议尺寸：1280*720px，小于2M</p>
            <p>支持jpg、gif、png、bmp</p>
          </div>
        </upload>
      </el-form-item>
      <el-form-item label="专题简介:" required>
        <v-editor save-type='special' :isReturn=true @returnChange="sendData" ref="unitImgTxtEditor" v-model="content"></v-editor>
      </el-form-item>
      <el-form-item label="预约人数:">
        <p class="switch__box">
          <el-switch
            v-model="reservation"
            active-color="#FB3A32"
            inactive-color="#CECECE"
            :active-text="reservationDesc">
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item label="热度:">
        <p class="switch__box">
          <el-switch
            v-model="hot"
            active-color="#FB3A32"
            inactive-color="#CECECE"
            :active-text="hotDesc">
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item label="关联主页:">
        <p class="switch__box">
          <el-switch
            v-model="home"
            active-color="#FB3A32"
            inactive-color="#CECECE"
            :active-text="homeDesc">
          </el-switch>
        </p>
      </el-form-item>
      <el-form-item label="专题目录:" required>
        <el-button size="small" type="primary" round @click="showActiveSelect = true">添加</el-button>
        <div class="vh-sort-tables" v-show="selectedActives.length">
          <div class="vh-sort-tables__theader">
            <div class="vh-sort-tables__theader-id">
              序号
            </div>
            <div class="vh-sort-tables__theader-title">
              直播标题
            </div>
            <div class="vh-sort-tables__theader-status">
              直播状态
            </div>
            <div class="vh-sort-tables__theader-hots">
              热度
            </div>
            <div class="vh-sort-tables__theader-editor">
              操作
            </div>
          </div>
          <div class="vh-sort-tables__tbody">
            <draggable
              :list="selectedActives"
              chosenClass="vh-sort-tables__tbody-selected"
              @dragstart="dragStart"
              @dragend="dragEnd"
            >
              <div
                class="vh-sort-tables__tbody-tr"
                v-for="(item, index) in selectedActives"
                :key="item.webinar_id"
                >
                <div class="vh-sort-tables__tbody-id">
                  {{ index + 1 }}
                </div>
                <div class="vh-sort-tables__tbody-title">
                  {{ item.subject }}
                </div>
                <div class="vh-sort-tables__tbody-status">
                  <template v-if="item.webinar_type == 1">
                    直播
                  </template>
                  <template v-if="item.webinar_type == 2">
                    预告
                  </template>
                  <template v-if="item.webinar_type == 3">
                    结束
                  </template>
                  <template v-if="item.webinar_type == 4">
                    点播
                  </template>
                  <template v-if="item.webinar_type == 5">
                    回放
                  </template>
                </div>
                <div class="vh-sort-tables__tbody-hots">
                  {{ item.pv }}
                </div>
                <div class="vh-sort-tables__tbody-editor">
                  <i class="iconfont-v3 saasicon-trash" @click="deleteSpecial(item.webinar_id)"></i>
                  <i class="iconfont-v3 saasicon_move"></i>
                </div>
              </div>
            </draggable>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" class="length152" :disabled="!formData.title" @click="submitForm('ruleForm')" v-preventReClick round>保存</el-button>
        <el-button class="length152"  @click="resetForm('ruleForm')" v-preventReClick round>取消</el-button>
      </el-form-item>
    </el-form>
    <chose-actives
      v-if="showActiveSelect"
      :checkedList="selectedActives"
      @cacelSelect="showActiveSelect = false"
      @selectedEvent="doSelectedActives"
    ></chose-actives>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import PageTitle from '@/components/PageTitle';
import upload from '@/components/Upload/main';
import VEditor from '@/components/Tinymce';
import Env from "@/api/env";
import ChoseActives from './components/choseActives'

export default {
  components: {
    PageTitle,
    VEditor,
    upload,
    ChoseActives,
    draggable
  },
  computed: {
    reservationDesc(){
      return this.reservation ?  '已开启，专题页显示预约人数' : '开启后，专题页显示预约人数';
    },
    hotDesc(){
      return this.hot ? '已开启，专题页显示热度' : "开启后，专题页显示热度";
    },
    homeDesc(){
      return this.home ? '已开启，该专题在个人主页中显示' : "开启后，该专题在个人主页中显示";
    }
  },
  data(){
    return {
      showActiveSelect: false,
      selectedActives: [],
      formData: {
        title: '',
      },
      subject_id: '',
      reservation: true,
      isSave: true,
      hot: true,
      home: true,
      loading: false,
      imageUrl: '',
      domain_url:'',
      content: '',
      webinarIds: [],
      rules: {
        title: [
          { required: true, message: '请输入专题标题', trigger: 'blur' }
        ],
      }
    };
  },
  created(){
    // console.log(this.$route.query.title, '111111111111111111');
  },
  beforeRouteLeave(to, from, next) {
    if (this.isSave && $route.query.title == '创建') {
      this.$confirm(`是否取消编辑的专题内容？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-alert-box',
        type: 'warning'
      }).then(() => {
        next();
      }).catch(() => {
      });
    } else {
      next();
    }

  },
  mounted() {
    if (this.$route.query.id) {
      this.initInfo()
    }
  },

  methods: {
    // 获取专题 - 详情
    initInfo() {
      this.$fetch('subjectInfo', {
        subject_id: this.$route.query.id
      }).then(res => {
        if (res.code == 200) {
          this.selectedActives = Array.from(res.data.webinar_subject.webinar_list)
          this.subject_id = res.data.webinar_subject.id
          this.formData.title = res.data.webinar_subject.title
          res.data.webinar_subject.cover && (this.imageUrl = res.data.webinar_subject.cover)
          this.domain_url = res.data.webinar_subject.cover;
          this.content = res.data.webinar_subject.intro

          // 配置项
          this.home = res.data.webinar_subject.is_open ? false : true // 是否显示个人主页
          this.hot = Boolean(res.data.webinar_subject.hide_pv) // 是否显示 人气
          this.reservation = Boolean(res.data.webinar_subject.hide_appointment) // 是否显示预约人数

        }
      })
    },

    sendData(content) {
      this.content = content;
    },
    handleUploadSuccess(res, file){
      console.log(res, file);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.imageUrl = file_url;
        this.domain_url = domain_url;
      }
    },
    beforeUploadHnadler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message.error(`上传专题封面图片只能是 ${typeList.join('、')} 格式!`);
        return false;
      }
      if (!isLt2M) {
        this.$message.error('上传专题封面图片大小不能超过 2MB!');
        return false;
      }
      return isType && isLt2M;
    },

    uploadProcess(event, file, fileList){
      console.log('uploadProcess', event, file, fileList);
    },
    uploadError(err, file, fileList){
      console.log('uploadError', err, file, fileList);
      this.$message.error(`专题封面上传失败`);
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },

    submitForm(formName) {
      if (!this.content) {
        this.$message.error('请选择专题简介');
        return;
      }
      if (!this.selectedActives.length) {
        this.$message.error('请选择专题目录');
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const webinar_ids = this.selectedActives.map((item) => {
            return item.webinar_id || item.id
          });
          let data = {
            subject: this.formData.title,
            introduction: this.content,
            img_url: this.imageUrl,
            is_private: this.home ? 0 : 1,
            hide_appointment: Number(this.reservation),
            hide_pv: Number(this.hot),
          };

          if (webinar_ids.length) {
            data.webinar_ids = webinar_ids.join(',')
          }

          this.loading = true;
          let url = this.$route.query.id ? 'subjectEdit' : 'subjectCreate';

          if(url == 'subjectEdit') {
            data.id = this.subject_id
          }

          this.$fetch(url, this.$params(data)).then(res=>{
            if(res.code == 200) {
             this.isSave = false;
              this.subject_id = res.data.subject_id;
              this.$message.success(`创建成功`);
              console.log(res);
              setTimeout(()=>{
                this.$router.push({path: '/special'});
              }, 500);
            } else {
              this.$message.error(`创建失败，${res.msg}`);
            }
          }).catch(error=>{
            this.$message.error(`创建失败，${error.message}`);
          }).finally(()=>{
            this.loading = false;
          });
          console.log(data);


        } else {
          this.$message.error('请完善必填字段');
          document.documentElement.scrollTop = 0;
          return false;
        }
      });
    },

    resetForm(formName) {
      if (this.$route.query.id) {
        this.$router.go(-1);
      } else {
         this.$confirm(`取消将不保存此页面的内容？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'zdy-alert-box',
            type: 'warning'
          }).then(() => {
              this.$router.go(-1)
          }).catch(() => {
            });
      }
    },
    deleteImg() {
      this.imageUrl = '';
      this.domain_url = '';
    },
    doSelectedActives (selectedActives) {
      selectedActives.map(item => {
        this.selectedActives.push(item);
      })
      let id = 'webinar_id';
      this.selectedActives = this.selectedActives.reduce((all, next) => all.some((atom) => atom[id] == next[id]) ? all : [...all, next],[]);
      this.showActiveSelect = false
    },
    // 删除事件
    deleteSpecial(id) {
      this.$confirm('您确定要删除选中的专题吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box'
        }).then(() => {
          this.selectedActives.map((opt, index) => {
            if (opt.webinar_id == id) {
              this.selectedActives.splice(index, 1);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
    },
    dragStart(e) {
      console.log('vhall saas Event 拖动开始::', e)
    },
    dragEnd(e) {
      console.log('vhall saas Event 拖动结束::', e)
    },
    sortChange(e) {
      console.log('拖拽事件', e)
    }
  },
};
</script>

<style lang="less" scoped>
  .el-form{
    background: #ffffff;
    padding: 48px 20px 50px 48px;
    /deep/ .el-switch__label--left{
      color: #1A1A1A;
      pointer-events: none;
      user-select: none;
    }
    /deep/ .el-switch__label--right{
      color: #999999;
      pointer-events: none;
      user-select: none;
    }
  }
  .el-form-item{
    width: 100%;
    max-width: 640px;
  }
  .btnGroup{
    text-align: center;
    margin-top: 40px;
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
 /* .editBox {
    padding: 0px 40px;
  }
  @media screen and (min-width: 1920px) {
    .editBox {
      padding: 0px 140px;
    }
  }*/
</style>
<style lang="less">
  html{
    background: #F7F7F7;
  }
  .vh-sort-tables{
    position: relative;
    width: 640px;
    font-size: 14px;
    font-weight: 400;


    &__theader{
      height: 40px;
      line-height: 40px;
      background: #F7F7F7;
      color: #666666;
      &>div{
        display: inline-block;
      }
      &-id{
        width: 77px;
        padding-left: 24px;
        box-sizing: border-box;
      }
      &-title{
        width: 290px;
      }
      &-status{
        width: 88px;
      }
      &-hots{
        width: 93px;
      }
      &-editor{
        width: 86px;
      }
    }

    &__tbody{
      // height: 120px;
      // overflow-y: scroll;
      &-selected {
        border: 1px solid #FB3A32;
      }
      &-tr{
        border-bottom: 1px solid #E6E6E6;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: #1A1A1A;
        word-break: keep-all;
        &>div{
          display: inline-block;
          vertical-align: top;
        }
      }

      &-id{
        width: 77px;
        padding-left: 24px;
        box-sizing: border-box;
      }
      &-title{
        overflow: hidden;
        text-overflow: ellipsis;
        width: 288px;
      }
      &-status{
        width: 88px;
      }
      &-hots{
        width: 93px;
      }
      &-editor{
        width: 82px;
        i{
          font-size: 20px;
          margin: 0 5px;
          cursor: pointer;
        }
      }
    }
  }
</style>
