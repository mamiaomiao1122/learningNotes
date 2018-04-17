//Decorator
//修饰器:1.是函数   2.修改行为   3.修改类的行为
//npm install babel-plugin-transform-decorators-legacy --save-dev

//在.babelrc文件里加入"plugins":["transform-decorators-legacy"]
//再启动服务--watch


{
	//限制属性只读
	let readonly = function(target,name,descriptor){
		descriptor.writable = false;
		return descriptor
	};

	class Test{
		@readonly  //修饰器，只读
		time(){
			return '2018-04-01'
		}
	}

	let test = new Test();
	// test.time = function(){  //报错
	// 	console.log('reset time');
	// }
	console.log(test.time());
}
{

	let typename = function(target,name,descriptor){
		target.myname = 'hello';//静态属性
	};
	@typename
	class Test{
		 
	}
	console.log(Test.myname);
}

//	第三方修饰器的js库：core-decorators;npm install core-decorators

{
	//修饰器对应的方法
	let log=(type)=>{
		return function(target,name,descriptor){
			let src_method = descriptor.value;
			descriptor.value = (...arg)=>{
				src_method.apply(target,arg);
				console.log(`log ${type}`);
			}
		}
	}
	class AD{
		@log('show')
		show(){
			console.log('ad is show');
		}

		@log('click')
		click(){
			console.log('ad is click')
		}
	}
	let ad = new AD();
	ad.show();
	ad.click();

}























