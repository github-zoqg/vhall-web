<template>
  <div
    :class="[
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
        :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
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
        @keyup.enter="handleChange"
        :aria-label="label"
        :style="textStyle"
      />
      <!-- 前置内容 -->
      <span class="el-input__prefix" v-if="$slots.prefix || prefixIcon">
        <slot name="prefix"></slot>
        <i class="el-input__icon" v-if="prefixIcon" :class="prefixIcon"></i>
      </span>
      <!-- 后置内容 -->
      <span class="el-input__suffix" v-if="getSuffixVisible()">
        <span class="el-input__suffix-inner">
          <template v-if="!showClear || !showPwdVisible || !isWordLimitVisible">
            <slot name="suffix"></slot>
            <i class="el-input__icon" v-if="suffixIcon" :class="suffixIcon"></i>
          </template>
          <i
            v-if="showClear"
            class="el-input__icon el-icon-circle-close el-input__clear"
            @mousedown.prevent
            @click="clear"
          ></i>
          <i
            v-if="showPwdVisible"
            class="el-input__icon el-icon-view el-input__clear"
            @click="handlePasswordVisible"
          ></i>
          <span ref="limit_count" v-if="isWordLimitVisible" class="el-input__count">
            <span class="el-input__count-inner">
              <span
                :class="[
                  'el-input__count-inner__numerator',
                  `${value}`.length && `${value}`.length != $attrs.maxlength
                    ? 'el-input__count-inner__numerator-hasnum'
                    : '',
                  `${value}`.length && `${value}`.length == $attrs.maxlength
                    ? 'el-input__count-inner__numerator-maxnum'
                    : ''
                ]"
              >
                {{ textLength }}
              </span>
              <span class="el-input__count-inner__denominator">
                <span ref="separator">/</span>
                <span ref="limit_total">{{ upperLimit }}</span>
              </span>
            </span>
          </span>
        </span>
        <i
          class="el-input__icon"
          v-if="validateState"
          :class="['el-input__validateIcon', validateIcon]"
        ></i>
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
    ></textarea>
    <span v-if="isWordLimitVisible && type === 'textarea'" class="el-input__count">
      <span
        :class="[
          'el-input__count-inner__numerator',
          `${value}`.length && `${value}`.length != $attrs.maxlength
            ? 'el-input__count-inner__numerator-hasnum'
            : '',
          `${value}`.length && `${value}`.length == $attrs.maxlength
            ? 'el-input__count-inner__numerator-maxnum'
            : ''
        ]"
      >
        {{ textLength }}
      </span>
      <span class="el-input__count-inner__denominator">
        <span ref="separator">/</span>
        <span ref="limit_total">{{ upperLimit }}</span>
      </span>
    </span>
  </div>
</template>
<script>
  import { Input } from 'element-ui';
  import merge from 'element-ui/src/utils/merge';
  export default {
    extends: Input,
    mounted() {
      this.calcWidth =
        this.$refs.limit_total && this.$refs.limit_total.offsetWidth
          ? this.$refs.limit_total.offsetWidth * 2 + this.$refs.separator.offsetWidth + 15 + 'px'
          : '30px';
    },
    data() {
      return {
        calcWidth: ''
      };
    },
    computed: {
      textStyle() {
        return {
          paddingRight: this.calcWidth
        };
      }
    }
  };
</script>
<style lang="less">
  .el-input__count-inner__numerator {
    color: #999999;
    &.el-input__count-inner__numerator-hasnum {
      color: #3562fa;
    }
    &.el-input__count-inner__numerator-maxnum {
      color: #fb3a32;
    }
  }
  .el-input__count-inner__denominator {
    color: #999999;
  }
  // 输入框样式重置
  .el-form-item.is-error .el-input__inner {
    border-color: #fb3a32;
  }
  .el-input__inner,
  .el-textarea__inner {
    border-color: #ccc;
    color: #1a1a1a;
    &:hover {
      border-color: #999;
    }
    &:focus {
      border-color: #999;
    }
    &::-webkit-input-placeholder {
      /* WebKit, Blink, Edge */
      color: #999999;
    }
    &:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #999999;
    }
    &::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #999999;
    }
    &:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #999999;
    }
  }
  .el-input.is-disabled .el-input__inner {
    background-color: #ffffff;
    border-color: #e6e6e6;
    color: #999999;
    cursor: not-allowed;
    &::-webkit-input-placeholder {
      /* WebKit, Blink, Edge */
      color: #b3b3b3;
    }
    &:-moz-placeholder {
      /* Mozilla Firefox 4 to 18 */
      color: #b3b3b3;
    }
    &::-moz-placeholder {
      /* Mozilla Firefox 19+ */
      color: #b3b3b3;
    }
    &:-ms-input-placeholder {
      /* Internet Explorer 10-11 */
      color: #b3b3b3;
    }
  }
</style>
