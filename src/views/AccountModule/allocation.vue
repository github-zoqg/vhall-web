<template>
  <div>
    <pageTitle pageTitle="用量分配"></pageTitle>
    <div class="ac__allocation__panel">
      <!-- 左侧 -->
      <div class="ac__allocation__panel--left">
        <el-tabs v-model="tabType" @tab-click="handleClick">
          <el-tab-pane :label="item.label" :name="item.value" v-for="(item, ins) in tabList" :key="ins"></el-tab-pane>
        </el-tabs>
        <el-button round @click.prevent.stop="multiSetHandle()" :class="['panel-btn length104', {'btn-right': resourcesVo && resourcesVo.extend_end_time != ''}]"
                   size="medium"
                   v-if="!(is_dynamic > 0) && dataList.length > 0" :disabled="!multipleSelection.length">{{resourcesVo && Number(resourcesVo.type) === 1 ? '批量分配' : '分配并发包'}}</el-button>
        <el-button round @click.prevent.stop="multiSetHandle('more')" class="panel-btn length104" size="medium"
                   v-if="!(is_dynamic > 0) && dataList.length > 0 && resourcesVo && resourcesVo.extend_end_time != ''" :disabled="!multipleSelection.length">分配扩展包</el-button>
        <!-- 固定分配，有查询列表。 -->
        <div v-if="tabType === 'regular'" :class="['regular-ctx', {'regular-list': !(is_dynamic > 0)}]">
          <p v-if="is_dynamic > 0">每个子账号可单独分配用量，<br/>所有用量之和不能大于可分配用量</p>
          <el-button type="primary" class="length152" round v-preventReClick @click="allocationSave('regular')" v-if="is_dynamic > 0">保存</el-button>
          <!-- 当前数据库中已经是固定分配 -->
          <el-table
            ref="multipleTable"
            :data="dataList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
            v-if="!(is_dynamic > 0) && dataList.length > 0">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              label="帐号 / 昵称"
              align="left"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                {{scope.row.child_id}} / {{ scope.row.nick_name }}
              </template>
            </el-table-column>
            <el-table-column
              label="手机号"
              width="160"
              align="left"
              show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.phone || '----'}}
              </template>
            </el-table-column>
            <el-table-column
              label="分配流量" v-if="resourcesVo && (resourcesVo.type > 0)"
              align="left"
              width="230">
              <template slot-scope="scope">
                <!-- <el-input type="text" v-model.trim="scope.row.inputCount" v-if="scope.row.isHide"  class="btn-relative" oninput="this.value=this.value.replace(/[^\d^\.]+/g, '')">
                  <template slot="append">GB</template>
                </el-input> -->
                <VhallInput v-model.trim="scope.row.inputCount"  :maxlength="11" v-if="scope.row.isHide" class="btn-relative" autocomplete="off"  @input="formatGBInputs($event, scope.row, 'inputCount')">
                  <template slot="append">GB</template>
                </VhallInput>
                <span v-else>{{scope.row.count | unitCovert}} GB</span>
              </template>
            </el-table-column>
            <el-table-column
              label="分配并发" v-if="resourcesVo && !(resourcesVo.type > 0)"
              align="left"
              width="230">
              <template slot-scope="scope">
               <!--  <el-input type="text" maxlength="5" v-model.trim="scope.row.inputCount" v-if="scope.row.isHide" class="btn-relative" oninput="this.value=this.value.replace(/[^\d]+/g, '')">
                  <template slot="append"> 方</template>
                </el-input> -->
                <VhallInput v-model.trim="scope.row.inputCount" :maxlength="8" v-if="scope.row.isHide" class="btn-relative" autocomplete="off"  @input="formatBFInputs($event, scope.row, 'inputCount')">
                  <template slot="append">方</template>
                </VhallInput>
                <span v-else>{{scope.row.count | unitCovert}} 方</span>
              </template>
            </el-table-column>
            <el-table-column
              label="分配扩展包" v-if="resourcesVo && resourcesVo.extend_end_time != ''"
              align="left"
              width="230">
              <template slot-scope="scope">
                <!-- <el-input type="text" maxlength="5" v-model.trim="scope.row.inputExtendDay" v-if="scope.row.isHide" class="btn-relative" oninput="this.value=this.value.replace(/[^\d]+/g, '')">
                  <template slot="append"> 方</template>
                </el-input> -->
                <VhallInput v-model.trim="scope.row.inputExtendDay" :maxlength="8" v-if="scope.row.isHide" class="btn-relative" autocomplete="off" @input="formatBFInputs($event, scope.row, 'inputExtendDay')">
                  <template slot="append">方</template>
                </VhallInput>
                <span v-else>{{scope.row.extend_day | unitCovert}} 方</span>
              </template>
            </el-table-column>
            <el-table-column
              label="操作"
              align="left"
              class="btn-rows"
              width="114">
              <template slot-scope="scope">
                <el-button type="text" @click="save(scope.row)" v-if="scope.row.isHide">保存</el-button>
                <el-button type="text" @click="showInput(scope.row)" v-if="!scope.row.isHide">编辑</el-button>
                <el-button type="text" @click="hideInput(scope.row)" v-if="scope.row.isHide">取消</el-button>
              </template>
            </el-table-column>
          </el-table>
          <SPagination
            :total="total"
            :currentPage="query.pageNumber"
            @current-change="currentChangeHandler"
            align="center"
            v-if="!(is_dynamic > 0) && total > query.limit">
          </SPagination>
        </div>
        <!-- 动态分配，无查询列表 -->
        <div v-if="tabType === 'trends'" :class="['trends-ctx', {'trends-list': vipStatus === 'trends_1'}]">
          <p>所有子账号共用所有可用的并发或流量<br />无需为单个账户分配</p>
          <el-button type="primary" class="length152" round v-preventReClick @click="allocationSave('trends')" v-if="!(is_dynamic > 0)">保存</el-button>
        </div>
      </div>
      <!-- 右侧名片 -->
      <div class="ac__allocation__panel--right">
        <div class="ac__allocation--user">
          <h1 class="title">可用资源</h1>
          <div class="allocation_icon">
            <img src="../../common/images/account/saasliuliang_tubiao.png" alt="" v-show="tabType === 'trends'"/>
            <img src="../../common/images/account/saasbingfa_tubiao.png" alt="" v-show="tabType === 'regular'"/>
            <!-- <i :class="`${resourcesVo && resourcesVo.type > 0 ? 'iconfont-v3 saasliuliang_tubiao' : 'iconfont-v3 saasbingfa_tubiao'}`"></i> -->
          </div>
          <ul class="allocation_one">
            <li class="custom-font-barlow">{{ (resourcesVo ? (resourcesVo.type > 0 ? resourcesVo.flow : resourcesVo.total ) : 0) | unitCovert }}  </li>
            <li>可分配{{resourcesVo ? (resourcesVo.type > 0 ? `流量` : `并发`) : ''}} {{resourcesVo ? (resourcesVo.type > 0 ? `（GB）` : `（方）`) : ''}}</li>
            <li>有效期至 {{resourcesVo && resourcesVo.end_time ? resourcesVo.end_time : '--'}}</li>
          </ul>
          <ul class="allocation_one mt32" v-if="resourcesVo && resourcesVo.extend_end_time != ''">
            <li class="custom-font-barlow">{{ (resourcesVo && resourcesVo.extend_day ? resourcesVo.extend_day : 0)  | unitCovert}} </li>
            <li>可分配并发扩展包（天）</li>
            <li>有效期至 {{resourcesVo && resourcesVo.extend_end_time ? resourcesVo.extend_end_time : '--'}}</li>
          </ul>
        </div>
        <ul class="ac__allocation--info">
          <li>提示：</li>
          <li><span>1.</span><span>动态分配方式：所有子账户共用所有可用的并发或流量，无需为单个账户分配</span></li>
          <li><span>2.</span><span>固定分配方式：请为每个子账号分配用量，所有账号用量之和不能大于可分配用量</span></li>
        </ul>
      </div>
    </div>
    <!-- 批量分配-弹出框 -->
    <VhallDialog title="批量分配" :visible.sync="multiAllocShow" class="dialog__group" width="380px" v-if="multiAllocShow" @close="closeAllocDialog">
      <el-form :model="multiAllocForm" ref="multiAllocForm" :rules="multiAllocFormRules" label-width="80px">
        <!--  <el-form-item label="分配数量" prop="count">
          <el-input v-model.trim="multiAllocForm.count" maxlength="5" auto-complete="off" placeholder="请输入分配数量" class="btn-relative" oninput="this.value=this.value.replace(/[^\d^\.]+/g, '')">
            <template slot="append"> {{resourcesVo && Number(resourcesVo.type) === 1 ? 'GB' : '方' }}</template>
          </el-input>
        </el-form-item> -->
         <el-form-item label="分配数量" prop="count" v-if="resourcesVo && Number(resourcesVo.type) === 1">
          <VhallInput v-model.trim="multiAllocForm.count"  :maxlength="11" class="btn-relative" autocomplete="off" placeholder="请输入分配数量" @input="formatGBInputs($event, 'multiAllocForm', 'count')">
            <template slot="append">GB</template>
          </VhallInput>
         </el-form-item>
         <el-form-item label="分配数量" prop="count1" v-else>
          <VhallInput v-model.trim="multiAllocForm.count1" :maxlength="8" class="btn-relative" autocomplete="off" placeholder="请输入分配数量" @input="formatBFInputs($event, 'multiAllocForm', 'count1')">
          <template slot="append">方</template>
        </VhallInput>
         </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary"  size="medium" round @click="saveMultiSetHandle">确 定</el-button>
        <el-button @click="closeAllocDialog"  size="medium" round>取 消</el-button>
      </div>
    </VhallDialog>
  </div>
