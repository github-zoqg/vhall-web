<template>
  <el-dialog
    title="分配小组"
    :visible.sync="defaultGroupShow"
    width="800px"
    height="520px"
    class="dispach-chgroup"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :before-close="cancelDialog"
  >
    <div class="group-content" element-loading-text="努力加载中" v-loading="loading">
      <div class="group-header">
        <el-button round @click.prevent.stop="viewerDialogAdd" size="small">新增分组</el-button>
      </div>
      <el-scrollbar class="scroll-bar" ref="scrollBar">
        <div class="group-list" v-if="defaultGroupShow">
          <div class="group-list-item">
            <grouping-card
              ref="groupingCard0"
              :groupType="0"
              @groupDissolution="groupDissolution"
              @changeGroup="changeGroup"
              :cardList="waitList"
            ></grouping-card>
          </div>
          <div
            class="group-list-item"
            v-for="(item, index) in readyList"
            :key="item.group_order_id"
          >
            <grouping-card
              :ref="`groupingCard${item.group_order_id}`"
              :groupType="1"
              @groupDissolution="groupDissolution"
              @changeGroup="changeGroup"
              @removeGroup="removeGroup"
              :groupIndex="index"
              :cardList="item"
              :maxNumber="maxNumber"
            ></grouping-card>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <span slot="footer">
      <el-button type="primary" size="medium" round :disabled="loading" @click="okHandle">
        保 存
      </el-button>
      <el-button size="medium" round @click="cancelDialog(null)">取 消</el-button>
    </span>
    <!-- 新增分组 -->
    <group-add ref="groupAdd" :readyList="readyList" :groupList="groupList"></group-add>
    <!--换组-->
    <group-change
      ref="groupChange"
      :isMax="changeGroupDefault.isMax"
      :maxNumber="maxNumber"
      :readyList="readyList"
      :checkList="changeGroupDefault.checkList"
      @changeGroupComplete="changeGroupComplete"
      :groupList="groupList"
    ></group-change>
  </el-dialog>
</template>

