
//类
//es6:getter setter

{
	//类的基本定义和生产的实例
	class Parent{
		constructor(name="zxc"){
			this.name = name;
		}
	}
	let v_parent = new Parent('v');
	console.log('constructor',v_parent)
}

{
	//继承
	class Parent{
		constructor(name="parent"){
			this.name = name;
		}
	}
	class Child  extends Parent{

	}

	console.log('继承',new Child()) ;//parent
}

{
	//继承参数
	class Parent{
		constructor(name="zxc"){
			this.name = name;
		}
	}
	class Child  extends Parent{
		constructor(name="child"){
			super(name); //如果没有name参数，就会传父类的默认参数
			this.type = 'child';//super必须第一行
		}
		
	}

	console.log('继承',new Child());//child  _Child {name: "child", type: "child"}
}
{
	//getter setter
	class Parent{
		constructor(name="hello"){
			this.name = name;
		}
		get longName(){  //属性
			return 'mm' + this.name;

		}
		set longName(value){
			this.name = value;
		}
	}
	let v = new Parent();

	console.log('getter',v.longName);//mmhello
	v.longName = 'world';
	console.log('setter',v.longName);//mmworld
}

{
	//静态方法static
	class Parent{
		constructor(name="zxc"){
			this.name = name;
		}
		static tell(){
		console.log('静态方法',"tell")
	}
	}
	
	Parent.tell();
}
{
	//静态属性，在类上直接定义
		class Parent{
		constructor(name="zxc"){
			this.name = name;
		}
		static tell(){
		console.log("tell")
	}
	}
	Parent.type = 'test';
	console.log('静态属性',Parent.type);//Parent是类 不是实例
}












