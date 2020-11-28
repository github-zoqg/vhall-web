<template>
  <div class="countdown" functional>
    <svg
      width="140px"
      height="140px"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="greenGradient" x1="0" y1="100%" x2="100%" y2="0">
          <stop offset="0%" stop-color="#FC5659" />
          <stop offset="50%" stop-color="#FC5659" />
          <stop offset="100%" stop-color="#FFA32B" />
        </linearGradient>
      </defs>
      <circle
        class="progress"
        cx="50%"
        cy="50%"
        r="47"
        fill="transparent"
        stroke="url(#greenGradient)"
        stroke-dasharray="1"
        stroke-dashoffset="1"
      ></circle>
      <circle
        class="progress progress-bar"
        cx="50%"
        cy="50%"
        r="47"
        fill="transparent"
        stroke="#F5F5F5"
        :stroke-dasharray="perimeter"
        :stroke-dashoffset="progress"
        stroke-linecap="square"
      ></circle>
    </svg>

    <div class="countdown-core">
      <div>{{ remainder }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'countDown',
  props: {
    duration: {
      type: [Number, String],
      default: 30
    },
    consume: {
      type: [Number, String],
      default: 10
    },
    radius: {
      type: [Number],
      default: 94
    }
  },
  computed: {
    percent() {
      let ret = this.consume / this.duration;
      return ret > 1 ? 1 : ret;
    },
    progress() {
      return Math.PI * 94 * this.percent;
    },
    remainder() {
      let ret = this.consume,
        m,
        s;
      ret = ret > 0 ? ret : 0;
      m = parseInt(ret / 60);
      s = ret % 60;
      m = m > 9 ? m : `0${m}`;
      s = s > 9 ? s : `0${s}`;
      return `${m}:${s}`;
    },
    perimeter() {
      return Math.PI * this.radius;
    }
  }
};
</script>

<style lang="less" scoped>
.countdown {
  position: relative;
  width: 140px;
  height: 140px;
  &-core {
    width: 110px;
    height: 110px;
    border-radius: 50%;
    background-color: #fff2f0;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 30px;
    color: #fc5659;
    font-weight: bold;
  }
  > svg {
    transform: rotate(-90deg);
  }
}
.progress {
  stroke-width: 4px;
}
.progress-bar {
  transform: rotate(-90deg);
  transform: rotateX(180deg);
  transform-origin: 50%;
  stroke-width: 5px;
}
</style>
