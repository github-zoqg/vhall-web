export const session = {
  set: (key, value) => {
    return sessionStorage.setItem(key, JSON.stringify(value))
  },
  get: key => {
    return JSON.parse(sessionStorage.getItem(key))
  },
  removeItem: param => {
    return sessionStorage.removeItem(param)
  }
}

export function isIE () {
  if (!!window.ActiveXObject || 'ActiveXObject' in window) return true
  else return false
}

export function resize () {
  if (isIE()) {
    var evt = window.document.createEvent('UIEvents')
    evt.initUIEvent('resize', true, false, window, 0)
    window.dispatchEvent(evt)
  } else {
    const resizeEvent = new Event('resize')
    window.dispatchEvent(resizeEvent)
  }
}

export function calculateAudioLevel (level) {
  let audioLevelValue = 1
  if (level > 0 && level <= 0.04) {
    audioLevelValue = 1
  } else if (level > 0.04 && level <= 0.16) {
    audioLevelValue = 2
  } else if (level > 0.16 && level <= 0.36) {
    audioLevelValue = 3
  } else if (level > 0.36 && level <= 0.64) {
    audioLevelValue = 4
  } else if (level > 0.64 && level <= 1) {
    audioLevelValue = 5
  }
  return audioLevelValue
}

export function calculateNetworkStatus (status) {
  let netWorkStatus = 2
  if (status >= 0 && status <= 2) {
    netWorkStatus = 2
  } else if (status > 2 && status <= 9) {
    netWorkStatus = 1
  } else if (status > 9 && status <= 100) {
    netWorkStatus = 0
  } else {
    netWorkStatus = 0
  }
  return netWorkStatus
}
