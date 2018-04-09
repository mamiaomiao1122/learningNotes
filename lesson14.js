//Promise
//是异步编程的解决方案（解决异步操作问题）
//a->b （a执行完在执行b） 传统的 1.回调函数；2.事件触发方式

// {
// //语法
// let promise = new Promise(function(resolve,reject){
// 	//resolve  成功调用
// 	//reject   失败调用
// });
// promise.then(res=>{

// },err=>{

// });
// promise.catch(err=>{
	
// })

// }

{
	//回调解决异步操作问题  模拟ajax过程
	let ajax = function(callback){
		console.log('zz');
		setTimeout(function(){
			callback&&callback.call()
		},1000)
	};
	ajax(function(){
		console.log('setTimeout1')
	})
}

{
	let ajax = function(){
		console.log('zz2');
		return new Promise(function(resolve,reject){
			setTimeout(function() {
				resolve()
			}, 1000);
		})
	};
	ajax().then(function(){
		console.log('promise','timeout2')
	})
}

{
	let ajax = function(){
		console.log('zz3');
		return new Promise(function(resolve,reject){
			setTimeout(function() {
				resolve()
			}, 1000);
		})
	};
	ajax()
		.then(function(){
		return new Promise(function(resolve,reject){
			setTimeout(function() {
				resolve()
			}, 2000);
		})
	})
		.then(function(){
			console.log('setTimeout3')
	})
}
{
	let ajax = function(num){
		console.log('zz4');
		return new Promise(function(resolve,reject){
			if(num>5){
				resolve();
			}else{
				throw new Error('error');
			}
		})
	}
	ajax(6).then(function(){
		console.log('log',6);
	}).catch(function(err){
		console.log('catch',err);
	})
}

{
	//所有图片加载完再添加到页面
	function loadImg(src){
		return new Promise((resolve,reject)=>{
			let img = document.createElement('img');
			img.src = src;
			img.onload = function(){
				resolve(img);
			}
			img.onerror = function(err){
				reject(err);
			}
		})
	}
	function showImg(imgs){
		imgs.forEach(function(img){
			document.body.appendChild(img);
		})
	}
	Promise.all([   //多个promise实例 生成一个新的promise实例
		loadImg('es6/app/css/picture01.png'),
		loadImg('/app/css/picture02.jpg'),
		loadImg('/app/css/picture03.png')
		]).then(showImg)
}

{
	//有一个图片加载完就添加到页面
	function loadImg(src){
		return new Promise((resolve,reject)=>{
			let img = document.createElement('img');
			img.src = src;
			img.onload = function(){
				resolve(img);
			}
			img.onerror = function(err){
				reject(err);
			}
		})
	}
	function showImg(imgs){
		let p=document.createElement('p');
		p.appendChild(img);
		document.body.appendChild(p);
		
	}
	Promise.race([   //多个promise实例 生成一个新的promise实例
		loadImg('es6/app/css/picture01.png'),
		loadImg('/app/css/picture02.jpg'),
		loadImg('/app/css/picture03.png')
		]).then(showImg)
}














