
/**
 * @name	CeL: JS library base function
 * @fileoverview
 * 本檔案包含了 library 常用 base functions。
 * @since	2010/1/8 22:21:36
 */


/*
TODO
將 module_name 改成 arguments
http://threecups.org/?p=129

listen language change event
play board

use <a href="http://prototyp.ical.ly/index.php/2007/03/01/javascript-design-patterns-1-the-singleton/" accessdate="2010/4/25 0:23" title="prototyp.ical.ly  &amp;raquo; Javascript Design Patterns - 1. The Singleton">Singleton pattern</a>,
Module 模式或單例模式（<a href="http://zh.wikipedia.org/wiki/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F" accessdate="2010/4/25 0:25" title="单例模式">Singleton</a>）<a href="http://www.comsharp.com/GetKnowledge/zh-CN/TeamBlogTimothyPage_K950.aspx" accessdate="2010/4/25 0:24" title="那些相见恨晚的 JavaScript 技巧 - 基于 COMSHARP CMS">為 Douglas Crockford 所推崇</a>，並被大量應用在 Yahoo User Interface Library YUI。

http://wiki.forum.nokia.com/index.php/JavaScript_Performance_Best_Practices
http://ioio.name/core-javascript-pitfalls.html

CommonJS
http://www.heliximitate.cn/studyblog/archives/tag/commonjs

*/


/*
TODO



//module

//typeof CeL_id === 'string' && typeof this[CeL_id] === 'function' &&
typeof CeL === 'function' && CeL.setup_module({
name:[module_name],
require:[function_name,module_name],

code:function(CeL){

var private_value=1;

function module_function_1(arg) {
	;
}
module_function_1.required='';


function module_class_1(arg) {
	;
}

function get_value(){
	return private_value;
}

module_class_1.prototype.print=function(){};
module_class_1.print=function(){};


return {module_function_1,module_class_1};

}

});

2011/7/31 21:18:01




*/

