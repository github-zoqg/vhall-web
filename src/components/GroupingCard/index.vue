<template>
  <div class="grouping-card">
    <!--小组卡片-->
    <draggable class="list-group"
      :list="list"
      :move="groupMove"
      @start="groupStart"
      @end="groupEnd"
      :sort="!sort"
      draggable=".item"
      :groupName="groupName"
      ghostClass="ghost"
      group="a">
      <!--分配小组按钮组-->
      <div slot="header"
        class="btn-group"
        role="group">
        <span>{{groupName}}（{{list.length}}）</span>
        <div class="btn-group-right">
          <span v-if="!batchGroupState"
            @click="batchGroup"><i class="vh-saas-iconfont vh-saas-a-line-batchdistribution pr4"></i>{{groupType?'批量换组':'批量分配'}}</span>
          <span v-if="groupType&&!batchGroupState"
            @click="dissolution"><i class="vh-saas-iconfont vh-saas-a-line-dissolutiongrouping pr4"></i>解散</span>
          <span v-show="batchGroupState"
            @click="batchGroupState = false"><i class="el-icon el-icon-close cancel-size"></i>取消</span>
          <span v-show="batchGroupState"
            @click="changeGroup"><i class="vh-saas-iconfont vh-saas-a-line-Ingroup pr4"></i>换组</span>
        </div>
      </div>
      <!--分配小组观众-->
      <div class="list-group-item item"
        v-for="item in list"
        :key="item.name">
        <el-checkbox v-if="batchGroupState"
          :label="item.name"
          size="medium"
          :name="groupName">{{item.name}}</el-checkbox>
        <div class="list-group-item-state"
          v-if="!batchGroupState">
          <el-popover placement="bottom-start"
            width="100%"
            :append-to-body="false"
            :popper-options="{
              boundariesElement: 'body',
              gpuAcceleration:true,
              positionFixed:false,
              preventOverflow:true
            }"
            popperClass="list-group-popover"
            trigger="click">
            <div class="list-group-item-button">
              <div>移出小组</div>
              <div>换组</div>
            </div>
            <span slot="reference">
              <span class="list-group-name">{{item.name}}</span>
              <!--<el-tooltip class="item"
                effect="dark"
                :content="item.name"
                placement="top">
                <span class="list-group-name">{{item.name}}</span>
              </el-tooltip>-->
            </span>
          </el-popover>
        </div>
      </div>
    </draggable>
    <!--换组-->
    <group-change ref="groupChange"></group-change>
  </div>
</template>

<script>
import draggable from "vuedraggable"
import GroupChange from './GroupChange.vue'
let id = 1
export default {
  props: {
    /**分组名称 */
    groupName: {
      require: true,
      type: String,
      default: '分组1'
    },
    groupIndex: {
      require: true,
      type: Number,
      default: 0
    },
    //0待分组1其他组
    groupType: {
      type: [String, Number],
      default: 1
    },
    /**分组人数 */
    maxNumber: {
      type: [String, Number],
      default: 2000
    },
    /**排序 */
    sort: {
      type: Boolean,
      default: false
    },
    /**本组观众 */
    list: {
      type: Array,
      default: () => []
    }
  },
  components: {
    draggable,
    GroupChange
  },
  data() {
    return {
      batchGroupState: false,//批量换组,
      validMove: false,//拖动校验
      isStart: false,
      isSameGroup: true//同组拖动
    }
  },
  methods: {
    batchGroup() {
      this.batchGroupState = true
    },
    /*换组*/
    changeGroup() {
      this.$refs.groupChange.handleOpen()
      this.$emit('changeGroup')
    },
    /*解散*/
    dissolution() {
      this.$emit('groupDissolution', this.groupIndex, this.list)
      console.log('解散' + this.groupName)
    },
    groupChange(data) {
      debugger
      this.$emit('change', data)
    },
    groupStart() {
      this.isStart = true
    },
    groupEnd() {
      this.isStart = false
    },
    groupMove(data) {
      const { draggedContext, relatedContext } = data
      const relatedGroupName = relatedContext?.component?.$attrs.groupName
      this.$emit('move', data)
      /*同组拖动允许*/
      if (relatedGroupName === '预分配' || relatedGroupName === this.groupName) {
        return true
      }
      if (this.isStart && relatedContext?.list.length >= this.maxNumber) {
        this.isStart = false
        this.$message({
          message: '该组观众已超出上限，请选择其他小组',
          showClose: true,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false
      }
      return true
    }
  }
}
</script>

<style lang="less" scoped>
.grouping-card {
  border: 1px solid #ccc;
  background: #f7f7f7;
  .ghost {
    color: #fb3a32;
  }
  .pr4 {
    padding-right: 4px;
  }
  .btn-group {
    padding: 0 12px;
    height: 40px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    overflow: hidden;
    .btn-group-right {
      float: right;
      span {
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
      margin-top: 8px;
      margin-left: 8px;
      float: left;
      cursor: pointer;
      .list-group-popover {
        width: 96px;
        margin-top: 0;
      }
    }
    .list-group-item-state {
      border-radius: 4px;
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
.list-group-popover {
  box-sizing: border-box;
  min-width: 96px;
  padding: 4px 0;
  position: absolute !important;
  left: 0;
  top: 0;
  transform: none;
  &[x-placement^='bottom'] {
    margin-top: 0px;
  }
  .list-group-item-button {
    background: #fff;
    text-align: left;
    div {
      cursor: pointer;
      padding: 0 14px;
      height: 28px;
      line-height: 28px;
    }
    div:hover {
      color: #1a1a1a;
      background: #f7f7f7;
    }
  }
}
.list-group-item {
  color: #1a1a1a;
  .el-checkbox {
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