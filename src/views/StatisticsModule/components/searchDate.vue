<template>
  <div class="data-search">
    <el-date-picker
      v-model="dateValue"
      value-format="yyyy-MM-dd"
      type="daterange"
      unlink-panels
      @change="getDateList('search')"
      range-separator="至"
      start-placeholder="开始日期"
      prefix-icon="iconfont-v3 saasicon_date"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      style="width: 240px; margin-right:16px"
    />
  </div>
</template>
<script>
export default {
  name: "searchDate",
  data() {
    const _this = this
    return {
      dateValue: '',
      timeType: 2, // TODO
      pickerOptions: {
        shortcuts: [
          {
            text: '全部',
            onClick(picker) {
              let childrenArray = Array.from(picker.$el.firstChild.firstChild.children)
              childrenArray.forEach((item)=>{
                item.style.color = '#666'
              })
              picker.$el.firstChild.firstChild.children[0].style.color = '#FB3A32'
              const end = '';
              const start = '';
              picker.$emit('pick', [start, end]);
              _this.timeType = 0;
            }
          },
          {
            text: '今日',
            onClick(picker) {
              let childrenArray = Array.from(picker.$el.firstChild.firstChild.children)
              childrenArray.forEach((item)=>{
                item.style.color = '#666'
              })
              picker.$el.firstChild.firstChild.children[1].style.color = '#FB3A32'
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime());
              start.setTime(start.getTime());
              picker.$emit('pick', [start, end]);
              _this.timeType = 1;
            }
          },
          {
            text: '近7日',
            onClick(picker) {
              let childrenArray = Array.from(picker.$el.firstChild.firstChild.children)
              childrenArray.forEach((item)=>{
                item.style.color = '#666'
              })
              picker.$el.firstChild.firstChild.children[2].style.color = '#FB3A32'
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
              _this.timeType = 2;
            }
          }, {
            text: '近30日',
            onClick(picker) {
              let childrenArray = Array.from(picker.$el.firstChild.firstChild.children)
              childrenArray.forEach((item)=>{
                item.style.color = '#666'
              })
              picker.$el.firstChild.firstChild.children[3].style.color = '#FB3A32'
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() - 3600 * 1000 * 24);
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
              _this.timeType = 3;
            }
          }
        ],
        // disabledDate是一个函数,参数是当前选中的日期值,这个函数需要返回一个Boolean值,
        disabledDate: (time) => {
          return time.getTime() > Date.now() //设置选择今天之前的日期（不能选择当天）
        }
      }
    }
  },
  created() {
    this.initDate()
  },
  mounted() {
    this.getDateList('init')
    this.$EventBus.$on('changeDateLiveSelect', () => {
      this.cleanDateValue()
    })
  },
  methods: {
    cleanDateValue() {
      this.dateValue = ''
    },
    initDate() {
      // 初始化设置日期为最近一周
      const end = new Date();
      const start = new Date();
      end.setTime(end.getTime() - 3600 * 1000 * 24);
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      this.dateValue = [dayjs(start).format('YYYY-MM-DD'), dayjs(end).format('YYYY-MM-DD')];
    },
    getDateList(type = 'search') {
      this.$emit('changeDate', {type, data: {time: this.dateValue, timeType: this.timeType}})
    }
  }
}
</script>
<style lang="less">
.el-picker-panel__shortcut:nth-of-type(3) {
  color: #fb3a32;
}
.el-picker-panel__shortcut:nth-of-type(1) {
  color: #666;
}
</style>