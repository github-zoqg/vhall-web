const loadMore = Vue => {
  Vue.directive('loadMore', {
    bind: (el, binding) => {
      let targetDom =
        el.querySelector('.el-table__body-wrapper') ||
        el.querySelector('.el-scrollbar__wrap') ||
        el.querySelector('.el-tabs__content');
      targetDom.addEventListener('scroll', function () {
        let scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
        if (!parseInt(scrollDistance)) {
          binding.value();
        }
      });
    }
  });
};
const tooltipMove = Vue => {
  //让tooltip快速消失
  Vue.directive('tooltipMove', {
    inserted: (el, binding) => {
      el.addEventListener('mouseout', () => {
        let toolTipAll = document.getElementsByClassName('el-tooltip__popper');
        if (toolTipAll && toolTipAll.length > 0) {
          for (const item of toolTipAll) {
            item.style.display = 'none';
          }
        }
      });
    }
  });
};

const clearEmoij = Vue => {
  Vue.directive('clearEmoij', {
    bind: (el, binding, vnode, oldVnode) => {
      let regex =
        /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2123-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030|(^\s*)/gi;
      // const regex = /(\ud83c[\udc00-\udfff])|(\ud83d[\udc00-\udfff])|(\ud83e[\udc00-\udfff])|[\u2100-\u32ff]|[\u0030-\u007f][\u20d0-\u20ff]|[\u0080-\u00ff]|(^\s*)/gi;
      const obj = el.querySelectorAll('.el-input__inner,.el-textarea__inner')[0];
      let zclearNoNum = function (e) {
        if (e.target.composing) return;
        let match = regex.exec(obj.value);
        if (match) {
          obj.value = obj.value.replace(
            /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2123-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030|(^\s*)/gi,
            ''
          );
          zclearNoNum(e);
        }
        // 触发v-model的更新
        obj.dispatchEvent(new Event('input'));
      };
      let zblur = function (e) {
        // zclearNoNum(e);
        setTimeout(() => {
          let match = regex.exec(obj.value);
          if (match) {
            obj.value = obj.value.replace(
              /[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF][\u200D|\uFE0F]|[\uD83C|\uD83D|\uD83E][\uDC00-\uDFFF]|[0-9|*|#]\uFE0F\u20E3|[0-9|#]\u20E3|[\u203C-\u3299]\uFE0F\u200D|[\u203C-\u3299]\uFE0F|[\u2123-\u2B55]|\u303D|[\A9|\AE]\u3030|\uA9|\uAE|\u3030|(^\s*)/gi,
              ''
            );
            // zclearNoNum(e);
          }
          // 触发v-model的更新
          obj.dispatchEvent(new Event('input'));
        }, 50);
      };
      // obj.onkeyup = zclearNoNum;
      // obj.onblur = zblur;
      obj.oninput = zblur;

      function onCompositionStart(e) {
        e.target.composing = true;
      }
      function onCompositionEnd(e) {
        e.target.composing = false;
        obj.dispatchEvent(new Event('input'));
      }
      obj.addEventListener('compositionstart', onCompositionStart);
      obj.addEventListener('compositionend', onCompositionEnd);
    },
    update(el, binding, vnode, oldVnode) {}
  });
};

export { loadMore, tooltipMove, clearEmoij };
