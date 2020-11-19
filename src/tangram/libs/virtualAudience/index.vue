<template>
  <div class="v-virtual-box">
    <div class="v-current-info">
      <p class="v-info">
        当前数据
      </p>
      <p class="v-data">
        实际：{{ preson.onlineNum }}人在线<span class="v-line"></span
        >{{ preson.pv }}次观看
      </p>
    </div>
    <div class="v-cumulativenumber">
      <p class="v-numbers">
        {{ addOnlineNum }}人在线<span class="v-line"></span>{{ addPv }}次观看
      </p>
      <p class="current-count" v-if="addCount == 0">
        暂未添加虚拟观众
      </p>
      <p class="current-count" v-else>已累计添加{{ addCount }}次虚拟观众</p>
    </div>
    <div class="v-form">
      <div class="v-item">
        执行时间：<el-select
          v-model="input.time"
          placeholder="请选择"
          :disabled="!addStatus"
        >
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option> </el-select
        >分钟
      </div>
      <div class="v-item">
        在线人数：<el-input
          v-model="input.onlineNum"
          placeholder="请输入内容"
          :disabled="!addStatus"
        ></el-input
        >人
        <p class="v-error" v-if="error.onlineNum">{{ error.onlineNum }}</p>
      </div>
      <div class="v-item">
        观看次数：<el-input
          v-model="input.pv"
          placeholder="请输入内容"
          :disabled="!addStatus"
        ></el-input
        >次
        <p class="v-error" v-if="error.pv">{{ error.pv }}</p>
      </div>
    </div>
    <button class="v-add" @click="addNumFun" v-if="addStatus">开始添加</button>
    <button class="v-add" @click="stopAddNumFun" v-else>
      <span class="v-adding">
        正在添加
      </span>
      <span class="v-stopadd">
        结束添加
      </span>
    </button>
  </div>
