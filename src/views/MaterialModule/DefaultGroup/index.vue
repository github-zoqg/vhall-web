<template>
  <VhallDialog title="分配小组"
    :visible.sync="defaultGroup.show"
    width="800px"
    height="520px"
    @close="hide">
    <div class="group-content">
      <div class="group-header">
        <el-button round
          @click.prevent.stop="viewerDialogAdd"
          size="small">新增分组</el-button>
      </div>
      <div class="group-list">
        <div class="group-list-item"
          v-for="item in data"
          :key="item.groupName">
          <grouping-card :groupName="item.groupName"
            :groupType="item.groupName==='预分配'?0:1"
            :list="item.list"></grouping-card>
        </div>
      </div>
    </div>
    <span slot="footer">
      <el-button type="primary"
        size="medium"
        round
        @click="okHandle">确 定</el-button>
      <el-button size="medium"
        round
        @click="hide">取 消</el-button>
    </span>
  </VhallDialog>
</template>

<script>
import GroupingCard from '@/components/GroupingCard'
export default {
  components: {
    GroupingCard
  },
  data() {
    return {
      defaultGroup: {
        show: false
      },
      data: [
        {
          groupName: '预分配',
          list: [
            {
              name: '观众阿里妈妈1',
              id: 1
            },
            {
              name: '观阿萨斯众2',
              id: 2
            },
            {
              name: '观啊实打实众3',
              id: 3
            }
          ]
        },
        {
          groupName: '分组1',
          list: [
            {
              name: '观众3',
              id: 9
            },
            {
              name: '观众4',
              id: 4
            },
            {
              name: '观众5',
              id: 5
            }
          ]
        },
        {
          groupName: '分组2',
          list: [
            {
              name: '观众6',
              id: 6
            },
            {
              name: '观众7',
              id: 7
            },
            {
              name: '观众8',
              id: 8
            }
          ]
        }
      ]
    }
  },
  methods: {
    show() {
      this.defaultGroup.show = true
    },
    hide() {
      this.defaultGroup.show = false
    },
    okHandle() { }
  }
}
</script>

<style lang="less" scoped>
.group-content {
  height: 430px;
  overflow: auto;
  background: #fff;
  .group-header {
    text-align: right;
    padding-bottom: 20px;
  }
  .group-list {
    background: #fff;
    .group-list-item {
      box-sizing: border-box;
      width: 49.9%;
      margin-bottom: 12px;
      float: left;
      &:nth-child(odd) {
        padding-right: 5px;
      }
      &:nth-child(even) {
        padding-left: 5px;
      }
    }
  }
}
</style>