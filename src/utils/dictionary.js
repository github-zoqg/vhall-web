/**
 * 枚举类
 * @Author: Jia.li
 * @Date: 2020-11-14 11点58分
 * @Remark:
 */
/*
	文章内容类型管理
	内容类型 0:图文，5:音频，10：视频，15:模板，20:下载包
 */
export function contentType(type) {
	const types = [
		{code:0,text:'图文',key:'textImg'},
		{code:5,text:'音频',key:'audio'},
		{code:10,text:'视频',key:'video'},
		{code:15,text:'模板',key:'template'},
		{code:20,text:'下载包',key:'downPack'}
	];
	return filter(type,types);
}
/*
	性别
	内容类型 0:男，1:女
 */
export function gender(type) {
	const types = [
		{code:1,text:'男',key:'man'},
		{code:2,text:'女',key:'women'}
	];
	return filter(type,types);
}

/*组件
* 内容类型：
  {name: "图文", is_vip: 0, type: "1", component_id: 1},
  {name: "二维码", is_vip: 0, type: "1", component_id: 2},
  {name: "直播", is_vip: 0, type: "1", component_id: 3},
  {name: "专题", is_vip: 0, type: "1", component_id: 4},
  {name: "文字链", is_vip: 1, type: "1", component_id: 5},
  {name: "图文链", is_vip: 1, type: "1", component_id: 6},
  {name: "标题", is_vip: 1, type: "1", component_id: 7},
  {name: "分割线", is_vip: 1, type: "1", component_id: 8},
  {name: "排行榜", is_vip: 0, type: "2", component_id: 9}
 */
export function customTabCompType(type) {
  const types = [
    {name: "图文", is_vip: 0, type: "1", component_id: 1, key: 'img-txt'},
    {name: "二维码", is_vip: 0, type: "1", component_id: 2, key: 'rq-code'},
    {name: "直播", is_vip: 0, type: "1", component_id: 3, key: 'video'},
    {name: "专题", is_vip: 0, type: "1", component_id: 4, key: 'special'},
    {name: "文字链", is_vip: 1, type: "1", component_id: 5, key: 'text-link'},
    {name: "图文链", is_vip: 1, type: "1", component_id: 6, key: 'img-link'},
    {name: "标题", is_vip: 1, type: "1", component_id: 7, key: 'title'},
    {name: "分割线", is_vip: 1, type: "1", component_id: 8, key: 'hr'},
    {name: "排行榜", is_vip: 0, type: "2", component_id: 9, key: 'rank'}
  ];
  return filter(type,types);
}

/*
 *公共参数platform含义
 */
export function platform(type) {
  const types = [
    {code:0,text:'iosAPP',key:'ios_app'},
    {code:1,text:'androidAPP',key:'android_app'},
    {code:4,text:'iosSDK',key:'ios_sdk'},
    {code:5,text:'androidSDK',key:'android_sdk'},
    {code:6,text:'pc客户端小助手',key:'pc_sdk'},
    {code:7,text:'h5播放器pc浏览器端',key:'h5_pc'},
    {code:9,text:'微信小程序',key:'chat'},
    {code:10,text:'h5播放器wap端',key:'h5_wap'},
    {code:15,text:'OpenApi',key:'open_api'},
    {code:16,text:'admin后台',key:'admin'},
    {code:16,text:'控制台',key:'console'}
  ];
  return filter(type,types);
}

/*
 * 文件格式类型
 * [doc => application/msword]
 * [docx => application/vnd.openxmlformats-officedocument.wordprocessingml.document]
 * [xls => application/vnd.ms-excel]
 * [xlsx => application/vnd.openxmlformats-officedocument.spreadsheetml.sheet]
 * [ppt => application/vnd.ms-powerpoint]
 * [pptx => application/vnd.openxmlformats-officedocument.presentationml.presentation]
 * [jpeg => image/jpeg]
 * [jpg => image/jpeg]
 * [png => image/png]
 * [bmp => image/bmp]
 */
export function fileUploadType(type) {
  const types = [
    {code:0,text:'application/msword',key:'doc'},
    {code:1,text:'application/vnd.openxmlformats-officedocument.wordprocessingml.document',key:'docx'},
    {code:4,text:'application/vnd.ms-excel',key:'xls'},
    {code:5,text:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',key:'xlsx'},
    {code:6,text:'application/vnd.ms-powerpoint',key:'ppt'},
    {code:7,text:'application/vnd.openxmlformats-officedocument.presentationml.presentation',key:'pptx'},
    {code:9,text:'image/jpeg',key:'jpeg'},
    {code:10,text:'image/jpeg',key:'jpg'},
    {code:15,text:'image/png',key:'png'},
    {code:16,text:'image/bmp',key:'bmp'}
  ];
  return filter(type,types);
}

function filter(type,types){
	if(!type){
		return types;
	}
	let target = {};
	types.map(item => {
		Object.keys(item).map( n =>{
			if(item[n] === type){
				target = item;
			}
		});
	});
	return target;
}
