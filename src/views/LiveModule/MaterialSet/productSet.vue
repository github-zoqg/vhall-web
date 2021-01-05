<template>
  <div class="question-wrap">
    <pageTitle title="商品"></pageTitle>
      <div class="head-operat" v-show="total || isSearch">
        <el-button type="primary" size="medium" round  @click="addProduct" v-preventReClick>创建商品</el-button>
        <el-button round @click="batchDel(null)" size="medium" v-preventReClick :disabled="!checkedGoodsId.length">批量删除</el-button>
         <div class="inputKey">
          <el-input v-model.trim="keyword" placeholder="请输入商品名称"  @change="getTableList" maxlength="50" clearable>
            <i slot="suffix" class="iconfont-v3 saasicon_search"></i>
          </el-input>
        </div>
        <!-- <search-area class="head-btn fr search"
          ref="searchArea"
          :placeholder="'请输入商品名称'"
          :isExports='false'
          :searchAreaLayout="searchAreaLayout"
          @onSearchFun="getTableList('search')"
          >
        </search-area> -->
      </div>
      <div class="question-list" v-show="total">
        <table-list
          ref="tableProductList"
          :manageTableData="tableData"
          :tabelColumnLabel="tabelColumn"
          :tableRowBtnFun="tableRowBtnFun"
          :width="150"
          :totalNum="total"
          @onHandleBtnClick='onHandleBtnClick'
          @getTableList="getTableList"
          @changeTableCheckbox="changeTableCheckbox"
          @switchChange="onSwitchChange"
        >
        </table-list>
      </div>
       <div class="empty" v-show="!total">
        <noData :nullType="nullText" :text="text">
          <el-button type="primary" round v-if="nullText == 'nullData'" @click="addProduct" v-preventReClick>创建</el-button>
        </noData>
      </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import noData from '@/views/PlatformModule/Error/nullPage';
export default {
  name: "prize",
  data() {
    return {
      formData: {},
      imageUrl: '',
      keyword:'',
      nullText: 'nullData',
      isSearch: false, //是否是搜索
      text: '您还没有商品，快来创建吧！',
      checkedGoodsId: [],
      total: 1,
      searchAreaLayout: [
        {
          key: 'questionName'
        }
      ],
      tabelColumn: [
        {
          label: '商品ID',
          key: 'goods_id',
        },
        {
          label: '图片',
          key: 'img',
        },
        {
          label: '商品名称',
          key: 'name',
        },
        {
          label: '单价',
          key: 'price',
        },
        {
          label: '优惠价',
          key: 'discount_price',
        },
        {
          label: '上下架',
          key: 'watch',
        }
      ],
      tableRowBtnFun: [
       {name:'编辑', methodName: 'edit'},{name:'复制', methodName: 'cope'},{name:'删除', methodName: 'del'}
      ],
      tableData: []
    };
  },
  components: {
    PageTitle,
    noData
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    onSwitchChange(option) {
      if(option.watch) {
        // 上架处理
        this.$fetch('goodsEnable', {
          webinar_id: this.$route.params.str,
          goods_id: option.goods_id
        }).then(res => {
          this.$message.success("上架设置成功！");
          this.getTableList();
          console.log(res);
        }).catch(err => {
          this.$message.error("上架设置失败！");
          console.log(err);
        });
      } else {
        // 下架处理
        this.$fetch('goodsDisable', {
          webinar_id: this.$route.params.str,
          goods_id: option.goods_id
        }).then(res => {
          this.$message.success("下架设置成功！");
          this.getTableList();
          console.log(res);
        }).catch(err => {
          this.$message.error("下架设置失败！");
          console.log(err);
        });
      }
    },
    onHandleBtnClick(val) {
      let methodsCombin = this.$options.methods;
      methodsCombin[val.type](this, val);
    },
    getTableList(params) {
      let pageInfo = this.$refs.tableProductList.pageInfo; //获取分页信息
      if (this.keyword) {
        pageInfo.pageNum= 1;
        pageInfo.pos= 0;
        // 如果搜索是有选中状态，取消选择
        this.$refs.tableProductList.clearSelect();
      }
      let obj = {
        ...pageInfo,
        keyword: this.keyword,
        webinar_id: this.$route.params.str
      };
      this.$fetch('goodsGet', this.$params(obj)).then(res => {
        let tableData = res.data.goods_list;
        tableData.map(item => {
          item.watch = Boolean(!item.status);
          item.img = item.img_url;
        });
        this.total = res.data.total;
        this.tableData = tableData;
        if (this.keyword) {
            this.nullText = 'search';
            this.text = '';
            this.isSearch = true;
          } else {
            this.nullText = 'nullData';
            this.text = '您还没有商品，快来创建吧！';
            this.isSearch = false;
          }
        this.addCover();
      }).catch(e => {
        console.log(e);
      });
    },
    // 为每个商品设置显示的封面
    addCover() {
      this.tableData.length &&
      this.tableData.forEach(item => {
        item.img = item.img_list.find(item => item.is_cover) > -1 ?
          item.img_list.find(item => item.is_cover).img_url :
          item.img_list[0].img_url;
      });
    },
    // 复制
    cope(that, {rows}) {
      if (that.total >= 100) {
        that.$message.error('商品最大上架数量为100，请删除后再进行操作');
        return;
      }
      that.$fetch('goodsCopy', {
        webinar_id: that.$route.params.str,
        goods_id: rows.goods_id
      }).then(res => {
        that.$message.success("复制成功！");
        that.getTableList();
      }).catch(err => {
        that.$message.error("复制失败！");
        console.log(err);
      });
    },
    // 编辑
    edit(that, {rows}) {
      that.$router.push({
        path: `/live/addProduct/${that.$route.params.str}`,
        query: {
          goodId: rows.goods_id
        }
      });
    },
    delConfirm(id) {
      this.$confirm('确定要删除该文件吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.$fetch('goodsBatchDel', {webinar_id: this.$route.params.str, goods_ids: id}).then(res => {
          if (res.code == 200) {
            this.$message.success("删除成功！");
            this.checkedGoodsId = [];
            this.getTableList();
          }
        }).catch(err => {
          this.$message.error('删除失败, 请下架后删除');
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    // 删除
    del(that, {rows}) {
      that.delConfirm(rows.goods_id);
    },
    // 选中
    changeTableCheckbox(val) {
      console.log(val);
      this.checkedGoodsId = val.map(item => item.goods_id);
    },
    // 批量删除
    batchDel(id) {
     if (this.checkedGoodsId.length < 1) {
        this.$message.error("请选择要操作的文件");
      } else {
        id = this.checkedGoodsId.join(',');
        this.delConfirm(id);
      }
    },
    // 新建商品
    addProduct() {
      this.$router.push({path: `/live/addProduct/${this.$route.params.str}`});
    }
  },
};
</script>

<style lang="less" scoped>
.question-wrap{
  height: 100%;
  width: 100%;
  .question-list{
    background: #fff;
    width: 100%;
    padding: 24px 32px;
    border-radius: 4px;
  }
  /deep/.el-card__body{
    width: 100%;
    padding: 32px 24px;
  }
  // /deep/.el-upload--picture-card{
  //   width:83%;
  // }
  .head-operat{
    margin-bottom: 20px;
    .head-btn{
      display: inline-block;
      border-radius: 20px;
    }
    .inputKey{
      float: right;
      height: 35px;
      width: 220px;
      /deep/.el-input__inner{
        border-radius: 18px;
      }
      i{
        padding-right:5px;
        line-height: 37px;
        cursor: pointer;
      }
    }
  }
}
</style>
