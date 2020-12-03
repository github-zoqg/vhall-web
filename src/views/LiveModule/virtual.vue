<template>
  <div>
    <pageTitle title="虚拟人数">
      <el-switch
        class="switch"
        v-model="virtualSwitch"
        active-color="#FB3A32"
        inactive-color="#CECECE"
        :active-text="virtualSwitch ? '开启后，观看端将显示真实数据+虚拟数据' : '已开启，观看端显示真实数据+虚拟数据'"
        @change="setVirtualSwitch">
      </el-switch>
    </pageTitle>
    <!-- 模式选择 -->
    <div class="pre--full-mask">
      <div class="pre--full-cover" v-show="!virtualSwitch"></div>
      <el-form :model="virtualForm" ref="virtualForm" :rules="virtualFormRules" label-width="180px">
        <el-form-item label="生效模式：" prop="model">
          <el-radio-group v-model="virtualForm.model">
            <el-radio :label="1">立即生效</el-radio>
            <el-radio :label="2">分时生效</el-radio>
          </el-radio-group>
          <p>注：保存后在真实数据基础上立即增加设置虚拟数据，建议直播中使用</p>
        </el-form-item>
        <el-form-item label="增加观看人数至：" prop="pv">
          <el-input type="text" v-model="virtualForm.pv" placeholder="请输入1-999999之间正整数">
            <template slot="append">人</template>
          </el-input>
        </el-form-item>
        <el-form-item label="增加热度至：" prop="online_num">
          <el-input type="text" v-model="virtualForm.online_num" placeholder="热度不小于观看人数，且不超过999999">
            <template slot="append">人</template>
          </el-input>
        </el-form-item>
        <el-form-item label="执行时间：" prop="time" v-if="this.virtualForm.model === '2'">
          <el-input type="text" v-model="virtualForm.time" placeholder="限制设置1-120分钟">
            <template slot="append">分</template>
          </el-input>
        </el-form-item>
        <div class="save-margin-top40">
          <el-button type="primary" @click.prevent.stop="virtualSetSave">保 存</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
export default {
  name: "virtual.vue",
  components: {
    PageTitle
  },
  data() {
    let checkPv = (rule, value, callback) => {
      let pvCount = value > 0 ? Math.floor(Number(value) * 0.8) : 0;
      if (!/^([1-9][0-9]{0,5})$/.test(value)) {
        return callback(new Error('请输入1~999,999之间的正整数'));
      } else if (!/^([1-9][0-9]{0,5})$/.test(value)) {
        return callback(new Error('请输入1~999,999之间的正整数'));
      } else if (this.virtualForm.online_num > 0 && pvCount < Number(this.virtualForm.online_num)) {
        return callback(new Error('热度不能大于观看人数的80%'));
      } else {
        if (this.virtualForm.online_num !== '') {
          this.$refs.virtualForm.clearValidate('online_num');
        }
        callback();
      }
    };
    let checkOnlineNum = (rule, value, callback) => {
      let pvCount = value > 0 ? Math.floor(Number(this.virtualForm.pv) * 0.8) : 0;
      if (!/^([1-9][0-9]{0,5})$/.test(value)) {
        return callback(new Error('请输入1~999,999之间的正整数'));
      } else if (!/^([1-9][0-9]{0,5})$/.test(value)) {
        return callback(new Error('请输入1~999,999之间的正整数'));
      } else if (this.virtualForm.pv > 0 && pvCount < Number(value)) {
        return callback(new Error('热度不能大于观看人数的80%'));
      } else {
        if (this.virtualForm.pv !== '') {
          this.$refs.virtualForm.clearValidate('pv');
        }
        callback();
      }
    };
    let checkTime = (rule, value, callback) => {
      if(this.virtualForm.model === '2') {
        if (isNaN(value) || value < 1 || value > 120) {
          return callback(new Error('请输入1-120之间的正整数'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      virtualSwitch: false,
      virtualForm: {
        model: "1",
        pv: null,
        online_num: null,
        time: null
      },
      virtualFormRules: {
        pv: [
          { validator: checkPv, trigger: 'blur' }
        ],
        online_num: [
          { validator: checkOnlineNum, trigger: 'blur' }
        ],
        time: [
          { validator: checkTime, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 获取虚拟人数信息状态
    getVirtualInfo() {
      this.$fetch('virtualGet', this.virtualForm).then(res => {
        console.log(res);
        if (res && res.code === 200) {
          this.virtualForm = res.data;
        } else {
          this.virtualForm = {
            model: "1",
            pv: null,
            online_num: null,
            time: null
          };
        }
      }).catch(err=>{
        console.log(err);
        this.virtualForm = {
          model: "1",
          pv: null,
          online_num: null,
          time: null
        };
      });
    },
    // 虚拟人数开关
    setVirtualSwitch() {
      this.virtualSwitch = !this.virtualSwitch;
      this.$fetch('virtualSetSave', {
        virtualSwitch: !this.virtualSwitch
      }).then(res => {
        console.log(res);
        if (res && res.code === 200) {
          this.$message.success(!this.virtualSwitch ? '开启成功' : '关闭成功');
        } else {
          this.$message.error(res.msg || !this.virtualSwitch ? '开启失败' : '关闭失败');
        }
      }).catch(err=>{
        console.log(err);
        this.$message.error(!this.virtualSwitch ? '开启失败' : '关闭失败');
      });
    },
    // 虚拟人数设置保存
    virtualSetSave() {
      this.$refs.virtualForm.validate((valid) => {
        if(valid) {
          this.$fetch('virtualSetSave', this.virtualForm).then(res => {
            console.log(res);
            if (res && res.code === 200) {
              this.$message.success('设置成功');
              this.initPage();
            } else {
              this.$message.error(res.msg || '设置失败');
            }
          }).catch(err=>{
            console.log(err);
            this.$message.error('设置失败');
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
.switch {
  margin-left: 8px;
}
.save-btn {
  text-align: center;
}
</style>
