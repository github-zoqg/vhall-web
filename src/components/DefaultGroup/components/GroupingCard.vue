<template>
  <div class="grouping-card">
    <!--分配小组按钮组-->
    <div class="group-header btn-group">
      <span class="group-header-name">
        {{ groupHeaderName }}（{{ cardList.audiences && cardList.audiences.length }}）
      </span>
      <div class="btn-group-right">
        <span
          v-if="!batchGroupState"
          @click="batchGroup"
          class="span"
          :class="cardList.audiences.length > 0 ? '' : 'group-disable'"
        >
          <i class="vh-saas-iconfont vh-saas-a-line-batchdistribution pr4"></i>
          {{ batchGroupName }}
        </span>
        <span v-if="groupType && !batchGroupState" class="span" @click="dissolution">
          <i class="vh-saas-iconfont vh-saas-a-line-dissolutiongrouping pr4"></i>
          解散
        </span>
        <span v-show="batchGroupState" class="span" @click="clearData">
          <i class="el-icon el-icon-close cancel-size"></i>
          取消
        </span>
        <span
          v-show="batchGroupState"
          class="span"
          @click="changeGroup"
          :class="checkList && checkList.length ? '' : 'group-disable'"
        >
          <i class="vh-saas-iconfont vh-saas-a-line-Ingroup pr4"></i>
          换组
        </span>
      </div>
    </div>
    <!--小组卡片-->
    <div class="list-group">
      <!--分配小组观众-->
      <el-scrollbar class="list-group-item scroll-bar" v-if="batchGroupState">
        <el-checkbox-group class="list-group-item item" v-model="checkList">
          <el-checkbox
            v-for="item in cardList.audiences"
            :key="item.group_order_id"
            :label="item.id"
            size="medium"
            :name="cardList.groupName"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-scrollbar>
      <el-scrollbar class="list-group-item scroll-bar" v-else>
        <div
          class="list-group-item-state"
          v-for="(item, index) in cardList.audiences"
          :ref="'groupItem' + item.id"
          :key="item.id"
        >
          <el-popover
            placement="bottom-start"
            width="100%"
            :append-to-body="false"
            :popper-options="{
              boundariesElement: 'body',
              gpuAcceleration: true,
              positionFixed: false,
              preventOverflow: true
            }"
            :popperClass="groupType ? 'list-group-popover' : 'list-group-popover list-none'"
            trigger="click"
          >
            <div class="list-group-item-button">
              <div class="item-button" @click="removeGroup(item, index)">移出小组</div>
              <div class="item-button" @click="changeCurrentGroup(item)">换组</div>
            </div>
            <span slot="reference">
              <span class="list-group-name" v-if="isOverflow(item.name)">{{ item.name }}</span>
              <el-tooltip effect="dark" v-else placement="top">
                <div slot="content" class="group-tooltip">{{ item.name }}</div>
                <span class="list-group-name">{{ item.name }}</span>
              </el-tooltip>
            </span>
          </el-popover>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  //import draggable from "vuedraggable"
  export default {
    name: 'VmpGroupCard',
    props: {
      //分组名称
      groupIndex: {
        required: false,
        type: Number,
        default: 0
      },
      //0待分组1其他组
      groupType: {
        required: false,
        type: [String, Number],
        default: 1
      },
      //分组最大人数
      maxNumber: {
        required: false,
        type: [String, Number],
        default: 2000
      },
      //本组观众
      cardList: {
        required: true,
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        checkList: [], //复选数据
        batchGroupState: false //批量换组,
      };
    },
    computed: {
      groupHeaderName() {
        return this.groupType ? '分组' + this.cardList.group_order_id : '待分配';
      },
      batchGroupName() {
        return this.groupType ? '批量换组' : '批量分配';
      }
    },
    methods: {
      //批量换组||批量分配
      batchGroup() {
        if (!this.cardList.audiences.length) return;
        this.batchGroupState = true;
      },
      //换组
      changeGroup() {
        if (!this.checkList.length) return;
        this.$emit('changeGroup', this.cardList, this.checkList);
      },
      /**
       * 单个换组
       * @param {object} item 选择组
       * */
      changeCurrentGroup(item) {
        this.$emit('changeGroup', this.cardList, [item.id]);
        this.clearData();
      },
      /**
       * 移出小组
       * @param {object} item 当前分组观众
       * @param {number} index 观众序号
       */
      removeGroup(item, index) {
        this.cardList.audiences.splice(index, 1);
        this.$emit('removeGroup', item);
      },
      //解散
      dissolution() {
        this.$confirm('解散后小组成员将全部回到主待分配中，确定是否要解散小组？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          customClass: 'zdy-message-box',
          lockScroll: false,
          closeOnClickModal: false,
          closeOnPressEscape: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        })
          .then(() => {
            this.checkList = [];
            this.$emit('groupDissolution', this.groupIndex, this.cardList.audiences);
            this.$message({
              message: `解散成功`,
              showClose: true,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            console.log('解散' + this.cardList.group_order_id);
          })
          .catch(() => {});
      },
      //清除状态 关闭弹框
      clearData() {
        this.checkList = [];
        this.batchGroupState = false;
      },
      //超出显示el-tooltip
      isOverflow(name) {
        // eslint-disable-next-line no-control-regex
        let bytesLen = name.replace(/[^\x00-\xff]/g, 'xx').length;
        return bytesLen < 10;
      }
    }
  };
</script>

<style lang="less" scoped>
  .grouping-card {
    border: 1px solid #ccc;
    background: #f7f7f7;
    border-radius: 4px;
    .pr4 {
      padding-right: 4px;
    }
    .btn-group {
      padding: 0 12px;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid #ccc;
      overflow: hidden;
      font-size: 14px;
      .btn-group-right {
        float: right;
        height: 40px;
        overflow: hidden;
        .group-disable {
          color: gray;
          padding-left: 8px;
          font-size: 14px;
          cursor: not-allowed;
          &:hover {
            color: gray;
          }
        }
        .span {
          padding-left: 8px;
          font-size: 14px;
          cursor: pointer;
          &:hover {
            color: #fb3a32;
          }
        }
        .cancel-size {
          font-size: 16px;
        }
      }
    }
    .list-group {
      overflow: auto;
      height: 205px;
      background: #f7f7f7;
      .list-group-item {
        height: 205px;
        overflow: hidden;
        .list-group-popover {
          width: 96px;
          margin-top: 0;
        }
      }
      .list-group-item-state {
        border-radius: 4px;
        margin-top: 8px;
        margin-left: 8px;
        display: inline-block;
        cursor: pointer;
        position: relative;
      }
      .list-group-name {
        max-width: 78px;
        display: inline-block;
        border-radius: 4px;
        overflow: hidden;
        height: 24px;
        line-height: 24px;
        font-size: 12px;
        padding: 0 8px;
        background: #e6e6e6;
        border-radius: 4px;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
</style>
<style lang="less">
  .group-tooltip {
    max-width: 300px;
  }
  .list-group-popover {
    box-sizing: border-box;
    min-width: 96px;
    padding: 0;
    left: 0;
    top: 0;
    transform: none;
    &[x-placement^='bottom'] {
      margin-top: 0px;
    }
    &.list-none {
      display: none;
    }
    .list-group-item-button {
      background: #fff;
      text-align: left;
      padding: 4px 0;
      .item-button {
        cursor: pointer;
        padding: 0 14px;
        height: 28px;
        line-height: 28px;
      }
      .item-button:hover {
        color: #1a1a1a;
        background: #f7f7f7;
      }
    }
  }
  .list-group-item {
    color: #1a1a1a;
    .el-checkbox {
      margin: 8px 0 0 8px;
      max-width: 96px;
      height: 24px;
      background: #e6e6e6;
      border-radius: 4px;
      line-height: 24px;
      overflow: hidden;
      padding: 0 8px;
    }
    .el-checkbox__label {
      max-width: 78px;
      display: inline-block;
      overflow: hidden;
      font-size: 12px;
      height: 24px;
      line-height: 24px;
      background: #e6e6e6;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding-left: 4px;
      padding-right: 8px;
    }
    .el-checkbox__input.is-checked + .el-checkbox__label {
      color: #1a1a1a;
    }
    .el-checkbox__input {
      margin-top: 5px;
      vertical-align: top;
    }
  }
</style>
