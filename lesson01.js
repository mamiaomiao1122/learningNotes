function letTest(){
	for(let i=1;i<3;i++){  //let不能重复定义变量，即let a =1; let a = 2;会报错
		console.log(i);  //块作用域内有用 
	}
	//console.log(i);  //块作用域的原因，会报错，未引用的错误
}
// letTest();

function constVariable(){
	const PI = 3.1415;  //声明的时候必须赋值
	// console.log(PI);

	const k={
		a:1
	}
	k.b = 3;
	console.log(k);   //会输出对象{a:1,b:3}数值不应该修改，引用类型是可修改的（指针）对象本身是可以变的

}
constVariable();
