import { getStyle } from '@/utils/utils';
const tableCellTooltip = {
  data() {
    return {
      isTextOverflow: false
    };
  },
  methods: {
    // 单元格鼠标移入事件
    handleCellMouseEnter(row, column, cell, event) {
      // 判断是否text-overflow, 如果是就显示tooltip
      const cellChild = event.target.querySelector('.cell .custom-tooltip-content');
      if (!cellChild) {
        return;
      }
      // use range width instead of scrollWidth to determine whether the text is overflowing
      // to address a potential FireFox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1074543#c3
      const range = document.createRange();
      range.setStart(cellChild, 0);
      range.setEnd(cellChild, cellChild.childNodes.length);
      const rangeWidth = range.getBoundingClientRect().width;
      const padding =
        (parseInt(getStyle(cellChild, 'paddingLeft'), 10) || 0) +
        (parseInt(getStyle(cellChild, 'paddingRight'), 10) || 0);
      if (
        rangeWidth + padding > cellChild.offsetWidth ||
        cellChild.scrollWidth > cellChild.offsetWidth
      ) {
        this.isTextOverflow = true;
      }
    },
    handleCellMouseLeave() {
      this.isTextOverflow = false;
    }
  }
};
export default tableCellTooltip;
