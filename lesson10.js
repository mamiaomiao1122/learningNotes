//数据结构
//set-map

{
	//set集合元素不能重复，是唯一的
	//map:key可以是任何类型
}
{
	let list = new Set();
	list.add(5);
	list.add(7);
	console.log('size',list.size); //2
}
{
	let arr = [1,2,3,4,5];
	let list = new Set(arr);
	console.log('size',list.size); //5

}{
	let list = new Set();  //set集合元素不能重复，是唯一的;去重
	list.add(1);
	list.add(2);
	list.add(1);
	console.log('size',list); //1 2

	let arr=[1,2,3,1,2,'3'];
	let list2 = new Set(arr);
	console.log('size',list2);  //1 2 3 '3'  注意：不会做数据类型的转换
}
//add delete clear
{
	let arr =['add','delete','clear','has'];
	let list = new Set(arr);
	console.log('has',list.has('add')); //true
	console.log('delete',list.delete('add'),list); //true Set(3) {"delete", "clear", "has"}
	list.clear();
	console.log('delete',list);//Set(0) {}
}
//keys value entries forEach
{
	let arr =['add','delete','clear','has'];
	let list = new Set(arr);

	for(let key of list.keys()){
		console.log('keys',key)
	}
	for(let value of list.values()){ //list也是value
		console.log('value',value)
	}
	for(let [key,value] of list.entries()){ //list也是value
		console.log('entries',key,value)
	}
	list.forEach(function(item){console.log(item);})
}
//weakSet  没有size等属性 clear方法  不能遍历
{
	let weakList = new WeakSet();//1,只能必须是对象；2,对象是弱引用 不会和垃圾回收机制没关系
	let arg = {};
	weakList.add(arg);
	//weakList.add(2);  错误 只能是对象
	console.log(weakList);
}


{
	let map = new Map();
	let arr = ["123"];

	map.set(arr,456);   //key value
	console.log('map',map,map.get(arr));//Map(1) {Array(1) => 456}  456
}
{
	let map = new Map([['a',123],['b',456]]);
	console.log(map);//Map(2) {"a" => 123, "b" => 456}
	console.log('size',map.size); //2
	console.log('delete',map.delete('a'),map); // true Map(1) {"b" => 456}
	console.log('clear',map.clear(),map);
}

//map与set遍历是一样的

{
	let weakmap = new WeakMap();//接受对象 没有size clear 不能遍历
	let o ={};
	weakmap.set(o,123);
	console.log(weakmap.get(o)); //123

}















