<template>
  <div class="subject-detail">
    <!-- 专题详情页 -->
    <pageTitle pageTitle="专题详情"></pageTitle>
    <div class="subject-detail_info">
      <div class="subject_left">
        <div class="info_inner">
          <div class="info_inner_thumb">
            <img :src="subjectDetailInfo.cover" alt="" />
          </div>
          <div class="info_inner_base">
            <div class="hidden_hover">
              <p class="mainColor">
                {{ subjectDetailInfo.title }}
              </p>
              <p class="title_hover">{{ subjectDetailInfo.title }}</p>
            </div>
            <p class="info_limit">
              观看限制：
              <span v-if="subjectDetailInfo.subject_verify==1">统一观看限制，各直播自己的失效</span>
              <span v-else-if="subjectDetailInfo.subject_verify==2">统一报名表单，各直播自己的失效</span>
              <span v-else>无统一的观看限制，采用直播自己的</span>
            </p>
            <p class="info_button">
              <el-button round  size="small" @click="previewSubject">预览</el-button>
              <el-button round size="small" @click="shareSubject">分享</el-button>
            </p>
          </div>
        </div>
      </div>
      <div class="subject_right">
        <div class="intro_inner">
          <div class="intro_inner_code">
            <img :src="subjectWapLink" alt="">
          </div>
          <div class="intro_inner_down">
            <el-button type="primary" size="medium" round @click="downErCode">下载二维码</el-button>
          </div>
        </div>
      </div>
    </div>
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
      subject_id: this.$route.params.id,
      subjectWapLink: `${Env.staticLinkVo.aliQr}${process.env.VUE_APP_WAP_WATCH}/special/detail?id=${this.$route.params.id}`,
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
    // 下载二维码
    downErCode() {
      const activeName = this.subjectDetailInfo.title
        let image = new Image()
        // 解决跨域 Canvas 污染问题
        image.setAttribute('crossOrigin', 'anonymous')
        image.onload = function () {
          let canvas = document.createElement('canvas')
          // canvas.width = image.width
          // canvas.height = image.height
          canvas.width = 217
          canvas.height = 217
          let context = canvas.getContext('2d')
          context.drawImage(image, 0, 0, 217, 217)
          // context.drawImage(image, 0, 0, image.width, image.height)
          let url = canvas.toDataURL('image/png') //得到图片的base64编码数据
          let a = document.createElement('a') // 生成一个a元素
          let event = new MouseEvent('click') // 创建一个单击事件
          a.download = `${activeName || 'code'}专题二维码.png` // 设置图片名称
          a.href = url // 将生成的URL设置为a.href属性
          a.dispatchEvent(event) // 触发a的单击事件
        }
        image.src = this.subjectWapLink;
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
      display: flex;
      .subject_left{
        width: calc(100% - 272px);
        flex: 1;
      }
      .info_inner {
        background: #fff;
        width: 100%;
        height: 100%;
        padding: 24px;
        display: flex;
        border-radius: 4px;
        position: relative;
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
          .mainColor{
            font-size: 20px;
            color: #1a1a1a;
            width: 100%;
            overflow: hidden;
            word-break: break-all;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            position: relative;
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
          .info_limit{
            color: #666;
            padding-top: 8px;
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
      .subject_right{
        height: 223px;
        width: 248px;
        background: #fff;
        border-radius: 4px;
        margin-left: 24px;
        .intro_inner{
          background: #fff;
          width: 100%;
          height: 100%;
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
            button.el-button.el-button--medium{
              padding: 4px 23px;
            }
          }
        }
      }
    }
  }
</style>
