<template>
  <div>
    <pageTitle title="虚拟人数">
      <div slot="content">
        1.人数：当前在线人数<br />2.热度：创建至今，进入观看页面（直播和回放、点播）的浏览量
      </div>
    </pageTitle>
    <!-- 模式选择 -->
    <div class="virtual-ctx">
      <el-form :model="virtualForm" ref="virtualForm" :rules="virtualFormRules" label-width="100px" width="360px">
        <el-form-item label="人数增加：" prop="online">
          <el-input  autocomplete="off" v-model.trim="virtualForm.online" placeholder="请输入1-999999之间正整数" class="btn-relative btn-two">
            <el-button class="no-border" size="mini" slot="append">人</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="热度增加：" prop="pv">
          <el-input  autocomplete="off" v-model.trim="virtualForm.pv" placeholder="热度不小于观看人数，且不超过999999" class="btn-relative btn-two">
            <el-button class="no-border" size="mini" slot="append">次</el-button>
          </el-input>
        </el-form-item>
        <el-form-item>
          <div class="notice">
            <p>提示：</p>
            <p>1.保存成功后，观看页将在真实数据基础上立即增加设置的虚拟数据</p>
            <p>2.活动重复开播，需要重新设置虚拟人数才能生效</p>
            <p>3.控制台设置虚拟人数将会立即生效，直播间设置虚拟人数将会模拟真实场景逐渐累加数据，请按需使用</p>
          </div>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click.prevent.stop="virtualSetSave" round>保 存</el-button>
        </el-form-item>
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
      virtualForm: {
        pv: null, // pv
        online: null // 在线人数
      },
      virtualFormRules: {
        online: [
          { validator: checkOnlineNum, trigger: 'blur' }
        ],
        pv: [
          { validator: checkPv, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    // 获取虚拟人数信息状态
    getVirtualInfo() {
      this.$fetch('virtualGet', {
        webinar_id: this.$route.params.str
      }).then(res => {
        console.log(res);
        if (res && res.code === 200) {
          res.data.pv = res.data.pv === 0 ? null : res.data.pv;
          res.data.online = res.data.online === 0 ? null : res.data.online;
          this.virtualForm = res.data;
        } else {
          this.virtualForm = {
            pv: null,
            online: null
          };
        }
      }).catch(err=>{
        console.log(err);
        this.virtualForm = {
          pv: null,
          online: null
        };
      });
    },
    // 虚拟人数设置保存
    virtualSetSave() {
      this.$refs.virtualForm.validate((valid) => {
        if(valid) {
          let params = {
            webinar_id: this.$route.params.str,
            pv: this.virtualForm.pv,
            online: this.virtualForm.online
          };
          this.$fetch('virtualSetSave', params).then(res => {
            if (res && res.code === 200) {
              this.$message.success('设置成功');
              this.getVirtualInfo();
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
.virtual-ctx {
  .layout--right--main;
  .padding41-40;
  .min-height;
}
/deep/.el-input {
  width: 600px;
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
