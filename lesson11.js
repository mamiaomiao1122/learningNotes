//es5  object  array
//新增set  map 
//建议：优先使用map；如果对数据要求较高（唯一性）考虑使用set；放弃使用object和数组做存储
{
	//map和array的对比
	let map = new Map();
	let array = [];
	// 增
	map.set('t',1);
	array.push({t:1});
	console.log('map-array',map,array);
	// console.log('map-array',map,array);
 
	// 查
	let map_exist = map.has('t');
	let array_exist = array.find(item=>item.t);
	console.log(map_exist);  //true
	console.log(array_exist);//返回的值  {t: 1}

	// 改
	map.set('t',2);
	array.forEach(item=>item.t?item.t=2:"");
	console.log(map,array);  //{"t" => 2} [{…}]
	
	// 删
	map.delete('t');
	let index = array.findIndex(item=>item.t);
	array.splice(index,1);
	console.log(map,array);
}

{
	//set和array的对比
	let set = new Set();
	let array = [];
	// 增
	set.add({t:1});
	array.push({t:1});
	console.log('set -array',set,array);

	// 查
	let set_exist = set.has({t:1});
	let array_exist = array.find(item=>item.t);
	console.log('set-array',set_exist,array_exist); //false {t: 1}
	
	// 改
	set.add({t2:2});set.add({t3:3}); //直接新增了
	console.log('set-add',set);

	set.forEach(item=>item.t?item.t=2:"")
	array.forEach(item=>item.t?item.t=2:"");
	console.log('set-array',set,array);  //{"t" => 2} [{…}]
	
	// 删
	set.forEach(item=>item.t?set.delete(item):"");
	let index = array.findIndex(item=>item.t);
	array.splice(index,1);
	console.log('set-array-delete',set,array);
}


{
	// map set object的对比
	let item = {t:1};
	let map = new Map();
	let set = new Set();
	let obj ={};
	// 增
	map.set('t',1);
	set.add(item);
	obj['t'] = 1;
	console.log('map-set-object',obj,map,set);
	// 查
	console.log({
		map_exist:map.has('t'),
		set_exist:set.has(item),
		obj_exist:'t' in obj
	})
	// 改
	map.set('t',2);
	item.t=2; //forEach()
	obj['t']=2;
	console.log('map-set-object-modify',obj,map,set);
	// 删
	map.delete('t');
	set.delete(item);
	delete obj['t'];
	console.log('map-set-object-delete',obj,map,set);

}