//字符串扩展
//

{
  console.log('a',`\u0061`);  //a a 
  console.log('s',`\u20BB7`);//s ₻7
  console.log('s',`\u{20BB7}`); //s 𠮷
}
{
  let s='𠮷';
  console.log('length',s.length); //length 2
  console.log('0',s.charAt(0)); //0 �
  console.log('1',s.charAt(1)); //1 �
  console.log('at0',s.charCodeAt(0));  //at0 55362
  console.log('at1',s.charCodeAt(1));  //at1 57271

  let s1='𠮷a';
  console.log('length',s1.length);//length 3
  console.log('code0',s1.codePointAt(0)); //code0 134071
  console.log('code0',s1.codePointAt(0).toString(16)); //code0 20bb7
  console.log('code1',s1.codePointAt(1)); //code1 57271
  console.log('code2',s1.codePointAt(2)); //code2 97
}
{
  console.log(String.fromCharCode("0x20bb7")); //ஷ
  console.log(String.fromCodePoint("0x20bb7"));//𠮷
}
{
  let str='\u{20bb7}abc';
  for(let i=0;i<str.length;i++){
    console.log('es5',str[i]);//es5 � � a b c
  }
  for(let code of str){
    console.log('es6',code);//es6 𠮷 a b c
  }
}
{
  let str="string";
  console.log('includes',str.includes("c")); //false
  console.log('start',str.startsWith('str')); //true
  console.log('end',str.endsWith('ng'));//true
}
{
  let str="abc";
  console.log(str.repeat(2)); //abcabc
}
{
  let name="asd";
  let info="hello world";
  let m=`i am ${name},${info}`;  //注意``号   i am asd,hello world
  console.log(m);
}
{
  console.log('1'.padStart(2,'0')); //补白 01
  console.log('1'.padEnd(2,'0'));   //10
}

{
  let user={
    name:'asd',
    info:'hello world'
  };
  console.log(abc`i am ${user.name},${user.info}`);  //i am ,,,asdhello world
  function abc(s,v1,v2){
    // console.log(s,v1,v2);
    return s+v1+v2
  }
}

{
  console.log(String.raw`Hi\n${1+2}`);  //Hi\n3
  console.log(`Hi\n${1+2}`);   
}



