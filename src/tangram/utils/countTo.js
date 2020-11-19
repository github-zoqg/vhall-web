/**
 *
 *
 * @export
 * @class CountTo
 * @author zhenliang.sun
 */
export default class CountTo {
  /**
   *
   *
   * @static
   * @param {*} s start
   * @param {*} e end
   * @param {*} d duration 秒为单位
   * @param {*} o offset
   * @param {*} cbk callback
   * @memberof CountTo
   */
  start (s, e, d, o, cbk) {
    clearInterval(this.interval)
    let currentStep = 1 //当前步数
    let chunkCount = Math.ceil(Math.pow((e - s) * d, 1 / 3))

    console.log('总共分N块', chunkCount)
    this.timeInterval = ((d * 1000) / chunkCount) >> 0 // 计时器时间间隔
    console.log('时间间隔', this.timeInterval)
    this.step = (Math.abs(e - s) / chunkCount) >> 0
    console.log('单次步长基准', this.step)

    // 剩余数量
    let residue = e

    this.interval = setInterval(() => {
      let num = (this.step + this.step * this.getRange(o)) >> 0
      num = num < 1 ? 1 : num
      residue = residue - num

      if (residue - s < 0) {
        clearInterval(this.interval)
        cbk && cbk(residue + num, true, currentStep)
        currentStep++
        return;
      }
      cbk && cbk(num, false, currentStep)
      currentStep++
    }, this.timeInterval)
  }

  stop () {
    clearInterval(this.interval)
  }

  getRange (o) {
    return o * (Math.random() * 2.0 - 1.0)
  }
}
