<template>
  <div :class="[
    type === 'textarea' ? 'el-textarea' : 'el-input',
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
    <template v-if="type !== 'textarea'">
      <!-- 前置元素 -->
      <div class="el-input-group__prepend" v-if="$slots.prepend">
        <slot name="prepend"></slot>
      </div>
      <input
        :tabindex="tabindex"
        v-if="type !== 'textarea'"
        class="el-input__inner"
        v-bind="$attrs"
        :type="showPassword ? (passwordVisible ? 'text': 'password') : type"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autoComplete || autocomplete"
        ref="input"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        :aria-label="label"
      >
      <!-- 前置内容 -->
      <span class="el-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="el-input__icon"
           v-if="prefixIcon"
           :class="prefixIcon">
        </i>
      </span>
      <!-- 后置内容 -->
      <span
        class="el-input__suffix"
        v-if="getSuffixVisible()">
        <span class="el-input__suffix-inner">
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <i class="el-input__icon"
              v-if="suffixIcon"
              :class="suffixIcon">
            </i>
          </template>
          <i v-if="showClear"
            class="el-input__icon el-icon-circle-close el-input__clear"
            @mousedown.prevent
            @click="clear"
          ></i>
          <i v-if="showPwdVisible"
            class="el-input__icon el-icon-view el-input__clear"
            @click="handlePasswordVisible"
          ></i>
          <span v-if="isWordLimitVisible" class="el-input__count">
            <span class="el-input__count-inner">
              <span
                :class="[
                  'el-input__count-inner__numerator',
                  `${value}`.length && `${value}`.length != $attrs.maxlength ? 'el-input__count-inner__numerator-hasnum' : '',
                  `${value}`.length && `${value}`.length == $attrs.maxlength ? 'el-input__count-inner__numerator-maxnum' : ''
                ]"
              >{{ textLength }}</span>/<span class="el-input__count-inner__denominator">{{ upperLimit }}</span>
            </span>
          </span>
        </span>
        <i class="el-input__icon"
          v-if="validateState"
          :class="['el-input__validateIcon', validateIcon]">
        </i>
      </span>
      <!-- 后置元素 -->
      <div class="el-input-group__append" v-if="$slots.append">
        <slot name="append"></slot>
      </div>
    </template>
    <textarea
      v-else
      :tabindex="tabindex"
      class="el-textarea__inner"
      @compositionstart="handleCompositionStart"
      @compositionupdate="handleCompositionUpdate"
      @compositionend="handleCompositionEnd"
      @input="handleInput"
      ref="textarea"
      v-bind="$attrs"
      :disabled="inputDisabled"
      :readonly="readonly"
      :autocomplete="autoComplete || autocomplete"
      :style="textareaStyle"
      @focus="handleFocus"
      @blur="handleBlur"
      @change="handleChange"
      :aria-label="label"
    >
    </textarea>
    <span v-if="isWordLimitVisible && type === 'textarea'" class="el-input__count">
      <span
        :class="[
          'el-input__count-inner__numerator',
          `${value}`.length && `${value}`.length != $attrs.maxlength ? 'el-input__count-inner__numerator-hasnum' : '',
          `${value}`.length && `${value}`.length == $attrs.maxlength ? 'el-input__count-inner__numerator-maxnum' : ''
        ]"
      >{{ textLength }}</span>/<span class="el-input__count-inner__denominator">{{ upperLimit }}</span>
    </span>
  </div>
</template>
<script>
  import { Input } from 'element-ui'
  export default {
    extends: Input
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
  .el-input__inner {
    border-color: #ccc;
    &:hover {
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