//void(
//typeof CeL !== 'function' &&
(
/*
 * We can redefine native values only for undefined.<br/>
 * http://weblogs.asp.net/bleroy/archive/2006/08/02/Define-undefined.aspx<br/>
 * <br/>
 * Will speed up references to undefined, and allows redefining its name. (from jQuery)<br/>
 * <br/>
 * 用在比較或是 return undefined<br/>
 * 在舊的 browser 中，undefined 可能不存在。
 */
function (_undefined) {

/*
 * ECMA-262 5th edition, ECMAScript 5 strict mode
 * http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
 * http://davidflanagan.com/Talks/es5/slides.html
 * http://kangax.github.com/es5-compat-table/
 */
'use strict';


//if(typeof global !== 'function') throw new Error('No global object specified!');


var
	library_name = 'CeL'

	/**
	 * default debug level
	 * @type	{Integer}
	 * @ignore
	 */
	, debug = 0

	/**
	 * library version
	 * @type	{String}
	 * @ignore
	 */
	, version = '2011.08.27'


	, old_namespace


	//, _base_function_to_extend

	, function_name_pattern
	;


//		members of library	-----------------------------------------------
;


/**
 * Global Scope object<br/>
 * 於 CeL.eval_code 使用
 * @ignore
 * @see
 * <a href="http://stackoverflow.com/questions/3277182/how-to-get-the-global-object-in-javascript" accessdate="2011/8/6 10:7">How to get the Global Object in JavaScript? - Stack Overflow</a>
 */
var global = Function('return this')();	//	isWeb()?window:this;

try {
	old_namespace = global[library_name];
} catch (e) {
	throw new Error(library_name + ': Can not get global scope!');
}



/*
var _Global=(function(){return this;})();
_Global.JustANumber=2;	//	var _GlobalPrototype=_Global.constructor.prototype;_GlobalPrototype.JustANumber=2;
if(typeof _Global=='undefined')_Global=this;
for(i in _Global)alert(i);
*/

//	若已經定義過，跳過。因為已有對 conflict 的對策，因此跳過。
//if(global[library_name] !== undefined) return;


/**
 * Will speed up references to DOM: window, and allows redefining its name. (from jQuery)
 * @ignore
 */
//window = this;


/**
 * 本 JavaScript framework 的框架基本宣告<br/>
 * base name-space declaration of JavaScript library framework
 * 
 * @name	CeL
 * @class	Colorless echo JavaScript kit/library: library base name-space
 */
function _() {
	//	function CeL: library root
	//	declaration for debug
	//this.global = arguments[0] || arguments.callee.ce_doc;
	return new (this.init.apply(global, arguments));
};

//if (typeof _.prototype !== 'object')
_// JSDT:_module_
.
/**
 * framework main prototype definition
 * for JSDT: 有 prototype 才會將之當作 Class
 */
prototype = {
};


//	name-space 歸屬設定

_// JSDT:_module_
.
get_old_namespace = function(){
	return old_namespace;
};

_// JSDT:_module_
.
recover_namespace = function(){
	if (old_namespace === undefined)
		delete global[library_name];
	else
		global[library_name] = old_namespace;
	return _;
};



_// JSDT:_module_
.
/**
 * JavaScript library framework main class name.
 * @see	<a href="http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf">ECMA-262</a>: Object.Class: A string value indicating the kind of this object.
 * @constant
 */
Class = library_name;





var is_WWW = typeof window === 'object'
	&& global === window
	&& typeof setTimeout !== 'undefined'
		&& setTimeout === window.setTimeout
	&& typeof document === 'object'
		&& document === window.document
	&& typeof location === 'object'
		&& location === window.location
	// 下兩個在 IE5.5 中都是 Object
	//&& library_namespace.is_type(window, 'global')
	//&& library_namespace.is_type(document, 'HTMLDocument')
,
is_W3CDOM =
	is_WWW
	// W3CDOM, type: Object @ IE5.5
	&& document.createElement
	// &&!!document.createElement
	//	type: Object @ IE5.5
	&& document.getElementsByTagName;

_// JSDT:_module_
.
/**
 * Are we in a web environment?
 * @param {Boolean} W3CDOM	Test if we are in a World Wide Web Consortium (W3C) Document Object Model (DOM) environment.
 * @return	We're in a WWW environment.
 * @since	2009/12/29 19:18:53
 * @see
 * use lazy evaluation
 * @_memberOf	_module_
 */
is_WWW = function(W3CDOM) {
	return W3CDOM ? is_W3CDOM : is_WWW;
};





_// JSDT:_module_
.
/**
 * 本 library 專用之 evaluate()。
 * 
 * 若在 function 中 eval 以獲得 local variable，在舊 browser 中須加 var。
 * e.g., 'var local_variable=' + ..
 * 不加 var 在舊 browser 中會變成 global 變數。
 * @param code	script code to evaluate
 * @returns	value that evaluate process returned
 * @see	window.eval === window.parent.eval
 * http://stackoverflow.com/questions/3277182/how-to-get-the-global-object-in-javascript
 */
eval_code = function eval_code(code) {
	/*
		JSC eval() takes an optional second argument which can be 'unsafe'.
		Mozilla/SpiderMonkey eval() takes an optional second argument which is the scope object for new symbols.

		use window.execScript(code,"JavaScript") in IE: window.execScript() 將直接使用全局上下文環境，因此，execScript(Str)中的字符串Str可以影響全局變量。——也包括聲明全局變量、函數以及對象構造器。
	*/
	//this.debug(global.eval, 2);
	//this.debug(global.eval && global.eval !== arguments.callee);
	return global.eval && global.eval !== eval_code ? global.eval.call(global, code) : eval(code);
};


_// JSDT:_module_
.
/**
 * evaluate @ Global scope.
 * By the ECMA-262, new Function() will 'Pass in the Global Environment as the Scope parameter.'
 * copy from jQuery core.js
 * @param code	script code to evaluate
 * @returns	value that evaluate process returned
 * @see
 * <a href="http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context" accessdate="2011/8/6 8:56">Eval JavaScript in a global context | Java.net</a>
 * use execScript on Internet Explorer
 */
global_eval = new Function('code', 'return '
		+ (
			global.execScript ? 'global.execScript('
			: global.eval ? 'global.eval.call(global,'
			: is_WWW && window.eval ? 'window.eval.call(window,'
			: 'eval.call(null,'
		)
		+ 'code);');



_// JSDT:_module_
.
/**
 * simple evaluates to get value of specified variable identifier name.
 * 不使用 eval().
 * BUG:
 * 無論是不是相同 name_space，只要 variable_name 相同，即會執行 modify_function。
 * 以記憶體空間換取時間效率，會增加記憶體空間之使用。
 * 
 * @param {String} variable_name	variable identifier name. e.g., /[a-z\d$_]+(.[a-z\d_]+)+/i
 * @param {Function} [modify_function]	註冊:當以 .set_variable() 改變時，順便執行此函數: modify_function(value, variable_name).
 * @param {Object|Function} [name_space]	initialize name-space. default: global.
 * @param [value]	設定 variable 為 value.
 * @returns	value of specified variable identifier name
 * @since	2010/1/1 18:11:40
 * @note
 * 'namespace' 是 JScript.NET 的保留字
 * 
 * 在兩個子層(a.b.c)下，這樣作效率較差 @User agent: Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.29 Safari/533.4:
 * function(v){try{return(new Function('return('+v+')'))();}catch(e){}}
 */
get_variable = function(variable_name, modify_function, name_space, value) {
	var variable_name_array;
	if (_.is_Array(variable_name) && variable_name.length)
		variable_name_array = variable_name,
		variable_name = variable_name.join('.');
	else if (typeof variable_name === 'string' && variable_name)
		variable_name_array = variable_name.split('.');
	else
		//	return variable_name: 預防 get_variable(null/undefined/NaN)
		return variable_name;

	//this.debug('get value of [' + variable_name + ']');
	if (_.is_Function(modify_function)) {
		if (variable_name in modify_function_hash)
			modify_function_hash[variable_name].push(modify_function);
		else
			modify_function_hash[variable_name] = [ modify_function ];
	}

	var i = 0,
	//	TODO: 可處理 e.g., obj1  . obj2 [ ' obj3.4 * \[ ' ] [''] . obj5 [ " obj6 \" \' \] . " ]
	//	or detect obj1 .. obj2
	l = variable_name_array.length,
	v = name_space ||
		//this.env.global
		global,
	set_value = arguments.length > 3;
	//this.debug('global.' + this.Class + ' = ' + this.env.global[this.Class]);

	if(set_value)
		l--;

	try {
		while (i < l)
			// this.debug('to [' + variable_name_array[i] + ']: ' + v[variable_name_array[i]]),
			v = v[variable_name_array[i++]];

		if (set_value) {
			v[variable_name_array[i]] = value;
			if (set_value = modify_function_hash[variable_name])
				for (i in set_value)
					try {
						set_value[i](value, variable_name);
					} catch (e) {
						// TODO: handle exception
					}
		}

	} catch (e) {
		variable_name_array[i - 1] = '<em>' + variable_name_array[i - 1] + '</em><span class="debug_weaken">';
		//alert(this.log.buffer.length + ',' + this.log.max_length + '\n' + this.debug);
		this.debug('Cannot ' + (set_value ? 'set' : 'get') +
				' [<span title="' + variable_name + '">' + variable_name_array.join('.') + '</span></span>]!', 2, 'get_variable');
		return;
	}

	return v;
};

var modify_function_hash = {};

_// JSDT:_module_
.
/**
 * simple evaluates to set value of specified variable identifier name.
 * 不使用 eval().
 * @param {String} variable_name	variable identifier name. e.g., /[a-z\d$_]+(.[a-z\d_]+)+/i
 * @param [value]	設定 variable 為 value.
 * @param {Object|Function} [name_space]	initialize name-space. default: global.
 * @returns	name-space of specified variable identifier name. e.g., return a.b.c when call .set_variable('a.b.c.d').
 * @since	2011/8/27 15:43:03
 */
set_variable = function(variable_name, value, name_space) {
	return _.get_variable(variable_name, null, name_space, value);
};


_// JSDT:_module_
.
/**
 * 取得執行 script 之 path, 在 .hta 中取代 WScript.ScriptFullName。
 * @returns	{String}	執行 script 之 path
 * @returns	''	unknown environment
 */
get_script_full_name = function() {
	//	在 IE8, IE9 中，get_object_type.call(WScript) 為 '[object Object]' !!
	return typeof WScript === 'object' && (!this.is_Object(WScript) || String(WScript) === 'Windows Script Host')
				&& WScript.ScriptFullName
		|| is_WWW && unescape(location.pathname)
		|| '';
};

_// JSDT:_module_
.
/**
 * 取得執行 script 之名稱
 * @returns	{String} 執行 script 之 名稱
 * @returns	''	unknown environment
 */
get_script_name = function() {
	var n, i, j;

	//	在 IE8, IE9 中，get_object_type.call(WScript) 為 '[object Object]' !!
	if (typeof WScript === 'object'
		&& (!this.is_Object(WScript) || String(WScript) === 'Windows Script Host')) {
		n = WScript.ScriptName;
		i = n.lastIndexOf('.');
		return i == -1 ? n : n.slice(0, i);
	}

	if (is_WWW) {
		n = unescape(location.pathname), j = n.lastIndexOf('.');
		if (!(i = n.lastIndexOf('\\') + 1))
			//	location.pathname 在 .hta 中會回傳 '\' 形式的 path
			i = n.lastIndexOf('/') + 1;
		//return document.title;
		return i < j ? n.slice(i, j) : n.slice(i);
	}
};




/*
測試各 type:

undefined:
變數值存在且變數 'undefined' 存在時: variable === undefined
否則: typeof(variable) === 'undefined'

number, boolean, string:
typeof(variable) === '~'

** NaN
** int/float

object:
null

不同frame中的Array擁有不同的constructor
*/
/**
 * A cache to the function we use to get the type of specified value.<br/>
 * Get the [[Class]] property of this object.<br/>
 * 不使用 Object.toString() 是怕被 overridden
 * @type	{Function}
 * @inner
 */
var get_object_type = Object.prototype.toString;

_// JSDT:_module_
.
/**
 * 判斷為何種 type。主要用在 Error, DOMException 等 native object 之判別。
 * @param	value	variable or class instance to test
 * @param	{String} [want_type]	type to compare: number, string, boolean, undefined, object, function
 * @param	{Boolean} [get_Class]	get the class name of a class(function) instance.
 * @returns	{Boolean}	The type is matched.
 * @returns	{String}	The type of value
 * @returns	{undefined}	error occurred
 * @example
 * CeL.is_type(value_to_test, 'Array');
 * @since	2009/12/14 19:50:14
 * @see
 * <a href="http://lifesinger.org/blog/2009/02/javascript-type-check-2/" accessdate="2009/12/6 19:10">JavaScript类型检测小结（下） - 岁月如歌</a><br/>
 * <a href="http://thinkweb2.com/projects/prototype/instanceof-considered-harmful-or-how-to-write-a-robust-isarray/" accessdate="2009/12/6 19:10">Perfection kills &raquo; `instanceof` considered harmful (or how to write a robust `isArray`)</a>
 */
is_type = function(value, want_type, get_Class) {
	var type;
	if (want_type && (type = typeof want_type) !== 'string')
		want_type = type;

	type = value === null ? String(value) : typeof value;

	if (get_Class)
		try {
			if(type === 'function' && value.Class)
				//	get the class name of a class
				//	若 value 為 function 時，測試其本身之 Class。
				type = value.Class;
			else if (type === 'function' || type === 'object')
				if (('constructor' in value) && (get_Class = value.constructor).Class)
					// get the class name of a class instance
					// 若 value 為 function 且無 Class，或為 object 時，測試其 constructor 之 Class。
					type = get_Class.Class;
				else if (get_Class = this.get_function_name(get_Class))
					// get Class by function name
					type = get_Class;
		} catch (e) {
			this.err(this.Class + '.is_type: Fault to get ths class name of value!');
		}

	if (type !== 'object')
		//	type maybe 'unknown' or 'date'!
		return want_type ? type === want_type.toLowerCase() : type;

	try {
		get_Class = get_object_type.call(value);
	} catch (e) {
		this.err(this.Class + '.is_type: Fault to get object type of value!');
		get_Class = '';
	}

	if (want_type)
		return get_Class === (want_type.charAt(0) === '[' ? want_type
				: '[object ' + want_type + ']');

	if (want_type = get_Class.match(
					/^\[object ([^\]]+)\]$/))
		return want_type[1];

	return type;
};


_// JSDT:_module_
.
/**
 * get a type test function
 * @param	{String} want_type	object type to compare
 * @param	{String} [toString_reference]	a reference name to Object.prototype.toString
 * @returns	{Function}	type test function
 * @since	2009/12/20 08:38:26
 * @example
 * // 大量驗證時，推薦另外在本身 scope 中造出捷徑：
 * this.OtS = Object.prototype.toString;
 * var is_Array = CeL.object_tester('Array', 'OtS');
 * // test
 * if(is_Array(value))
 * 	//	it's really a native Array
 * 	;
 */
object_tester = function(want_type, toString_reference) {
	var t = '[object ' + want_type + ']';

/*
	return new Function('v', 'return "' + t + '"==='
				+ (toString_reference ||
						//	在 Google Chrome 中 'Object.prototype.toString' 可以與其 reference 同速度，但其他的 reference 會快些。
						'Object.prototype.toString'
						//'get_object_type'
						)
				+ '.call(v);');
*/

	return typeof toString_reference === 'string'
		&& toString_reference ?
			new Function('v', 'return "' + t
				+ '"===' + toString_reference + '.call(v);')

			//	slow@Chrome
			: function(v) { return t === get_object_type.call(v); };
			//	faster@Chrome
			//: new Function('v', 'return "' + t + '"===Object.prototype.toString.call(v);');

};

_// JSDT:_module_
.
/**
 * Test if the value is a native Array.
 * @param	v	value to test
 * @returns	{Boolean}	the value is a native Array.
 * @since	2009/12/20 08:38:26
 */
is_Array =
	// _.object_tester('Array');
	function(v) {
		// instanceof 比 Object.prototype.toString 快
		return v instanceof Array
				|| get_object_type.call(v) === '[object Array]';
	};

_// JSDT:_module_
.
/**
 * Test if the value is a native Object.
 * TODO:
 * test null
 * @param	v	value to test
 * @returns	{Boolean}	the value is a native Object.
 * @since	2009/12/20 08:38:26
 */
is_Object =
	//	Object.prototype.toString.call(undefined) === '[object Object]' @ MSIE 6.0
	get_object_type.call(undefined) === '[object Object]'?
	function(v) {
		return typeof v !== 'undefined'
				&& get_object_type.call(v) === '[object Object]';
	}
	:
	//_.object_tester('Object');
	function(v) {
		//	非如此不得與 jQuery 平起平坐…
		return get_object_type.call(v) === '[object Object]';
	};

_// JSDT:_module_
.
/**
 * Test if the value is a native Function.
 * @param	v	value to test
 * @returns	{Boolean}	the value is a native Function.
 * @since	2009/12/20 08:38:26
 */
is_Function =
	//_.object_tester('Function');
	function(v) {
		//	typeof 比 Object.prototype.toString 快，不過得注意有些 native object 可能 type 是 'function'，但不具有 function 特性。
		return get_object_type.call(v) === '[object Function]';

		//	須注意，在 firefox 3 中，typeof [object HTMLObjectElement] 之外的 HTMLElement 皆 === 'function'，
		//	因此光用 typeof() === 'function' 而執行下去會得出 [XPCWrappedNative_NoHelper] Component is not available
		//return typeof v === 'function' || get_object_type.call(v) === '[object Function]';
	};


//----------------------------------------------------------------------------------------------------------------------------------------------------------//


_// JSDT:_module_
.
/**
 * 取得/設定環境變數 enumeration<br/>
 * （雖然不喜歡另開 name-space，但以 2009 當下的 JsDoc Toolkit 來說，似乎沒辦法創造 enumeration。）
 * @class	環境變數 (environment variables) 與程式會用到的 library 相關變數 / configuration。
 * @param {String} name	環境變數名稱
 * @param value	環境變數之值
 * @returns	舊環境變數之值
 * @_memberOf	_module_
 */
env = function env(name, value) {
	if (!name)
		//return undefined;
		return;

	var _s = env, v = _s[name];

	if (arguments.length > 1) _s[name] = value;
	//if (typeof value !== 'undefined') _s[name] = value;

	return isNaN(v) ? String(v) : v;
};


_// JSDT:_module_
.
/**
 * Setup environment variables
 * @param	{String} [OS_type]	type of OS
 * @param	{Boolean} [reset]	reset the environment variables 
 * @returns	{Object}	environment variables set
 */
initial_env = function(OS_type, reset){
	if (reset)
		this.env = {};

	var OS, env = this.env;

	/**
	 * default extension of script file.
	 * 設定成 '.' 時由 CeL.get_script_base_path 設定
	 * @type	String
	 * @see
	 * <a href="http://soswitcher.blogspot.com/2009/05/blogger-host-javascript-file-for-free.html" accessdate="2010/3/11 23:30">Blogger - Host Javascript File for Free - Blogger,Javascript - Blogger Blog by Switcher</a>
	 * @name	CeL.env.script_extension
	 */
	env.script_extension = typeof WScript === 'undefined' ? '.' : '.js';//'.txt'

	/**
	 * library main file base name
	 * @name	CeL.env.main_script_name
	 * @type	String
	 */
	env.main_script_name = 'ce';

	/**
	 * library main file name<br/>
	 * full path: {@link CeL.env.registry_path} + {@link CeL.env.main_script}
	 * @example:
	 * CeL.log('full path: ['+CeL.env.registry_path+CeL.env.main_script+']');
	 * @name	CeL.env.main_script
	 * @type	String
	 */
	env.main_script = env.main_script_name + env.script_extension;

	/**
	 * module 中的這 member 定義了哪些 member 不被 extend
	 * @name	CeL.env.not_to_extend_keyword
	 * @type	String
	 */
	env.not_to_extend_keyword = 'no_extend';

	/**
	 * 本 library source 檔案使用之 encoding<br/>
	 * 不使用會產生語法錯誤
	 * @name	CeL.env.source_encoding
	 * @type	String
	 */
	env.source_encoding = 'UTF-16';

	/**
	 * default global object.
	 * 有可能為 undefined!
	 * @name	CeL.env.global
	 * @type	Object
	 */
	env.global = global;

	/**
	 * creator group / 組織名稱 organization name
	 * @name	CeL.env.organization
	 * @type	String
	 */
	env.organization = 'Colorless echo';

	/**
	 * 在 registry 中存放 library 資料的 base path
	 * @name	CeL.env.registry_base
	 * @type	String
	 */
	env.registry_base = 'HKCU\\Software\\' + env.organization + '\\' + this.Class
				+ '\\';
	/**
	 * 在 registry 中存放 library 在 File System 中的 base path 的 key name
	 * @name	CeL.env.registry_base
	 * @type	String
	 */
	env.registry_path_key_name = env.registry_base + 'path';
	//if(typeof WScript === 'object')
	try {
		//WScript.Echo(env.registry_path_key_name);

		/**
		 * 存放在 registry 中的 path，通常指的是 library 在 File System 中的 base path
		 * @name	CeL.env.registry_path
		 * @type	String
		 */
		env.registry_path = (WScript.CreateObject("WScript.Shell"))
			.RegRead(env.registry_path_key_name)
			// 去除 filename
			//.replace(/[^\\\/]+$/, '')
			;
		//this.debug(env.registry_path);
	} catch (e) {
		// this.warn(e.message);
	}


	//條件式編譯(条件コンパイル) for version>=4, 用 /*@ and @*/ to 判別
	/*@cc_on
	@if(@_PowerPC||@_mac)
	 OS='Mac';
	@else
	 @if(@_win32||@_win64||@_win16)
	  OS='Windows';
	 @else
	  OS='UNIX';	//	unknown
	 @end
	@end@*/

	/**
	 * 本次執行所在 OS 平台
	 * @name	CeL.env.OS
	 * @type	String
	 */
	env.OS = OS = typeof OS_type === 'string' ? OS_type
			// 假如未設定則取預設值
			: (OS || 'UNIX');

	/**
	 * 文件預設 new line
	 * @name	CeL.env.new_line
	 * @type	String
	 */
	env.new_line =		OS === 'UNIX' ? '\n' : OS === 'Mac' ? '\r' : '\r\n';	//	in VB: vbCrLf
	/**
	 * file system 預設 path separator<br/>
	 * platform-dependent path separator character, 決定目錄(directory)分隔
	 * @name	CeL.env.path_separator
	 * @type	String
	 */
	env.path_separator	=	OS === 'UNIX' ? '/' : '\\';
	/**
	 * 預設 module name separator
	 * @name	CeL.env.module_name_separator
	 * @type	String
	 */
	env.module_name_separator = '.';
	/**
	 * path_separator in 通用(regular)運算式
	 * @name	CeL.env.path_separator_RegExp
	 * @type	RegExp
	 */
	env.path_separator_RegExp = this.to_RegExp_pattern ?
			this.to_RegExp_pattern(env.path_separator)
			: (env.path_separator === '\\' ? '\\' : '') + env.path_separator;
	/**
	 * 預設語系
	 * 0x404:中文-台灣,0x0411:日文-日本
	 * @name	CeL.env.locale
	 * @see	<a href="http://msdn.microsoft.com/zh-tw/library/system.globalization.cultureinfo(VS.80).aspx">CultureInfo 類別</a>
	 * @type	Number
	 */
	env.locale = 0x404;

	/**
	 * script name
	 * @name	CeL.env.script_name
	 * @type	String
	 */
	env.script_name = this.get_script_name();
	/**
	 * base path of script.
	 * TODO
	 * 以 reg 代替
	 * @name	CeL.env.script_base_path
	 * @type	String
	 */
	env.script_base_path = this.get_script_full_name()
		// 去除 filename
		.replace(/[^\\\/]+$/, '');

	/**
	 * Legal identifier name in RegExp.
	 * 這 pattern 會佔去兩個筆紀錄: first letter, and least.
	 * .replace(/_/ [g],'for first letter')
	 * .replace(/\\d/,'for least')
	 * 這邊列出的只是合法 identifier 的*子集*，且未去除 reserved words!
	 * 請注意實際判別須加入 ^..$
	 * 
	 * 不用 \d 而用 0-9 是因為 \d 還包括了 MATHEMATICAL BOLD DIGIT。
	 * <a href="http://blog.est.im/archives/3229" accessdate="2010/11/16 20:6">基于正则的URL匹配安全性考虑</a>
	 * @name	CeL.env.identifier_RegExp
	 * @see
	 * ECMA-262	7.6 Identifier Names and Identifiers
	 * @type	RegExp
	 */
	env.identifier_RegExp = /([a-zA-Z$_]|\\u[0-9a-fA-F]{4})([a-zA-Z$_0-9]+|\\u[0-9a-fA-F]{4}){0,63}/;

	/**
	 * Legal identifier name in String from env.identifier_RegExp.
	 * @name	CeL.env.identifier_String
	 */
	env.identifier_String = env.identifier_RegExp.source;

	return env;
};


_// JSDT:_module_
.
//	TODO
get_identifier_RegExp = function(pattern, flag, add_for_first_letter, add_for_all_letter) {
	var s = this.env.identifier_String;
	if (add_for_first_letter)
		s = s.replace(/_/g, add_for_first_letter);
	if (add_for_all_letter)
		s = s.replace(/0-9/g, add_for_all_letter);

	return new RegExp(
			(get_object_type.call(pattern) === '[object RegExp]' ? pattern.source : pattern)
				.replace(/$identifier/g, s), flag || '');
};


//----------------------------------------------------------------------------------------------------------------------------------------------------------//


_// JSDT:_module_
.
/**
 * Tell if it's now debugging.
 * @param {Integer} [debug_level]	if it's now in this debug level.
 * @returns	{Boolean}	It's now in specified debug level.
 * @returns	{Number}	It's now in what debug level (Integer).
 */
is_debug = function(debug_level){
	return typeof debug_level === 'undefined' ? debug
				: debug >= debug_level;
};

_// JSDT:_module_
.
/**
 * Set debugging level
 * @param {Integer} [debug_level]	The debugging level to set.
 * @type	Integer
 * @returns	{Number} debugging level now
 */
set_debug = function (debug_level) {
	if (!isNaN(debug_level))
		debug = debug_level;

	else if (typeof debug_level === 'undefined' && !debug)
		debug = 1;

	return debug;
};


/*
CeL.extend(function f_name(){}, object || string, initial arguments);
CeL.extend({name:function(){},.. }, object || string);
CeL.extend([function1,function12,..], object || string);

set .name
*/







_// JSDT:_module_
.
/**
 * Get the hash key of text.
 * @param {String} text	text to test
 * @returns	{String}	hash key
 */
_get_hash_key = function(text) {
	//text = String(text);
	//text = '' + text;
	var l = text.length, take = 30, from = .3;
	from = Math.floor(l * from);
	//this.log(from + '~' + l + ': ' + (l - from < take ? text : text.substr(from, take)));
	return l - from < take ? text : text.substr(from, take);
};


//	for JScript<=5
try {
	function_name_pattern = new RegExp('^function[\\s\\n]+(\\w+)[\\s\\n]*\\(');
} catch (e) {
	function_name_pattern = function emulate_function_name(fs) {
		fs = String(fs);
		var l = 'function ', r, s;

		if (fs.indexOf(l) === 0) {
			l = l.length;
			s = {
					' ' : 1,
					'\n' : 1,
					'\r' : 1,
					'\t' : 1
			};
			while (fs.charAt(l) in s)
				l++;
			r = fs.indexOf('(', l);
			while (fs.charAt(--r) in s)
				;

			return [ , fs.slice(l, r + 1) ];
		}
	};
	if (typeof RegExp != 'object')
		eval('RegExp = function(){};');
}

_// JSDT:_module_
.
/**
 * 獲得函數名
 * @param {Function} fr	function reference
 * @param {String} ns	name-space
 * @param {Boolean} force_load	force reload this name-space
 * @returns
 * @see
 * 可能的話請改用 {@link CeL.native.parse_function}(F).funcName
 * @since	2010/1/7 22:10:27
 */
get_function_name = function(fr, ns, force_load) {
	var _s = _.get_function_name,
	//	初始化變數 'm'
	m = 0, ft, b, load, k, i;
	if (!fr)
		try{
			fr = _s.caller;
		}catch (e) {
			// TODO: handle exception
		}

	//	get function text (函數的解譯文字)
	//	不用 insteadof 是怕傳入奇怪的東西，例如 {string} script code
	m = typeof fr;
	if (m === 'function') {
		//	勿更改傳入之 argument
		/*
		if ('toString' in fr) {
			m = fr.toString;
			delete fr.toString;
		}
		ft = String(fr);
		if (m)
			fr.toString = m;
		*/
		//	TODO: cache Function.prototype.toString
		ft = Function.prototype.toString.call(fr);
	} else if(m === 'string')
		// typeof fr === 'string'
		ft = fr;
	else
		return '';

	//	以函數的解譯文字獲得函數名
	if (m = function_name_pattern instanceof RegExp ?
			//	包含引數:	+ '(' + (f ? m[2] : '') + ')';
			((m = ft.match(function_name_pattern)) && m[1] || 0)
			: function_name_pattern instanceof Function ?
				function_name_pattern(ft)
				: 0){
		//this.debug('matched ' + m, 1, this.Class + '.get_function_name');
		return m;
	}
	//	無法從 function code 本身得到 name 之資訊。

	//	查詢是否是已註冊之 function
	if (b = _s.b)
		load = _s.ns;
	else
		_s.b = b = {}, _s.ns = load = {};

	if (!ns)
		ns = this;

	//	cache functions
	if ((this.is_Function(ns) || this.is_Object(ns)) && ns.Class
					&& (force_load || !load[ns.Class])) {
		for (i in ns)
			if (typeof ns[i] === 'function'){
				k = this._get_hash_key(String(ns[i]));
				m = ns.Class + this.env.module_name_separator + i;
				//this.debug(m + ': ' + k + (', ' + ns[i]).slice(0, 200));
				if(!(m in load)){
					load[m] = 1;
					if (!b[k])
						b[k] = [];
					b[k].push( [ m, ns[i] ]);
				}
			}
		load[ns.Class] = 1;
	}

	//	將函數與 cache 比對以獲得函數名
	if (m = b[this._get_hash_key(ft)])
		for (i = 0; i < m.length; i++) {
			b= m[i][1];
			if (// typeof fr === 'function' &&
					fr === b)
				return m[i][0];
			if (ft === String(b))
				return m[i];
		}
};






_// JSDT:_module_
.
null_function =
	//new Function;
	function() {};


//	Initialization

//	temporary decoration in case we call for nothing and raise error
_.debug = _.err = _.warn = _.log = function(m) {
	/*
	 * 請注意:
	 * _.log.buffer === this.log.buffer !== log.buffer
	 * 在 WScript 中 需要用 _.log，其他則可用 log。
	 * 因此應該將所有類似的值指定給雙方，並注意非[常數]的情況。
	 */
	var _s = this.log;
	//_s.function_to_call.apply(null,arguments);
	//_s.function_to_call.apply(global, arguments);

	_s.buffer.push(m);

	if (!_s.max_length)
		_s.max_length = 0;

	if (debug && _s.buffer.length > _s.max_length)
		_s.function_to_call.call(global, _s.buffer.join('\n\n')),
		_s.buffer = [];
};


/*
 * test:
 * var k=function l(){alert(l.m);};k.m=1;alert(l.m+','+k.m);k();
 * 
 * JScript 中
 * k();
 * 為 undefined, 其他會把 "l." 代換成 "k."？
 * 
 * @inner
 */
//_.debug.buffer = _.err.buffer = _.warn.buffer =
_.log.buffer = [];


//_.debug.max_length = _.err.max_length = _.warn.max_length =
_.log.max_length = 0;
//CeL.log.max_length = 0;


var max_log_length = 1000;
//_.debug.function_to_call = _.err.function_to_call = _.warn.function_to_call =
_.log.function_to_call =
	typeof JSalert === 'function' ? JSalert :
	typeof WScript === 'object' ? function(m){m=String(m);if(m.length>2*max_log_length)m=m.slice(0,max_log_length)+'\n\n..\n\n'+m.slice(-max_log_length);WScript.Echo(m);} :
	typeof alert === 'object' || typeof alert === 'function' ? function(m){m=String(m);if(m.length>2*max_log_length)m=m.slice(0,max_log_length)+'\n\n..\n\n'+m.slice(-max_log_length);alert(m);} :
	_.null_function;


_.initial_env();


/*
var test_obj = _(2, 'test: Initialization');

test_obj.test_print('OK!');
*/

/**
 * 能執行到最後都沒出錯才設定到 global。
 * @ignore
 */
global[library_name] = _;


}
)(
	//	In strict mode, this inside globe functions is undefined.
	//	https://developer.mozilla.org/en/JavaScript/Strict_mode
	//this	// || typeof window === 'undefined' || window
)
//)	//	void(
;
