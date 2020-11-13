<template>
  <div>
    <pageTitle title='设置中心'></pageTitle>
    <item-card :operas="operas" @blockHandler="blockHandler"></item-card>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import ItemCard from '@/components/ItemCard/index.vue';
export default {
  name: "setting.vue",
  components: {
    PageTitle,
    ItemCard
  },
  data() {
    return {
      operas: {
        "基本设置": [
          { icon: '', title: '聊天严禁词', subText: '设置聊天过滤严禁词', path: '/setting-chat' },
          { icon: '', title: '开发设置', subText: '设置API接口信息' , path: '/setting-dev'},
          { icon: '', title: '控制台标志', subText: '设置控制台的品牌标识' , path: '/setting-logo'}
        ],
      }
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
</style>
