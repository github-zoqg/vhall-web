<template>
  <div class="grouping-card">
    <draggable class="list-group"
      :list="list"
      @change="changeMove"
      :sort="!sort"
      draggable=".item"
      :group="groupName">
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
          border
          size="medium"
          :name="groupName">{{item.name}}</el-checkbox>
        <div class="list-group-item-state"
          v-if="!batchGroupState">
          <el-popover placement="bottom"
            width="100%"
            popperClass="list-group-popover"
            trigger="click">
            <div class="list-group-item-button">
              <div>换组</div>
              <div>移出小组</div>
            </div>
            <span slot="reference">{{item.name}}</span>
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
      width: 100px;
      line-height: 34px;
      text-align: center;
      height: 34px;
      margin-left: 8px;
      float: left;
      cursor: pointer;
      .list-group-popover {
        width: 100px;
      }
    }
    .list-group-item-state {
      border: 1px solid #ccc;
      width: 100px;
      border-radius: 4px;
      span {
        display: inline-block;
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
<style lang="less">
.list-group-popover {
  box-sizing: border-box;
  min-width: 100px;
  .list-group-item-button {
    background: #fff;
    div {
      cursor: pointer;
    }
    div:hover {
      color: #fb3a32;
    }
  }
}
</style>