<script>
  import GroupingCard from './components/GroupingCard';
  import GroupAdd from './components/GroupAdd.vue';
  import GroupChange from './components/GroupChange.vue';
  export default {
    components: {
      GroupingCard,
      GroupAdd,
      GroupChange
    },
    props: {
      //当前分组id
      groupId: {
        type: [String, Number],
        default: ''
      }
    },
    data() {
      return {
        defaultGroupShow: false,
        loading: false,
        loadingData: false,
        groupAddShow: false,
        //换组
        changeGroupDefault: {
          currentGroup: null, //from当前分组
          checkList: [], //data选中换组观众
          selectGroup: 1, //to换到组
          isMax: false //是否超过小组上限
        },
        //待分配
        waitList: {
          group_order_id: 0, //组序号
          id: 0,
          audiences: []
        },
        readyList: [], //已分配
        copyReadyList: '',
        changeData: false, //数据是否变动
        maxNumber: 2000 //最大人数
      };
    },
    computed: {
      //分组小组
      groupList() {
        return this.readyList.map(item => {
          return {
            group_order_id: item.group_order_id,
            groupName: '分组' + item.group_order_id
          };
        });
      },
      //所有分配小组人数和
      allReadyNumber() {
        let _num = 0;
        this.readyList.forEach(item => {
          if (item && item.audiences && item.audiences.length) {
            _num += item.audiences.length;
          }
        });
        return _num;
      }
    },
    methods: {
      /**
       * 数据变动关闭弹框提示
       * function(done)，done 用于关闭 Dialog
       */
      cancelDialog(done) {
        if (this.defaultGroupShow && this.copyReadyList != JSON.stringify(this.readyList)) {
          this.$confirm('数据有变化，确认不保存？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            customClass: 'zdy-message-box',
            lockScroll: false,
            closeOnClickModal: false,
            closeOnPressEscape: false,
            cancelButtonClass: 'zdy-confirm-cancel'
          })
            .then(() => {
              done ? done() : this.hide();
            })
            .catch(() => {});
        } else {
          done ? done() : this.hide();
        }
      },
      //新增分组
      viewerDialogAdd() {
        this.$refs.groupAdd?.handlOpen(this.groupList);
        this.$nextTick(() => {
          this.$refs.scrollBar?.update();
        });
      },
      //显示分配小组弹框
      show() {
        this.defaultGroupShow = true;
        this.getDefaultData();
      },
      //查询分组观众
      getDefaultData() {
        this.loading = true;
        this.waitList.audiences = [];
        this.readyList = [];
        this.$fetch('getAudienceList', { am_id: this.groupId })
          .then(res => {
            this.loading = false;
            if (res && res.code === 200 && res.data) {
              this.waitList.audiences = res.data.wait_list ? res.data.wait_list : [];
              this.readyList = res.data.ready_list ? res.data.ready_list : [];
              this.$nextTick(() => {
                this.$refs.scrollBar?.update();
              });
              this.copyReadyList = JSON.stringify(this.readyList);
            } else {
              this.waitList.audiences = [];
              this.readyList = [];
            }
          })
          .catch(e => {
            this.loading = false;
            this.waitList.audiences = [];
            this.readyList = [];
          });
      },
      //重置分组
      hide() {
        this.waitList.audiences = [];
        this.readyList = [];
        this.defaultGroupShow = false;
        this.loading = false;
      },
      /**
       * 解散小组
       * @param groupIndex {Number} groupIndex 分组序号
       * @param list {Array} list 当前分组观众
       */
      groupDissolution(groupIndex, list) {
        this.readyList.splice(groupIndex, 1);
        this.waitList.audiences = this.waitList.audiences.concat(list);
      },
      /**
       * 换组
       * @param {string} groupName   分组名称
       * @param {Array}  checkList  选中换组观众数据
       */
      changeGroup(currentGroup, checkList) {
        //如果是待分配组，判断所有已分配+选中数据是否超过最大允许人数
        if (currentGroup.id === 0 && this.allReadyNumber + checkList.length > this.maxNumber) {
          this.$set(this.changeGroupDefault, 'isMax', true);
        } else {
          this.$set(this.changeGroupDefault, 'isMax', false);
        }
        this.$set(this.changeGroupDefault, 'currentGroup', currentGroup);
        this.$set(this.changeGroupDefault, 'checkList', checkList);
        this.$nextTick(() => {
          this.$refs.groupChange.handleOpen(checkList);
        });
      },
      /**
       * 移出小组
       * @param {object} item  当前被移出观众
       */
      removeGroup(item) {
        this.waitList.audiences.push(item);
      },
      /**
       * 确定换组
       * @param {string | number} selectGroup 选择小组
       */
      changeGroupComplete(selectGroup) {
        let currentGroupID = this.changeGroupDefault.currentGroup.group_order_id;
        if (currentGroupID == selectGroup) {
          this.$message({
            message: '不能选择同一组',
            showClose: true,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
        this.$set(this.changeGroupDefault, 'selectGroup', selectGroup);
        const toGroupDataFilter = this.readyList.filter(item => {
          return item.group_order_id === this.changeGroupDefault.selectGroup;
        });
        //目标小组
        const toGroupData =
          toGroupDataFilter && toGroupDataFilter.length ? toGroupDataFilter[0] : { audiences: [] };
        //当前小组
        const currentGroupList = [];
        if (!toGroupData.audiences) {
          toGroupData.audiences = [];
        }
        this.changeGroupDefault.currentGroup.audiences.forEach(item => {
          if (this.changeGroupDefault.checkList.includes(item.id)) {
            toGroupData.audiences.push(item);
          } else {
            currentGroupList.push(item);
          }
        });
        this.changeGroupDefault.currentGroup.audiences = currentGroupList;
        this.$refs.groupChange && this.$refs.groupChange.handleClose();
        const groupingCardIndex = `groupingCard${this.changeGroupDefault.currentGroup.group_order_id}`;
        if (this.$refs[groupingCardIndex]) {
          this.$refs[groupingCardIndex].clearData
            ? this.$refs[groupingCardIndex].clearData()
            : this.$refs[groupingCardIndex][0].clearData();
        }
      },
      //分组保存
      okHandle() {
        if (this.readyList.length == 0) {
          this.$message({
            message: '预分组必须＞＝1',
            showClose: true,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
        const validList = this.readyList.filter(item => {
          return item.audiences.length == 0;
        });
        if (validList.length > 0) {
          this.$message({
            message: '小组内观众不能为空，请解散空白小组',
            showClose: true,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          return;
        }
        this.loading = true;
        const params = {
          am_id: this.groupId,
          list: JSON.stringify({
            ready_list: this.readyList,
            wait_list: this.waitList.audiences
          })
        };
        this.$fetch('saveAudienceSave', params)
          .then(res => {
            this.$message({
              message: `操作成功`,
              showClose: true,
              type: 'success',
              customClass: 'zdy-info-box'
            });
            this.hide();
            this.$emit('search'); //重置列表数据
          })
          .catch(res => {
            console.log(res);
            this.$message({
              message: res.msg || `操作失败`,
              showClose: true,
              type: 'error',
              customClass: 'zdy-info-box'
            });
            this.loading = false;
          });
      }
    }
  };
</script>

<style lang="less" scoped>
  .group-content {
    background: #fff;
    .group-header {
      text-align: right;
      padding: 0 32px 20px 32px;
    }
    .scroll-bar {
      height: 380px;
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
          padding-left: 32px;
        }
        &:nth-child(even) {
          padding-left: 5px;
          padding-right: 32px;
        }
      }
    }
  }
</style>
<style lang="less">
  .dispach-chgroup .el-dialog .el-dialog__body {
    padding: 0;
  }
</style>
