<template>
  <div class="video-wrap">
    <video-list :type='2' :operatingArray="['编辑','预览', '删除']" @operating='operating'></video-list>
    <pagination-list :total='total' :currentPage='currentPage'></pagination-list>
  </div>
</template>
<script>
import VideoList from '@/components/DataList/index.vue';
import PaginationList from '@/components/Pagination/index.vue';
export default {
  data() {
    return {
      total: 100,
      currentPage: 1
    };
  },
  components: {
    VideoList,
    PaginationList
  },
  methods: {
    operating(item){
      console.log(item, 9);
    }
  },
};
</script>
<style lang="less" scoped>
.video-wrap{
  height: 100%;
}
</style>
