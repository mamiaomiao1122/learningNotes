//symbol
//这种数据类型提供独一无二的值
{
	//声明
	let a1 = Symbol();
	let a2 = Symbol(); //不重复 不相等 保证唯一的
	console.log(a1 === a2); //false,独立无二的
	let a3 = Symbol.for('a3');
	let a4 = Symbol.for('a3');
	console.log(a3 === a4)  //true
}
{
	let a1 = Symbol.for('abc');
	let obj={
		[a1]:'123',
		'abc':345,
		'c':567
	};
	console.log('obj',obj);//obj {abc: 345, c: 567, Symbol(abc): "123"}
	for(let [key,value] of Object.entries(obj)){
		console.log('let of ',key,value); //取不到abc:123
	}
	Object.getOwnPropertySymbols(obj).forEach(function(item){
		console.log(obj[item]);  //123
	})
	Reflect.ownKeys(obj).forEach(function(item){
		console.log('ownKeys',item,obj[item]);
		//ownKeys abc 345
		//ownKeys c 567
		//ownKeys Symbol(abc) 123
	}); 
}