<template>
  <div class="editBox">
    <pageTitle :pageTitle="`${$route.query.title || '创建'}专题`"></pageTitle>
    <el-form :model="formData" ref="ruleForm" :rules="rules" v-loading="loading" label-width="80px">
      <el-form-item label="专题标题" prop="title">
        <VhallInput v-model="formData.title" v-clearEmoij :maxlength="100" autocomplete="off" placeholder="请输入专题标题" show-word-limit></VhallInput>
      </el-form-item>
      <el-form-item label="专题封面">
        <upload
          class="upload__avatar"
          v-model="formData.imageUrl"
          :domain_url="formData.domain_url"
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
            <p>建议尺寸：1280*720px，小于4M</p>
            <p>支持jpg、gif、png、bmp</p>
          </div>
        </upload>
      </el-form-item>
      <el-form-item label="专题简介" required>
        <v-editor save-type='special' :isReturn=true @returnChange="sendData" ref="unitImgTxtEditor" v-model="formData.content"></v-editor>
      </el-form-item>
      <p class="switch__box">
        <el-switch
          v-model="formData.reservation"
          active-color="#FB3A32"
          inactive-color="#CECECE"
          inactive-text="预约人数"
          :active-text="reservationDesc">
        </el-switch>
      </p>
      <!-- <el-form-item label="预约人数">
        <p class="switch__box">
          <el-switch
            v-model="formData.reservation"
            active-color="#FB3A32"
            inactive-color="#CECECE"
            :active-text="reservationDesc">
          </el-switch>
        </p>
      </el-form-item> -->
      <!-- <el-form-item label="专题热度"> -->
        <p class="switch__box">
          <el-switch
            v-model="formData.hot"
            active-color="#FB3A32"
            inactive-color="#CECECE"
            inactive-text="专题热度"
            :active-text="hotDesc">
          </el-switch>
        </p>
      <!-- </el-form-item> -->
      <!-- <el-form-item label="关联主页"> -->
        <p class="switch__box">
          <el-switch
            v-model="formData.home"
            active-color="#FB3A32"
            inactive-color="#CECECE"
            inactive-text="关联主页"
            :active-text="homeDesc">
          </el-switch>
        </p>
      <!-- </el-form-item> -->
      <el-form-item label="专题目录" required>
        <el-button size="small" round @click="showActiveSelect = true">添加</el-button>
        <div class="vh-sort-tables" v-show="formData.selectedActives.length">
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
              :list="formData.selectedActives"
              chosenClass="vh-sort-tables__tbody-selected"
              @dragstart="dragStart"
              @dragend="dragEnd"
            >
              <div
                class="vh-sort-tables__tbody-tr"
                v-for="(item, index) in formData.selectedActives"
                :key="item.webinar_id"
                >
                <div class="vh-sort-tables__tbody-id">
                  {{ index + 1 }}
                </div>
                <div class="vh-sort-tables__tbody-title" @click="goWebinarSpecial(item.webinar_id, item.webinar_state)">
                  {{ item.subject }}
                </div>
                <div class="vh-sort-tables__tbody-status">
                  <template>
                   {{ item.webinar_state | actionText }}
                  </template>
                  <!-- <template v-if="item.webinar_type == 1">
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
                  </template> -->
                </div>
                <div class="vh-sort-tables__tbody-hots">
                  {{ item.pv | formatNum }}
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
      :checkedList="formData.selectedActives"
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
import ChoseActives from './components/choseLiveList'
import {sessionOrLocal} from "@/utils/utils";

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
      return this.formData.reservation ?  '已开启，专题页显示预约人数' : '开启后，专题页显示预约人数';
    },
    hotDesc(){
      return this.formData.hot ? '已开启，专题页显示热度' : "开启后，专题页显示热度";
    },
    homeDesc(){
      return this.formData.home ? '已开启，该专题在个人主页中显示' : "开启后，该专题在个人主页中显示";
    },
    title() {
      return this.$route.query.title
    }
  },
  data(){
    return {
      showActiveSelect: false,
      formData: {
        selectedActives: [],
        title: '',
        reservation: true,
        imageUrl: '',
        domain_url:'',
        content: '',
        hot: true,
        home: true,
      },
      subject_id: '',
      subjectInfo: {
      },
      userId:JSON.parse(sessionOrLocal.get("userId")),
      loading: false,
      webinarIds: [],
      rules: {
        title: [
          { required: true, message: '请输入专题标题', trigger: 'blur' }
        ],
      },
      isChange: false
    };
  },
  created() {
    window.scrollTo(0,0)
  },
  mounted() {
    if (this.$route.query.id) {
      this.initInfo()
    }
  },
  watch: {
    formData: {
      deep: true,
      handler() {
        this.isChange = true;
      }
    },
    title(newVal, oldVal) {
      if (newVal != oldVal) {
        this.formData = {
          selectedActives: [],
          title: '',
          reservation: true,
          imageUrl: '',
          domain_url:'',
          content: '',
          hot: true,
          home: true
        }
        this.$refs.unitImgTxtEditor.$refs.editor.resetContent()
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    // 离开页面前判断信息是否修改
    if (!this.isChange) {
      next()
      return false;
    }
    this.$confirm(`取消将不保存此页面的内容？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      customClass: 'zdy-message-box',
      lockScroll: false,
      cancelButtonClass: 'zdy-confirm-cancel'
    }).then(() => {
        next()
    }).catch(() => {
    });
  },
  methods: {
    // 获取专题 - 详情
    initInfo() {
      this.$fetch('subjectInfo', {
        subject_id: this.$route.query.id
      }).then(res => {
        if (res.code == 200) {
          this.subjectInfo = {...res.data.webinar_subject};
          this.formData.selectedActives = Array.from(res.data.webinar_subject.webinar_list)
          this.subject_id = res.data.webinar_subject.id
          this.formData.title = res.data.webinar_subject.title
          res.data.webinar_subject.cover && (this.formData.imageUrl = res.data.webinar_subject.cover)
          this.formData.domain_url = res.data.webinar_subject.cover;
          this.formData.content = res.data.webinar_subject.intro

          // 配置项
          this.formData.home = res.data.webinar_subject.is_open ? false : true // 是否显示个人主页
          this.formData.hot = Boolean(res.data.webinar_subject.hide_pv) // 是否显示 人气
          this.formData.reservation = Boolean(res.data.webinar_subject.hide_appointment) // 是否显示预约人数

          // 重置修改状态
          setTimeout(() => {
            this.isChange = false
          }, 300)
        }
      })
    },

    sendData(content) {
      this.formData.content = content;
      console.log(content, "1111111111111111");
    },
    handleUploadSuccess(res, file){
      console.log(res, file);
      if(res.data) {
        let domain_url = res.data.domain_url || ''
        let file_url = res.data.file_url || '';
        this.formData.imageUrl = file_url;
        this.formData.domain_url = domain_url;
      }
    },
    beforeUploadHnadler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 4;
      if (!isType) {
        this.$message({
          message: `上传专题封面图片只能是 ${typeList.join('、')} 格式`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: `上传专题封面图片大小不能超过 4M`,
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
        message: `专题封面上传失败`,
        showClose: true,
        // duration: 0,
        type: 'error',
        customClass: 'zdy-info-box'
      });
    },
    uploadPreview(file){
      console.log('uploadPreview', file);
    },

    submitForm(formName) {
    window.cd = this.formData
      if (!this.formData.content) {
        this.$message({
          message: `请输入专题简介`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
      if (!this.formData.selectedActives.length) {
        this.$message({
          message: `请选择专题目录`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return;
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const webinar_ids = this.formData.selectedActives.map((item) => {
            return item.webinar_id || item.id
          });
          let data = {
            subject: this.formData.title,
            introduction: this.formData.content,
            img_url: this.formData.imageUrl,
            is_private: this.formData.home ? 0 : 1,
            hide_appointment: Number(this.formData.reservation),
            hide_pv: Number(this.formData.hot),
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
            if (!this.$route.query.id) {
              let refer = this.$route.query.refer || 2
              this.$vhall_paas_port({
                k: 100489,
                data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: refer, s: '', report_extra: {}, ref_url: '', req_url: ''}
              })
            }

            if(res.code == 200) {
              this.setReportData(webinar_ids.length)
              this.subject_id = res.data.subject_id;
              this.$message({
                message: this.$route.query.id ? '编辑成功' : `创建成功`,
                showClose: true,
                // duration: 0,
                type: 'success',
                customClass: 'zdy-info-box'
              });
              // 保存或创建成功重置更改状态
              this.isChange = false
              console.log(res);
              setTimeout(()=>{
                this.$router.push({path: '/special'});
              }, 500);
            }
          }).catch(error=>{
            this.$message({
              message: this.$route.query.id ? '编辑失败' : `创建失败，${error.msg}`,
              showClose: true,
              // duration: 0,
              type: 'error',
              customClass: 'zdy-info-box'
            });
          }).finally(()=>{
            this.loading = false;
          });
          console.log(data);


        } else {
          this.$message({
            message: `请完善必填字段`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          document.documentElement.scrollTop = 0;
          return false;
        }
      });
    },
    setReportData(len) {
      if (this.formData.imageUrl) {
        this.$vhall_paas_port({
          k: 100498,
          data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
      }
      this.$vhall_paas_port({
        k: this.formData.reservation ? 100499 : 100500,
        data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      this.$vhall_paas_port({
        k: this.formData.hot ? 100501 : 100502,
        data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      this.$vhall_paas_port({
        k: this.formData.home ? 100503 : 100504,
        data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      this.$vhall_paas_port({
        k: 100505,
        data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {vip:len}, ref_url: '', req_url: ''}
      })
    },
    // 判断是否填写数据
    isContent() {
      if (this.formData.title||
          this.formData.content ||
          this.formData.imageUrl ||
          !this.formData.home ||
          !this.formData.reservation ||
          !this.formData.hot ||
          this.formData.selectedActives.length > 0) {
        this.$confirm(`取消将不保存此页面的内容？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
            this.$router.push({path:'/special/list'});
        }).catch(() => {
          });
      } else {
         this.$router.push({path:'/special/list'});
      }
    },
    resetForm(formName) {
      this.$router.push({path:'/special/list'});
    },
    deleteImg() {
      this.formData.imageUrl = '';
      this.formData.domain_url = '';
    },
    doSelectedActives (selectedActives) {
      selectedActives.map(item => {
        this.formData.selectedActives.push(item);
      })
      let id = 'webinar_id';
      this.formData.selectedActives = this.formData.selectedActives.reduce((all, next) => all.some((atom) => atom[id] == next[id]) ? all : [...all, next],[]);
      this.showActiveSelect = false
    },
    // 删除事件
    deleteSpecial(id) {
      this.$confirm('您确定要删除选中的直播吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          this.formData.selectedActives.map((opt, index) => {
            if (opt.webinar_id == id) {
              this.formData.selectedActives.splice(index, 1);
            }
          })
          this.$vhall_paas_port({
            k: 100507,
            data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
        }).catch(() => {
          this.$message({
            message:  `已取消删除`,
            showClose: true,
            // duration: 0,
            type: 'info',
            customClass: 'zdy-info-box'
          });
        });
    },
    // 跳转活动页面
    goWebinarSpecial(id, state) {
      this.$vhall_paas_port({
        k: 100508,
        data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
      let path = state === 4 ? '/live/vodEdit/' : '/live/edit/';
      const { href } = this.$router.resolve({path: `${path}${id}`, query: {type: 2 }});
      window.open(href, '_blank');
    },
    dragStart(e) {
      console.log('vhall saas Event 拖动开始::', e)
    },
    dragEnd(e) {
      this.$vhall_paas_port({
        k: 100506,
        data: {business_uid: this.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      })
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
    padding: 48px 20px 1px 48px;
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
    /deep/.el-input__inner{
      height: 40px;
    }
    .tox-tinymce{
      border-radius: 4px;
    }
    /deep/.el-switch__label--left {
      margin-right: 13px;
    }
  }
  /deep/.el-upload--picture-card i.saasicon_shangchuan{
    font-size: 40px;
  }
  .switch__box{
    line-height: 35px;
    padding-bottom: 10px;
    padding-left: 10px;
  }
  .el-form-item{
    width: 100%;
    max-width: 668px;
    &:last-child{
      padding: 16px 0;
    }
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
  /* 图片上传 */
  .upload__avatar {
    /deep/.el-upload--picture-card {
      height: 180px;
      border: 1px solid #CCCCCC;
    }
    /deep/.box > div {
      height: 180px;
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
      &-tr{
        // border: 1px solid #FB3A32;
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
      &-selected {
        border: 1px solid #FB3A32;
      }

      &-id{
        width: 77px;
        padding-left: 24px;
        box-sizing: border-box;
      }
      &-title{
        width: 288px;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        word-break: break-all;
        cursor: pointer;
        color: #3562FA;
        &:hover{
          color: #FB3A32;
        }
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
          &:hover{
            color: #FB3A32;
          }
        }
      }
    }
  }
</style>
