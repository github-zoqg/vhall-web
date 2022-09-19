<template>
  <div>
    <pageTitle pageTitle="用量分配"></pageTitle>
    <div class="ac__allocation__panel">
      <!-- 左侧 -->
      <div class="ac__allocation__panel--left">
        <el-tabs v-model="tabType" @tab-click="handleClick">
          <el-tab-pane :label="item.label" :name="item.value" v-for="(item, ins) in tabList" :key="ins"></el-tab-pane>
        </el-tabs>
        <vh-select v-if="tabType == 'regular'" v-model="clickType" round size="medium" placeholder="批量分配" :disabled="!multipleSelection.length" class="panel-select-btn" @change="multiSetHandle">
          <vh-option
            v-for="item in clickOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </vh-option>
        </vh-select>
        <!-- 固定分配，有查询列表。 -->
        <div v-if="tabType === 'regular'" :class="['regular-ctx', {'regular-list': !(is_dynamic > 0)}]">
          <p v-if="is_dynamic > 0">每个子账号可单独分配用量，<br/>所有用量之和不能大于可分配用量</p>
          <vh-button type="primary" class="length152" round v-preventReClick @click="allocationSave('regular')" v-if="is_dynamic > 0">保存</vh-button>
          <!-- 当前数据库中已经是固定分配 -->
          <vh-table
            ref="multipleTable"
            :data="dataList"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            :header-cell-style="{background:'#f7f7f7',color:'#666',height:'56px'}"
            v-if="!(is_dynamic > 0) && dataList.length > 0">
            <vh-table-column
              type="selection"
              width="55">
            </vh-table-column>
            <vh-table-column
              label="帐号 / 昵称"
              align="left"
              show-overflow-tooltip
              min-width="230"
            >
              <template slot-scope="scope">
                {{scope.row.child_id}} / {{ scope.row.nick_name }}
              </template>
            </vh-table-column>
            <vh-table-column
              label="手机号"
              width="160"
              align="left"
              show-overflow-tooltip>
              <template slot-scope="scope">
                {{scope.row.phone || '----'}}
              </template>
            </vh-table-column>
            <vh-table-column
              label="分配流量" v-if="resourcesVo && resourcesVo.type === 1"
              align="left"
              width="230">
              <template slot-scope="scope">
                <VhallInput v-model.trim="scope.row.inputCount"  :maxlength="11" v-if="scope.row.isHide" class="btn-relative" autocomplete="off"  @input="formatGBInputs($event, scope.row, 'inputCount')">
                  <template slot="append">GB</template>
                </VhallInput>
                <span v-else>{{scope.row.count | unitCovert}} GB</span>
              </template>
            </vh-table-column>
            <vh-table-column
              label="分配并发" v-if="resourcesVo && resourcesVo.type === 0"
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
            </vh-table-column>
            <vh-table-column
              label="分配时长" v-if="resourcesVo && resourcesVo.type === 2"
              align="left"
              width="230">
              <template slot-scope="scope">
               <!--  <el-input type="text" maxlength="5" v-model.trim="scope.row.inputCount" v-if="scope.row.isHide" class="btn-relative" oninput="this.value=this.value.replace(/[^\d]+/g, '')">
                  <template slot="append"> 方</template>
                </el-input> -->
                <VhallInput v-model.trim="scope.row.inputCount" :maxlength="8" v-if="scope.row.isHide" class="btn-relative" autocomplete="off"  @input="formatBFInputs($event, scope.row, 'inputCount')">
                  <template slot="append">分钟</template>
                </VhallInput>
                <span v-else>{{scope.row.count | unitCovert}} 分钟</span>
              </template>
            </vh-table-column>
            <vh-table-column
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
            </vh-table-column>
            <vh-table-column
              label="分配短信"
              align="left"
              width="230">
              <template slot-scope="scope">
                <VhallInput v-model.trim="scope.row.inputSms"  :maxlength="11" v-if="scope.row.isHide" class="btn-relative" autocomplete="off"  @input="formatBFInputs($event, scope.row, 'inputSms')">
                  <template slot="append">条</template>
                </VhallInput>
                <span v-else>{{scope.row.sms | unitCovert}} 条</span>
              </template>
            </vh-table-column>
            <vh-table-column
              label="操作"
              align="left"
              class="btn-rows"
              fixed="right"
              width="114">
              <template slot-scope="scope">
                <vh-button borderRadius="4" type="text" round @click="save(scope.row)" v-if="scope.row.isHide" size="mini" class="zdy-theme-red">保存</vh-button>
                <el-button type="text" @click="showInput(scope.row)" v-if="!scope.row.isHide">编辑</el-button>
                <vh-button borderRadius="4" type="text" plain  @click="hideInput(scope.row)" v-if="scope.row.isHide" size="mini" class="zdy-theme-gray">取消</vh-button>
              </template>
            </vh-table-column>
          </vh-table>
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
          <p>所有子账号共用所有可用的并发/流量/时长资源，以及短信资源，<br />无需为单个账户分配</p>
          <vh-button type="primary" class="length152" round v-preventReClick @click="allocationSave('trends')" v-if="!(is_dynamic > 0)">保存</vh-button>
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
            <li class="custom-font-barlow">{{typeNumber}}</li>
            <li >可分配{{typeName}}</li>
            <li>有效期至 {{resourcesVo && resourcesVo.end_time ? resourcesVo.end_time : '--'}}</li>
          </ul>
          <!-- <ul class="allocation_one" v-if="resourcesVo && resourcesVo.type === 0">
            <li class="custom-font-barlow">{{ (resourcesVo ? resourcesVo.total : 0) | unitCovert }}  </li>
            <li >可分配并发（方）</li>
            <li>有效期至 {{resourcesVo && resourcesVo.end_time ? resourcesVo.end_time : '--'}}</li>
          </ul>
          <ul class="allocation_one" v-if="resourcesVo && resourcesVo.type === 1">

            <li class="custom-font-barlow">{{ (resourcesVo ? resourcesVo.flow : 0) | unitCovert }}  </li>
            <li>可分配流量（GB）</li>
            <li>有效期至 {{resourcesVo && resourcesVo.end_time ? resourcesVo.end_time : '--'}}</li>
          </ul>
          <ul class="allocation_one" v-if="resourcesVo && resourcesVo.type === 2">
            <li class="custom-font-barlow">{{ (resourcesVo ? resourcesVo.duration : 0) | unitCovert }}  </li>
            <li>可分配时长（分钟）</li>
            <li>有效期至 {{resourcesVo && resourcesVo.end_time ? resourcesVo.end_time : '--'}}</li>
          </ul> -->
          <ul class="allocation_one mt32" v-if="resourcesVo && resourcesVo.extend_end_time != ''">
            <li class="custom-font-barlow">{{ (resourcesVo && resourcesVo.extend_day ? resourcesVo.extend_day : 0)  | unitCovert}} </li>
            <li>可分配并发扩展包（天）</li>
            <li>有效期至 {{resourcesVo && resourcesVo.extend_end_time ? resourcesVo.extend_end_time : '--'}}</li>
          </ul>
        </div>
        <ul class="ac__allocation--msg" v-if="showSmsModule">
          <div class="allocation_icon">
            <img src="../../common/images/account/saasliuliang_tubiao.png" alt="" v-show="tabType === 'trends'"/>
            <img src="../../common/images/account/saasbingfa_tubiao.png" alt="" v-show="tabType === 'regular'"/>
            <!-- <i :class="`${resourcesVo && resourcesVo.type > 0 ? 'iconfont-v3 saasliuliang_tubiao' : 'iconfont-v3 saasbingfa_tubiao'}`"></i> -->
          </div>
          <ul class="allocation_one">
            <li class="custom-font-barlow">{{resourcesVo && resourcesVo.sms ? resourcesVo.sms || 0 : 0}}</li>
            <li >可分配短信（条）</li>
            <li>有效期至 {{resourcesVo && resourcesVo.end_time ? resourcesVo.end_time : '--'}}</li>
          </ul>
        </ul>
        <ul class="ac__allocation--info">
          <li>提示：</li>
          <li><span>1.</span><span>动态分配方式：所有子账户共用所有可用的并发、流量、时长及短信，无需为单个账户分配</span></li>
          <li><span>2.</span><span>固定分配方式：请为每个子账号分配用量，所有账号用量之和不能大于可分配用量</span></li>
        </ul>
      </div>
    </div>
    <!-- 批量分配-弹出框 -->
    <vh-dialog title="批量分配" :visible.sync="multiAllocShow" class="dialog__group" width="380px" v-if="multiAllocShow" @close="closeAllocDialog"  close-on-click-modal="false"
    close-on-press-escape="false">
      <vh-form :model="multiAllocForm" ref="multiAllocForm" :rules="multiAllocFormRules" label-width="80px">
         <vh-form-item label="分配流量" prop="count" v-if="dialogType === 2">
          <VhallInput v-model.trim="multiAllocForm.count"  :maxlength="11" class="btn-relative" autocomplete="off" placeholder="请输入分配数量" @input="formatGBInputs($event, 'multiAllocForm', 'count')">
            <template slot="append">GB</template>
          </VhallInput>
         </vh-form-item>
         <vh-form-item :label="`分配${dialogType === 1 ? '并发包':'扩展包'}`" prop="count1" v-if="[1,3].includes(dialogType)">
          <VhallInput v-model.trim="multiAllocForm.count1" :maxlength="8" class="btn-relative" autocomplete="off" placeholder="请输入分配数量" @input="formatBFInputs($event, 'multiAllocForm', 'count1')">
            <template slot="append">方</template>
          </VhallInput>
         </vh-form-item>
         <vh-form-item label="分配时长" prop="count2" v-if="dialogType === 4">
          <VhallInput v-model.trim="multiAllocForm.count2"  :maxlength="11" class="btn-relative" autocomplete="off" placeholder="请输入分配数量" @input="formatTimeInputs($event, 'multiAllocForm', 'count2')">
            <template slot="append">分钟</template>
          </VhallInput>
         </vh-form-item>
         <vh-form-item label="分配短信" prop="count2" v-if="dialogType === 19">
          <VhallInput v-model.trim="multiAllocForm.count2"  :maxlength="11" class="btn-relative top2" autocomplete="off" placeholder="请输入分配数量" @input="formatTimeInputs($event, 'multiAllocForm', 'count2')">
            <template slot="append">条</template>
          </VhallInput>
         </vh-form-item>
      </vh-form>
      <div slot="footer" class="dialog-footer">
        <vh-button type="primary"  size="medium" round @click="saveMultiSetHandle" borderRadius="50">确定</vh-button>
        <vh-button @click="closeAllocDialog"  size="medium" round plain borderRadius="50">取消</vh-button>
      </div>
    </vh-dialog>
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
    computed:{
      showSmsModule: function () {
        const userInfo = JSON.parse(sessionOrLocal.get('userInfo'));
        const isNoticeMessage = JSON.parse(sessionOrLocal.get('SAAS_VS_PES', 'localStorage'))['message_notice'];
        // 不是知学云账号 & 开启了 短信通知配置项权限
        return userInfo.user_extends.extends_remark != 1 && isNoticeMessage == 1;
      },
      // 批量分配可操作按钮（只有固定分配才有按钮）
      clickOptions: function () {
        let list = []
        // 套餐包
        if (!(this.is_dynamic > 0) && this.dataList.length > 0 && this.tabType=='regular') {
          if(this.resourcesVo && Number(this.resourcesVo.type) === 1) {
            list.push({
              value: '2',
              label: '分配流量'
            })
          } else if (this.resourcesVo && Number(this.resourcesVo.type) === 2) {
            list.push({
              value: '4',
              label: '分配时长'
            })
          } else if (this.resourcesVo && Number(this.resourcesVo.type) === 0) {
            list.push({
              value: '1',
              label: '分配并发包'
            })
          }
        }
        // 并发扩展包
        if (!(this.is_dynamic > 0) && this.dataList.length > 0 && this.tabType=='regular' && this.resourcesVo && this.resourcesVo.extend_end_time != '') {
          // 有分配扩展包
          list.push({
            value: '3',
            label: '分配扩展包'
          })
        }
        // 流量包
        if (this.showSmsModule) {
          list.push({
            value: '19',
            label: '分配短信'
          })
        }
        return list
      }
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
          count1: null,
          count2: null
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
          ],
          count2: [
            { required: true, message: '请输入分配数量', trigger: 'blur' },
           /*  { pattern: /^\d{0,8}$/, message: '请输入正整数' , trigger: 'blur'} */
          ],

        },
        sonDao: {},
        multipleSelection: [],
        query: {
          pos: 0,
          limit: 10,
          pageNumber: 1
        },
        typeNumber: '',
        typeName: '',
        clickType: null
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
      formatTimeInputs(value, row, key) {
        if(value && key === 'count2') {
          this[row][key] = this[row][key].replace(/[^\d]+/g, '')
          row = this[row];
        } else {
          return
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
      // 按钮切换的时候，选择
      multiSetHandle() {
        // 按钮限制，若没有选中信息，不可展示
        if (this.multipleSelection && this.multipleSelection.length > 0) {
          this.dialogType = Number(this.clickType);
          this.multiAllocShow = true;
        } else {
          this.multiAllocShow = false;
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
           this.$vhall_paas_port({
            k: type === 'regular' ? 100817 : 100818,
            data: {business_uid: this.$parent.userId, user_id: '', webinar_id: '', refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
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
          this.allocMoreGet();

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
            if(Number(this.resourcesVo.type) == 1) {
              if (item.is_dynamic > 0 ) {
                // 流量动态
                item.count = 0;
                item.inputCount = '';
              } else {
                // 流量（XXXGB）
                item.inputCount = item.vip_info.flow;
                item.count = item.vip_info.flow;
              }
            } else if(Number(this.resourcesVo.type) == 0){
              if (item.is_dynamic > 0 ) {
                // 流量动态
                item.count = 0;
                item.inputCount = '';
              } else {
                // 并发（XXX方）
                item.inputCount = item.vip_info.total;
                item.count = item.vip_info.total;
              }
            } else if(Number(this.resourcesVo.type) == 2){
              item.count = item.vip_info.duration;
              item.inputCount = item.vip_info.duration;
            }
            item.extend_day = item.vip_info.extend_day;
            item.inputExtendDay = item.vip_info.extend_day;
            // 短信用量
            item.sms = item.vip_info.sms || 0;
            item.inputSms = item.vip_info.sms || 0;
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
          if(res.data && res.data.type === 0){
            this.typeName = '并发（方）';
            this.typeNumber = res.data.total
          }else if(res.data && res.data.type === 1){
            this.typeName = '流量（GB）';
            this.typeNumber = res.data.flow
          }else if(res.data && res.data.type === 2){
            this.typeName = '时长（分钟）';
            this.typeNumber = res.data.duration
          }else {
            this.typeNumber = res.data.duration
          }
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
        // 验证——套餐数据（非扩展包）
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
        let paramsKv = {
          user_id: row.child_id,
          resources: row.inputCount || 0,
          extend_day: row.inputExtendDay || 0
        }
        if (this.showSmsModule) {
          // 增加短信设置
          paramsKv.sms = Number(row.inputSms) || 0
        }
        let params = {
          type: Number(this.resourcesVo.type), // 分配类型 0-并发 1-流量 2-时长
          pid: sessionOrLocal.get('userId'),
          kv: [paramsKv],
          scene: 1 // 1 全部修改；2 只修改短信；3 修改套餐or扩展包。
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
                user_id: item.child_id
              }
              console.log(this.multiAllocForm, 'this.multiAllocForm')
              if (this.dialogType === 1) {
                // 并发-分配并发包，设置resources， type为并发
                result.resources = Number(this.multiAllocForm.count1);
                result.extend_day = item.extend_day;
              } else if (this.dialogType === 2) {
                // 流量-批量分配，设置 resources， type为流量
                result.resources = Number(this.multiAllocForm.count);
                result.extend_day = item.extend_day;
              } else if (this.dialogType === 3) {
                // 并发-分配扩展包，设置 extend_day， type为并发
                result.extend_day = Number(this.multiAllocForm.count1);
                result.resources = item.count;
              } else if (this.dialogType === 4) {
                // 并发-分配时长，设置 extend_day， type为时长
                result.extend_day = item.extend_day;
                result.resources = Number(this.multiAllocForm.count2);
              }
              if (this.showSmsModule && this.dialogType === 19) {
                // 短信分配，设置cms，增量
                result.sms = Number(this.multiAllocForm.count2);
                result.resources = 0;
                result.extend_day = 0; // 如果是短信分配，批量，其它字段传递0
              } else {
                result.sms = 0; // 如果是其它分配，短信字段值传0
              }
              console.log(result, '批量数据')
              return result;
            })
            this.multiAllocForm.count2 = null;
            let params = {
              type: Number(this.resourcesVo.type), // 分配类型 0-并发 1-流量,
              pid: sessionOrLocal.get('userId'),
              kv: childIdList,
              scene: this.showSmsModule && this.dialogType === 19 ? 2 : 3
            };
            this.sendAllocSet(params);
          }
        });
      },
      closeAllocDialog() {
        this.multiAllocShow = false;
        // 设置完成，按钮归位
        this.clickType = null
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
        if(row.inputSms) {
          row.inputSms = `${row.sms}`;
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
  .ac__allocation--msg {
    border-top: 1px solid #E6E6E6;
    margin-top: 32px;
    padding-top: 16px;
    .allocation_icon {
      text-align: center;
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
  /* 下拉切换 */
  /deep/.vh-select.panel-select-btn {
    position: absolute;
    right: 32px;
    top: 9px;
    width: 116px;
    .vh-select__caret {
      color: #bfbfbf;
    }
    &:hover, &:hover .vh-input.is-focus {
      .vh-input__inner {
        border-color: #FB2626;
      }
      .vh-select__caret {
        color: #FB2626;
      }
      .vh-input__inner::-webkit-input-placeholder {
        color: #FB2626;
      }
      .vh-input__inner::-moz-placeholder {
        color: #FB2626;
      }
      .vh-input__inner:-ms-input-placeholder {
        color: #FB2626;
      }
      .vh-input__inner::-ms-input-placeholder {
        color: #FB2626;
      }
      .vh-input__inner::placeholder {
        color: #FB2626;
      }
    }
    .vh-input.is-disabled {
      .vh-input__inner {
        border-color: #d9d9d9;
        background-color: transparent;
      }
      .vh-select__caret {
        color: #bfbfbf;
      }
      .vh-input__inner::-webkit-input-placeholder {
        color: #bfbfbf;
      }
      .vh-input__inner::-moz-placeholder {
        color: #bfbfbf;
      }
      .vh-input__inner:-ms-input-placeholder {
        color: #bfbfbf;
      }
      .vh-input__inner::-ms-input-placeholder {
        color: #bfbfbf;
      }
      .vh-input__inner::placeholder {
        color: #bfbfbf;
      }
    }
    /* 切换要选择的时候 */
    .vh-input.is-focus {
      .vh-input__inner {
        border-color: #d9d9d9;
      }
      .vh-select__caret {
        color: #595959;
      }
      .vh-input__inner::-webkit-input-placeholder {
        color: rgba(0, 0, 0, 0.85);
      }
      .vh-input__inner::-moz-placeholder {
        color: rgba(0, 0, 0, 0.85);
      }
      .vh-input__inner:-ms-input-placeholder {
        color: rgba(0, 0, 0, 0.85);
      }
      .vh-input__inner::-ms-input-placeholder {
        color: rgba(0, 0, 0, 0.85);
      }
      .vh-input__inner::placeholder {
        color: rgba(0, 0, 0, 0.85);
      }
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
    &.top2 {
      .el-input-group__append {
        top: 7px;
      }
    }
  }
  /deep/.el-input-group__append {
    position: absolute;
    right: 10px;
    top: 9px;
    width: 20px!important;
    background-color: transparent;
    border: 0;
    border-bottom-right-radius: 4px;
    border-top-right-radius: 4px;
    color: #1A1A1A;
  }
  .dialog__group{
    /deep/.vh-dialog__body {
      padding: 0 32px;
    }
    /deep/.el-input__inner{
      border-radius: 4px;
    }
    /deep/.el-form-item {
      margin-bottom: 0;
    }
    /deep/.vh-select-dropdown__item {
      &.hover {
        background-color: #d9d9d9;
        font-style: normal;
        font-weight: 400;
        font-size: 14px;
        line-height: 36px;
        color: rgba(0, 0, 0, 0.85);
        &:active {
          background-color: #f0f0f0;
        }
      }
      &:active {
        background-color: #f0f0f0;
      }
    }
    /deep/.vh-form-item__label {
      font-style: normal;
      font-weight: 400;
      font-size: 14px;
      text-align: right;
      color: rgba(0, 0, 0, 0.65);
    }
    /deep/.vh-button+.vh-button {
      margin-left: 12px;
    }
  }
  .el-table__row {
    /deep/.el-input-group {
      width: 130px;
    }
  }
  /deep/.vh-button--text.zdy-theme-red {
    color: #FB2626;
    &:hover {
      color: #D4151C;
    }
  }
  /deep/.vh-button--text.zdy-theme-gray {
    color: rgba(0, 0, 0, 0.65);
    &:hover {
      color: rgba(0, 0, 0, 0.85);
    }
  }
</style>
