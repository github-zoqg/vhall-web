<template>
  <VhallDialog title="分配小组"
    :visible.sync="defaultGroupShow"
    width="800px"
    height="520px"
    @close="hide">
    <div class="group-content"
      element-loading-text="努力加载中"
      v-loading="loading">
      <div class="group-header">
        <el-button round
          @click.prevent.stop="viewerDialogAdd"
          size="small">新增分组</el-button>
      </div>
      <div class="group-list"
        v-if="defaultGroupShow">
        <div class="group-list-item">
          <grouping-card :ref="`groupingCard`"
            :groupType="0"
            @groupDissolution="groupDissolution"
            @changeGroup="changeGroup"
            :data="waitList"></grouping-card>
        </div>
        <div class="group-list-item"
          v-for="(item,index) in readyList"
          :key="item.groupName">
          <grouping-card :ref="`groupingCard${item.index}`"
            groupType="1"
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
    <!-- 新增分组 -->
    <group-add ref="groupAdd"
      :readyList="readyList"
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
      defaultGroupShow: false,
      loading: false,
      groupAddShow: false,
      /**换组 */
      changeGroupDefault: {
        currentGroup: null, //from当前分组
        checkList: [],//data选中换组观众
        selectGroup: 1//to换到组
      },
      waitList: {
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
      },//待分配
      readyList: [//已分配
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
    /** 
     * 分组小组
    */
    groupList() {
      return this.readyList.map(item => {
        return {
          id: item.id,
          groupName: item.groupName,
          index: item.index
        };
      });
    }
  },
  methods: {
    /**
     * 新增分组
     */
    viewerDialogAdd() {
      this.$refs.groupAdd && this.$refs.groupAdd.handlOpen(this.groupList)
    },
    /**
     * 显示分配小组弹框
     */
    show() {
      this.defaultGroupShow = true
      this.getDefaultData()
    },
    /**
     * 查询分组观众
     */
    getDefaultData() {
      this.loading = true
      this.$fetch('getAudienceList').then(res => {
        this.loading = false
        if (res && res.code === 200 && res.data) {
          this.waitList.list = res.data.wait_list ? res.data.wait_list : []
          this.readyList = res.data.ready_list ? res.data.ready_list : []
        } else {
          this.waitList.list = []
          this.readyList = []
        }
      }).catch(e => {
        this.loading = false
        this.waitList.list = []
        this.readyList = []
      });
    },
    /**
     * 重置分组
     */
    hide() {
      this.waitList.list = []
      this.readyList = []
      this.defaultGroupShow = false
    },
    /**
     * 解散小组
     * @param groupIndex {Number} groupIndex 分组序号
     * @param list {Array} list 当前分组观众
    */
    groupDissolution(groupIndex, list) {
      this.readyList.splice(groupIndex, 1)
      this.waitList.list = this.waitList.list.concat(list)
    },
    /**
     * 换组 
     * @param {string} groupName   分组名称
     * @param {Array}  checkList  选中换组观众数据
     */
    changeGroup(currentGroup, checkList) {
      this.$set(this.changeGroupDefault, 'currentGroup', currentGroup)
      this.$set(this.changeGroupDefault, 'checkList', checkList)
      this.$nextTick(() => {
        this.$refs.groupChange.handleOpen()
      })
    },
    /** 
     * 移出小组
     * @param {object} item  当前被移出观众
    */
    removeGroup(item) {
      this.waitList.list.push(item)
    },
    /**
     * 确定换组
     * @param {string | number} selectGroup 选择小组
    */
    changeGroupComplete(selectGroup) {
      this.$set(this.changeGroupDefault, 'selectGroup', selectGroup)
      const toGroupDataFilter = this.readyList.filter(item => {
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
    /**
     * 分组保存
     */
    okHandle() {
      const params = {
        list: this.readyList
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