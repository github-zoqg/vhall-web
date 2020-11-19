import md5 from 'md5'

function makeSign (data) {
  const signAt = Math.round(new Date().getTime() / 1000)
  const secretKey = '8YfPw4s6YLcYyLc8'
  const postData = Object.assign({
    signed_at: signAt
  }, data)
  const keys = Object.keys(postData)
  keys.sort()

  let signStr = ''
  keys.forEach((key) => {
    signStr = key + postData[key].toString()
  })

  const sign = md5(secretKey + signStr + secretKey)
  return {
    signed_at: signAt,
    sign
  }
}

export default makeSign
