//generator 异步的解决方案
//next yield


{
	//基本定义
	let tell = function* (){
		yield 'a';
		yield 'b';
		return 'c'
	}
	let k = tell();
	console.log(k.next());
	console.log(k.next());
	console.log(k.next()); //报错 因为不兼容，要安装babel-polyfill
}
//遍历器的返回值
{
	let obj = {};
	obj[Symbol.iterator] = function* (){
		yield 1;
		yield 2;
		yield 3;
	}
	for(let key of obj){
		console.log(value);
	}
}
{
	//状态机
	let state = function* (){
		while(1){
			yield 's';
			yield 'd';
			yield 'v';
		}
	}
	let status = state();
	console.log(status.next());
	console.log(status.next());
	console.log(status.next());
}

// {
// 	//和上面的一样的结果  但需要安装babel的插件
// 	let state =async function (){
// 		while(1){
// 			yield 's';
// 			yield 'd';
// 			yield 'v';
// 		}
// 	}
// 	let status = state();
// 	console.log(status.next());
// 	console.log(status.next());
// 	console.log(status.next());
// }
{
	let draw = function(count){  //次数没有保存在全局变量
	//具体抽奖逻辑
		console.log(`剩余${count}次`)
	}
	let reside = function* (count){
		while(count>0){
			count--;
			yield draw(count);
		}
	}
	let star = reside(5);

	let btn  =document.createElement('button');
	btn.id = 'start';
	btn.textContent = '抽奖';
	document.body.appendChild(btn);
	document.getElementById('start').addEventLister('click',function(){
		star.next();
	},false)

}

{
	//定时取状态  长轮询
	let ajax = function* (){
		yield new Promise(function(resolve,reject){
			setTimeout(function() {
				resolve({code:0})
			}, 10);
		})
	}
	let pull = function(){
		let generator = ajax();
		let step = generator.next();
		step.value.then(function(d){
			if(d.code!=0){
				setTimeout(function() {
					console.log('wait');
					pull()
				}, 1000);
			}else{
				console.log(d);
			}
		})
	}
	pull();

}




