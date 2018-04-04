//proxy代理，中间层
//reflect反射
//俩者方法一样
{
	let obj = {   //供应商
		time:'2018-04-01',
		name:'net',
		_r:123
	};

	let monitor = new Proxy(obj,{
		//拦截对象属性的读取
		get(target,key){
			return target[key].replace('2018','2019')
		},
		//拦截对象设置属性
		set(target,key,value){
			if(key  === 'name'){
				return target[key] = value;
			}else{
				return target[key];
			}
		},
		//拦截key in object操作
		has(target,key){
			if(key === 'name'){
				return target[key];
			}else{
				return false;
			}
		},
		//拦截delete
		deleteProperty(target,key){
			if(key.indexOf('_')>-1){
				delete target[key];
				return true
			}else{
				return target[key];
			}
		},
		//拦截Object.keys,Object.getOwnPropertySymbols,object.getOwnPropertyNames
		ownKeys(target){
			return Object.keys(target).filter(item=>item!='time')//过滤掉time 相当于保护time的做法
		}
	});
	console.log('get',monitor.time);//2019-04-01
	monitor.time='2018';
	console.log('set',monitor.time);//2019-04-01  不能修改
	monitor.name='mamiao';
	console.log('set',monitor.name);//mamiao

	console.log('has','name' in monitor,'time' in monitor)  //true false
	console.log('ownKeys',Object.keys(monitor));
	delete monitor.time;
	console.log('delete',monitor);//未删除

	delete monitor._r;
	console.log('delete',monitor);//删除了
	
}

{    //Reflect,和上面的一样
	let obj = {   
		time:'2018-04-01',
		name:'net',
		_r:123
	};
	console.log(Reflect.get(obj,'time'));
	Reflect.set(obj,'name','zxcv');
	console.log(obj);
	console.log(Reflect.has(obj,'name'));//true
}

{
	//校验模块
	function validator(target,validator){  //this ，校验的条件
		return new Proxy(target,{
			_validator:validator,
			set(target,key,value,proxy){
				if(target.hasOwnProperty(key)){   //判断有没有key值
					let va = this._validator[key];
					if(!!va(value)){   //如果存在且满足条件
						return Reflect.set(target,key,value,proxy)
					}
					else{
						throw Error('不能设置');  //不满足条件的话，抛出异常
					}
				}else{
					throw Error('${key} 不存在');
				}
			}
		})
	}
	const personValid={   //校验的条件
		name(val){
			return typeof val==='string'
		},
		age(val){
			return typeof val ==='number' && val>18
		}
	}
	class Person{  //对象
		constructor(name,age){
			this.name =name;
			this.age=age;
			return validator(this,personValid)  //返回proxy对象,
		}
	}
	const person = new Person('mamiao',18);
	console.log(person); //Proxy {name: "mamiao", age: 18}
	// person.name=12;//报错
	person.age=22;//不可修改
}




















