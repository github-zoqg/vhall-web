<template>
  <div class="grouping-card">
    <draggable class="list-group"
      :list="list"
      @change="changeMove"
      :sort="!sort"
      draggable=".item"
      group="a">
      <div slot="header"
        class="btn-group"
        role="group">
        <span>{{groupName}}（{{list.length}}）</span>
        <div class="btn-group-right">
          <span v-if="!groupType"><i class="vh-saas-iconfont vh-saas-a-line-batchdistribution pr4"></i>批量分配</span>
          <span v-if="groupType"><i class="vh-saas-iconfont vh-saas-a-line-dissolutiongrouping pr4"></i>解散</span>
          <span v-show="groupType&&!batchGroupState"
            @click="batchGroupState = !batchGroupState">
            <i class="vh-saas-iconfont vh-saas-a-line-batchChangegroup pr4"></i>批量换组</span>
          <span v-show="batchGroupState"
            @click="batchGroupState = false"><i class="el-icon el-icon-close cancel-size"></i>取消</span>
          <span v-show="groupType&&batchGroupState"
            @click="changeGroup"><i class="vh-saas-iconfont vh-saas-a-line-Ingroup pr4"></i>换组</span>
        </div>
      </div>
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
  </div>
</template>

<script>
import draggable from "vuedraggable"
let id = 1
export default {
  props: {
    /**分组名称 */
    groupName: {
      require: false,
      type: String,
      default: '分组1'
    },
    //0待分组1其他组
    groupType: {
      type: [String, Number],
      default: 1
    },
    /**分组人数 */
    number: {
      type: [String, Number],
      default: 0
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
    draggable
  },
  data() {
    return {
      batchGroupState: false//批量换组
    }
  },
  methods: {
    /*换组*/
    changeGroup() {
      this.$emit('changeGroup', data)
    },
    changeMove(data) {
      this.$emit('change', data)
    },
    startMove(data) {
      this.$emit('start', data)
    }
  }
}
</script>

<style lang="less" scoped>
.grouping-card {
  border: 1px solid #ccc;
  background: #f7f7f7;
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