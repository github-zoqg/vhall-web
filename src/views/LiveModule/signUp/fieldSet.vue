<template>
  <div class="fieldSetBox">
    <!-- v-model="list" -->
    <!-- 表单名称、表单简介与表单头图为固定字段 -->
    <section class="viewItem">
      <p class="label">表单名称</p>
      <VhallInput
        maxlength="50"
        show-word-limit
        placeholder="请输入表单标题"
        v-model="title"
        @change="baseInfoChange('title')"
      ></VhallInput>
      <div class="disable_wrap" v-show="!signUpSwtich"></div>
    </section>
    <section class="viewItem">
      <p class="label">表单简介</p>
      <VhallInput
        :maxlength="500"
        autocomplete="off"
        v-model="intro"
        show-word-limit
        placeholder="请输入表单简介"
        type="textarea"
        :autosize="{ minRows: 5 }"
        resize=none
        @change="baseInfoChange('intro')"
        class="intro-input"
      ></VhallInput>
      <div class="disable_wrap" v-show="!signUpSwtich"></div>
    </section>
    <section class="viewItem">
      <p class="label">表单头图</p>
      <upload
        id="form_cropper"
        :domain_url="domain_url"
        v-model="imageUrl"
        :on-success="productLoadSuccess"
        :before-upload="beforeUploadHandler"
        :restPic="true"
        :widthImg="'100%'"
        :heightImg="120"
        @delete="deleteBanner"
      >
        <div slot="tip">
          <p>建议尺寸：750*125px，小于2M</p>
          <p>支持jpg、gif、png、bmp</p>
        </div>
      </upload>
      <span class="header-img-tip">建议尺寸：750*125 px，小于2MB（支持格式jpg、png、gif、bmp）</span>
      <div class="disable_wrap" v-show="!signUpSwtich"></div>
      <div class="form_images" v-if="imageUrl">
        <div class="form_images_item">
          <span>模糊程度</span>
          <vh-slider class="form-slider" v-model="blurryDegree" :max="10" style="width:540px"></vh-slider>
          <span class="vague_num">{{blurryDegree}}</span>
        </div>
        <div class="form_images_item">
          <span>背景亮度</span>
          <vh-slider class="form-slider" v-model="lightDegree" :max="20" style="width:540px"></vh-slider>
          <span class="vague_num">{{lightDegree}}</span>
        </div>
      </div>
    </section>
    <!-- 表单名称、表单简介与表单头图为固定字段 -->
    <draggable
      class="list-group"
      tag="ul"
      handle=".moveBtn"
      v-bind="dragOptions"
      v-model="renderQuestion"
      @change="sortChange"
      @start="drag = true"
      @end="drag = false"
      :move="onMove"
    >
      <!-- 加上v-model即可排序后实时更新数据 -->
      <transition-group type="transition" :name="!drag ? 'flip-list' : null" >
        <li
          :ref="item.question_id"
          :class="['viewItem', signUpSwtich ? 'viewItemHover' : '', item.privacy ? 'privacyItem' : '']"
          v-for="(item, index) in renderQuestion"
          :key="item.question_id"
        >
          <p class="label">
            {{ index | numFormmat }}.
            <!-- {{item.required ? '（必填）' : ''}} -->
            <template v-if="!item.labelEditable">
              {{item.label}}
            </template>
            <VhallInput
              v-else
              :maxlength="60"
              autocomplete="off"
              show-word-limit
              placeholder="请输入题目"
              v-model="item.label"
              class="radioInput titleInput"
              @change="subjectChange(item)"
            ></VhallInput>
          </p>
          <template v-for="(node, nodeIndex) in item.nodes">

            <!-- 输入框类型 || 设置表单时下拉框类型 -->
            {{node.other ? "其他" : ''}}
            <template
              v-if="item.type=='input' || item.type=='select'"
            >
              <VhallInput
                :disabled="item.disabledEdit"
                v-model="node.value"
                v-bind="node.props"
                show-word-limit
                autocomplete="off"
                :type="node.key == 'url'? 'textarea' : 'text'"
                :autosize="node.key == 'url' ? { minRows: 2 } : ''"
                :maxlength="node.key == 'url'? '200' : item.privacy ? '100' : '60'"
                :key='`${index}-${nodeIndex}`'
                @change="selectOptChange(item, node, item.type=='select', item.privacy)"
              >
                <i
                  class="el-icon-remove-outline removeIcon"
                  slot="suffix"
                  v-if="!!node.canRemove"
                  @click="deleteOptions(item, nodeIndex, item.privacy ? 'privacy' : 'select')"
                  v-show="item.privacy || item.nodes.length != 2"
                ></i>
                <i
                  class="el-icon-circle-plus-outline removeIcon"
                  slot="suffix"
                  v-if="!!node.privacyAdd && item.nodes.length < 4"
                  @click="privacyAdd(item.nodes, item)"
                ></i>
              </VhallInput>
              <!-- 区域级别下拉开启状态控制 -->
              <el-switch
                v-model="regionalLevel[node.index]"
                @change="regionalLevelChange(node.index, item)"
                v-if="item.reqType == 5 && node.index != 0"
                class="regionalBtn"
                :key="`statusctrl${index}-${nodeIndex}`"
              ></el-switch>
            </template>
            <!-- 单选类型 -->
            <el-radio-group
              v-model="item.value"
              v-bind="node.props"
              v-else-if="item.type=='radio'"
              :key='`${index}-${nodeIndex}`'
            >
              <el-radio
                disabled
                :name="item.id"
                v-for="(radioItem, raionIndex) in node.children"
                :key="`${index}-${nodeIndex}-${raionIndex}`"
                :label="radioItem.item_id"
              >
                <VhallInput
                  :disabled="item.reqType == 0 && item.default_type == 4"
                  @change="(chooseOptChange(item, radioItem))"
                  :maxlength="60"
                  autocomplete="off"
                  show-word-limit
                  placeholder="选项"
                  v-model="radioItem.value"
                  class="radioInput"
                  :class="{'radioGender': item.reqType == 0 && item.default_type == 4}"
                >
                  <i
                    v-show="item.nodes[0].children.length != 2"
                    class="el-icon-remove-outline removeIcon"
                    slot="suffix"
                    @click="deleteOptions(item, raionIndex, 'option')"
                  ></i>
                </VhallInput>
                <br/>
                <VhallInput
                  class="other-input"
                  placeholder="观众输入区"
                  disabled
                  v-if="radioItem.other"
                  :maxlength="60"
                  autocomplete="off"
                  show-word-limit
                  :key='`${index}-${nodeIndex}disabled`'
                ></VhallInput>
              </el-radio>
            </el-radio-group>
            <!-- 复选框类型 -->
            <el-checkbox-group
              v-model="item.value"
              v-bind="node.props"
              v-else-if="item.type=='checkBox'"
              :key='`${index}-${nodeIndex}`'
            >
              <el-checkbox
                disabled
                v-for="(radioItem, raionIndex) in node.children"
                :key="`${index}-${nodeIndex}-${raionIndex}`"
                :label="radioItem.item_id"
                :name="item.id"
                :class="{'other-checkbox': radioItem.other}"
              >
                <VhallInput
                  :maxlength="60"
                  autocomplete="off"
                  show-word-limit
                  placeholder="选项"
                  v-model="radioItem.value"
                  class="radioInput"
                  @change="chooseOptChange(item, radioItem)"
                >
                  <i
                    v-show="item.nodes[0].children.length != 2"
                    class="el-icon-remove-outline removeIcon"
                    slot="suffix"
                    @click="deleteOptions(item, raionIndex, 'option')"
                  ></i>
                </VhallInput>
                <br/>
                <VhallInput
                  class="other-input"
                  placeholder="观众输入区"
                  disabled
                  v-if="radioItem.other"
                  :maxlength="60"
                  show-word-limit
                  :key='`${index}-${nodeIndex}disabled`'
                ></VhallInput>
              </el-checkbox>
            </el-checkbox-group>
          </template>
          <div class="previewPrivacy" v-if="item.privacy">
            <p>预览效果</p>
            <el-checkbox>
              <p><pre v-html="privacyFormatter(item.nodes)"></pre></p>
            </el-checkbox>
          </div>
          <!-- 底部按钮 -->
          <div class="bottomBtn" v-if="!!item.bottomBtn">
            <div
              :class="[
                'addBtn',
                (item.nodes[0].children && item.nodes[0].children.length >= 30) || item.nodes.length >= 30 ? 'isoverflow' : ''
              ]">
              <el-button
                type="text"
                v-if="item.bottomBtn.includes('addBtn')"
                v-preventReOneClick
                @click="addOption(item)"
              ><i class="el-icon-plus"></i>添加选项</el-button>
              <template v-if="item.bottomBtn.includes('addOther')">
                <span class="line"></span>
                <el-button
                  v-preventReOneClick
                  type="text"
                  @click="addOption(item, 'other')"
                ><i class="el-icon-plus"></i>添加其他</el-button>
              </template>
            </div>
            <p class="clear_both">
              <el-switch
                @change="phoneSwitchChange(item)"
                v-if="item.bottomBtn.includes('phoneValid')"
                class="swtich"
                :width='30'
                :height="16"
                v-model="item.phoneValide"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                inactive-text="短信验证">
              </el-switch>
            </p>
            <p class="clear_both" v-if="item.bottomBtn.includes('phoneValid')">
              <el-switch
                @change="abroadPhoneSwitchChange(item)"
                class="swtich"
                :width='30'
                :height="16"
                v-model="item.abroadPhoneValide"
                active-color="#FB3A32"
                inactive-color="#CECECE"
                inactive-text="支持国外手机号报名">
              </el-switch>
            </p>
            <p v-if="item.bottomBtn.includes('phoneValid')" class="font_set">注：国外手机号无法进行短信验证，请悉知</p>
            <el-switch
              @change="requiredSwitchChange(item)"
              v-if="item.bottomBtn.includes('requireSwtich')"
              class="swtich"
              :width='30'
              :height="16"
              v-model="item.required"
              active-color="#FB3A32"
              inactive-color="#CECECE"
              inactive-text="必填项">
            </el-switch>
            <div class="controlBtnBox">
              <el-tooltip class="item" effect="dark" content="删除" placement="top" v-tooltipMove>
                <i
                  class="iconfont-v3 saasicon-trash"
                  v-if="item.bottomBtn.includes('delete')"
                  @click="deleteQuestion(questionArr, index, item)"
                ></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="移动" placement="top" v-tooltipMove>
                <i
                  class="iconfont-v3 saasicon_move moveBtn"
                  v-if="item.bottomBtn.includes('move')"
                ></i>
              </el-tooltip>
            </div>
          </div>
          <!-- 底部按钮 -->
          <div class="disable_wrap" v-show="!signUpSwtich"></div>
        </li>
      </transition-group>
    </draggable>
    <section class="viewItem sureBtn" v-if="signUpPageType === 'webinar'">
      <el-button :disabled="!signUpSwtich" round type="primary" v-preventReClick @click="sureQuestionnaire">保存</el-button>
    </section>
    <!-- 裁剪图片弹窗 -->
    <cropper ref="formCropper" @cropComplete="cropComplete" @resetUpload="resetUpload" :ratio="750/125"></cropper>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import upload from '@/components/Upload/main';
