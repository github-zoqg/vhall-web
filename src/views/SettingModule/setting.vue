<template>
  <div>
    <pageTitle title='设置中心'></pageTitle>
    <div>
      <el-row type="flex" class="row-bg" justify="space-between" :gutter="24">
        <el-col :span="8"  v-for="(item, ins) in operas" :key='ins'>
          <div class="subjectInner"  @click="blockHandler(item)">
            <icon class="icon" :icon-class="item.icon"></icon>
            <div class="desc">
              <p class="mainText">{{item.title}}</p>
              <p class="subText">{{item.subText}}</p>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  name: "setting.vue",
  components: {
    PageTitle,
  },
  data() {
    return {
      operas: [
        { icon: 'saasicon_xiaoxiyanjinci', title: '聊天严禁词', subText: '设置聊天过滤严禁词', path: `/setting/chat/1`},
        { icon: 'saasicon_kaifashezhi', title: '开发设置', subText: '设置API接口信息' , path: '/dev/list'},
        { icon: 'saasicon_kongzhitaibiaoshi', title: '控制台标志', subText: '设置控制台的品牌标识' , path: '/setting/logo/1'}
      ]
    };
  },
  methods: {
    blockHandler(item) {
      console.log('块点击：' + JSON.stringify(item));
      this.$router.push({
        path: item.path
      });
    }
  }
};
</script>
<style lang="less" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  .subjectInner {
    display: flex;
    height: 110px;
    background: #fff;
    align-items: center;
    margin-bottom: 24px;
    box-sizing: border-box;
    background-clip: content-box;
    cursor: pointer;
    border: 2px solid transparent;
    border-radius: 4px;
    &:hover{
      box-shadow: 0 6px 12px 0 rgba(251, 58, 50, 0.16);
      border: 1px solid #FB3A32;
    }
  }
  .icon{
    width: 56px;
    height: 56px;
    // background: #FB3A32;
    margin-right: 15px;
    border-radius: 50%;
    margin-left: 35px;
    // border: 1px solid #ccc;
  }
  /deep/.svg-icon{
    text-align: center;
    font-size: 50px;
    vertical-align: top;
  }
  .desc{
    .mainText{
      margin-bottom: 4px;
      font-size: 18px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #1A1A1A;
      line-height: 25px;
    }
    .subText{
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #666666;
      line-height: 20px;
    }
  }
}
</style>
