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