import Env from "@/api/env";
import defaultHeader from './images/formHeader.png'
import {parseImgOssQueryString, cropperImage, getImageQuery} from "@/utils/utils";
import cropper from '@/components/Cropper/index'
export default {
  components:{
    draggable,
    upload,
    cropper
  },
  props: {
    questionArr: {
      type: Array,
      default: ()=> []
    },
    baseInfo: {
      type: Object,
    },
    signUpSwtich: {
      type: Boolean
    },
    regionalOptions: {
      type: Object,
    }
  },
  watch:{
    imageParamsUrl: {
      handler(newVal, oldVal) {
        if (newVal != oldVal) {
          this.$emit('setBaseInfo', { cover: this.imageParamsUrl });
        }
      }
    },
    regionalOptions: {
      handler(newVal){
        this.regionalLevel = { ...newVal }
      },
      deep: true,
      immediate: true
    },
    questionArr: {
      handler(newVal){
        this.renderQuestion = newVal;
      },
      deep: true,
      immediate: true
    },
    baseInfo: {
      handler(newVal){
        this.title = newVal.title;
        this.intro = newVal.intro;
        this.handlerImage(newVal);
      },
      deep: true,
      immediate: true
    }
  },
  data(){
    return {
      title: '', // 基本信息——表单名称
      intro: '', // 基本信息——表单简介
      drag: false,
      radio: 3,
      imageUrl: '',
      imageCropMode: 1,
      blurryDegree: 0,
      lightDegree: 10,
      defaultHeader: defaultHeader,
      renderQuestion: [],
      backgroundSize: {
        x: 0,
        y:0,
        width: 0,
        height: 0
      },
      regionalLevel: {
        1: true, // 市
        2: true // 区/县
      },
      signUpPageType: (window.location.href.indexOf('/live/signup/') != -1 || window.location.href.indexOf('/lives/entryform') != -1) ? 'webinar'
        : (window.location.href.indexOf('/special/viewer/') != -1 || window.location.href.indexOf('/special/entryform') != -1) ? 'subject'
        : '',
      webinarOrSubjectId:
        (window.location.href.indexOf('/live/signup/') != -1)
        ? this.$route.params.str :
        (
          (window.location.href.indexOf('/special/viewer/') != -1 || window.location.href.indexOf('/lives/entryform') != -1 || window.location.href.indexOf('/special/entryform') != -1)
          ? (this.$route.params.id || this.$route.params.str) : ''
        )
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost"
      };
    },
    imageParamsUrl() {
      return `${this.imageUrl}?x-oss-process=image/crop,x_${this.backgroundSize.x.toFixed()},y_${this.backgroundSize.y.toFixed()},w_${this.backgroundSize.width.toFixed()},h_${this.backgroundSize.height.toFixed()}${this.blurryDegree > 0 ? `,/blur,r_10,s_${this.blurryDegree * 2}` : ''},/bright,${(this.lightDegree - 10) * 5}&mode=${this.imageCropMode}`
    },
    domain_url() {
      if (this.imageUrl) {
        return `${Env.staticLinkVo.uploadBaseUrl}${this.imageParamsUrl}`;
      } else {
        return this.defaultHeader;
      }
    }
  },
  filters: {
    numFormmat(val){
      return val < 9 ? `0${ val + 1 }` : val + 1
    }
  },
  methods: {
    // 设置接口入参，是活动维度 还是 专题维度
    setParamsIdByRoute(params) {
      if (this.signUpPageType === 'webinar') {
        params.webinar_id = this.webinarOrSubjectId
      } else if (this.signUpPageType === 'subject') {
        params.subject_id = this.webinarOrSubjectId
      }
      return params
    },
    // 区域级别下拉菜单开启状态控制
    regionalLevelChange(level, question) {
      if (level == 1 && !this.regionalLevel[1]) {
        this.regionalLevel[2] = false;
      }
      if (level == 2 && this.regionalLevel[2]) {
        this.regionalLevel[1] = true;
      }
      question.options.show_city = this.regionalLevel[1] ? 1 : 0;
      question.options.show_district = this.regionalLevel[2] ? 1 : 0;
      this.subjectChange(question);
    },
    onMove({ relatedContext, draggedContext }) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      if (relatedElement.reqType === 0) {
        if (relatedElement.default_type === 1 || relatedElement.default_type === 2) {
          return false
        }
      } else if (relatedElement.reqType === 6) {
        return false
      } else {
        return true
      }
    },
    // 处理图片
    handlerImage(val) {
      if (!val.cover) {
        this.imageUrl = '';
        return;
      }
      let url = `https:${Env.staticLinkVo.uploadBaseUrl}${val.cover}`
      this.imageUrl = getImageQuery(val.cover);
      if (cropperImage(val.cover)) {
        let obj = parseImgOssQueryString(url);
        const { blur, crop } = obj;
        this.backgroundSize = {
          x: Number(crop.x),
          y: Number(crop.y),
          width: Number(crop.w),
          height: Number(crop.h)
        };
        this.blurryDegree = blur && Number(blur.s) / 2 || 0;
        this.lightDegree = obj.bright ? 10 + Number(obj.bright) / 5 : 10;
        this.imageCropMode = obj.mode;
      }
    },
    // 保存表单
    sureQuestionnaire() {
      if (this.signUpPageType === 'subject') {
        return
      }
      let userId = this.$parent.userId;
      console.log(this.renderQuestion)
      this.renderQuestion.filter(item => item.name !== 'name').map(item => {
        this.$vhall_paas_port({
          k: item.reporType,
          data: {business_uid: userId, user_id: '', webinar_id: this.webinarOrSubjectId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
        })
        if (item.reqType !== 6) {
          this.$vhall_paas_port({
            k: item.required ? item.reporType + 1 : item.reporType + 2,
            data: {business_uid: userId, user_id: '', webinar_id: this.webinarOrSubjectId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
        }
        if (item.reqType === 4) {
          this.$vhall_paas_port({
            k: item.reporType + 4,
            data: {business_uid: userId, user_id: '', webinar_id: this.webinarOrSubjectId, refer: '', s: '', report_extra: {num: item.nodes.length}, ref_url: '', req_url: ''}
          })
        } else if (item.reqType === 2 || item.reqType === 3) {
          let other = 0;
          let total = item.nodes[0].children.length;
          if (total > 0) {
            other = item.nodes[0].children.filter(items => items.other).length
          }
          this.$vhall_paas_port({
            k: item.reporType + 4,
            data: {business_uid: userId, user_id: '', webinar_id: this.webinarOrSubjectId, refer: '',  s: '', report_extra: {num: total - other}, ref_url: '', req_url: ''}
          })
          this.$vhall_paas_port({
            k: item.reporType + 5,
            data: {business_uid: userId, user_id: '', webinar_id: this.webinarOrSubjectId, refer: '', s: '', report_extra: {num: other}, ref_url: '', req_url: ''}
          })
        }
      })
      this.$message({
        message: `保存成功`,
        showClose: true,
        // duration: 0,
        type: 'success',
        customClass: 'zdy-info-box'
      });
    },
    // 添加一个题目选项
    addOption(data, other){
      if ((data.nodes[0].children && data.nodes[0].children.length >= 30) || data.nodes.length >= 30) {
        this.$message({
          message: `最多可添加30个选项`,
          showClose: true,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      let itemType = other ? 1: 0;
      let options = data.type != 'input' && data.type != 'select' ? data.nodes[0].children : data.nodes;
      let colneChild = JSON.parse(JSON.stringify(options[options.length - 1]));
      if(data.type == 'input'){
        if(other){
          itemType = 1;
          if(colneChild.props.class){
            !colneChild.props.class.includes('noFull') && colneChild.props.class.push('noFull');
          }else{
            colneChild.props.class = ['noFull'];
          }
        }else{
          colneChild.props.class && (colneChild.props.class = colneChild.props.class.filter(item=> item!='noFull'));
        }
      }
      colneChild.props && (colneChild.props.disabled = false);
      colneChild.other = !!other;
      colneChild.value = "";

      this.$fetch('regQOptionAdd', {
        question_id: data.question_id,
        item_type: itemType
      }).then(res => {
        options.push({
          ...colneChild,
          value: res.data.subject,
          item_id: res.data.id
        });
      }).catch(err => { console.log(err); });
    },
    // 题目属性改变（通用）
    questionEdit(options) {
      this.$fetch('regQEdit', options)
        .then(res => { console.log(res); })
        .catch(err => { console.log(err); });
    },
    // 选项编辑（通用）
    optionEdit(options) {
      this.$fetch('regQOptionUpdate', options)
        .then(res => console.log(res))
        .catch(err => console.log(err));
    },
    // 题目 title 改变
    subjectChange(question) {
      const params = {
        question_id: question.question_id,
        subject: question.label,
        is_must: question.required ? 1 : 0
      }
      question.options !== '' && (params.options = JSON.stringify(question.options))
      this.questionEdit(params);
    },
    // 下拉题目选项 subject 改变
    selectOptChange(question, node, isSelect, isPrivacy) {
      // 如果是更改的隐私声明的跳转链接需要验证链接格式
      if (node.key == 'url') {
        const reg = /http[s]{0,1}:\/\/([\w.]+\/?)\S*/
        if (!reg.test(node.value)) {
          this.$message({
            message: `请输入正确格式的跳转链接！`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
          node.value = ''
        }
      }
      // 只有 select 才可以更改
      if (isSelect) {
        const options = {
          item_id: node.item_id,
          subject: node.value,
          question_id: question.question_id
        };
        this.optionEdit(options);
      }
      // 如果改变的是隐私声明
      if (isPrivacy) {
        // 如果更改默认添加的隐私声明，调用更新题目接口
        if (!node.privacy_id) {
          const options = {
            question_id: question.question_id,
            subject: question.label,
            is_must: question.required ? 1 : 0,
            options: JSON.stringify({
              content: question.nodes[0].value,
              color_text: question.nodes[1].value,
              url: question.nodes[2].value,
            })
          };
          this.questionEdit(options);
        } else {
          // 如果更改自定义添加的隐私声明，调用更新隐私协议的接口
          let options = {
            ...this.setParamsIdByRoute({}), // 活动ID 或者 专题ID
            privacy_id: node.privacy_id,
            content: question.nodes[0].value,
            color_text: question.nodes[3].value,
            url: question.nodes[4].value,
          };
          // 更改隐私协议
          this.$fetch('regRrivacyUpdate', options)
            .then(res => console.log(res))
            .catch(err => consoel.log(err));
        }
      }
    },
    // 单选\多选题目选项 subject 改变
    chooseOptChange(item, radioItem) {
      const options = {
        item_id: radioItem.item_id,
        subject: radioItem.value,
        question_id: item.question_id
      };
      this.optionEdit(options);
    },
    // 删除一个题目
    deleteQuestion(arr, index, item) {
      console.log(arr, index, item)
      this.$confirm('删除后已收集信息会被清空，确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        customClass: 'zdy-message-box',
        lockScroll: false,
        cancelButtonClass: 'zdy-confirm-cancel'
      }).then(() => {
        this.$fetch('regQDelete', {
          question_id: arr[index].question_id
        }).then(res => {
          let userId = this.$parent.userId;
          if (this.signUpPageType === 'webinar') {
            this.$vhall_paas_port({
              k: item.reporType + 3,
              data: {business_uid: userId, user_id: '', webinar_id: this.webinarOrSubjectId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
            })
          }
          arr.splice(index, 1);
          console.log(res);
        }).catch(err => {
          console.log(err);
        });
      })
    },
    // 删除一个题目选项
    deleteOptions(item, index, type){
      // 删除一个隐私协议选项
      if(type === 'privacy'){
        // 隐私协议删除两个元素 且不能有数量限制
        let reg = new RegExp(`(和${item.nodes[3].value})`);
        item.nodes[0].value = item.nodes[0].value.replace(reg, '');

        // 删除隐私协议接口
        this.$fetch('regRrivacyDelete', {
          ...this.setParamsIdByRoute({}), // 活动ID 或者 专题ID
          privacy_id: item.nodes[index].privacy_id
        }).then(res => {
          // 删除成功调用题目编辑接口更新 content
          const options = {
            question_id: item.question_id,
            subject: item.label,
            is_must: item.required ? 1 : 0,
            options: JSON.stringify({
              content: item.nodes[0].value,
              color_text: item.nodes[1].value,
              url: item.nodes[2].value,
            })
          };
          this.questionEdit(options);
        }).catch(err => { console.log(err); });

        item.nodes.splice(index, 2);
        return;
      }else if(type === 'select') {
        if(item.nodes.length == 2){
          return  this.$message({
            message: `请至少保留两个选项`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        }
        // 删除一个下拉框选项
        this.$fetch('regQOptionDelete', {
          item_id: item.nodes[index].item_id,
          question_id: item.question_id
        }).then(res => { console.log(res); })
          .catch(err => { console.log(err); });
        item.nodes.splice(index, 1);
      } else {
        // 普通选项删除
        if(item.nodes[0].children.length == 2){
          return this.$message({
            message: `请至少保留两个选项`,
            showClose: true,
            // duration: 0,
            type: 'error',
            customClass: 'zdy-info-box'
          });
        }
        // 删除其他题目中的一个选项
        this.$fetch('regQOptionDelete', {
          item_id: item.nodes[0].children[index].item_id,
          question_id: item.question_id
        }).then(res => {
          item.nodes[0].children.splice(index, 1);
        }).catch(err => { console.log(err); });

      }
    },
    // 添加一个隐私协议
    privacyAdd(nodes, question){
      let privacy1 = nodes[1].value;
      if(!privacy1 || !nodes[0].value.match(privacy1)){
        return this.$message({
          message: '请完善可点击文字',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      } else if (nodes[0].value.length + 8 > 100) {
        return this.$message({
          message: '添加隐私协议会超出预览字数，请删减后再添加',
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
      }

      let cloneNode = JSON.parse(JSON.stringify(nodes[1]));
      let cloneNode2 = JSON.parse(JSON.stringify(nodes[2]));
      cloneNode.value = "《隐私声明2》";
      cloneNode.privacyAdd = false;
      cloneNode.canRemove = true;
      cloneNode2.value = "";
      let reg = new RegExp(`(${privacy1})`);
      nodes[0].value = nodes[0].value.replace(reg, `$1和${cloneNode.value}`);
      nodes.push(cloneNode);
      nodes.push(cloneNode2);
      console.log(nodes[0].value, 'nodes[0].value')
      this.$fetch('regRrivacyAdd', {
        ...this.setParamsIdByRoute({}), // 活动ID 或者 专题ID
        content: nodes[0].value,
        color_text: '《隐私声明2》',
        url: ''
      }).then(res => {
        nodes[3].privacy_id = res.data.privacy_id;
        nodes[4].privacy_id = res.data.privacy_id;
        // 添加成功之后需要调用更新问题接口，更新问题的 content
        const options = {
          question_id: question.question_id,
          subject: question.label,
          is_must: question.required ? 1 : 0,
          options: JSON.stringify({
            content: nodes[0].value,
            color_text: nodes[1].value,
            url: nodes[2].value,
          })
        };
        this.questionEdit(options);
      }).catch(err => { console.log(err); });
    },
    privacyFormatter(item){
      let text = JSON.parse(JSON.stringify(item[0].value));
      console.log(text, item, 'text')
      // let privacy =
      let matchPrivacy1 = item[1].value.trim() ? text.match(item[1].value) : null;
      if(matchPrivacy1){
        let reg = new RegExp(`(${matchPrivacy1[0]})`);
        text = text.replace(reg, `<a href="${item[2].value || 'javascript:void(0);'}" target="_blank">$1</a>`);
      }else{
        item[1].value = '';
      }
      let matchPrivacy2 = (item[3] && item[3].value.trim()) ? text.match(item[3].value) : null;
      // alert(matchPrivacy2, 'matchPrivacy2')
      if(matchPrivacy2){
        let reg = new RegExp(`(${matchPrivacy2[0]})`, "g");
        text = text.replace(reg, `<a href="${item[4].value || 'javascript:void(0);'}" target="_blank">$1</a>`);
      }else{
        item[3] && (item[3].value = '');
      }

      return text;
    },
    // 上传格式校验
    beforeUploadHandler(file){
      console.log(file);
      const typeList = ['png', 'jpeg', 'gif', 'bmp'];
      console.log(file.type.toLowerCase())
      let typeArr = file.type.toLowerCase().split('/');
      const isType = typeList.includes(typeArr[typeArr.length - 1]);
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isType) {
        this.$message({
          message: `上传表单头图只能是 ${typeList.join('、')} 格式`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      if (!isLt2M) {
        this.$message({
          message: `上传表单头图大小不能超过 2M`,
          showClose: true,
          // duration: 0,
          type: 'error',
          customClass: 'zdy-info-box'
        });
        return false;
      }
      return isType && isLt2M;
    },
    productLoadSuccess(res, file) {
      if (res.data.file_url) {
        // 文件上传成功，保存信息
        this.$refs.formCropper.showModel(res.data.domain_url);
        this._imageUrl = res.data.file_url;
        // this.$emit('setBaseInfo', { cover: res.data.file_url });
      }
    },
    // 删除头图
    deleteBanner() {
      this.imageUrl = '';
      this.blurryDegree = 0;
      this.lightDegree = 10;
      this.$emit('setBaseInfo', { cover: '' });
    },
    cropComplete(cropperData, url, mode) {
      this.backgroundSize = cropperData;
      // this.imageUrl = url;
      this.imageUrl = this._imageUrl;
      this.imageCropMode = mode;
      // this.$emit('setBaseInfo', { cover: this.imageParamsUrl });
    },
    resetUpload() {
      let dom = document.querySelector('#form_cropper .el-upload__input');
      dom.click();
    },
    // 题目顺序修改
    sortChange(val, arr){
      console.log('sortChange-->', this.renderQuestion);
      // 同步父组件数据
      this.$emit('update:questionArr', this.renderQuestion);
      let question_ids = this.renderQuestion.reduce((acc, curr) => {
        return acc + curr.question_id + ',';
      }, '');
      question_ids = question_ids.substring(0, question_ids.length - 1);

      // 以问题数组的 index + 1 作为顺序提交更新顺序接口
      this.$fetch('regQSort', {
        ...this.setParamsIdByRoute({}), // 活动ID 或者专题ID
        question_ids
      }).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    },
    // 标题修改
    baseInfoChange(paramName) {
      const obj = {};
      obj[paramName] = this[paramName];
      this.$emit('setBaseInfo', obj);
    },
    // 短信验证开关
    async phoneSwitchChange(question) {
      if(question.phoneValide && question.abroadPhoneValide){
        this.$message.warning('请关闭”支持国外手机号报名“后，开启”短信验证“功能');
        question.phoneValide = false
        return false;
      }
      let isConfirm = true;
      let userId = this.$parent.userId;
      if (!question.phoneValide) {
        await this.$confirm('关闭短信验证将会导致无法验证用户手机号码，同时用户将无法接收预约短信，确认是否关闭？', '提示', {
          confirmButtonText: '仍然关闭',
          cancelButtonText: '暂不关闭',
          /* center: true, */
          customClass: 'zdy-message-box',
          lockScroll: false,
          cancelButtonClass: 'zdy-confirm-cancel'
        }).then(() => {
          if (this.signUpPageType === 'webinar') {
            this.$vhall_paas_port({
              k: 100139,
              data: {business_uid: userId, user_id: '', webinar_id: this.webinarOrSubjectId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
            })
          }
        }).catch(() => {
          isConfirm = false;
          question.phoneValide = true;
        });
      } else {
        if (this.signUpPageType === 'webinar') {
          this.$vhall_paas_port({
            k: 100080,
            data: {business_uid: userId, user_id: '', webinar_id: this.webinarOrSubjectId, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
          })
        }
      }
      if (!isConfirm) return false;
      const options = {
        question_id: question.question_id,
        options: JSON.stringify({
          open_verify: question.phoneValide ? 1 : 0,
          support_foreign_phone: 0
        }),
        subject: question.label,
        is_must: question.required ? 1: 0
      };
      this.questionEdit(options);
    },
    // 国外手机号短信验证开关
    async abroadPhoneSwitchChange(question) {
      if(question.phoneValide && question.abroadPhoneValide){
        this.$message.warning('请关闭”短信验证“后，开启”支持国外手机号报名“功能');
        question.abroadPhoneValide = false
        return false;
      }
      let userId = this.$parent.userId;
      // this.$vhall_paas_port({
      //   k: 100139,
      //   data: {business_uid: userId, user_id: '', webinar_id: this.webinar_id, refer: '', s: '', report_extra: {}, ref_url: '', req_url: ''}
      // })
      const options = {
        question_id: question.question_id,
        options: JSON.stringify({
          open_verify: 0,
          support_foreign_phone: question.abroadPhoneValide ? 1 : 0
        }),
        subject: question.label,
        is_must: question.required ? 1: 0
      };
      this.questionEdit(options);
    },
    // 是否必填开关
    requiredSwitchChange(question) {
      const options = {
        question_id: question.question_id,
        is_must: question.required ? 1 : 0,
        subject: question.label
      };
      this.questionEdit(options);
    }
  },
};
</script>

<style lang="less" scoped>
.fieldSetBox {
  width: 100%;
  /deep/ .intro-input .el-textarea__inner{
    max-height: 200px;
  }
}
.viewItem{
  border-radius: 4px;
  margin-bottom: 16px;
  border: 1px solid #FFFFFF;
  position: relative;
  .disable_wrap{
    position: absolute;
    z-index: 2;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.5)
  }
  /deep/ .avatar-uploader{
    .mask{
      top: 0;
    }
  }
  &.viewItemHover:hover{
    border-color: #FB3A32;
  }
  /deep/ .el-checkbox__input.is-disabled .el-checkbox__inner {
    border-color: #E6E6E6;
    cursor: not-allowed;
  }
  /deep/ .el-radio__inner{
    background-color: rgba(255, 255, 255, 0)
  }
  /deep/ .el-checkbox__inner {
    background-color: rgba(255, 255, 255, 0)
  }
  &.viewItemHover{
    /deep/.el-input__suffix{
      right: 5px;
    }
  }
  .form_images{
    padding-top: 24px;
    &_item{
      padding-bottom: 12px;
      display: flex;
      justify-items: center;
      align-items: center;
      .form-slider{
        margin: 0 16px ;
      }
    }
  }
  &.privacyItem {
    .radioInput {
      margin-bottom: 10px;
    }
    /deep/ .el-textarea__inner {
      padding-left: 12px;
    }
  }
  .header-img-tip {
    display: block;
    padding-top: 5px;
    font-size: 14px;
    color: #999999;
  }
  .label{
    display: flex;
    align-items: center;
    font-size: 16px;
    color: #1A1A1A;
    margin-bottom: 10px;
    // text-indent: 8px;
    .titleInput {
      font-size: 16px;
      /deep/ .el-input__inner {
        padding-left: 10px;
        color: #1A1A1A;
        padding-right: 54px;
      }
    }
  }
  .noFull{
    width: calc(100% - 40px);
  }
  padding: 20px 24px;
  background: #fff;
  .el-checkbox-group{
    width: 100%;
    padding-left: 0px;
    .el-checkbox{
      display: block;
      margin-top: 10px;
    }
    /deep/ .el-checkbox__label{
      width: calc(100% - 14px);
      padding-left: 6px;
      .el-input__inner {
        padding-right: 74px!important;
      }
    }
  }
  .el-radio-group{
    width: 100%;
    padding-left: 0px;
    .el-radio{
      display: block;
      margin-top: 10px;
      margin-right: 0px;
      &:first-child {
        margin-top: 0;
      }
      /deep/ .el-radio__label {
        padding-left: 6px;
        .radioInput {
          width: calc(100% - 24px);
          .el-input__inner {
            padding-right: 74px!important;
          }
        }
        .radioGender .el-input__inner{
          cursor: not-allowed;
          color: #1a1a1a;
        }
        .other-input {
          margin-top: 10px;
        }
      }
    }
  }
  /deep/ .el-input .el-input__count .el-input__count-inner {
    background: inherit;
  }
  .el-checkbox {
    margin-right: 0px;
  }
  .other-checkbox {
    /deep/ .el-checkbox__input {
      position: absolute;
      top: 11px;
    }
    /deep/ .el-checkbox__label {
      padding-left: 20px;
      width: 100%;
    }
    .other-input {
      margin-top: 10px;
    }
  }
  .bottomBtn{
    margin-top: 9px;
    text-align: right;
    overflow: hidden;
    .clear_both{
      overflow: hidden;
      margin-bottom: 10px;
    }
    .font_set{
      font-size: 14px;
      color: #666;
    }
    .addBtn{
      float: left;
      i{
        margin-left: 0px;
        color: #3562FA;
        font-weight: bold;
        font-size: 14px;

      }
      .el-button{
        margin-left: 0;
        color: #3562FA;
      }
      .line{
        width: 2px;
        height: 13px;
        background: #999999;
        display: inline-block;
        margin: 0 12px;
        vertical-align: middle;
      }
      &.isoverflow {
        i{
          color: #3c3c3c;
        }
        .el-button{
          color: #3c3c3c;
        }
      }
    }
    .moveBtn{
      cursor: move;
    }
    i{
      font-size: 18px;
      color: #666666;
      margin-left: 16px;
      cursor: pointer;
    }
    .controlBtnBox{
      display: inline-flex;
      height: 20px;
      line-height: 20px;
      float: right;
      i:hover{
        color: #1a1a1a;
      }
    }
    .swtich{
      vertical-align: text-top;
      margin-left: 16px;
      float: right;
    }
    /deep/ .el-switch__label{
      font-size: 14px;
      color: #666666;
    }
  }
  .selectInput{
    margin-bottom: 10px;
  }
  .regionalInput{
    width: calc(100% - 38px)
  }
  .regionalBtn{
    margin-left: 10px;
  }
  /deep/ .box .avatar {
    width: auto;
  }
  .el-textarea {
    /deep/ .el-textarea__inner {
      font-family: @fontRegular;
    }
    /deep/ .el-input__count {
      font-size: 14px;
      font-family: @fontRegular;
      font-weight: 400;
      color: #666666;
    }
  }
  /deep/ .el-input__inner {
    height: 40px;
    padding: 0 10px;
    padding-right: 70px !important;
  }
  /deep/ .el-input.is-disabled .el-input__inner {
    background-color: #FFFFFF;
    border-color: #E6E6E6;
    color: #b3b3b3;
    cursor: not-allowed;
  }
  /deep/ .el-upload--picture-card {
    height: 120px;
    i {
      font-size: 18px;
    }
    .box {
      span {
        font-size: 14px
      }
      i {
        font-size: 18px;
      }
    }
    &:hover {
      border: 1px dashed #c0ccda!important;
    }
  }
}
.sureBtn{
  background: none;
  text-align: center;
  border: 0;
  .el-button{
    width: 160px;
    padding: 12px 50px;
    border-radius: 23px;
  }
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #FFF2F2;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
.radioInput:not(.noFull){
  /deep/ .el-input__inner{
    border-color: transparent !important;
    &:focus{
      background: #F7F7F7;
      & + .el-input__suffix .el-input__count{
        visibility: visible;
      }
    }
    &:hover{
      background: #F7F7F7;
      & + .el-input__suffix .el-input__count{
        visibility: visible;
      }
    }
  }
  /deep/ .el-input__count{
    visibility: hidden;
  }


}
.radioInput,.selectInput{
  &:hover .removeIcon{
    display: inline-block;
  }
}
.removeIcon{
  font-weight: bold;
  font-size: 16px;
  color: #666666;
  vertical-align: middle;
  display: none;
  line-height: 34px;
  cursor: pointer;
}
.previewPrivacy{
  font-size: 14px;
  color: #666;
  /deep/ .el-checkbox__input{
    padding-top: 18px;
    vertical-align: top;
  }
  /deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
    color: #666;
  }
  /deep/ .el-checkbox__inner {
    border-color: #E6E6E6!important;
    background-color: rgba(255, 255, 255, 0)!important;
    cursor: not-allowed;
  }
  p{
    margin: 16px 0 8px 0;
    /* display: flex; */
    align-items: flex-start;
    width: 100%;
    white-space: normal;
    /deep/ a{
      color: #3562FA;
      &:link{
        color: #3562FA;
      }
      &:active{
        color: #3562FA;
      }
    }
  }
  pre{
    font-family: @fontMedium;
  }
}
</style>
