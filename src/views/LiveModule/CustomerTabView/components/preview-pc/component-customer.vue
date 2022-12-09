<template>
  <div class="vh-customer-previewPc">
    <template v-for="(item, index) in units">
      <div :key="index" v-if="item.component_id == 1">
        <des :info="item" mode="1"></des>
      </div>
      <div :key="index" v-if="item.component_id == 2">
        <qrcode :info="item" mode="1"></qrcode>
      </div>
      <div :key="index" v-if="item.component_id == 3">
        <lives :info="item" :checkedList="item.webinars" mode="1"></lives>
      </div>
      <div :key="index" v-if="item.component_id == 4">
        <project :info="item" :checkedList="item.subjects" mode="1"></project>
      </div>
      <div :key="index" v-if="item.component_id == 5">
        <text-link :info="item" mode="1"></text-link>
      </div>
      <div :key="index" v-if="item.component_id == 6">
        <img-link :info="item" mode="1"></img-link>
      </div>
      <div :key="index" v-if="item.component_id == 7" style="margin-bottom: 16px">
        <component-title :info="item" mode="1"></component-title>
      </div>
      <div :key="index" v-if="item.component_id == 8">
        <component-line :info="item" mode="1"></component-line>
      </div>
      <div :key="index" v-if="item.component_id == 9">
        <rank :info="item" mode="1" :pre="pre"></rank>
      </div>
    </template>
  </div>
</template>
<script>
  import lives from './lives';
  import project from './project';
  import rank from '../componet-editor/component-rank';
  import des from '../componet-editor/component-desimg';
  import componentLine from '../componet-editor/component-line';
  import qrcode from '../componet-editor/component-qrcode';
  import imgLink from '../componet-editor/component-imglink';
  import textLink from '../componet-editor/component-textlink';
  import componentTitle from '../componet-editor/component-title';

  export default {
    props: {
      menuInfo: {
        required: true
      },
      units: {
        required: true
      },
      pre: {
        required: true
      }
    },

    components: {
      lives,
      project,
      qrcode,
      rank,
      des,
      componentTitle,
      componentLine,
      imgLink,
      textLink
    },

    data() {
      return {};
    },

    methods: {}
  };
</script>
<style lang="less" scoped></style>
