
//解构赋值，左边一种结构，右边一种结构，一一对应进行赋值  "数组解构，对象解构赋值"
function value(){
	let a,b,c;
	[a,b] = [10,20];
	console.log(a,b);
}
// value();
{
	let a,b,rest;
	[a,b,...rest]=[1,2,3,4,5,6]; //数组解构赋值
	// console.log(a,b,rest)
}
{
	let a,b,c;
	[a,b,c=23]=[1,2]; //数组解构赋值
	console.log(a,b,c)
}
{
	let a,b;
	({a,b}={a:1,b:2});  //对象解构赋值
	console.log(a,b)
}
{
	let a = 1;
	let b = 2;
	[a,b]  = [b,a];
	console.log(a,b)   //变量交换
}
{
	function f(){
		return [1,2];
	}
	let a,b;
	[a,b] = f();
	console.log(a,b)
}
{
	function f(){
		return [1,2,3,4,5];
	}
	let a,b,c;
	[a,,,b] = f();
	console.log(a,b)  //1 4
}
{
	function f(){
		return [1,2,3,4,5];
	}
	let a,b,c;
	[a,...b] = f();
	console.log(a,b)  //1  [2,3,4,5]
}


{
	let o={p:21,q:true};
	let {p,q} = o;
	console.log(p,q);
}
{
	let {a=10,b=5} = {a:3};
	console.log(a,b)   //3 5
}
{
	let maData = {
		title:'aaa',
		text:[{title:'test',
				desc:"descp"}]
	}
	let {title:esTitle,text:[{title:cnTitle}]} = maData;
	console.log(esTitle,cnTitle)
}