</template>

<script>
  import PageTitle from '@/components/PageTitle';
  import {sessionOrLocal} from "@/utils/utils";
  export default {
    name: 'info.vue',
    components: {
      PageTitle
    },
    data() {
      let checkGB = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入分配数量'));
        } else if (isNaN(value)) {
          return callback(new Error('请输入正数'));
        } else if (parseFloat(value) < 0 || parseFloat(value) > 99999999.99) {
          return callback(new Error('分配数量最多可输入'));
        } else {
          callback();
        }
      };
      return {
        is_dynamic: null,
        resourcesVo: null,
        tabList: [
          {
            label: '动态分配',
            value: 'trends',
            total: 0
          },
          {
            label: '固定分配',
            value: 'regular',
            total: 10
          }
        ],
        tabType: '',
        vipStatus: null, // trends_0 动态重分配；trends_1 动态已分配；regular_0 固态重分配；regular_1 固态已分配
        vipSelectStatus: null,
        dataList: [],
        total: 0,
        multiAllocShow: false,
        multiAllocForm: {
          count: null,
          count1: null
        },
        multiAllocFormRules: {
          count: [
            { required: true, message: '请输入分配数量', trigger: 'blur' },
           /*  { pattern: /^\d{0,8}(\.\d{0,2})?$/, message: '请输入正数' , trigger: 'blur'},
            { validator: checkGB, trigger: 'blur' } */
          ],
          count1: [
            { required: true, message: '请输入分配数量', trigger: 'blur' },
           /*  { pattern: /^\d{0,8}$/, message: '请输入正整数' , trigger: 'blur'} */
          ]
        },
        sonDao: {},
        multipleSelection: [],
        query: {
          pos: 0,
          limit: 10,
          pageNumber: 1
        },
      };
    },
    methods: {
       /**
     * 价格格式限制
     * 只能输入数字和小数点；
     * 小数点只能有1个
     * 第一位不能是小数点
     * 第一位如果输入0，且第二位不是小数点，则去掉第一位的0
     * 小数点后保留2位
     */
    handleInput(value, row, key) {
      if (value != '') {
          // this.editParams.price = value.replace(/^[0-9]*$/,'')
          // this.editParams.price = value.replace(/[^\d]/g,'')
          let str = value;
          let len1 = str.substr(0, 1);
          let len2 = str.substr(1, 1);
          //如果第一位是0，第二位不是点，就用数字把点替换掉
          if (str.length > 1 && len1 == 0 && len2 != ".") {
            str = str.substr(1, 1);
          }
          //第一位不能是.
          if (len1 == ".") {
            str = "";
          }
          //限制只能输入一个小数点
          if (str.indexOf(".") != -1) {
            let str_ = str.substr(str.indexOf(".") + 1);
            if (str_.indexOf(".") != -1) {
              str = str.substr(0, str.indexOf(".") + str_.indexOf(".") + 1);
            }
          }
          //正则替换，保留数字和小数点
          str = str.replace(/[^\d^\.]+/g,'')
          //如果需要保留小数点后两位，则用下面公式
          if (str.indexOf('.') > -1 && str.length - str.indexOf('.') > 3) {
            str = str.slice(0, str.indexOf('.') + 3)
          }
          row[key]= str;
        }
      },
      formatGBInputs(value, row, key) {
        /* if(key === 'count' || key === 'count1') {
          console.log('1111111')
          this[row][key] = this[row][key].replace(/[^\d^\.]+/g, '')
          row = this[row];
        } else {
          row[key] = row[key].replace(/[^\d^\.]+/g, '')
        }
        if (!/^\d{0,8}(\.\d{0,2})?$/.test(value)) {
          if(!value.match(/^\d{0,8}(\.\d{0,2})?$/g)) {
            row[key] = row[key].replace(/[^\d^\.]+/g, '')
          } else {
            // 前两位不能是00开头
            if(`${value.substring(0, 2)}` === '00') {
              row[key] = row[key].substring(0, row[key].length - 1);
            } else {
              row[key] = parseFloat(value).toFixed(2);
            }
          }
        } else {
          if(`${value.substring(0, 2)}` === '00') {
            row[key] = row[key].substring(0, row[key].length - 1);
          }
        } */
        if(key === 'count' || key === 'count1') {
          row = this[row];
        }
        this.handleInput(value, row, key);

      },
      formatBFInputs(value, row, key) {
        if(key === 'count' || key === 'count1') {
          this[row][key] = this[row][key].replace(/[^\d]+/g, '')
          row = this[row];
        } else {
          row[key] = row[key].replace(/[^\d]+/g, '')
        }
        if (!/^\d{0,8}$/.test(value)) {
          if(!value.match(/^\d{0,8}$/g)) {
            row[key] = row[key].replace(/[^\d]+/g, '')
          } else {
            // 前两位不能是00开头
            if(`${value.substring(0, 2)}` === '00') {
              row[key] = row[key].substring(0, row[key].length - 1);
            } else {
              row[key] = parseInt(value);
            }
          }
        } else {
          if(`${value.substring(0, 2)}` === '00') {
            row[key] = row[key].substring(0, row[key].length - 1);
          }
        }
      },
      // 切换选项卡[每次点击切换时，设定其需要点击保存按钮]
      handleClick(tab, event) {
        console.log(tab, event);
        // trends_0 动态重分配；trends_1 动态已分配；regular_0 固定重分配；regular_1 固定已分配。
        this.vipSelectStatus = this.tabType === 'trends' ? `trends_0` : `regular_0`;
      },
      multiSetHandle(type) {
        // 按钮限制，若没有选中信息，不可展示
        if (this.multipleSelection && this.multipleSelection.length > 0) {
          if(type === 'more') {
            // 当前为批量-并发分配扩展包
            this.dialogType = 3;
          } else {
            if (Number(this.resourcesVo.type) === 1) {
              // 当前为流量-批量分配
              this.dialogType = 2;
            } else {
              // 当前为并发-分配并发包
              this.dialogType = 1;
            }
          }
          this.multiAllocShow = true;
        } else {
          this.$message({
            message:  '请至少选择一条子账号',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        }
      },
      // 分配方式切换-保存分配方式
      allocationSave(type) {
        // 若为regular表示固定，其它动态
        this.$fetch('userEdit', {
          is_dynamic: type === 'regular' ? 0 : 1
        }).then(res=>{
          this.$message({
            message:  '保存分配方式成功',
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          // 若当前为固定分配，获取子账户列表数据
          this.is_dynamic = type === 'regular' ? 0 : 1;
          this.getSonList();
        }).catch(res =>{
          console.log(res);
          this.$message({
            message:  '保存分配方式失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        });
      },
      // 获取用量分配方式
      getAllocMethod() {
        // 获取用户信息中的 is_dynamic字段
        this.tabType = 'trends';
        this.vipStatus = 'trends_1';
        if (this.vipStatus === 'trends_1') {
          // 获取子账户数据
          this.getSonList();
        }
      },
      // 页码改变按钮事件
      currentChangeHandler(current) {
        this.query.pageNumber = current;
        this.query.pos = parseInt((current - 1) * this.query.limit);
        this.getSonList();
      },
      // 获取列表数据
      getSonList(row) {
        if (row) {
          this.query.pos = row.pos;
          this.query.pageNumber = row.pageNum;
        }
        let params = {
          user_id: sessionOrLocal.get('userId'),
          pos: this.query.pos,
          limit: this.query.limit,
          scene_id: 2 // 场景id：1子账号列表 2用量分配获取子账号列表
        };
        this.$fetch('getSonList', this.$params(params)).then(res =>{
          let dao =  res && res.code === 200 && res.data ? res.data : {
            total: 0,
            list: []
          };
          (dao.list||[]).map(item => {
            // 组装数据 type =>  0并发 1流量 [Number(this.resourcesVo.type)]
            if(Number(this.resourcesVo.type) > 0) {
              if (item.is_dynamic > 0 ) {
                // 流量动态
                item.count = 0;
                item.inputCount = '';
              } else {
                // 流量（XXXGB）
                item.inputCount = item.vip_info.flow;
                item.count = item.vip_info.flow;
              }
            } else {
              if (item.is_dynamic > 0 ) {
                // 流量动态
                item.count = 0;
                item.inputCount = '';
              } else {
                // 并发（XXX方）
                item.inputCount = item.vip_info.total;
                item.count = item.vip_info.total;
              }
            }
            item.extend_day = item.vip_info.extend_day;
            item.inputExtendDay = item.vip_info.extend_day;
            item.isHide = false;
          });
          this.dataList = dao.list;
          this.total = dao.total;
        }).catch(e=>{
          console.log(e);
          this.sonDao = {
            total: 0,
            list: []
          };
        });
      },
      // 获取账号可分配资源
      async allocMoreGet() {
        let res = await this.$fetch('allocMoreGet', {}).catch(res => {
           console.log('获取可分配资源异常', res)
          this.resourcesVo = null;
        })
        if (res && res.code === 200) {
          // res = {"msg":"操作成功！","code":200,"data":{"extend_end_time":"2022-03-03 23:59:59","end_time":"2022-03-03 23:59:59","type":0,"total":0,"extend_day": 0,"flow":"297.59"},"request_id":"35d779b0-808d-11eb-8860-937321402ac7"}
          this.resourcesVo = res.data;
          let userResult = await this.$fetch('getInfo', {scene_id: 2}).catch(error => {
            console.log('获取账户信息异常', error)
          });
          if (userResult && res.code === 200) {
            sessionOrLocal.set('userInfo', JSON.stringify(userResult.data));
            sessionOrLocal.set('userId', JSON.stringify(userResult.data.user_id));
            this.$EventBus.$emit('saas_vs_account_change', userResult.data);
            // user下的is_dynamic > 0 表示动态， 其它表示固定。
            this.tabType = userResult.data.is_dynamic > 0 ? 'trends' : 'regular';
            this.is_dynamic = userResult.data.is_dynamic;
            if(!(this.is_dynamic > 0)) {
              this.getSonList();
            }
          }
        }
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 保存单个子账户分配
      save(row) {
        let regA = Number(this.resourcesVo.type) === 1 ? /^\d+(\.\d{1,2})?$/ :  /^\d+$/; // 允许二位小数点输入
        console.log(regA);
        let flag = true;
        if (row === null || row === undefined || row === '') {
          this.$message({
            message: '请输入数量',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          flag = false;
        } else if (row.inputCount === null || row.inputCount === undefined) {
          flag = false;
        } else if (regA.test(row.inputCount)) {
          row.inputCount = Number(this.resourcesVo.type) === 1 ? parseFloat(row.inputCount) : parseInt(row.inputCount);
          flag = true;
        } else {
          flag = true;
        }
        // 右侧最大可分配数据
        let maxVla = this.resourcesVo.type > 0 ? this.resourcesVo.flow : this.resourcesVo.total;
        // 判断流量是否超出可分配流量
        let params = {
          type: Number(this.resourcesVo.type), // 分配类型 0-并发 1-流量,
          pid: sessionOrLocal.get('userId'),
          kv: [{
            user_id: row.child_id,
            resources: row.inputCount || 0,
            extend_day: row.inputExtendDay || 0
          }]
        };
        flag ? this.sendAllocSet(params, row) :  this.$message({
          message: '请输入数量',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      },
      saveMultiSetHandle(){
        this.$refs.multiAllocForm.validate((valid) => {
          if (valid) {
            let childIdList = this.multipleSelection.map(item => {
              let result = {
                user_id: item.child_id,
                resources: 0,
                extend_day: 0
              }
              if (this.dialogType === 1) {
                // 并发-分配并发包，设置resources， type为并发
                result.resources = Number(this.multiAllocForm.count1);
                result.extend_day = item.extend_day;
              } else if (this.dialogType === 2) {
                // 流量-批量分配，设置 resources， type为流量
                result.resources = Number(this.multiAllocForm.count);
                result.extend_day = item.extend_day;
              }  else if (this.dialogType === 3) {
                // 并发-分配扩展包，设置 extend_day， type为并发
                result.extend_day = Number(this.multiAllocForm.count1);
                result.resources = item.count;
              }
              console.log(result, '批量数据')
              return result;
            })
            let params = {
              type: Number(this.resourcesVo.type), // 分配类型 0-并发 1-流量,
              pid: sessionOrLocal.get('userId'),
              kv: childIdList
            };
            this.sendAllocSet(params);
          }
        });
      },
      closeAllocDialog() {
        this.multiAllocShow = false;
        this.$nextTick(() => {
          this.multiAllocForm.count = null;
          this.multiAllocForm.count1 = null;
          if (this.$refs['multiAllocForm']) {
            this.$refs['multiAllocForm'].resetFields();
          }
        })
      },
      // 如果有row表示单行，无表示批量
      sendAllocSet(params, row) {
        this.$fetch('allocSetVal', params, {
          'Content-Type': 'application/json'
        }).then(res=>{
          this.$message({
            message: '保存成功',
            showClose: true,
            // duration: 0,
            type: 'success',
            customClass: 'zdy-info-box'
          });
          if (row) {
            row.isHide = true;
          }
          this.closeAllocDialog();
          this.allocMoreGet();
          // 保存完成后，更新数据
          this.getSonList();
        }).catch(res =>{
          console.log(res);
          this.$message({
            message: res.msg ||'保存失败',
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        });
      },
      // 取消按钮 => 编辑展示
      hideInput(row) {
        if(row.inputExtendDay) {
          row.inputExtendDay = `${row.extend_day}`;
        }
        if(row.inputCount) {
          row.inputCount = `${row.count}`;
        }
        row.isHide = false;
      },
      // 编辑按钮 => 保存 和 取消展示
      showInput(row) {
        row.isHide = true;
      }
    },
    created() {
      this.allocMoreGet();
    }
  };
</script>

<style lang="less" scoped>
  .ac__allocation__panel {
    .flex-display();
    .justify(space-between);
    .align(flex-start);
  }
  .regular-ctx {
    padding-top: 225px;
    text-align: center;
    p {
      margin-bottom: 32px;
      font-size: 16px;
      font-weight: 400;
      color: #666666;
      line-height: 24px;
    }
    &.regular-list {
      padding: 24px 24px 40px 24px;
      /deep/.el-table td, /deep/.el-table th {
        padding: 9px 0;
      }
      /deep/.btn-relative {
        position: relative;
        width: 125px;
      }
      /deep/.el-table .cell {
        line-height: 36px;
      }
      .btn-rows {
        /deep/.el-button {
          margin-left:16px;
          font-size: 14px;
          &:first-child {
            margin-left: 0;
          }
        }
      }
    }
    /deep/.btn-relative .el-input__inner {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      padding: 0 40px 0 12px!important;
    }
  }
  .pageBox {
    margin-top: 40px;
  }
  .trends-ctx {
    padding-top: 225px;
    text-align: center;
    p {
      margin-bottom: 32px;
      font-size: 16px;
      font-weight: 400;
      color: #666666;
      line-height: 24px;
    }
    &.trends-list {
      padding: 24px 32px;
    }
  }
  .ac__allocation__panel--right {
    width: 248px;
    min-height: 437px;
    background: #FFFFFF;
    border-radius: 4px;
    padding: 24px 24px;
  }
  .ac__allocation--user {
    .title {
      font-size: 16px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #1A1A1A;
      line-height: 22px;
    }
    p {
      text-align: center;
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #999999;
      line-height: 20px;
    }
    .allocation_icon {
      text-align: center;
      margin-top: 32px;
      height: 62px;
      i.iconfont-v3 {
        font-size: 62px;
      }
      img {
        width: 62px;
        height: 62px;
      }
    }
    .allocation_one {
      margin-top: 24px;
      li {
        text-align: center;
        list-style-type: none;
        font-family: @fontRegular;
        font-size: 14px;
        font-weight: 400;
        color: #1A1A1A;
        line-height: 20px;
        &:first-child {
          font-size: 32px;
          font-weight: bold;
          color: #1A1A1A;
          line-height: 24px;
          padding-bottom: 8px;
        }
        &:last-child {
          margin-top: 4px;
          font-size: 14px;
          font-weight: 400;
          color: #999999;
          line-height: 20px;
        }
      }
      &.mt32 {
        margin-top: 32px;
      }
    }
    .result_val {
      font-size: 36px;
      font-family: @fontDINAL;
      font-weight: bold;
      color: #1A1A1A;
      line-height: 42px;
      margin-top: 24px;
    }
    .date {
      margin-top: 10px;
    }
  }
  .ac__allocation--info {
    border-top: 1px solid #E6E6E6;
    margin-top: 32px;
    padding-top: 16px;
    li {
      font-size: 12px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #999999;
      line-height: 17px;
      span {
        display: inline-block;
        vertical-align: top;
        width: 16px;
        &:last-child {
          width: calc(100% - 20px);
        }
      }
    }
  }
  .ac__allocation__panel--left {
    width: calc(100% - 272px);
    min-height: 612px;
    height: auto;
    background: #FFFFFF;
    position: relative;
    border-radius: 4px;
    .el-button {
      margin-top: 3px;
    }
  }
  .panel-btn {
    position: absolute;
    right: 32px;
    top: 6px;
    &.btn-right {
      margin-right: 132px;
    }
  }
  /* 选项卡 */
  /deep/.el-tabs__header {
    margin: 0 0;
  }
  /deep/.el-tabs__item {
    padding: 0 24px;
    box-sizing: border-box;
    display: inline-block;
    list-style: none;
    position: relative;
    font-size: 16px;
    font-family: @fontRegular;
    font-weight: 400;
    color: #666666;
    line-height: 55px;
    height: 55px;
    &.is-active {
      color: #FB3A32;
    }
  }
  /deep/.el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2),
  /deep/.el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
  /deep/.el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
  /deep/.el-tabs--top .el-tabs__item.is-top:nth-child(2) {
    padding-left: 24px;
  }
  /deep/.el-tabs__nav-wrap::after {
    height: 1px;
    color: #E6E6E6;
  }
  /* 内嵌按钮重试 */
  /deep/.btn-relative {
    position: relative;
    .el-input__inner {
      padding: 0 36px 0 12px;
    }
  }
  /deep/.el-input-group__append {
    position: absolute;
    right: 10px;
    top: 7px;
    width: 20px!important;
    background-color: transparent;
    border: 0;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    color: #1A1A1A;
  }
  .dialog__group{
    /deep/.el-input__inner{
      border-radius: 4px;
    }
    /deep/.el-form-item {
      margin-bottom: 0;
    }
  }
  .el-table__row {
    /deep/.el-input-group {
      width: 130px;
    }
  }
</style>
