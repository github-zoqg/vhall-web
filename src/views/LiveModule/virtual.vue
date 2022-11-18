<template>
  <div>
    <pageTitle pageTitle="虚拟人数">
      <div slot="content">
        1.人数：当前在线人数
        <br />
        2.热度：创建至今，进入观看页面（直播和回放、点播）的浏览量
      </div>
    </pageTitle>
    <!-- 模式选择 -->
    <div class="virtual-ctx">
      <el-form
        :model="virtualForm"
        ref="virtualForm"
        :rules="virtualFormRules"
        label-width="100px"
        width="360px"
      >
        <el-form-item label="人数增加" prop="online">
          <VhallInput
            autocomplete="off"
            v-model.trim="virtualForm.online"
            placeholder="请输入1-999999之间正整数"
            class="btn-relative btn-two"
            @input="formatInputs($event, 'virtualForm', 'online')"
          >
            <el-button type="text" class="no-border" size="mini" slot="append">人</el-button>
          </VhallInput>
        </el-form-item>
        <el-form-item label="热度增加" prop="pv">
          <VhallInput
            autocomplete="off"
            v-model.trim="virtualForm.pv"
            placeholder="热度不小于观看人数，且不超过999999"
            class="btn-relative btn-two"
            @input="formatInputs($event, 'virtualForm', 'pv')"
          >
            <el-button type="text" class="no-border" size="mini" slot="append">次</el-button>
          </VhallInput>
        </el-form-item>
        <el-form-item>
          <div class="notice">
            <p>提示：</p>
            <p>1.控制台保存成功后，观看页将在真实数据基础上立即生效设置的虚拟人数</p>
            <p>2.直播间设置虚拟人数，将会模拟真实场景逐渐累加数据，请按需使用</p>
            <p>3.活动重复开播，需要重新设置虚拟人数才能生效</p>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" class="length152" @click.prevent.stop="virtualSetSave" round>
            保 存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <begin-play
      :webinarId="$route.params.str"
      v-if="$route.query.type != 5 && webinarState != 4"
    ></begin-play>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import beginPlay from '@/components/beginBtn';
  import { sessionOrLocal } from '@/utils/utils';
  export default {
    name: 'virtual.vue',
    components: {
      PageTitle,
      beginPlay
    },
    data() {
      // 校验人数
      let checkOnlineNum = (rule, value, callback) => {
        // 在线人数不能超过热度的80%
        let pvCount = value > 0 ? Math.floor(Number(this.virtualForm.pv) * 0.8) : 0;
        if (!/^([1-9][0-9]{0,5})$/.test(value)) {
          return callback(new Error('请输入1~999,999之间的正整数'));
        } else if (!/^([1-9][0-9]{0,5})$/.test(value)) {
          return callback(new Error('请输入1~999,999之间的正整数'));
        } else if (this.virtualForm.pv > 0 && pvCount < Number(value)) {
          return callback(new Error('在线人数不能超过热度的80%'));
        } else {
          if (this.virtualForm.pv !== '') {
            this.$refs.virtualForm.clearValidate('pv');
          }
          callback();
        }
      };
      // 校验热度
      let checkPv = (rule, value, callback) => {
        // 在线人数不能超过热度的80%
        let pvCount = value > 0 ? Math.floor(Number(value) * 0.8) : 0;
        if (!/^([1-9][0-9]{0,5})$/.test(value)) {
          return callback(new Error('请输入1~999,999之间的正整数'));
        } else if (!/^([1-9][0-9]{0,5})$/.test(value)) {
          return callback(new Error('请输入1~999,999之间的正整数'));
        } else if (this.virtualForm.online > 0 && pvCount < Number(this.virtualForm.online)) {
          return callback(new Error('在线人数不能超过热度的80%'));
        } else {
          if (this.virtualForm.online !== '') {
            this.$refs.virtualForm.clearValidate('online_num');
          }
          callback();
        }
      };
      return {
        webinarState: JSON.parse(sessionOrLocal.get('webinarState')),
        virtualForm: {
          pv: null, // pv
          online: null // 在线人数
        },
        virtualFormRules: {
          online: [{ validator: checkOnlineNum, trigger: 'blur' }],
          pv: [{ validator: checkPv, trigger: 'blur' }]
        }
      };
    },
    watch: {
      $route: {
        handler: function (route) {
          let levelList = [
            {
              title: '直播管理',
              path: '/live/list',
              isClick: false
            },
            {
              title: '直播列表',
              path: '/live/list',
              isClick: true
            },
            {
              title: '直播列表',
              path: `/live/detail/${this.$params.str}`,
              isClick: true
            },
            {
              title: '观看限制',
              path: `/live/viewerRules/${this.$params.str}`,
              isClick: false
            }
          ];
          this.$EventBus.$emit('saas_vs_crumb_event', this.levelList);
        },
        immediate: true
      }
    },
    methods: {
      formatInputs(value, formName, key) {
        if (!/^([1-9][0-9]{0,5})$/.test(value)) {
          if (!value.match(/^([1-9][0-9]{0,5})$/g)) {
            this[formName][key] = '';
          } else {
            this[formName][key] = parseInt(value);
          }
        }
      },
      // 获取虚拟人数信息状态
      getVirtualInfo() {
        this.$fetch('virtualGet', {
          webinar_id: this.$route.params.str
        })
          .then(res => {
            console.log(res);
            if (res.data) {
              res.data.pv = res.data.pv === 0 ? null : res.data.pv;
              res.data.online = res.data.online === 0 ? null : res.data.online;
              this.virtualForm = res.data;
            } else {
              this.virtualForm = {
                pv: null,
                online: null
              };
            }
          })
          .catch(err => {
            console.log(err);
            this.virtualForm = {
              pv: null,
              online: null
            };
          });
      },
      // 虚拟人数设置保存
      virtualSetSave() {
        let userId = JSON.parse(sessionOrLocal.get('userId'));
        this.$refs.virtualForm.validate(valid => {
          if (valid) {
            let params = {
              webinar_id: this.$route.params.str,
              pv: this.virtualForm.pv,
              online: this.virtualForm.online
            };
            this.$fetch('virtualSetSave', params)
              .then(res => {
                this.$vhall_paas_port({
                  k: 100136,
                  data: {
                    business_uid: userId,
                    user_id: '',
                    webinar_id: this.$route.params.str,
                    refer: '',
                    s: '',
                    report_extra: {},
                    ref_url: '',
                    req_url: ''
                  }
                });
                this.$message({
                  message: `设置成功`,
                  showClose: true,
                  // duration: 0,
                  type: 'success',
                  customClass: 'zdy-info-box'
                });
                this.getVirtualInfo();
              })
              .catch(res => {
                console.log(res);
                this.$message({
                  message: res.msg || `设置失败`,
                  showClose: true,
                  // duration: 0,
                  type: 'error',
                  customClass: 'zdy-info-box'
                });
              });
          }
        });
      }
    },
    created() {
      this.getVirtualInfo();
    }
  };
</script>

<style lang="less" scoped>
  .virtual-ctx {
    .layout--right--main;
    .padding41-40;
    .min-height;
    .btn-relative {
      position: relative;
    }
    /deep/.el-input__inner {
      border-radius: 4px;
      padding: 0 12px;
    }
    /deep/.el-input-group__append {
      background: transparent;
      position: absolute;
      text-align: center;
      right: 0;
      top: -2px;
      height: 38px;
      line-height: 40px;
      border: 0;
      border-radius: 4px;
      .el-button {
        span {
          font-size: 14px;
          font-weight: 400;
          color: #666666;
        }
      }
    }
  }
  /deep/.el-input {
    width: 400px;
  }
  .notice {
    p {
      font-size: 12px;
      color: #999999;
      margin: 0 0;
      line-height: 20px;
    }
  }
</style>
