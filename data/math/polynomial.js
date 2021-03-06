
/**
 * @name	CeL polynomial function
 * @fileoverview
 * 本檔案包含了數學多項式的 functions。
 * @since	
 */


'use strict';
if (typeof CeL === 'function')
CeL.run({name:'data.math.polynomial',
code:function(library_namespace ) {

//	no required


var 
/**
 * null module constructor
 * @class 數學多項式相關之 function。
 * @constructor
 */
_// JSDT:_module_
= function () {
	//	null module constructor
};

/**
 * for JSDT: 有 prototype 才會將之當作 Class
 */
_// JSDT:_module_
.prototype = {};





//	polynomial	-----------------------------------

/*
	return [r1,r2,..[,餘式]]
	** 若有無法解的餘式，會附加在最後!

高次代數方程數值求根解法:	http://www.journals.zju.edu.cn/sci/2003/200303/030305.pdf	http://tsg.gxtvu.com.cn/eduwest/web_courseware/maths/0092/2/2-3.htm
	修正牛頓法 1819年霍納法 伯努利法 勞思表格法	http://en.wikipedia.org/wiki/Ruffini%27s_rule
	Newton's method牛頓法	x2=x1-f(x1)/f'(x1)	http://zh.wikipedia.org/wiki/%E7%89%9B%E9%A1%BF%E6%B3%95
四次方程Finding roots	http://zh.wikipedia.org/wiki/%E5%9B%9B%E6%AC%A1%E6%96%B9%E7%A8%8B
一元三次方程的公式解	http://en.wikipedia.org/wiki/Cubic_equation	http://math.xmu.edu.cn/jszg/ynLin/JX/jiaoxueKJ/5.ppt

var rootFindingFragment=1e-15;	//	因為浮點乘除法而會產生的誤差
*/
rootFinding[generateCode.dLK]='rootFindingFragment';
function rootFinding(polynomial){
 var r=[],a,q;

 //alert(NewtonMethod(polynomial));

 while(a=polynomial.length,a>1){
  if(a<4){
   if(a==2)r.push(-polynomial[1]/polynomial[0]);
   else{
    a=polynomial[1]*polynomial[1]-4*polynomial[0]*polynomial[2];	//	b^2-4ac
    q=2*polynomial[0];
    if(a<0)a=(Math.sqrt(-a)/Math.abs(q))+'i',q=-polynomial[1]/q,r.push(q+'+'+a,q+'-'+a);
    else a=Math.sqrt(a)/q,q=-polynomial[1]/q,r.push(q+a,q-a);
   }
   polynomial=[];break;
  }else if(a=NewtonMethod(polynomial),Math.abs(a[1])>rootFindingFragment){
   //alert('rootFinding: NewtonMethod 無法得出根!\n誤差:'+a[1]);
   break;
  }
  a=qNum(a[0],1e6);//alert(a[0]+'/'+a[1]);
  q=pLongDivision(polynomial,[a[1],-a[0]]);
  if(Math.abs(q[1][0])>pLongDivisionFragment){alert('rootFinding error!\n誤差:'+q[1][0]);break;}
  r.push(a[0]/a[1]),polynomial=q[0];
  //alert('get root: '+a[0]+'\n'+polynomial);
 }

 if(polynomial.length==5){	//	兩對共軛虛根四次方程
  q=[],a=polynomial.length,i=0;
  while(--a)q.push(polynomial[i++]*a);	//	微分
  if(q=rootFinding(q),q.length>1){
   //a=0;for(var i=0;i<polynomial.length;i++)a=a*q[0]+polynomial[i];
   //	將函數上下移動至原極值有根處，則會有二重根。原函數之根應為(-b +- (b^2-4ac)^.5)/2a，則此二重根即為-b/2a（？）
   //	故可將原函數分解為(x^2-2*q[n]*x+&)(?x^2+?x+?)
   //	以長除法解之可得&有三解:a*&^2+(-2*q[n]*(b+2*a*q[n])-c)*&+e=0 or ..
   q=q[0],a=4*polynomial[0]*q+polynomial[1];
   if(a==0){a=rootFinding([polynomial[0],-2*q*(polynomial[1]+2*q*polynomial[0])-polynomial[2],polynomial[4]]);if(a.length<2)a=null;else a=a[0];}
   else a=(2*polynomial[2]*q+polynomial[3]-2*polynomial[0]*q*(2*polynomial[0]*q+polynomial[1]))/a;
   var o;
   if(!isNaN(a)&&(q=pLongDivision(polynomial,o=[1,-2*q,a]),Math.abs(q[1][0])<pLongDivisionFragment&&Math.abs(q[1][1])<pLongDivisionFragment))
    a=rootFinding(q[0]),r.push(a[0],a[1]),a=rootFinding(o),r.push(a[0],a[1]),polynomial=[];
  }
 }

 if(polynomial.length>1){
  r.push(polynomial);
  //if(polynomial.length%2==1)alert('rootFinding error!');
 }
 return r;
}
//alert(rootFinding(getPbyR([1,4/3,5,2,6])).join('\n'));
//alert(NewtonMethod(getPbyR([1,4,5,2,6])).join('\n'));
//alert(rootFinding([1,4,11,14,10]).join('\n'));
//alert(rootFinding([1,2,3,2,1]).join('\n'));

/*	長除法 polynomial long division	http://en.wikipedia.org/wiki/Polynomial_long_division	2005/3/4 18:48
	dividend/divisor=quotient..remainder

	input	(dividend,divisor)
	return	[商,餘式]

var pLongDivisionFragment=1e-13;	//	因為浮點乘除法而會產生的誤差
*/
pLongDivision[generateCode.dLK]='pLongDivisionFragment';
function pLongDivision(dividend,divisor){
 if(typeof dividend!='object'||typeof divisor!='object')return;
 while(!dividend[0])dividend.shift();while(!divisor[0])dividend.shift();
 if(!dividend.length||!divisor.length)return;

 var quotient=[],remainder=[],r,r0=divisor[0],c=-1,l2=divisor.length,l=dividend.length-l2+1,i;
 for(i=0;i<dividend.length;i++)remainder.push(dividend[i]);
 while(++c<l)
  for(quotient.push(r=remainder[c]/r0),i=1;i<l2;i++){
   remainder[c+i]-=r*divisor[i];
   //if(Math.abs(remainder[c+i])<Math.abs(.00001*divisor[i]*r))remainder[c+i]=0;
  }
 return [quotient,remainder.slice(l)];
}
//alert(pLongDivision([4,-5,3,1/3+2/27-1],[3,-1]).join('\n'));

/*
//	polynomial multiplication乘法
function polynomialMultiplication(pol1,pol2){
 //for()
}
*/

/*	Newton Iteration Function	2005/2/26 1:4
	return [root,誤差]
*/
function NewtonMethod(polynomial,init,diff,count){
 var x=0,d,i,t,l,o,dp=[];
 if(!polynomial||!(d=l=polynomial.length))return;
 while(--d)dp.push(polynomial[x++]*d);	//	dp:微分derivative
 if(!diff)diff=rootFindingFragment;diff=Math.abs(diff);
 if(!count)count=15;
 x=init||0,o=diff+1,l--;
 //alert(polynomial+'\n'+dp+'\n'+diff+',l:'+l);
 while(o>diff&&count--){
  //alert(count+':'+x+','+d);
  for(d=t=i=0;i<l;i++)d=d*x+polynomial[i],t=t*x+dp[i];
  d=d*x+polynomial[l];
  //alert(d+'/'+t);
  if(t)d/=t;else d=1;//alert();
  t=Math.abs(d);
  if(o<=t)if(o<rootFindingFragment)break;else x++;	//	test
  o=t,x-=d;
 }
 return [x,d];
}

//	從roots得到多項式	2005/2/26 0:45
function getPbyR(roots){
 var p,r,i,c=0,l;
 if(!roots||!(l=roots.length))return;
 p=[1,-roots.pop()];
 while(++c<l)
  if(r=roots.pop()){p.push(-r*p[i=c]);while(i)p[i]-=p[--i]*r;}
  else p.push(0);
 return p;
}

//alert(getPbyR([1,2,3]));
//document.write(Newton1(getPbyR([2,32,5,3])));

//	↑polynomial	-----------------------------------






return (
	_// JSDT:_module_
);
}


});

