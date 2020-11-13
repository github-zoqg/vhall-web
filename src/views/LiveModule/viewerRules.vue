<template>
  <div>
    <pageTitle title="观看限制">
      <div slot="content">
        可联系客服开通“单点观看”功能，即开启付费/邀请码/白名单后，一个账号仅允许同时一台设备观看直播。
        <!--可联系客服开通“单点观看”功能，即开启付费后，一个账号仅允许同时一台设备观看直播。-->
      </div>
    </pageTitle>
    <!-- 内容区域 -->
    <el-tabs v-model="form.verify" type="card" @tab-click="handleClick">
      <el-tab-pane label="免费" name="0">
        <p>观看无需任何验证，即可观看直播</p>
      </el-tab-pane>
      <el-tab-pane label="付费" name="3">
        <!-- 付费表单-->
        <el-form :model="payForm" ref="payForm" :rules="payFormRules"  label-width="100px">
          <el-form-item label="付费金额" prop="fee">
            <el-input v-model.number="payForm.fee" autocomplete="off" placeholder="0.01-99999.99"></el-input>
          </el-form-item>
          <el-form-item label="试看">
            <div class="switch__box">
              <el-switch
                v-model="form.is_preview"
                active-color="#FB3A32"
                inactive-color="#CECECE">
              </el-switch>
              <span class="leve3_title title--999">开启后，观众可以对回放进行试看</span>
            </div>
          </el-form-item>
          <el-form-item label="试看时长" v-show="form.is_preview">
            <el-select v-model="form.preview_time" placeholder="请选择">
              <el-option
                v-for="item in timeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="邀请码（原F码）" name="4">
        <!-- 邀请码（原F码）-->
        <el-form :model="fCodeForm" ref="fCodeForm" :rules="fCodeFormRules"  label-width="100px">
          <el-form-item label="生成邀请码" prop="nums">
            <div class="fCode__flex">
              <el-input v-model.number="fCodeForm.nums" autocomplete="off" placeholder="1-1000"></el-input><i class='unit'>个</i>
              <el-button @click.prevent.stop="fCodeExecute('fCodeForm')">生成</el-button>
              <span>（已生成{{viewerDao && viewerDao.nums ? viewerDao.nums : 0}}个）</span>
              <el-button>下载邀请码</el-button>
            </div>
          </el-form-item>
          <el-form-item label="试看">
            <div class="switch__box">
              <el-switch
                v-model="form.is_preview"
                active-color="#FB3A32"
                inactive-color="#CECECE">
              </el-switch>
              <span class="leve3_title title--999">开启后，观众可以对回放进行试看</span>
            </div>
          </el-form-item>
          <el-form-item label="试看时长" v-show="form.is_preview">
            <el-select v-model="form.preview_time" placeholder="请选择">
              <el-option
                v-for="item in timeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="付费/邀请码" name="6">
        <!-- 付费/邀请码 -->
        <el-form :model="fCodePayForm" ref="fCodePayForm" :rules="fCodePayFormRules"  label-width="100px">
          <el-form-item label="付费金额" prop="fee">
            <el-input v-model.number="fCodePayForm.fee" autocomplete="off" placeholder="0.01-99999.99"></el-input>
          </el-form-item>
          <el-form-item label="生成邀请码" prop="nums">
            <div class="fCode__flex">
              <el-input v-model.number="fCodePayForm.nums" autocomplete="off" placeholder="1-1000"></el-input><i class='unit'>个</i>
              <el-button @click.prevent.stop="fCodeExecute('fCodePayForm')">生成</el-button>
              <span>（已生成{{viewerDao && viewerDao.nums ? viewerDao.nums : 0}}个）</span>
              <el-button>下载邀请码</el-button>
            </div>
          </el-form-item>
          <el-form-item label="试看">
            <div class="switch__box">
              <el-switch
                v-model="form.is_preview"
                active-color="#FB3A32"
                inactive-color="#CECECE">
              </el-switch>
              <span class="leve3_title title--999">开启后，观众可以对回放进行试看</span>
            </div>
          </el-form-item>
          <el-form-item label="试看时长" v-show="form.is_preview">
            <el-select v-model="form.preview_time" placeholder="请选择">
              <el-option
                v-for="item in timeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="密码" name="1">
        <!-- 密码-->
        <el-form :model="pwdForm" ref="pwdForm" :rules="pwdFormRules"  label-width="100px">
          <el-form-item label="观看密码" prop="password">
            <el-input v-model.number="pwdForm.password" autocomplete="off" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="试看">
            <div class="switch__box">
              <el-switch
                v-model="form.is_preview"
                active-color="#FB3A32"
                inactive-color="#CECECE">
              </el-switch>
              <span class="leve3_title title--999">开启后，观众可以对回放进行试看</span>
            </div>
          </el-form-item>
          <el-form-item label="试看时长" v-show="form.is_preview">
            <el-select v-model="form.preview_time" placeholder="请选择">
              <el-option
                v-for="item in timeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="白名单" name="2">
        <ul class="tab__white tab__white__group">
          <li class="tab__label--show">
            <label>选择观众组</label>
          </li>
          <li :class="['tab__btn--solid', {'active': whiteIds.includes(item.id)}]"  v-for="(item, ins) in groupList" :key="`group${ins}`" @click.prevent.stop="selectGroup(item)">
            <span>{{item.subject}}</span>
          </li>
          <li class="tab__btn--dashed">
            <router-link target="_blank" :to="{path:'/material-viewer'}"><i class="el-icon-plus"></i>添加观众分组</router-link>
          </li>
        </ul>
        <div class="switch__box">
          <label class="leve3_title label__r12">试看</label>
          <el-switch
            v-model="form.is_preview"
            active-color="#FB3A32"
            inactive-color="#CECECE">
          </el-switch>
          <span class="leve3_title title--999">开启后，观众可以对回放进行试看</span>
        </div>
        <ul class="tab__white tab__white__time">
          <li class="tab__label--show">
            <label>试看时长</label>
          </li>
          <li class="tab__select">
            <el-select v-model="form.preview_time" placeholder="请选择">
              <el-option
                v-for="item in timeOption"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </li>
        </ul>
      </el-tab-pane>
    </el-tabs>
    <el-row>
      <el-button @click.prevent.stop="viewerSetSave">保 存</el-button>
    </el-row>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import env from "@/api/env";
