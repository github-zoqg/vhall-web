<template>
   <div :class="[
      'el-input',
      inputSize ? 'el-input--' + inputSize : '',
      {
        'is-disabled': inputDisabled,
        'is-exceed': inputExceed,
        'el-input-group': $slots.prepend || $slots.append,
        'el-input-group--append': $slots.append,
        'el-input-group--prepend': $slots.prepend,
        'el-input--prefix': $slots.prefix || prefixIcon,
        'el-input--suffix': $slots.suffix || suffixIcon || clearable || showPassword
      }
    ]"
    @mouseenter="hovering = true"
    @mouseleave="hovering = false"
  >
  <!-- 前置元素 -->
  <div class="el-input-group__prepend" v-if="$slots.prepend">
    <slot name="prepend"></slot>
  </div>
  <input
    :tabindex="tabindex"
    class="el-input__inner"
    placeholder="请输入密码"
    ref="input"
    @input="handleInput"
    @compositionstart="handleCompositionStart"
    @compositionend="handleCompositionEnd"
    v-bind="$attrs"
    :disabled="inputDisabled"
    :readonly="readonly"
    oninput="this.value=this.value.replace(/[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2122-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030/gi, '')"
    :aria-label="label"
    :style="textStyle"
     />
  </div>

</template>
<script>
import { Input } from 'element-ui'
import merge from 'element-ui/src/utils/merge';
//自定义密码输入框
//input元素光标操作
class CursorPosition{
    constructor(_inputEl) {
        this._inputEl = _inputEl;
    }
    //获取光标的位置 前，后，以及中间字符
    get(){
        var rangeData = { text: "", start: 0, end: 0 };
        if (this._inputEl.setSelectionRange) { // W3C
            this._inputEl.focus();
            rangeData.start = this._inputEl.selectionStart;
            rangeData.end = this._inputEl.selectionEnd;
            rangeData.text = (rangeData.start != rangeData.end) ? this._inputEl.value.substring(rangeData.start, rangeData.end) : "";
        } else if (document.selection) { // IE
            this._inputEl.focus();
            var i,
                oS = document.selection.createRange(),
                oR = document.body.createTextRange();
            oR.moveToElementText(this._inputEl);

            rangeData.text = oS.text;
            rangeData.bookmark = oS.getBookmark();
            for (i = 0; oR.compareEndPoints('StartToStart', oS) < 0 && oS.moveStart("character", -1) !== 0; i++) {
                if (this._inputEl.value.charAt(i) == '\r') {
                    i++;
                }
            }
            rangeData.start = i;
            rangeData.end = rangeData.text.length + rangeData.start;
        }

        return rangeData;
    }
    //写入光标的位置
    set(rangeData){
        var oR;
        if (!rangeData) {
            alert("You must get cursor position first.")
        }
        this._inputEl.focus();
        if (this._inputEl.setSelectionRange) { // W3C
            this._inputEl.setSelectionRange(rangeData.start, rangeData.end);
        } else if (this._inputEl.createTextRange) { // IE
            oR = this._inputEl.createTextRange();
            if (this._inputEl.value.length === rangeData.start) {
                oR.collapse(false);
                oR.select();
            } else {
                oR.moveToBookmark(rangeData.bookmark);
                oR.select();
            }
        }
    }
}
export default {
    name: 'Pw_input_cp',
    extends: Input,
    props:{
        value:{
            type:String,
            default:"",
        },
    },
    data(){
        return{
            symbol:"●", //自定义的密码符号
            pwd:"", //密码明文数据
            inputEl:null, //input元素
            isComposing:false, //输入框是否还在输入（记录输入框输入的是虚拟文本还是已确定文本）
        };
    },
    mounted(){
        this.inputEl = this.$refs.input;
    },
    watch:{
        value(){
            this.pwd = this.value;
            this.inputDataConversion(this.pwd);
        },
    },
    methods:{
        inputDataConversion(value){ //输入框里的数据转换，将123转为***
            if (!value){
                this.inputEl.value = "";
                return;
            }
            let data = "";
            for(let i=0;i<value.length;i++){
                data+=this.symbol;
            }
            this.inputEl.value = data;
        },
        pwdSetData(positionIndex,value){ //写入原始数据
            let _pwd = value.split(this.symbol).join("");
            if(_pwd){
                let index = this.pwd.length - (value.length - positionIndex.end);
                this.pwd = this.pwd.slice(0,positionIndex.end-_pwd.length) + _pwd + this.pwd.slice(index);
            }else{
                this.pwd = this.pwd.slice(0,positionIndex.end) + this.pwd.slice(positionIndex.end+this.pwd.length - value.length);
            }
        },
        handleInput(e){ //输入值变化后执行
            //撰写期间不应发出输入
            if (this.isComposing) return;
            let cursorPosition = new CursorPosition(this.inputEl);
            let positionIndex = cursorPosition.get();
            let value = e.target.value; //整个输入框的值
            this.pwdSetData(positionIndex,value);
            this.inputDataConversion(value);
            cursorPosition.set(positionIndex,this.inputEl);
            this.$emit("input",this.pwd);
        },
        handleCompositionStart() {
            //表示正在写
            this.isComposing = true;
        },
        handleCompositionEnd(e) {
            if (this.isComposing) {
                this.isComposing = false;
                //handleCompositionEnd比handleInput后执行，避免isComposing还为true时handleInput无法执行正确逻辑
                this.handleInput(e);
            }
        },
    },
}
</script>
<style lang="less">
  .el-input__count-inner__numerator {
    color: #999999;
    &.el-input__count-inner__numerator-hasnum {
      color: #3562FA;
    }
    &.el-input__count-inner__numerator-maxnum {
      color: #FB3A32;
    }
  }
  .el-input__count-inner__denominator {
    color: #999999;
  }
  // 输入框样式重置
  .el-form-item.is-error .el-input__inner {
    border-color: #FB3A32;
  }
  .el-input__inner,.el-textarea__inner {
    border-color: #ccc;
    color: #1a1a1a;
    &:hover {
      border-color: #999;
    }
    &:focus {
      border-color: #999;
    }
    &::-webkit-input-placeholder { /* WebKit, Blink, Edge */
      color:    #999999;
    }
    &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color:    #999999;
    }
    &::-moz-placeholder { /* Mozilla Firefox 19+ */
      color:    #999999;
    }
    &:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color:    #999999;
    }
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #FFFFFF;
    border-color: #E6E6E6;
    color: #999999;
    cursor: not-allowed;
    &::-webkit-input-placeholder { /* WebKit, Blink, Edge */
      color:    #B3B3B3;
    }
    &:-moz-placeholder { /* Mozilla Firefox 4 to 18 */
      color:    #B3B3B3;
    }
    &::-moz-placeholder { /* Mozilla Firefox 19+ */
      color:    #B3B3B3;
    }
    &:-ms-input-placeholder { /* Internet Explorer 10-11 */
      color:    #B3B3B3;
    }
  }
</style>