</template>
<script>
import CountTo from '../../utils/countTo';
import EventBus from '@/utils/Events';
export default {
  name: 'virtualAudience',
  props: {
    ilId: {
      required: false
    },
    params_verify_token: {
      required: false
    }
  },
  data () {
    return {
      options: [
        {
          value: 5,
          label: '5'
        },
        {
          value: 10,
          label: '10'
        },
        {
          value: 15,
          label: '15'
        },
        {
          value: 30,
          label: '30'
        }
      ],
      addCount: 0,
      QRCodeVisible: false,
      input: {
        time: 5,
        onlineNum: 80,
        pv: 100
      },
      addNum: {
        onlineNum: 0,
        pv: 0
      },
      preson: {
        pv: 0,
        basePv: 0,
        onlineNum: 0,
        baseOnlineNum: 0,
        baseTime: 0
      },
      error: {
        onlineNum: false,
        pv: false
      },
      status: {
        onlineNum: true,
        pv: true
      },
      onlineNumCountTo: new CountTo(),
      pvCountTo: new CountTo()
    };
  },
  watch: {
    'input.onlineNum' (newVal, oldVal) {
      let re = /^\d+$/;
      newVal = Number(newVal);
      const targetOnlineCount = Math.floor(this.input.pv * 0.8);
      if (!re.test(newVal) || newVal <= 0) {
        this.error.onlineNum = `请输入正整数`;
      } else if (newVal > targetOnlineCount) {
        this.error.onlineNum = '';
        this.error.pv = `在线人数不能大于观看次数的80%`;
      } else {
        this.error.onlineNum = '';
        if (
          re.test(this.input.pv) &&
          this.input.pv <= 1500 &&
          this.input.pv > 0
        ) {
          this.error.pv = '';
        }
      }
    },
    'input.pv' (newVal, oldVal) {
      let re = /^\d+$/;
      newVal = Number(newVal);
      const targetOnlineCount = Math.floor(newVal * 0.8);
      if (!re.test(newVal) || newVal > 1500 || newVal <= 0) {
        this.error.pv = '请输入1~1500之间的正整数';
      } else if (targetOnlineCount < this.input.onlineNum) {
        this.error.pv = `在线人数不能大于观看次数的80%`;
      } else {
        this.error.pv = '';
      }
    },
    addStatus (newVal) {
      if (newVal) {
        this.input.time = 5;
        this.input.onlineNum = 80;
        this.input.pv = 100;
      }
    }
  },
  computed: {
    addOnlineNum () {
      return Number(this.preson.onlineNum + this.preson.baseOnlineNum);
    },
    addPv () {
      return Number(this.preson.pv + this.preson.basePv);
    },
    addStatus () {
      console.log(this.status.pv && this.status.onlineNum);
      return this.status.pv && this.status.onlineNum;
    }
  },
  methods: {
    addNumFun () {
      if (!this.error.onlineNum && !this.error.pv) {
        this.status.onlineNum = false;
        this.status.pv = false;
        this.$vhallFetch('startBaseNum', {
          params_verify_token: this.params_verify_token,
          webinar_id: this.ilId
        }).then(res => {
          this.addCount++;
        });
        this.onlineNumCountTo.start(
          0,
          this.input.pv,
          Number(this.input.time) * 60,
          0.2,
          (count, lastStep, step) => {
            // pv修改
            this.$vhallFetch(
              'updateBaseNum',
              {
                params_verify_token: this.params_verify_token,
                webinar_id: this.ilId,
                update_pv: count,
                update_online_num: 0
              },
              {},
              false
            )
              .then(res => {
                if (lastStep) {
                  this.status.pv = true;
                }
                this.preson.basePv = Number(this.preson.basePv) + Number(count);
                // console.log('pv success' + count)
              })
              .catch(() => {
                this.status.pv = true;
                this.onlineNumCountTo.stop();
              });
          }
        );
        this.pvCountTo.start(
          0,
          this.input.onlineNum,
          Number(this.input.time) * 60,
          0.2,
          (count, lastStep, step) => {
            // onlineNum修改
            this.$vhallFetch(
              'updateBaseNum',
              {
                params_verify_token: this.params_verify_token,
                webinar_id: this.ilId,
                update_online_num: count,
                update_pv: 0
              },
              {},
              false
            )
              .then(res => {
                if (lastStep) {
                  this.status.onlineNum = true;
                }
                this.preson.baseOnlineNum =
                  Number(this.preson.baseOnlineNum) + Number(count);
                // console.log('onlineNum success' + count)
              })
              .catch(() => {
                this.status.pv = true;
                this.pvCountTo.stop();
              });
          }
        );
      }
    },
    stopAddNumFun () {
      this.onlineNumCountTo.stop();
      this.pvCountTo.stop();
      this.status.pv = true;
      this.status.onlineNum = true;
    },
    getBaseNum () {
      this.$vhallFetch('getBaseNum', {
        params_verify_token: this.params_verify_token,
        webinar_id: this.ilId
      }).then(res => {
        this.preson.pv = res.data.pv;
        this.preson.basePv = res.data.base_pv;
        this.preson.onlineNum = res.data.online_num;
        this.preson.baseOnlineNum = res.data.base_online_num;
        this.preson.baseTime = res.data.base_time;
        this.addCount = res.data.base_time;
      });
    }
  },
  mounted () {
    EventBus.$on('openVirtualAudience', () => {
      this.getBaseNum();
    });

    // 上线
    EventBus.$on('onlineJoin', msg => {
      this.preson.onlineNum = msg.uv;
      if (msg.context.pv > this.preson.pv) {
        this.preson.pv = msg.context.pv;
      }
    });

    // 下线
    EventBus.$on('onlineLeave', msg => {
      this.preson.onlineNum = msg.uv;
    });
  }
};
</script>
<style lang="less">
.v-virtual-box {
  height: 370px;
  background-color: #fff;
  padding: 20px 30px;
  .v-current-info {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #333;
    .v-info {
      display: flex;
      justify-content: flex-start;
    }
    .v-data {
      display: flex;
      justify-content: flex-end;
      .v-line {
        display: inline-block;
        width: 1px;
        height: 11px;
        background-color: #b9b9b9;
        margin: 3px 5px 0 5px;
      }
    }
  }
  .v-cumulativenumber {
    width: 100%;
    height: 92px;
    padding-top: 18px;
    color: #333;
    background-color: #f3f3f3;
    text-align: center;
    margin-top: 10px;
    .v-numbers {
      font-size: 20px;
      font-weight: bold;
      .v-line {
        display: inline-block;
        width: 1px;
        height: 17px;
        background-color: #b9b9b9;
        margin: 0px 10px;
        position: relative;
        top: 2px;
      }
    }
    .current-count {
      margin-top: 9px;
      font-size: 16px;
    }
  }
  .v-form {
    width: 100%;
    font-size: 12px;
    .v-item {
      position: relative;
      .el-input {
        width: 340px;
        height: 28px;
        margin: 20px 10px 0 0;
        input {
          height: 100% !important;
          border-radius: 2px;
        }
        .el-input__icon {
          line-height: 19px;
        }
        &.is-disabled {
          .el-input__inner {
            border-color: #d2d2d2;
            background-color: #f2f2f2;
            color: #999999;
          }
        }
      }
      .v-error {
        color: #fc5b5e;
        position: absolute;
        bottom: -16px;
        left: 60px;
      }
    }
  }
  .v-add {
    display: block;
    background-color: #fff;
    border: 1px solid #fc5659;
    color: #fc5659;
    font-size: 12px;
    width: 80px;
    height: 30px;
    box-sizing: border-box;
    border-radius: 2px;
    padding: 0;
    line-height: 28px;
    margin: 36px auto 0;
    display: block;
    cursor: pointer;
    .v-adding {
      display: inline-block;
    }
    .v-stopadd {
      display: none;
    }
    &:hover {
      background-color: #fc5659;
      color: #fff;
      .v-adding {
        display: none;
      }
      .v-stopadd {
        display: inline-block;
      }
    }
  }
}
</style>
