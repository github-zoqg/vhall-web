// import { emojiUrl } from './config.js'
const emojiUrl = 'https://cnstatic01.e.vhall.com/static/img/arclist'
const faceArr = {
  '[微笑]': '1',
  '[撇嘴]': '2',
  '[色]': '3',
  '[发呆]': '4',
  '[得意]': '5',
  '[流泪]': '6',
  '[害羞]': '7',
  '[闭嘴]': '8',
  '[睡]': '9',
  '[哭]': '10',
  '[尴尬]': '11',
  '[发怒]': '12',
  '[调皮]': '13',
  '[呲牙]': '14',
  '[惊讶]': '15',
  '[难过]': '16',
  '[酷]': '17',
  '[汗]': '18',
  '[抓狂]': '19',
  '[吐]': '20',
  '[偷笑]': '21',
  '[愉快]': '22',
  '[白眼]': '23',
  '[傲慢]': '24',
  '[饥饿]': '25',
  '[困]': '26',
  '[惊恐]': '27',
  '[流汗]': '28',
  '[憨笑]': '29',
  '[悠闲]': '30',
  '[奋斗]': '31',
  '[咒骂]': '32',
  '[疑问]': '33',
  '[嘘]': '34',
  '[晕]': '35',
  '[疯了]': '36',
  '[衰]': '37',
  '[骷髅]': '38',
  '[敲打]': '39',
  '[再见]': '40',
  '[擦汗]': '41',
  '[抠鼻]': '42',
  '[鼓掌]': '43',
  '[糗大了]': '44',
  '[坏笑]': '45',
  '[左哼哼]': '46',
  '[右哼哼]': '47',
  '[哈欠]': '48',
  '[鄙视]': '49',
  '[委屈]': '50',
  '[快哭了]': '51',
  '[阴险]': '52',
  '[亲亲]': '53',
  '[吓]': '54',
  '[可怜]': '55',
  '[菜刀]': '56',
  '[西瓜]': '57',
  '[啤酒]': '58',
  '[篮球]': '59',
  '[乒乓]': '60',
  '[咖啡]': '61',
  '[饭]': '62',
  '[猪头]': '63',
  '[玫瑰]': '64',
  '[凋谢]': '65',
  '[嘴唇]': '66',
  '[爱心]': '67',
  '[心碎]': '68',
  '[蛋糕]': '69',
  '[闪电]': '70',
  '[炸弹]': '71',
  '[刀]': '72',
  '[足球]': '73',
  '[瓢虫]': '74',
  '[便便]': '75',
  '[月亮]': '76',
  '[太阳]': '77',
  '[礼物]': '78',
  '[拥抱]': '79',
  '[强]': '80',
  '[弱]': '81',
  '[握手]': '82',
  '[胜利]': '83',
  '[抱拳]': '84',
  '[勾引]': '85',
  '[拳头]': '86',
  '[差劲]': '87',
  '[爱你]': '88',
  '[NO]': '89',
  '[OK]': '90'
}
const textToEmoji = s => {
  s = s.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br/>')
  // eslint-disable-next-line no-useless-escape
  let reg = /\[[^\[\]]+?\]/g
  let ret = []
  let textArr = s.split(reg) // 字符串分割，返回一个数组
  let emojiArr = s.match(reg) // 返回一个数组，成员是所有匹配的子字符串

  // 文字与表情 轮流添加到a
  // textArr 的长度 永远比 emojiArr 大 1
  // 当然 emojiArr 可能为 null，此时 textArr 长度为 1，成员即为原始字符串
  textArr.forEach((cont, i) => {
    // 当文字内容不为空 添加到a
    cont &&
      ret.push({
        msgType: 'text',
        msgCont: cont
      })

    // 最后一次循环，肯定没有表情与之对应，所以忽略
    // 如果不是最后一次，添加表情到a
    // 当然此处还需判断是否有此表情的图片定义
    i !== textArr.length - 1 &&
      ret.push(
        faceArr[emojiArr[i]]
          ? {
            msgType: 'emoji',
            msgCont: emojiArr[i],
            msgImage: emojiToPath(emojiArr[i])
          }
          : {
            msgType: 'text',
            msgCont: emojiArr[i]
          }
      )
  })
  return ret
}
function getEmojiList() {
  let result = []
  for (let key in faceArr) {
    result.push({
      name: key,
      value: faceArr[key],
      src: emojiToPath(key)
    })
  }

  return result
}
// 将拆分开的消息数组转换成字符串
function combinationStr(arr) {
  let result = ''

  arr.forEach(item => {
    let str = item.msgType === 'text' ? item.msgCont : `<img width="24" height="24" style="vertical-align:text-bottom;" src="${item.msgImage}"/>`
    result += str
  })

  return result
}
function textToEmojiText(str) {
  let arr = textToEmoji(str)
  let result = combinationStr(arr)
  return result
}
const emojiToPath = key => `${emojiUrl}/Expression_${faceArr[key]}@2x.png`
export { getEmojiList, textToEmojiText, emojiToPath, textToEmoji, faceArr }
