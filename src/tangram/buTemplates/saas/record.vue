<template>
  <div class="vhall-room-record-container">
    <div class="vhall-room-record vhall-room-operation" :class="{recording:recording}" v-if="living">
      <i class="iconfont iconluzhi"></i> {{ statusText }}
    </div>
    <ol class="vhall-recorder-buttons">
      <li class="vhall-record-button" v-show="!recorded" @click="record">
        <i class="iconfont iconluzhi"></i>录制
      </li>
      <li
        class="vhall-resume-button"
        v-show="recorded && !paused"
        @click="pause"
      >
        <i class="iconfont iconzanting"></i>暂停
      </li>
      <li
        class="vhall-recover-button"
        v-show="paused && recorded"
        @click="reRecord"
      >
        <i class="iconfont iconluzhi"></i>恢复
      </li>
      <li class="vhall-stop-button" v-show="recorded && !paused" @click="stop(true)">
        <i class="iconfont icontingzhi"></i>停止
      </li>
    </ol>
  </div>
</template>
<script>
/**
   * 打点 录制 组件
   */
import EventBus from '@/utils/Events';
export default {
  data () {
    return {
      disabled: true,
      paused: false,
      recorded: false,
      statusText: '录制',
      living: false,
      recording: false
    };
  },
  props: ['cut_record_status'],
  created () {
    EventBus.$on('startLive', () => {
      this.living = true;
    });
    EventBus.$on('endLive', () => {
      this.living = false;
    });
  },

  mounted () {
    if (this.cut_record_status == 2) {
      this.recorded = true;
      this.paused = true;
      this.statusText = '暂停';
      this.recording = false;
    } else if (this.cut_record_status == 1) {
      this.recorded = true;
      this.statusText = '录制中';
      this.recording = true;
    }
  },
  methods: {
    pause () {
      if (!this.recorded) {
        return;
      }
      this.paused = true;
      this.statusText = '暂停';
      this.recording = false;

      this.$emit('recordFun', {
        status: 2
      });
    },

    record () {
      if (!this.recorded) {
        this.recorded = true;
        this.statusText = '录制中';
        this.recording = true;
        this.$emit('recordFun', {
          status: 1
        });
      }
    },

    stop (mark) {
      if (!this.recording) return;
      this.recorded = false;
      this.statusText = '录制';
      this.recording = false;
      this.$emit('recordFun', {
        status: 3
      });
      if (mark) {
        this.$message.success('直播结束后，打点录制的直播将自动生成回放');
      }
    },

    reRecord () {
      this.paused = false;
      this.statusText = '录制中';
      this.recording = true;
      this.$emit('recordFun', {
        status: 1
      });
    }
  }
};
</script>
<style scoped>
  .iconfont{
    display: inline-block;
    font-size: 12px;
    transform: scale(0.8);
  }
  .vhall-room-record.vhall-room-operation.recording  {
    color: #FC5659;
    border-color: #FC5659;
  }
</style>