export default {
  name: 'viewerRules.vue',
  components: {
    PageTitle
  },
  data() {
    let checkNums = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('生成数量不能为空'));
      } else if (value > 1000 || value < 1) {
        return callback(new Error('生成数量1~1000'));
      } else {
        callback();
      }
    };
    return {
      timeOption: [
        {
          label: '5分钟',
          value: 5
        },
        {
          label: '10分钟',
          value: 10
        },
        {
          label: '15分钟',
          value: 15
        },
        {
          label: '20分钟',
          value: 20
        }
      ],
      viewerDao: {},
      form: {
        webinar_id: this.$route.params.str,
        verify: 0,
        password: '', // 观看密码
        white_id: '', // 白名单-观众组字符拼接串
        fee: null, // 付费金额,
        is_preview: 5, // 是否开启试看（1-试看；0-否；）
        preview_time: null, // 试看时长-分钟计
      },
      whiteIds: [],
      groupList: [],
      payForm: {
        fee: ''
      },
      payFormRules: {
        fee: [
          { required: true, message: '请按正确格式填写，如10.00', trigger: 'blur' },
          { pattern: !/^\d{0,6}\.{0,1}(\d{1,2})?$/, message: '请按正确格式填写，如10.00' , trigger: 'blur'}
        ]
      },
      fCodeForm: {
        nums: ''
      },
      fCodeFormRules: {
        nums: [
          { required: true, message: '1~1000', trigger: 'blur' },
          { validator: checkNums, trigger: 'blur' }
        ]
      },
      fCodePayForm: {
        nums: '',
        fee: null
      },
      fCodePayFormRules: {
        nums: [
          { validator: checkNums, trigger: 'blur' }
        ],
        fee: [
          { required: true, message: '请按正确格式填写，如10.00', trigger: 'blur' },
          { pattern: /^\d{0,6}\.{0,1}(\d{1,2})?$/, message: '请按正确格式填写，如10.00' , trigger: 'blur'}
        ]
      },
      pwdForm: {
        password: null
      },
      pwdFormRules: {
        password: [
          { required: true, message: '密码只能由1-12位数字或字母组成', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z]{1,12}$/, message: '密码只能由1-12位数字或字母组成' , trigger: 'blur'},
        ]
      }
    };
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
      // 每次选项卡切换，之前选择项清空。
      this.form.password = '';
      this.form.white_id = '';
      this.form.fee = null;
      this.form.is_preview = 0;
      this.form.preview_time = 5;
    },
    // 获取已经设置过的观看限制信息
    viewerSetGet() {
      this.$fetch('viewerSetGet', {
        webinar_id: this.$route.params.str
      }).then(res => {
        res && res.code === 200 && res.data ? this.viewerDao = res.data.data : this.viewerDao = {};
        // 数据初始化渲染（verify字段控制类别=> 0 无验证，1 密码，2 白名单，3 付费活动, 4 F码 ,6 付费+F码）
        this.form.verify = this.viewerDao.verify;
      }).catch(err=>{
        console.log(err);
        this.viewerDao = {};
      });
    },
    // 观看限制保存
    viewerSetSave() {
      let formList = ['', 'pwdForm', 'whiteForm', 'payForm', 'fCodeForm', '', 'fCodePayForm'];
      let formName = formList[this.form.verify];
      let flag = false;
      let params = {};
      if (this.$refs[formName]) {
        this.$refs[formName].validate((valid) => {
          if(valid) {
            flag = true;
            params = Object.assign(this.form, this[formName]);
          }
        });
      } else if(formName === 'whiteForm') {
        flag = this.whiteIds.length > 0;
        if (!flag) {
          this.$message.error('请选择观众组');
          return;
        }
        params = Object.assign(this.form, {white_id: this.whiteIds.join(',')});
      }
      if (flag) {
        console.log('当前保存参数存储：' + JSON.stringify(params));
        this.$fetch('viewerSetSave', params).then(res => {
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
    },
    // 获取观众分组列表
    audienceGet() {
      let params = {
        user_id: 1333,
        pos: 0,
        limit: 1000, // TODO 默认分组查询1000条
      };
      this.$fetch('audienceGet', params).then(res => {
        res && res.code === 200 && res.data && res.data.list ? this.groupList = res.data.list : this.groupList = [];
      }).catch(e => {
        console.log(e);
        this.groupList = [];
      });
    },
    selectGroup(item) {
      console.log(item);
      if(!this.whiteIds.includes(item.id)) {
        this.whiteIds.push(item.id);
      } else {
        if(this.whiteIds.includes(item.id)) {
          this.whiteIds.splice(this.whiteIds.indexOf(item.id), 1);
        }
      }
      console.log('当前已经选中分组集合'+this.whiteIds.join('.'));
    },
    // 验证码生成
    fCodeExecute(formName) {
      let flag = true;
      this.$refs[formName].validateField('nums', (valid) => {
        if(valid) {
          flag = false;
        }
      });
      if(flag) {
        this.$fetch('audienceGet', {
          webinar_id: this.$route.params.str,
          nums: this[formName].nums
        }).then(res => {
          if(res && res.code === 200) {
            this.$message.success('生成成功');
            this.viewerSetGet();
          } else {
            this.$message.error(res.msg || '生成失败');
          }
        }).catch(e => {
          console.log(e);
          this.$message.error('生成失败');
        });
      }
    },
    initPage() {
      this.viewerSetGet();
      this.audienceGet();
    }
  },
  created() {
    this.initPage();
    this.downloadUrl = `${env.downBaseUrl}/export/fcode/${this.$route.params.str}`;
  }
};
</script>

<style lang="less" scoped>
.fCode__flex {
  display: flex;
  justify-content: flex-start;
}
.tab__white {
  display: flex;
  justify-content: flex-start;
  li {
    list-style-type: none;
    text-align: center;
    padding: 5px 5px;
    margin-right: 24px;
  }
}
.tab__btn--solid {
  border: 1px solid #d2d2d2;
  &.active{
    border: 1px solid red;
  }
}
.tab__btn--dashed {
  border: 1px dashed #d2d2d2;
}
</style>
