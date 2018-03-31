{
	let reg1 = new RegExp('abc','i');
	let reg2 = new RegExp(/abc/i);
	console.log(reg1.test('abcqww'),reg2.test('abcjngksj')); //es5
}
{
	let reg3 = new RegExp(/abc/ig,'i')
	console.log(reg3.flags);   //es6可以有俩个参数，第二个可以覆盖第一个的ig修饰符
}
{
	let s = 'bbb_bb';
	let a1 =/b+/g;
	let a2 =/b+/y;
	console.log(a1.exec(s),a2.exec(s));
	console.log(a1.exec(s),a2.exec(s));
	console.log(a1.sticky,a2.sticky)  //是否启用y修饰符，匹配的下一个位置的起点

}
{
	//u修饰符
	console.log(/^\uD123/.test('\uD123\uDC2A'));//特征值

	console.log(/^\uD123/u.test('\uD123\uDC2A'));
	console.log(/\u{61}/.test('a'));  //false
	console.log(/\u{61}/u.test('a'));//true

	//大于俩个字符的要加u
	console.log(`\u{21061}`);
	let s='𡁡';
	console.log('u-1',/^.$/.test(s)); //false   .并不能匹配所以字符；前提是小于俩个长度的字符
	console.log('u-2',/^.$/u.test(s));//true

	console.log('test',/𡁡{2}/.test('𡁡𡁡'));  //false
	console.log('test-2',/𡁡{2}/u.test('𡁡𡁡'));//true

}