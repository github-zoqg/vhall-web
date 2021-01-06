<template>
  <div class="question-wrap">
    <pageTitle title="奖品" v-if="$route.meta.title === '奖品'">
      <div slot="content">
        1.创建奖品不限制数量
        <br>
        2.奖品名称：不支持特殊符号、表情
        <br>
        3.奖品图片：尺寸120*120px，大小不超过2M
      </div>
    </pageTitle>
    <div class="head-operat" v-show="total || isSearch">
      <el-button size="medium" type="primary" round class="head-btn length104" @click="createPrize">创建奖品</el-button>
      <el-button size="medium" round class="head-btn length104" v-if="$route.meta.title !== '奖品'" @click="prizeMeterial">资料库</el-button>
      <el-button size="medium" round class="head-btn batch-del" @click="allDelete(null)" :disabled="!prizeChecked.length">批量删除</el-button>
      <div class="inputKey">
        <el-input v-model.trim="keyword" suffix-icon="el-icon-search" placeholder="请输入奖品名称" clearable @change="getTableList"></el-input>
      </div>
      <!-- <search-area class="head-btn fr search"
        ref="searchArea"
        :isExports='false'
        :placeholder="'请输入奖品名称'"
        :searchAreaLayout="searchAreaLayout"
        @onSearchFun="getTableList('search')"
        >
      </search-area> -->
    </div>
    <div class="question-list" v-show="total">
      <table-list ref="tableList" :manageTableData="tableData" :tabelColumnLabel="tabelColumn" :tableRowBtnFun="tableRowBtnFun"
       :totalNum="total" :width="150" @onHandleBtnClick='onHandleBtnClick' @getTableList="getTableList" @changeTableCheckbox="changeTableCheckbox">
      </table-list>
    </div>
    <div class="no-live" v-show="!total">
      <noData :nullType="nullText" :text="text">
        <el-button type="primary" v-if="nullText == 'nullData'" round  @click="createPrize" v-preventReClick>创建奖品</el-button>
        <el-button type="white-primary" v-if="nullText == 'nullData' && $route.path !='/material/prize'" round  @click="prizeMeterial" v-preventReClick>资料库</el-button>
      </noData>
    </div>
    <create-prize ref="createPrize" @getTableList="getTableList" :prizeInfo="prizeInfo" :liveTotal="total"></create-prize>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import createPrize from '../LiveModule/MaterialSet/components/createPrize';
import noData from '@/views/PlatformModule/Error/nullPage';
export default {
  name: "prize",
  props: {
    source: {
      type: String,
      required: false,
      default: '1'
    },
    roomId: {
      type: String,
      required: false,
      default: ''
    },
  },
  data() {
    return {
      total: 0,
      nullText: 'nullData',
      isSearch: false,
      keyword: '',
      text: '您还未添加奖品，快去添加吧~',
      prizeInfo: {},
      isDelete: false,
      searchAreaLayout: [
        {
          key: 'keyword'
        }
      ],
      tabelColumn: [
        {
          label: '奖品id',
          key: 'prize_id',
        },
        {
          label: '奖品图片',
          key: 'img',
        },
        {
          label: '奖品名称',
          key: 'prize_name',
        },
        {
          label: '创建时间',
          key: 'create_time',
        }
      ],
      tableRowBtnFun: [
        {name:'复制', methodName: 'cope'} ,{name:'编辑', methodName: 'edit'},{name:'删除', methodName: 'del'}
      ],
      prizeChecked: [],
      tableData: []
    };
  },
  components: {
    PageTitle,
    createPrize,
    noData
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    getTableList(params) {
      let pageInfo = this.$refs.tableList.pageInfo;
       //获取分页信息
      let formParams = {
        keyword: this.keyword
      }; //获取搜索参数
      if (this.keyword || params == 'delete') {
        pageInfo.pageNum = 1;
        pageInfo.pos = 0;
        this.$refs.tableList.clearSelect();
      }
      if (this.source == '0') {
        formParams.room_id = this.roomId;
      }
      formParams.source =  this.source;
      let obj = Object.assign({}, pageInfo, formParams);

      this.$fetch('getPrizeList', obj).then(res => {
        this.tableData = res.data.list;
        this.total = res.data.count;
        if (this.keyword) {
          this.nullText = 'search';
          this.text = '';
          this.isSearch = true;
        } else {
          this.nullText = 'nullData';
          this.text = '您还未添加奖品，快去添加吧~';
          this.isSearch = false;
        }
        this.tableData.map(item => {
          item.img = item.img_path;
        })
      })
    },
    // 复制
    cope(that, {rows}) {
      if (that.source == 0 && Number(that.total) >= 20) {
        that.$message.error('每个活动最多显示20个奖品，超过20个后无法关联，需要将原有奖品删除')
        return;
      }
      let params = {
        prize_id: rows.prize_id,
        source: that.source,
        room_id: that.roomId
      }
      that.$fetch('copyPrize', that.$params(params)).then(res => {
        that.$message.success('复制成功');
        that.getTableList();
      })
    },
    // 编辑
    edit(that, {rows}) {
      that.$refs.createPrize.dialogVisible = true;
      that.prizeInfo = rows;
    },
    // 删除
    del(that, {rows}) {
      that.deleteConfirm(rows.prize_id);
    },
    deleteConfirm(id) {
      this.$confirm('删除后，此奖品将无法使用，确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        let params = {
          prize_id: id,
          source: this.source,
          room_id: this.roomId
        }
        this.$fetch('delPrize', this.$params(params)).then(res=>{
          if (res.code == 200) {
            this.getTableList('delete');
            this.$message.success('删除成功');
          }
        }).catch(res => {
          this.$message.success(res.msg || '删除失败');
        });
      }).catch(() => {
      });
    },
    allDelete(id) {
      id = this.prizeChecked.join(',')
      this.deleteConfirm(id);
    },
    // 选中
    changeTableCheckbox(val) {
      this.prizeChecked = val.map(item => item.prize_id);
    },
    // 创建奖品
    createPrize() {
      if (this.source == 0 && Number(this.total) >= 20) {
        this.$message.error('每个活动最多显示20个奖品，超过20个后无法关联，需要将原有奖品删除')
        return;
      }
      if (this.tableData.length) {
         this.$refs.tableList.clearSelect();
      }
      this.prizeInfo = {};
      this.$refs.createPrize.dialogVisible = true;
    },
    // 从资料库中选择
    prizeMeterial() {
      this.$refs.createPrize.dialogPrizeVisible = true;
    }
  },
};
</script>

<style lang="less" scoped>
.question-list{
  width: 100%;
  .layout--right--main();
  .padding-table-list();
}
.question-wrap{
  height: 100%;
  width: 100%;
  /deep/.el-card__body{
    width: 100%;
    padding: 32px 24px;
  }
  .head-operat{
    margin-bottom: 20px;
    .head-btn{
      display: inline-block;
    }
    ::v-deep.set-upload{
      position: relative;
      span{
        input{
          position: absolute;
          left: 0;
          top: 0;
          opacity: 0;
          width: 100%;
          height: 100%;
        }
      }
    }
    .inputKey{
      float: right;
      height: 35px;
      width: 220px;
      /deep/.el-input__inner{
        border-radius: 18px;
      }
    }
  }
  .prize-no{
    // height: calc(100vh - 260px);
    text-align: center;
    margin-top: 208px;
  }
  .no-live{
    padding-bottom: 150px;
  }
}
</style>
