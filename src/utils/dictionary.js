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
