<template>
  <div class="result">
    <div class="result-count">
      <img :class="{'img-zero': count == 0}" :src="count!=0 ? signImg : signImgZero" alt="" />
      <div>签到人数：{{count}}人</div>
    </div>
    <div class="result-table" v-if="count != 0">
      <div class="result-table-head">
        <strong>昵称</strong>
        <strong>签到时间</strong>
      </div>
      <div class="result-table-list">
        <div class="result-table-item">
          <img :src="signImg" alt="" />
          <span class="nickname ellsips">欧阳丹打发时间粉红色副书记咖啡馆田</span>
          <span class="time">14:34</span>
        </div>
      </div>
    </div>
    <div class="result-tip">
      最多显示100人，更多数据请查看控制台-信息收集-签到
    </div>
    <div class="start-btn">
      <el-button type="danger" @click="$emit('restartsign')">开始签到</el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SignResult',
  props: {
    count: {
      type: Number,
      default: 0
    },
    users: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      signImg: require('../images/sign@2x.png'),
      signImgZero: require('../images/sign_zero@2x.png')
    };
  }
};
</script>

<style lang="less" scoped>
.result {
  text-align: center;
  &-count {
    margin-bottom: 12px;
    img {
      width: 56px;
      height: 56px;
    }
    .img-zero{
      width: 110px;
      height: 110px;
    }
    > div {
      font-size: 18px;
      color: #222;
      margin-top: 12px;
    }
    > p {
      font-size: 12px;
      color: #888;
    }
  }
  &-tip {
    font-size: 12px;
    color: #888;
    margin-top: 10px;
    margin-bottom: 39px;
  }
  &-table {
    background-color: #f5f5f5;
    border-radius: 8px;
    color: #222;
    &-head {
      display: flex;
      padding: 12px 20px;
      justify-content: space-between;
    }
    &-item {
      display: flex;
      padding: 12px 20px;
      align-items: center;
      > img {
        width: 24px;
        height: 24px;
        margin-right: 8px;
      }
      .nickname {
        text-align: left;
        width: 230px;
      }
      .time {
        flex: 1;
        text-align: right;
      }
    }
    &-list {
      max-height: 240px;
      overflow-y: scroll;
    }
  }
}
.start-btn {
  text-align: center;
  &-core {
    width: 160px;
    background: #FC5659;
    span{
      color: #fff;
    }
  }
  ::v-deep .el-button{
    box-shadow: 0px 8px 32px 0px rgba(34, 34, 34, 0.24);
    border-radius: 8px;
    color: #FFFFFF;
  }
}
</style>
