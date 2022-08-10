<template>
  <div class="subject_card">
    <section>
      <p class="subject">设置</p>
      <div class="subjectOuter">
        <template v-for="item in settingList">
          <div class="sunjectInner" @click="blockHandler(item)" :key="item.id">
            <span><img :src="require(`../../../common/images/icon/${item.icon}.png`)" alt=""></span>
            <div class="desc">
              <p class="mainText">{{item.title}}</p>
              <p class="subText">{{item.subText}}</p>
            </div>
          </div>
        </template>
      </div>
    </section>
    <section>
      <p class="subject">数据</p>
      <div class="subjectOuter">
        <div class="sunjectInner" @click="handleData">
          <span><img src="../../../common/images/icon/icon_data@2x.png" alt=""></span>
          <div class="desc">
            <p class="mainText">导出数据</p>
            <p class="subText">导出报名表单数据</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
import {sessionOrLocal} from "@/utils/utils";
export default {
  data() {
    return {
      userId:JSON.parse(sessionOrLocal.get("userId")),
      settingList: [
        {icon: 'icon_information@2x', id: 1, title: '基本信息', subText: '编辑专题基本信息', path: `/special/edit/${this.$route.params.id}`, k: 100856},
         {icon: 'icon_watch@2x', id: 2, title: '观看限制', subText: '设置专题观看限制', path: `/special/viewer/${this.$route.params.id}`, k: 100858},
      ]
    }
  },
  methods: {
    blockHandler(item) {
      this.reportData(item.k);
      this.$router.push({path: item.path, query: {title: item.id == 1 ? '编辑' : undefined}})
    },
    handleData() {
      this.reportData(100865);
      this.$router.push({path: `/special/data/${this.$route.params.id}`})
    },
    reportData(k) {
      this.$vhall_paas_port({
        k: k,
        data: {
          business_uid: this.userId,
          user_id: '',
          webinar_id: '',
          subject_id: this.$route.params.id,
          refer: '',
          s: '',
          report_extra:{},
          ref_url: '',
          req_url: '',
        },
      })
    }
  }
}
</script>
<style lang="less" scoped>
.subject{
  font-size: 20px;
  color: #333333;
  border-left: 4px solid #FB3A32;
  line-height: 16px;
  height: 18px;
  margin-top: 32px;
  margin-bottom: 12px;
  padding-left: 5px;
}
.subjectOuter{
  display: flex;
  flex-wrap: wrap;
  margin-right: -24px;
// justify-content: space-between;
}
.sunjectInner{
  display: flex;
  background: #fff;
  width: 330px;
  height: 110px;
  align-items: center;
  margin-bottom: 24px;
  margin-right: 17px;
  box-sizing: border-box;
  background-clip: content-box;
  cursor: pointer;
  border-radius: 4px;
  border: 1px solid transparent;
  transition: all 0.15s ease-in;
  &:nth-child(3n) {
    margin-right: 0;
  }
  &:nth-child(4n) {
    margin-right: 18px;
  }
  &:hover{
    box-shadow: 0px 6px 12px 0px rgba(0, 0, 0, 0.08), 0px 2px 4px 0px rgba(0, 0, 0, 0.02);
    border: 1px solid #FB3A32;
  }
  span{
    width: 44px;
    height: 44px;
    display: inline-block;
    margin-right: 15px;
    border-radius: 50%;
    margin-left: 35px;
    img{
      width: 100%;
      height: 100%;
      // background: #FB3A32;
      // border: 1px solid #ccc;
    }
  }
  /deep/.svg-icon{
    text-align: center;
    font-size: 50px;
    vertical-align: top;
    color: #FB3A32;
  }
  .desc{
    .mainText{
      font-size: 18px;
      color: #1A1A1A;
      margin-bottom: 8px;
    }
    .subText{
      font-size: 14px;
      color: #666666;
    }
  }
}
@media screen and (min-width: 1920px) {
  .sunjectInner {
    &:nth-child(3n) {
      margin-right: 18px;
    }
    &:nth-child(4n) {
      margin-right: 0;
    }
  }
}
</style>
