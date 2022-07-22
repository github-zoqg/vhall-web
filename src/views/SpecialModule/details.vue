<template>
  <div class="subject-detail">
    <!-- 专题详情页 -->
    <pageTitle pageTitle="专题详情"></pageTitle>
    <el-row :gutter="16" class="subject-detail_info">
      <el-col :span="18" :lg="18" :md="24" :sm="24" :xs="24">
        <div class="info_inner">
          <div class="info_inner_thumb">
            <img :src="subjectDetailInfo.cover" alt="" />
          </div>
          <div class="info_inner_base">
            <div class="hidden_hover">
              <p class="mainColor font-20">
                {{ subjectDetailInfo.title }}
              </p>
              <p class="title_hover">{{ subjectDetailInfo.title }}</p>
            </div>
            <p class="info_limit">
              观看限制：
              <span v-if="subjectDetailInfo.subject_verify==1">统一观看限制，各直播自己的失效</span>
              <span v-if="subjectDetailInfo.subject_verify==2">统一报名表单，各直播自己的失效</span>
              <span v-else>无统一的观看限制，采用直播自己的</span>
            </p>
            <p class="info_button">
              <el-button round  size="small" @click="previewSubject">预览</el-button>
              <el-button round size="small" @click="shareSubject">分享</el-button>
            </p>
          </div>
        </div>
      </el-col>
      <el-col :span="6" :lg="6" :md="24" :sm="24" :xs="24" class="subject-detail_intro" style="padding-right: 4px">
        <div class="intro_inner">
          <div class="intro_inner_code">
            <img :src="env.staticLinkVo.aliQr + shareVo.url" alt="">
          </div>
          <div class="intro_inner_down">
            <el-button type="primary" size="medium" round >下载二维码</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <itemCard></itemCard>
    <share ref="share" :shareVo="shareVo"></share>
  </div>
</template>
<script>
import PageTitle from '@/components/PageTitle'
import itemCard from './components/itemCard.vue'
import share from './components/share.vue'
import {sessionOrLocal} from "@/utils/utils";
import Env from "@/api/env";
export default {
  name: 'subjectDetails',
  components: {
    PageTitle,
    itemCard,
    share
  },
  data() {
    return {
      hasDelayPermission: 0,
      env: Env,
      subject_id: this.$route.params.id,
      shareVo: {
        pcUrl: ''
      },
      subjectDetailInfo: {}
    }
  },
  created() {
    let SAAS_VS_PES = sessionOrLocal.get('SAAS_VS_PES', 'localStorage');
    let permissions = SAAS_VS_PES ? JSON.parse(SAAS_VS_PES) : null
    this.hasDelayPermission = permissions ? permissions['no.delay.webinar'] : 0
    this.getSubjectInfo()
  },
  methods: {
    getSubjectInfo() {
       this.$fetch('subjectInfo', {
        subject_id: this.$route.params.id
      }).then(res => {
        if (res.code == 200) {
          this.subjectDetailInfo = {...res.data.webinar_subject};
          this.subject_id = res.data.webinar_subject.id
        }
      })
    },
    previewSubject() {
      window.open(`${process.env.VUE_APP_WAP_WATCH}/special/detail?id=${this.$route.params.id}&delay=${this.hasDelayPermission}`, '_blank')
    },
    shareSubject() {
      this.shareVo.url = `${process.env.VUE_APP_WAP_WATCH}/special/detail?id=${this.$route.params.id}`;
      // this.shareVo.pcUrl = `${process.env.VUE_APP_WEB_URL}/special/detail?id=${id}`;
      this.shareVo.pcUrl = `${process.env.VUE_APP_WAP_WATCH}/special/detail?id=${this.$route.params.id}`;
      this.$refs.share.dialogVisible = true;
    }
  }

}
</script>
<style lang="less" scoped>
  .subject-detail{
    &_info{
      height: 223px;
      .info_inner {
        background: #fff;
        width: 100%;
        height: 100%;
        padding: 24px;
        display: flex;
        border-radius: 4px;
        &_thumb{
          width: 312px;
          height: 175px;
          position: relative;
          margin-right: 25px;
          background: #1a1a1a;
          border-radius: 4px;
          img {
            width: 100%;
            height: 100%;
            object-fit: scale-down;
            border-radius: 4px;
          }
        }
        &_base {
          flex: 1;
          p {
            font-size: 14px;
            line-height: 28px;
          }
          .hidden_hover:hover .title_hover {
            display: block;
          }
          .title_hover {
            position: absolute;
            left: 370px;
            top: 55px;
            border-radius: 4px;
            max-width: 368px;
            word-break: break-all;
            line-height: 17px;
            background: rgba(#1a1a1a, 0.85);
            font-size: 12px;
            color: #fff;
            padding: 8px 10px;
            z-index: 100;
            display: none;
          }
        }
        .tag {
          border-radius: 20px;
          background: #f2f2f2;
          font-size: 12px;
          padding: 4px 8px;
          margin-right: 8px;
        }
      }
    }
    &_intro {
      height: 223px;
      overflow: auto;
      .intro_inner{
        background: #fff;
        width: 100%;
        height: 100%;
        padding: 12px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        &_code{
          width: 132px;
          height: 132px;
          img{
            width: 100%;
            height: 100%;
            object-fit: scale-down;
          }
        }
        &_down{
          margin-top: 10px;
        }
      }
    }
  }
</style>
