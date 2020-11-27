export default {
  inserted: (el, binding) => {
    console.log('full screen', el, binding)

    el.onClick = function () {
      if (el.requestFullscreen) {
        el.requestFullscreen();
      } else if (el.mozRequestFullScreen) {
        el.mozRequestFullScreen();
      } else if (el.webkitRequestFullScreen) {
        el.webkitRequestFullScreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    }  
  }
}