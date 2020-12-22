<template>
  <div>
    <pageTitle title="用量分配"></pageTitle>
    <div class="ac__allocation__panel">
      <!-- 左侧 -->
      <div class="ac__allocation__panel--left">
        <el-tabs v-model="tabType" @tab-click="handleClick">
          <el-tab-pane :label="item.label" :name="item.value" v-for="(item, ins) in tabList" :key="ins"></el-tab-pane>
        </el-tabs>
        <el-button round @click.prevent.stop="multiSetHandle()" :class="['panel-btn length104', {'btn-right': resourcesVo && resourcesVo.extend_day}]"
                   size="medium"
                   v-if="!(is_dynamic > 0) && dataList.length > 0">{{resourcesVo && Number(resourcesVo.type) === 1 ? '批量分配' : '分配并发包'}}</el-button>
        <el-button round @click.prevent.stop="multiSetHandle('more')" class="panel-btn length104" size="medium"
                   v-if="!(is_dynamic > 0) && dataList.length > 0 && resourcesVo && resourcesVo.extend_day">分配扩展包</el-button>

        <!-- 固定分配，有查询列表。 -->
        <div v-if="tabType === 'regular'" :class="['regular-ctx', {'regular-list': !(is_dynamic > 0)}]">
          <p v-if="is_dynamic > 0">每个子账号可单独分配用量，所有用量之和不能大于可分配用量</p>
          <el-button type="primary" class="length152" round v-preventReClick @click="allocationSave('regular')" v-if="is_dynamic > 0">保存</el-button>
          <!-- 当前数据库中已经是固定分配 -->
          <el-table
            ref="multipleTable"
            :data="dataList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            v-if="!(is_dynamic > 0) && dataList.length > 0">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="帐号昵称"
              width="120">
              <template slot-scope="scope">{{ scope.row.nick_name }}</template>
            </el-table-column>
            <el-table-column
              prop="phone"
              label="手机号">
            </el-table-column>
            <el-table-column
              label="预设流量" v-if="resourcesVo && (resourcesVo.type > 0)">
              <template slot-scope="scope">
                <el-input type="text" v-model.trim="scope.row.inputCount" v-if="scope.row.isHide" class="btn-relative">
                  <template slot="append">GB</template>
                </el-input>
                <span v-else>{{scope.row.count}} GB</span>
              </template>
            </el-table-column>
            <el-table-column
              label="分配并发" v-if="resourcesVo && !(resourcesVo.type > 0)">
              <template slot-scope="scope">
                <el-input type="text" v-model.trim="scope.row.inputCount" v-if="scope.row.isHide" class="btn-relative">
                  <template slot="append"> 方</template>
                </el-input>
                <span v-else>{{scope.row.count}} 方</span>
              </template>
            </el-table-column>
            <el-table-column
              label="分配扩展包" v-if="resourcesVo && resourcesVo.extend_day">
              <template slot-scope="scope">
                <el-input type="text" v-model.trim="scope.row.inputExtendDay" v-if="scope.row.isHide" class="btn-relative">
                  <template slot="append"> 方</template>
                </el-input>
                <span v-else>{{scope.row.extend_day}} 方</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="save(scope.row)" v-if="scope.row.isHide">保存</el-button>
                <el-button type="text" @click="showInput(scope.row)" v-if="!scope.row.isHide">编辑</el-button>
                <el-button type="text" @click="hideInput(scope.row)" v-if="scope.row.isHide">取消</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <!-- 动态分配，无查询列表 -->
        <div v-if="tabType === 'trends'" :class="['trends-ctx', {'trends-list': vipStatus === 'trends_1'}]">
          <p>所有子账号共用所有可用的并发或流量<br />无需为单个账户分配</p>
          <el-button type="primary" class="length152" round v-preventReClick @click="allocationSave('trends')" v-if="!(is_dynamic > 0)">保存</el-button>
        </div>
      </div>
      <!-- 右侧名片 -->
      <div class="ac__allocation__panel--right">
        <div class="ac__allocation--user">
          <h1 class="title">可用资源</h1>
          <div class="allocation_icon">
            <i :class="`${resourcesVo && resourcesVo.type > 0 ? 'iconfont-v3 saasliuliang_tubiao' : 'iconfont-v3 saasbingfa_tubiao'}`"></i>
          </div>
          <ul class="allocation_one">
            <li>可分配{{resourcesVo ? (resourcesVo.type > 0 ? `流量` : `并发`) : ''}}：{{resourcesVo ? (resourcesVo.type > 0 ? resourcesVo.flow : resourcesVo.total) : ''}}{{resourcesVo ? (resourcesVo.type > 0 ? `流量（GB）` : `并发（方）`) : ''}}</li>
            <li>有效期至{{resourcesVo && resourcesVo.end_time ? resourcesVo.end_time : '--'}}</li>
          </ul>
          <ul class="allocation_one" v-if="resourcesVo && resourcesVo.extend_day">
            <li>可分配并发扩展包（天）：{{ resourcesVo && resourcesVo.extend_day ? resourcesVo.extend_day : 0 }}</li>
            <li>有效期至{{resourcesVo && resourcesVo.extend_end_time ? resourcesVo.extend_end_time : '--'}}</li>
          </ul>
        </div>
        <ul class="ac__allocation--info">
          <li>提示：</li>
          <li><span>1、</span><span>动态分配方式：所有子账户共用所有可用的并发或流量，无需为单个账户分配</span></li>
          <li><span>2、</span><span>固定分配方式：请为每个子账号分配用量，所有账号用量之和不能大于可分配用量</span></li>
        </ul>
      </div>
    </div>
    <!-- 批量分配-弹出框 -->
    <VhallDialog title="批量分配" :visible.sync="multiAllocShow" :lock-scroll='false' class="dialog__group" width="468px">
      <el-form :model="multiAllocForm" ref="multiAllocForm" :rules="multiAllocFormRules" label-width="120px">
        <el-form-item label="分配数量：" prop="count">
          <el-input v-model.trim="multiAllocForm.count" auto-complete="off" placeholder="请输入分配数量" class="btn-relative">
            <template slot="append"> {{resourcesVo && Number(resourcesVo.type) === 1 ? 'GB' : '方' }}</template>
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  size="medium" round @click="saveMultiSetHandle">确 定</el-button>
        <el-button @click.prevent.stop="multiAllocShow = false"  size="medium" round>取 消</el-button>
      </div>
    </VhallDialog>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import {sessionOrLocal} from "@/utils/utils";
  export default {
    name: 'info.vue',
    components: {
      PageTitle
    },
    data() {
      return {
        is_dynamic: null,
        resourcesVo: null,
        tabList: [
          {
            label: '动态分配',
            value: 'trends',
            total: 0
          },
          {
            label: '固定分配',
            value: 'regular',
            total: 10
          }
        ],
        tabType: null,
        vipStatus: null, // trends_0 动态重分配；trends_1 动态已分配；regular_0 固态重分配；regular_1 固态已分配
        vipSelectStatus: null,
        dataList: [],
        total: 0,
        multiAllocShow: false,
        multiAllocForm: {
          count: null
        },
        multiAllocFormRules: {
          count: [
            { required: true, message: '请输入分配数量', trigger: 'blur' }
          ]
        },
        sonDao: {},
        multipleSelection: [],
        query: {
          pos: 0,
          limit: 500,
          pageNumber: 1
        },
      };
    },
    methods: {
      // 切换选项卡[每次点击切换时，设定其需要点击保存按钮]
      handleClick(tab, event) {
        console.log(tab, event);
        // trends_0 动态重分配；trends_1 动态已分配；regular_0 固定重分配；regular_1 固定已分配。
        this.vipSelectStatus = this.tabType === 'trends' ? `trends_0` : `regular_0`;
      },
      multiSetHandle(type) {
        // 按钮限制，若没有选中信息，不可展示
        if (this.multipleSelection && this.multipleSelection.length > 0) {
          if(type === 'more') {
            // 当前为批量-并发分配扩展包
            this.dialogType = 3;
          } else {
            if (Number(this.resourcesVo.type) === 1) {
              // 当前为流量-批量分配
              this.dialogType = 2;
            } else {
              // 当前为并发-分配并发包
              this.dialogType = 1;
            }
          }
          this.multiAllocShow = true;
        } else {
          this.$message.error('请至少选择一条子账号');
        }
      },
      // 分配方式切换-保存分配方式
      allocationSave(type) {
        // 若为regular表示固定，其它动态
        this.$fetch('userEdit', {
          is_dynamic: type === 'regular' ? 0 : 1
        }).then(res=>{
          if (res && res.code === 200) {
            this.$message.success('保存分配方式成功！');
            // 若当前为固定分配，获取子账户列表数据
            this.is_dynamic = type === 'regular' ? 0 : 1;
            this.getSonList();
          } else {
            this.$message.success(res.msg ||'保存分配方式失败！');
          }
        }).catch(e=>{
          console.log(e);
          this.$message.error('保存分配方式失败！');
        });
      },
      // 获取用量分配方式
      getAllocMethod() {
        // 获取用户信息中的 is_dynamic字段
        this.tabType = 'trends';
        this.vipStatus = 'trends_1';
        if (this.vipStatus === 'trends_1') {
          // 获取子账户数据
          this.getSonList();
        }
      },
      // 获取列表数据
      getSonList(row) {
        if (row) {
          this.query.pos = row.pos;
          this.query.pageNumber = row.pageNum;
        }
        let params = {
          user_id: sessionOrLocal.get('userId'),
          pos: this.query.pos,
          limit: this.query.limit,
          scene_id: 2 // 场景id：1子账号列表 2用量分配获取子账号列表
        };
        this.$fetch('getSonList', this.$params(params)).then(res =>{
          let dao =  res && res.code === 200 && res.data ? res.data : {
            total: 0,
            list: []
          };
          (dao.list||[]).map(item => {
            // 组装数据 type =>  0并发 1流量 [Number(this.resourcesVo.type)]
            if(Number(this.resourcesVo.type) > 0) {
              if (item.is_dynamic > 0 ) {
                // 流量动态
                item.count = 0;
                item.inputCount = '';
              } else {
                // 流量（XXXGB）
                item.inputCount = item.vip_info.flow;
                item.count = item.vip_info.flow;
              }
            } else {
              if (item.is_dynamic > 0 ) {
                // 流量动态
                item.count = 0;
                item.inputCount = '';
              } else {
                // 并发（XXX方）
                item.inputCount = item.vip_info.total;
                item.count = item.vip_info.total;
              }
            }
            item.extend_day = item.vip_info.extend_day;
            item.inputExtendDay = item.vip_info.extend_day;
            item.isHide = false;
          });
          this.dataList = dao.list;
          this.total = dao.total;
        }).catch(e=>{
          console.log(e);
          this.sonDao = {
            total: 0,
            list: []
          };
        });
      },
      // 获取账号可分配资源
      allocMoreGet() {
        this.$fetch('allocMoreGet', {}).then(res=>{
          if (res && res.code === 200) {
            this.resourcesVo = res.data;
          } else {
            this.resourcesVo = null;
          }
        }).catch(e=>{
          console.log(e);
          this.resourcesVo = null;
        });
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 保存单个子账户分配
      save(row) {
        let regA = Number(this.resourcesVo.type) === 1 ? /^\d+(\.\d{1,2})?$/ :  /^\d+$/; // 允许二位小数点输入
        console.log(regA);
        let flag = true;
        if (row === null || row === undefined || row === '') {
          flag = true;
        } else if (row.inputCount === null || row.inputCount === undefined) {
          flag = true;
        } else if (regA.test(row.inputCount)) {
          row.inputCount = Number(this.resourcesVo.type) === 1 ? parseFloat(row.inputCount) : parseInt(row.inputCount);
          flag = true;
        } else {
          flag = false;
        }
        // 右侧最大可分配数据
        let maxVla = this.resourcesVo.type > 0 ? this.resourcesVo.flow : this.resourcesVo.total;

        // 判断流量是否超出可分配流量
        let params = {
          type: Number(this.resourcesVo.type), // 分配类型 0-并发 1-流量,
          pid: sessionOrLocal.get('userId'),
          kv: [{
            user_id: row.child_id,
            resources: row.inputCount || 0,
            extend_day: row.inputExtendDay || 0
          }]
        };
        flag ? this.sendAllocSet(params, row) : null;
      },
      saveMultiSetHandle(){
        this.$refs.multiAllocForm.validate((valid) => {
          if (valid) {
            let childIdList = this.multipleSelection.map(item => {
              let result = {
                user_id: item.child_id,
                resources: 0,
                extend_day: 0
              }
              if (this.dialogType === 1) {
                // 并发-分配并发包，设置resources， type为并发
                result.resources = Number(this.multiAllocForm.count);
                result.extend_day = item.extend_day;
              } else if (this.dialogType === 2) {
                // 流量-批量分配，设置 resources， type为流量
                result.resources = Number(this.multiAllocForm.count);
                result.extend_day = item.extend_day;
              }  else if (this.dialogType === 3) {
                // 并发-分配扩展包，设置 extend_day， type为并发
                result.extend_day = Number(this.multiAllocForm.count);
                result.resources = item.count;
              }
              console.log(result, '批量数据')
              return result;
            })
            let params = {
              type: Number(this.resourcesVo.type), // 分配类型 0-并发 1-流量,
              pid: sessionOrLocal.get('userId'),
              kv: childIdList
            };
            this.sendAllocSet(params);
          }
        });
      },
      sendAllocSet(params, row) {
        this.$fetch('allocSetVal', params, {
          'Content-Type': 'application/json'
        }).then(res=>{
          if (res && res.code === 200) {
            this.$message.success('保存成功！');
            if (row) {
              row.isHide = true;
            }
            this.multiAllocShow = false;
            this.allocMoreGet();
            // 保存完成后，更新数据
            this.getSonList();
          } else {
            this.$message.success(res.msg ||'保存失败！');
          }
        }).catch(e=>{
          console.log(e);
          this.$message.error('保存失败！');
        });
      },
      // 取消按钮 => 编辑展示
      hideInput(row) {
        row.isHide = false;
      },
      // 编辑按钮 => 保存 和 取消展示
      showInput(row) {
        row.isHide = true;
      }
    },
    created() {
      this.allocMoreGet();
      let userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
      if(userInfo) {
        // is_dynamic > 0 表示动态， 其它表示固定。
        this.tabType = userInfo.is_dynamic > 0 ? 'trends' : 'regular';
        this.is_dynamic = userInfo.is_dynamic;
        if(!(this.is_dynamic > 0)) {
          this.getSonList();
        }
      }
    }
  };
</script>

<style lang="less" scoped>
  .ac__allocation__panel {
    .flex-display();
    .justify(space-between);
    .align(flex-start);
  }
  .regular-ctx {
    padding-top: 225px;
    text-align: center;
    p {
      margin-bottom: 32px;
    }
    &.regular-list {
      padding: 24px 32px;
    }
  }
  .trends-ctx {
    padding-top: 225px;
    text-align: center;
    p {
      margin-bottom: 32px;
    }
    &.trends-list {
      padding: 24px 32px;
    }
  }
  .ac__allocation__panel--right {
    width: 248px;
    min-height: 437px;
    background: #FFFFFF;
    border-radius: 4px;
    padding: 24px 24px;
  }
  .ac__allocation--user {
    .title {
      font-size: 16px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #1A1A1A;
      line-height: 22px;
    }
    p {
      text-align: center;
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
    }
    .allocation_icon {
      text-align: center;
      margin-top: 24px;
      i.iconfont-v3 {
        font-size: 62px;
      }
    }
    .allocation_one {
      margin-top: 24px;
      li {
        list-style-type: none;
        text-align: left;
        font-size: 12px;
        font-family: @fontRegular;
        font-weight: 400;
        color: #999999;
        line-height: 20px;
      }
    }
    .result_val {
      font-size: 36px;
      font-family: @fontDINAL;
      font-weight: bold;
      color: #1A1A1A;
      line-height: 42px;
      margin-top: 24px;
    }
    .date {
      margin-top: 10px;
    }
  }
  .ac__allocation--info {
    border-top: 1px solid #E6E6E6;
    margin-top: 24px;
    padding-top: 22px;
    li {
      font-size: 12px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
      span {
        display: inline-block;
        vertical-align: top;
        width: 20px;
        &:last-child {
          width: calc(100% - 20px);
        }
      }
    }
  }
  .ac__allocation__panel--left {
    width: calc(100% - 272px);
    min-height: 612px;
    height: auto;
    background: #FFFFFF;
    position: relative;
    .el-button {
      margin-top: 3px;
    }
  }
  .panel-btn {
    position: absolute;
    right: 32px;
    top: 6px;
    &.btn-right {
      margin-right: 132px;
    }
  }
  /* 选项卡 */
  /deep/.el-tabs__header {
    margin: 0 0;
  }
  /deep/.el-tabs__item {
    padding: 0 24px;
    box-sizing: border-box;
    display: inline-block;
    list-style: none;
    position: relative;
    font-size: 16px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #666666;
    line-height: 55px;
    height: 55px;
    &.is-active {
      color: #FB3A32;
    }
  }
  /deep/.el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
  /deep/.el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
  /deep/.el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
  /deep/.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 24px;
  }
  /deep/.el-tabs__nav-wrap::after {
    height: 1px;
    color: #E6E6E6;
  }
  /* 内嵌按钮重试 */
  /deep/.btn-relative {
    position: relative;
    .el-input__inner {
      padding: 0 36px 0 12px;
    }
    /deep/.el-input-group__append {
      position: absolute;
      right: 10px;
      top: 10px;
      width: 20px!important;
      background-color: transparent;
      border: 0;
      border-bottom-right-radius: 4px;
      border-top-right-radius: 4px;
      color: #1A1A1A;
    }
  }
</style>
