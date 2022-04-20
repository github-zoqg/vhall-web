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
      <div class="group-list"
        v-if="defaultGroup.show">
        <div class="group-list-item"
          v-for="(item,index) in data"
          :key="item.groupName">
          <grouping-card :ref="`groupingCard${item.index}`"
            :groupType="item.groupName==='预分配'?0:1"
            @groupDissolution="groupDissolution"
            @changeGroup="changeGroup"
            @removeGroup="removeGroup"
            :groupIndex="index"
            :data="item"
            :maxNumber="4"></grouping-card>
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
    <group-add ref="groupAdd"
      :data="data"
      :groupList="groupList"></group-add>
    <!--换组-->
    <group-change ref="groupChange"
      @changeGroupComplete="changeGroupComplete"
      :groupList="groupList"></group-change>
  </VhallDialog>
</template>

<script>
import GroupingCard from './components/GroupingCard'
import GroupAdd from './components/GroupAdd.vue'
import GroupChange from './components/GroupChange.vue'
export default {
  components: {
    GroupingCard,
    GroupAdd,
    GroupChange
  },
  data() {
    return {
      defaultGroup: {
        show: false
      },
      groupAddShow: false,
      /**换组 */
      changeGroupDefault: {
        currentGroup: null, //from当前分组
        checkList: [],//data选中换组观众
        selectGroup: 1//to换到组
      },
      data: [
        {
          groupName: '预分配',
          index: 0,//组序号
          id: '2323232',
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
          index: 1,
          id: '232312',
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
          index: 2,
          id: '2323eq',
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
  computed: {
    // 分组小组
    groupList() {
      return this.data.map(item => {
        return {
          id: item.id,
          groupName: item.groupName,
          index: item.index
        };
      });
    }
  },
  methods: {
    viewerDialogAdd() {
      this.$refs.groupAdd.handlOpen(this.groupList)
    },
    show() {
      this.defaultGroup.show = true
      this.$fetch('getAudienceList').then(res => {
        if (res && res.code === 200 && res.data) {
          const wait_list = res.data.wait_list ? res.data.wait_list : []
          const ready_list = res.data.ready_list ? res.data.ready_list : []
          this.data = wait_list.concat(ready_list)
        } else {
          this.data = []
        }
      }).catch(e => {
        console.log(e);
        //this.data = []
      });
    },
    hide() {
      this.data = []
      this.defaultGroup.show = false
    },
    /**解散 */
    groupDissolution(groupIndex, list) {
      this.data.splice(groupIndex, 1)
      this.data[0].list = this.data[0].list.concat(list)
    },
    /**换组 */
    /**groupName   分组名称*/
    /**checkList  选中换组观众数据 */
    changeGroup(currentGroup, checkList) {
      this.$set(this.changeGroupDefault, 'currentGroup', currentGroup)
      this.$set(this.changeGroupDefault, 'checkList', checkList)
      this.$nextTick(() => {
        this.$refs.groupChange.handleOpen()
      })
    },
    /** 移出小组*/
    removeGroup(item) {
      this.data[0].list.push(item)
    },
    /**确定换组 */
    changeGroupComplete(selectGroup) {
      this.$set(this.changeGroupDefault, 'selectGroup', selectGroup)
      const toGroupDataFilter = this.data.filter(item => {
        return item.index === this.changeGroupDefault.selectGroup
      })
      const toGroupData = toGroupDataFilter && toGroupDataFilter.length ? toGroupDataFilter[0] : { list: [] }
      const currentGroupList = []
      if (!toGroupData.list) {
        toGroupData.list = []
      }
      this.changeGroupDefault.currentGroup.list.forEach(item => {
        if (this.changeGroupDefault.checkList.includes(item.id)) {
          toGroupData.list.push(item)
        } else {
          currentGroupList.push(item)
        }
      });
      this.changeGroupDefault.currentGroup.list = currentGroupList
      this.$refs.groupChange && this.$refs.groupChange.handleClose()
      const groupingCardIndex = `groupingCard${this.changeGroupDefault.currentGroup.index}`
      this.$refs[groupingCardIndex] && this.$refs[groupingCardIndex][0].clearData()
    },
    okHandle() {
      const data = this.data.slice(1)
      const params = {
        list: data
      }
      this.$fetch('saveAudienceSave', this.$params(params)).then(res => {
        this.$message({
          message: `操作成功`,
          showClose: true,
          type: 'success',
          customClass: 'zdy-info-box'
        });
        this.hide()
      }).catch(res => {
        console.log(res);
        this.$message({
          message: res.msg || `操作失败`,
          showClose: true,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      });
    }
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