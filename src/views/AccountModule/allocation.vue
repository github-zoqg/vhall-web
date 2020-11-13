<template>
  <div>
    <pageTitle title="可用资源"></pageTitle>
    <!-- 头部图形 + 右侧面板 -->
    <div class="alloc--top">
      <div class="echarts--tar" ref="allocTopChartDom" id="allocTopChartDom"></div>
      <div>
        <p>当前可用并发</p>
        <p>1200方</p>
        <p>服务期限： 2020-10-1~2020-12-22</p>
      </div>
    </div>
    <!-- 内容区域 -->
    <div class="alloc--ctx">
      <!-- 操作栏 -->
      <ul class="alloc--control">
        <li>
          <label>分配方式：</label>
          <el-radio-group v-model="ocType" @change="ocType === '1' ? getDataList() : null">
            <el-radio :label="1">动态分配</el-radio>
            <el-radio :label="2">固定分配</el-radio>
          </el-radio-group>
        </li>
        <li>
          <el-button round @click.prevent.stop="multiAllocShow = true">批量分配</el-button>
        </li>
      </ul>
      <!-- 操作栏 -->
      <!-- 动态分配占位图 -->
      <div class="oc--show--default" v-if="ocType === 1">
        <img src="../../common/images/icon/qq.png" />
      </div>
      <!-- 固定分配，表格 -->
      <div class="oc--show--set" v-else>
        <el-table
          :data="tableData"
          stripe
          style="width: 100%">
          <el-table-column
            prop="nick_name"
            label="帐号昵称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="phone"
            label="手机号码"
            width="180">
          </el-table-column>
          <el-table-column
            label="预设流量">
            <template slot-scope="{ rows }">
              <el-input type="text" v-model="rows.inputCount" v-if="rows.isHide"/>
              <span v-else>{{rows.count}}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            align="center">
            <template slot-scope="{ rows }">
              <el-button size="mini" type="text" @click.prevent.stop="save(rows)">保存</el-button>
              <el-button size="mini" type="text" @click.prevent.stop="showInput(rows)">编辑</el-button>
              <el-button size="mini" type="text" @click.prevent.stop="hideInput(rows)">取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 批量分配-弹出框 -->
      <el-dialog title="批量分配" :visible.sync="multiAllocShow" :lock-scroll='false' class="dialog__group">
        <el-form :model="multiAllocForm" ref="multiAllocForm" :rules="multiAllocFormRules" label-width="120px">
          <el-form-item label="分配数量：" prop="count">
            <el-input v-model.trim="multiAllocForm.count" auto-complete="off" placeholder="请输入分配数量"/>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.prevent.stop="multiAllocShow = false">取 消</el-button>
          <el-button type="primary">确 定</el-button>
        </div>
      </el-dialog>

    </div>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle';
import Echarts from 'echarts';
export default {
  name: 'allocation.vue',
  components: {
    PageTitle,
  },
  data() {
    return {
      tabType: null,
      myChart: null,
      ocType: 1,
      allocData: {
        list: [
          {
            name: '电脑端',
            value: 44
          },
          {
            name: '移动端',
            value: 4096
          }
        ]
      },
      tableData: [],
      multiAllocShow: false,
      multiAllocForm: {
        count: null
      },
      multiAllocFormRules: {
        count: [
          { required: true, message: '请输入分配数量', trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    initPage() {
      // 样式重置
      this.renderTarCharts();
      this.$nextTick(() => {
        if (this.myChart) {
          this.myChart.resize();
        }
      });
    },
    getDataList(pageInfo = {pageNum: 1, pageSize: 10}) {
      this.tableData = [
        {
          nick_name: '嘿嘿嘿',
          phone: 18310410764,
          inputCount: 0,
          count: 0,
          isHide: false
        }
      ]
    },
    renderTarCharts() {
      this.myChart = Echarts.init(this.$refs.allocTopChartDom);
      //数据
      let options = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}<br/>观看次数  {c}  ({d}%)',
        },
        legend: {
          show: false,
          orient: 'vertical',
          top: 80,
          right:50,
          icon: 'circle',
          itemWidth: 8,
          itemHeight: 8,
          formatter: function(name) {
            let topList = [];
            let topValue = 0;
            [{
              name: "电脑端",
              value: 44
            }, {
              name: "移动端",
              value: 4096
            }].map(item => {
              if (item.name === name) {
                topValue = item.value;
              }
              topList.push(item.value);
            });
            let sum = topList.reduce((prev, cur) => prev + cur);
            return name + '   ' + ((topValue/sum) * 100).toFixed(2) + '%';
          },
          data: [{
            name: "电脑端",
            value: 44
          }, {
            name: "移动端",
            value: 4096
          }],
        },
        color: ['#4383E4', '#FA9A32', '#7D43E4', '#FB3A32', '#ccc'],
        series: {
          name: 'sdfsdf',
          type: 'pie',
          radius: ['30%', '60%'],
          center: ['30%', '50%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center',
          },
          labelLine: {
            show: false,
          },
          itemStyle: {
            show: false,
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          data:  [{
            name: "电脑端",
            value: 44
          }, {
            name: "移动端",
            value: 4096
          }]
        },
      };
      // 使用刚指定的配置项和数据显示图表。
      this.myChart.setOption(options);
    },
    save(row) {},
    hideInput(row) {},
    showInput(row) {}
  },
  mounted() {
    this.initPage();
  }
};
</script>

<style lang="less" scoped>
.alloc--top {
  .flex-display();
  .justify(flex-start);
  .align(center);
}
.echarts--tar {
  width: 200px;
  height: 200px;
}
.alloc--ctx {
  .layout--right--main();
  .min-height--header();
}
.alloc--control {
  .flex-display();
  .justify(flex-start);
  .align(center);
  li:last-child {
    margin-left: auto;
  }
}
.oc--show--default {
  img {
    width: 100px;
    margin: 100px auto;
    display: block;
  }
}
</style>
