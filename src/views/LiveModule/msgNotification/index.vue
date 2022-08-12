<template>
  <div class="msg-notification-page">
    <pageTitle pageTitle="消息通知">
      <div slot="content">
          1.消息通知支持重复发送，为避免用户打扰，建议控制发送时间及频次
          <br />
          2.重复开播/设置时间即对所有参与用户进行发送，不区分场次
          <br />
          3.单条短信超过70字符（含后缀）将消耗2条计费，最大字符限制500字
      </div>
    </pageTitle>
    <div class="msg-notification__body"></div>
    <begin-play
      :webinarId="$route.params.str"
      v-if="$route.query.type != 5 && webinarState != 4"
    ></begin-play>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import beginPlay from '@/components/beginBtn';
import {sessionOrLocal} from "@/utils/utils";
export default {
  name: 'msgNotification',
  data() {
    return {
      webinarState: JSON.parse(sessionOrLocal.get("webinarState")),
    }
  },
  components: {
    PageTitle,
    beginPlay
  },
  methods: {},
  created() {
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.msg-notification-page {
  .msg-notification__body {
    background: #eae;
  }
}
</style>
