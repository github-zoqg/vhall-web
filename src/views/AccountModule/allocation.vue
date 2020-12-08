<template>
  <div>
    <pageTitle title="用量分配"></pageTitle>
    <div class="ac__allocation__panel">
      <!-- 左侧 -->
      <div class="ac__allocation__panel--left">
        <el-tabs v-model="tabType" @tab-click="handleClick">
          <el-tab-pane :label="item.label" :name="item.value" v-for="(item, ins) in tabList" :key="ins"></el-tab-pane>
        </el-tabs>
        <el-button round @click.prevent.stop="multiAllocShow = true" class="panel-btn length104" size="medium">批量分配</el-button>
        <!-- 固定分配 -->
        <div v-if="tabType === 'regular'" class="regular-ctx">
          <p>每个子账号可单独分配用量，所有用量之和不能大于可分配用量</p>
          <el-button type="primary" class="length152" round v-if="vipStatus === 'regular_0'" v-preventReClick @click="allocationSave('regular')">保存</el-button>
        </div>
        <!-- 动态分配 -->
        <div v-if="tabType === 'trends'" :class="['trends-ctx', {'trend-list': vipStatus === 'trends_1'}]">
          <p v-if="vipStatus === 'trends_0'">所有子账号共用所有可用的并发或流量<br />无需为单个账户分配</p>
          <el-button type="primary" class="length152" round v-if="vipStatus === 'trends_0'" v-preventReClick @click="allocationSave('trends')">保存</el-button>
          <el-table
            ref="multipleTable"
            :data="dataList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            v-if="vipStatus === 'trends_1' && dataList.length > 0">
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
              label="预设流量" v-if="Number($route.params.str) === 1">
              <template slot-scope="scope">
                <el-input type="text" v-model.trim="scope.row.inputCount" v-if="scope.row.isHide" class="btn-relative">
                  <template slot="append">GB</template>
                </el-input>
                <span v-else>{{scope.row.count}} GB</span>
              </template>
            </el-table-column>
            <el-table-column
              label="并发人数" v-if="Number($route.params.str) !== 1">
              <template slot-scope="scope">
                <el-input type="text" v-model.trim="scope.row.inputCount" v-if="scope.row.isHide" class="btn-relative">
                  <template slot="append"> 人</template>
                </el-input>
                <span v-else>{{scope.row.count}} 人</span>
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
      </div>
      <!-- 右侧名片 -->
      <div class="ac__allocation__panel--right">
        <div class="ac__allocation--user">
          <h1 class="title">可用资源</h1>
          <img src="../../common/images/avatar.jpg" alt="" />
          <p class="result_val">{{resourcesVo ? (resourcesVo.type > 0 ? resourcesVo.flow : resourcesVo.total) : ''}}</p>
          <p class="unit">当前可分配{{resourcesVo ? (resourcesVo.type > 0 ? `流量（GB）` : `并发（方）`) : ''}}</p>
          <p class="date">有效期至2023-07-31</p>
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
          <el-input v-model.trim="multiAllocForm.count" auto-complete="off" placeholder="请输入分配数量"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  size="medium" round>确 定</el-button>
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
        }
      };
    },
    methods: {
      // 切换选项卡
      handleClick(tab, event) {
        console.log(tab, event);
        this.vipStatus = this.tabType === 'trends' ? `trends_0` : `regular_0`;
      },
      // 保存分配方式
      allocationSave(type) {
        console.log(type);
        this.$fetch('allocSave', {}).then(res=>{
          if (res && res.code === 200) {
            this.$message.success('保存分配方式成功！');
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
        this.tabType = 'trends';
        this.vipStatus = 'trends_1';
        if (this.vipStatus === 'trends_1') {
          // 获取子账户数据
        }
      },
      // 获取账号可分配资源
      allocMoreGet() {
        this.$fetch('allocMoreGet', {
          user_id: sessionOrLocal.get('userId')
        }).then(res=>{
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
      handleSelectionChange() {},
      // 保存单个子账户分配
      save(row) {
        let regA = Number(this.$route.params.str) === 1 ? /^\d+(\.\d{1,2})?$/ :  /^\d+$/; // 允许二位小数点输入
        console.log(regA);
        let flag = true;
        if (row === null || row === undefined || row === '') {
          flag = true;
        } else if (row.inputCount === null || row.inputCount === undefined || row.inputCount === '') {
          flag = true;
        } else if (regA.test(row.inputCount)) {
          row.inputCount = Number(this.$route.params.str) === 1 ? parseFloat(row.inputCount) : parseInt(row.inputCount);
          flag = true;
        } else {
          flag = false;
        }
        flag ? this.$fetch('allocSetVal', {}).then(res=>{
          if (res && res.code === 200) {
            this.$message.success('保存成功！');
            row.isHide = true;
          } else {
            this.$message.success(res.msg ||'保存失败！');
          }
        }).catch(e=>{
          console.log(e);
          this.$message.error('保存失败！');
        }) : null;
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
  }
  .trends-ctx {
    padding-top: 225px;
    text-align: center;
    p {
      margin-bottom: 32px;
    }
    &.trend-list {
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
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #1A1A1A;
      line-height: 22px;
    }
    p {
      text-align: center;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
    }
    img {
      display: block;
      margin: 0 auto;
      width: 62px;
      height: 62px;
      margin-top: 29px;
    }
    .result_val {
      font-size: 36px;
      font-family: DINAlternate-Bold, DINAlternate;
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
      font-family: PingFangSC-Regular, PingFang SC;
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
    font-family: PingFangSC-Regular, PingFang SC;
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
