
/*
	本檔案為自動生成，請勿編輯！
	This file is auto created from _structure\structure.js, base.js, package.js, initialization.js
		by tool: build_main_script.
*/


//<![CDATA[

/*
 * ECMA-262 5th edition, ECMAScript 5 strict mode
 * http://ejohn.org/blog/ecmascript-5-strict-mode-json-and-more/
 * http://davidflanagan.com/Talks/es5/slides.html
 * http://kangax.github.com/es5-compat-table/
 */
'use strict';

/**
 * @name	JavaScript framework: CeL base loader
 * @fileoverview
 * Colorless echo JavaScript kit/library base loader
 * 本檔案包含了呼叫其他 library 需要用到的 function，以及常用 base functions。<br/>
 * <br/>
 * Copyright (C) 2002-, kanashimi <kanasimi@gmail.com>. All Rights Reserved.<br/>
 * <br/>
 * This file is in tab wide of 4 chars, documentation with JsDoc Toolkit (<a href="http://code.google.com/p/jsdoc-toolkit/wiki/TagReference">tags</a>).<br/>
 * <br/>
 * <br/>Please visit <a href="http://lyrics.meicho.com.tw/program/">Colorless echo program room</a> for more informations.
 * @since	自 function.js 0.2 改寫
 * @since	JavaScript 1.2
 * @since	2010/1/9 00:01:52
 * @author	kanasimi@gmail.com
 * @version	$Id: ce.js,v 0.2 2009/11/26 18:37:11 kanashimi Exp $
 */


/*
引用：參照
function addCode

CeL.package


駝峰式大小寫命名規則 CamelCase → embedded_underscore/Snake case


單一JS引用：
//	[function.js]_iF
function _iF(){}_iF.p='HKCU\\Software\\Colorless echo\\function.js.path';if(typeof WScript=="object")try{eval(getU((new ActiveXObject("WScript.Shell")).RegRead(_iF.p)));}catch(e){}
function getU(p,enc){var o;try{o=new ActiveXObject('Microsoft.XMLHTTP');}catch(e){o=new XMLHttpRequest();}if(o)with(o){open('GET',p,false);if(enc&&o.overrideMimeType)overrideMimeType('text/xml;charset='+enc);send(null);return responseText;}}
//	[function.js]End


初始化：參照
initialization of function.js

http://www.w3school.com.cn/html5/html5_script.asp
<script type="text/javascript" async="true" src="path/to/function.js"></script>
<script type="application/javascript;version=1.7" async="true" src="path/to/function.js"></script>

JSDoc:
	http://code.google.com/p/jsdoc-toolkit/w/list
	http://jsdoc.sourceforge.net/

Javadoc:
	http://java.sun.com/j2se/javadoc/writingdoccomments/

VSdoc:
	JScript IntelliSense in Visual Studio
	http://weblogs.asp.net/bleroy/archive/2007/04/23/the-format-for-javascript-doc-comments.aspx
	http://blogs.msdn.com/b/webdevtools/archive/2008/11/07/hotfix-to-enable-vsdoc-js-intellisense-doc-files-is-now-available.aspx
	Create JScript XML Code Comments
	http://msdn.microsoft.com/zh-tw/library/bb514138.aspx
	http://blog.miniasp.com/post/2010/04/Visual-Studio-2010-jQuery-Development-Tips.aspx

*/



/*
TODO

本 library 大量使用了 arguments.callee，但這與 ECMAScript design principles 不甚相符，需要避免。
	http://stackoverflow.com/questions/103598/why-was-the-arguments-callee-caller-property-deprecated-in-javascript
	http://wiki.ecmascript.org/doku.php?id=es3.1:design_principles


reset environment (__defineSetter__, __defineGetter__, ..)
in case of
	<a href="http://haacked.com/archive/2009/06/25/json-hijacking.aspx" accessdate="2009/12/2 0:7">JSON Hijacking</a>,
	<a href="http://blog.miniasp.com/post/2009/11/JavaScript-JSON-Hijacking.aspx" accessdate="2009/12/2 0:18">在 Web 2.0 時代必須重視 JavaScript/JSON Hijacking 攻擊</a>,
	etc.
*/


//try{






/*
將 module_name 改成 arguments
http://threecups.org/?p=129

use <a href="http://prototyp.ical.ly/index.php/2007/03/01/javascript-design-patterns-1-the-singleton/" accessdate="2010/4/25 0:23" title="prototyp.ical.ly  &amp;raquo; Javascript Design Patterns - 1. The Singleton">Singleton pattern</a>,
Module 模式或單例模式（<a href="http://zh.wikipedia.org/wiki/%E5%8D%95%E4%BE%8B%E6%A8%A1%E5%BC%8F" accessdate="2010/4/25 0:25" title="单例模式">Singleton</a>）<a href="http://www.comsharp.com/GetKnowledge/zh-CN/TeamBlogTimothyPage_K950.aspx" accessdate="2010/4/25 0:24" title="那些相见恨晚的 JavaScript 技巧 - 基于 COMSHARP CMS">為 Douglas Crockford 所推崇</a>，並被大量應用在 Yahoo User Interface Library YUI。

http://wiki.forum.nokia.com/index.php/JavaScript_Performance_Best_Practices
http://ioio.name/core-javascript-pitfalls.html

CommonJS
http://www.heliximitate.cn/studyblog/archives/tag/commonjs

*/

//void(
//typeof CeL !== 'function' &&
;(
/*
 * We can redefine native values only for undefined.<br/>
 * http://weblogs.asp.net/bleroy/archive/2006/08/02/Define-undefined.aspx<br/>
 * <br/>
 * Will speed up references to undefined, and allows redefining its name. (from jQuery)<br/>
 * <br/>
 * 用在比較或是 return undefined<br/>
 * 在舊的 browser 中，undefined 可能不存在。
 */
function(global, undefined) {


//if(typeof global !== 'function') throw new Error('No global object specified!');


var
	library_name = 'CeL'

	/**
	 * default debug level
	 * @type	{Integral}
	 * @ignore
	 */
	, debug = 0

	//,window

	, old_library_namespace

	//	library base name-space
	, _

	//, _base_function_to_extend

	, function_name_pattern
	;


//		members of library	-----------------------------------------------
;


/**
 * Global Scope object<br/>
 * 於 CeL.eval_code 使用
 * @ignore
 */
//global = this;	//	isWeb()?window:this;


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
 * @example
 * //	load library
 * <script type="text/javascript" src="../ce.js"></script>
 * //	預防 initialization 到一半彈出警告視窗，所以設大一點。
 * CeL.log.max_length = 20;
 * //	set debug
 * CeL.set_debug();
 *
 * //	判別是否已經 load 過
 * if(typeof CeL !== 'function' || CeL.Class !== 'CeL')
 * 	;	//	CeL has not been loaded
 * @name	CeL
 * @class	Colorless echo JavaScript kit/library: base name-space declaration
 */
function _() {
	//	function CeL: library root
	//	declaration for debug
	//this.global = arguments[0] || arguments.callee.ce_doc;
	return new (this.init.apply(global, arguments));
};

_// JSDT:_module_
.
/**
 * JavaScript library framework main class name.
 * @see	<a href="http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf">ECMA-262</a>: Object.Class: A string value indicating the kind of this object.
 * @constant
 */
Class = library_name;


/**
 * Map over main name-space in case of overwrite (from jQuery)
 * @ignore
 */
//old_library_namespace = global[library_name];
global[library_name] = _;


if (!_.prototype)
	_// JSDT:_module_
	.
	/**
	 * framework main prototype definition
	 * for JSDT: 有 prototype 才會將之當作 Class
	 */
	prototype = {
	};




_// JSDT:_module_
.
/**
 * 本 library 專用之 evaluate()。
 * 
 * 若在 function 中 eval 以獲得 local various，在舊 browser 中須加 var。
 * e.g., 'var local_various=' + ..
 * 不加 var 在舊 browser 中會變成 global 變數。
 * @param code	script code to evaluate
 * @return	value that evaluate process returned
 * @see	window.eval === window.parent.eval
 */
eval_code = function eval_code(code) {
	/*
		JSC eval() takes an optional second argument which can be 'unsafe'.
		Mozilla/SpiderMonkey eval() takes an optional second argument which is the scope object for new symbols.

		use window.execScript(code,"JavaScript") in IE: window.execScript() 將直接使用全局上下文環境，因此，execScript(Str)中的字符串Str可以影響全局變量。——也包括聲明全局變量、函數以及對象構造器。
	*/
	//this.debug(global.eval, 2);
	//this.debug(global && global.eval && global.eval !== arguments.callee);
	return global && global.eval && global.eval !== eval_code ? global.eval.call(global, code) : eval(code);
};


_// JSDT:_module_
.
/**
 * evaluate @ Global scope.
 * By the ECMA-262, new Function() will 'Pass in the Global Environment as the Scope parameter.'
 * @param code	script code to evaluate
 * @return	value that evaluate process returned
 */
global_eval = new Function('code', 'return eval(code);');


_// JSDT:_module_
.
/**
 * simple evaluates to get value of specified various identifier name.
 * 不使用 eval().
 * @param {String} various_name	various identifier name. e.g., /[a-z\d$_]+(.[a-z\d_]+)+/i
 * @param {Object|Function} [name_space]	initialize name-space. default: global
 * @return	value of specified various identifier name
 * @since	2010/1/1 18:11:40
 * @note
 * 'namespace' 是 JScript.NET 的保留字
 * 
 * 在兩個子層(a.b.c)下，這樣作效率較差 @User agent: Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.4 (KHTML, like Gecko) Chrome/5.0.375.29 Safari/533.4:
 * function(v){try{return(new Function('return('+v+')'))();}catch(e){}}
 */
get_various = function(various_name, name_space) {
	//this.debug('get value of [' + various_name + ']');
	if (typeof various_name !== 'string' || !various_name)
		return various_name;

	var i = 0,
	//	TODO: 可處理 e.g., obj1  . obj2 [ ' obj3.4 * \[ ' ] [''] . obj5 [ " obj6 \" \' \] . " ]
	//	or detect obj1 .. obj2
	s = various_name.split('.'),
	l = s.length,
	v = name_space ||
		//this.env.global
		global
		;
	//this.debug('global.' + this.Class + ' = ' + this.env.global[this.Class]);

	try {
		while (i < l)
			if (v)
				// this.debug('to [' + s[i] + ']: ' + v[s[i]]),
				v = v[s[i++]];
			else
				throw 1;
	} catch (e) {
		s[i - 1] = '<em>' + s[i - 1] + '</em><span class="debug_weaken">';
		//alert(this.log.buffer.length+','+this.log.max_length+'\n'+this.debug);
		this.debug('Can\'t get [<span title="' + various_name + '">'
				+ s.join('.') + '</span></span>]!');
		return;
	}

	return v;
};




_// JSDT:_module_
.
/**
 * 取得執行 script 之 path, 在 .hta 中取代 WScript.ScriptFullName。
 * @return	{String}	執行 script 之 path
 * @return	''	unknown environment
 */
get_script_full_name = function() {
	//	在 IE8, IE9 中，get_object_type.call(WScript) 為 '[object Object]' !!
	return typeof WScript === 'object' && (!this.is_Object(WScript) || '' + WScript === 'Windows Script Host')
				&& WScript.ScriptFullName
		|| typeof location === 'object' && location === window.location && unescape(location.pathname)
		|| '';
};

_// JSDT:_module_
.
/**
 * 取得執行 script 之名稱
 * @return	{String} 執行 script 之 名稱
 * @return	''	unknown environment
 */
get_script_name = function() {
	var n, i, j;

	//	在 IE8, IE9 中，get_object_type.call(WScript) 為 '[object Object]' !!
	if (typeof WScript === 'object'
		&& (!this.is_Object(WScript) || '' + WScript === 'Windows Script Host')) {
		n = WScript.ScriptName;
		i = n.lastIndexOf('.');
		return i == -1 ? n : n.slice(0, i);
	}

	if (typeof location === 'object' && location === window.location) {
		n = unescape(location.pathname), j = n.lastIndexOf('.');
		if (!(i = n.lastIndexOf('\\') + 1))
			//	location.pathname 在 .hta 中會回傳 '\' 形式的 path
			i = n.lastIndexOf('/') + 1;
		return i < j ? n.slice(i, j) : n.slice(i);
	}

	return typeof document === 'object' && document === window.document ? document.title : '';
};




_// JSDT:_module_
.
/**
 * 取得/設定環境變數 enumeration<br/>
 * （雖然不喜歡另開 name-space，但以 2009 當下的 JsDoc Toolkit 來說，似乎沒辦法創造 enumeration。）
 * @class	環境變數 (environment variables) 與程式會用到的 library 相關變數。
 * @param {String} name	環境變數名稱
 * @param value	環境變數之值
 * @return	舊環境變數之值
 * @_memberOf	_module_
 */
env = function env(name, value) {
	if (!name)
		//return undefined;
		return;

	var _s = env, v = _s[name];

	if (arguments.length > 1) _s[name] = value;
	//if (typeof value !== 'undefined') _s[name] = value;

	return isNaN(v) ? '' + v : v;
};


/*
測試各 type:

undefined:
變數值存在且變數 'undefined' 存在時: various === undefined
否則: typeof(various) === 'undefined'

number, boolean, string:
typeof(various) === '~'

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
 * @param	value	various or class instance to test
 * @param	{String} [want_type]	type to compare: number, string, boolean, undefined, object, function
 * @param	{Boolean} [get_Class]	get the class name of a class(function) instance.
 * @return	{Boolean}	The type is matched.
 * @return	{String}	The type of value
 * @return	{undefined}	error occurred
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

	type = value === null ? 'null' : typeof value;

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
 * @return	{Function}	type test function
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
 * @return	{Boolean}	the value is a native Array.
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
 * @param	v	value to test
 * @return	{Boolean}	the value is a native Object.
 * @since	2009/12/20 08:38:26
 */
is_Object =
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
 * @return	{Boolean}	the value is a native Function.
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


_// JSDT:_module_
.
/**
 * Setup environment variables
 * @param	{String} [OS_type]	type of OS
 * @param	{Boolean} [reset]	reset the environment variables 
 * @return	{Object}	environment variables set
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
	  OS='DOS';
	 @else
	  OS='unix';	//	unknown
	 @end
	@end@*/

	/**
	 * 本次執行所在 OS 平台
	 * @name	CeL.env.OS
	 * @type	String
	 */
	env.OS = OS = typeof OS_type === 'string' ? OS_type
			// 假如未設定則取預設值
			: (OS || 'unix');

	/**
	 * 文件預設 new line
	 * @name	CeL.env.new_line
	 * @type	String
	 */
	env.new_line=		OS == 'unix' ? '\n' : OS == 'Mac' ? '\r' : '\r\n';	//	in VB: vbCrLf
	/**
	 * file system 預設 path separator<br/>
	 * platform-dependent path separator character, 決定目錄(directory)分隔
	 * @name	CeL.env.path_separator
	 * @type	String
	 */
	env.path_separator	=	OS == 'unix' ? '/' : '\\';
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
	env.path_separator_RegExp = this.to_RegExp_pattern ? this
			.to_RegExp_pattern(env.path_separator)
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
	 * 這邊列出的只是合法 identifier 的子集且未去除 reserved words!
	 * @name	CeL.env.identifier_RegExp
	 * @see
	 * ECMA-262	7.6 Identifier Names and Identifiers
	 * @type	RegExp
	 */
	env.identifier_RegExp = /([a-zA-Z$_]|\\u[\da-fA-F]{4})([a-zA-Z$_\d]+|\\u[\da-fA-F]{4}){0,63}/;

	/**
	 * Legal identifier name in String from env.identifier_RegExp.
	 * @name	CeL.env.identifier_String
	 */
	env.identifier_String = env.identifier_RegExp.source;

	return env;
};


_// JSDT:_module_
.
get_identifier_RegExp = function(pattern, flag,add_for_first, add_for_least) {
	var s = this.env.identifier_String;
	if (add_for_first)
		s = s.replace(/_/[g], 'for first letter');
	if (add_for_least)
		s = s.replace(/\\d/, 'for least');

	return new RegExp(
			(get_object_type.call(pattern) === '[object RegExp]' ? pattern.source
					: pattern).replace(/$identifier/g, s), flag || '');
};


_// JSDT:_module_
.
/**
 * Tell if it's now debugging.
 * @param {Integral} [debug_level]	if it's now in this debug level.
 * @return	{Boolean}	It's now in specified debug level.
 * @return	{Number}	It's now in what debug level(Integral).
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
 * @return	{Number} debugging level now
 */
set_debug = function(debug_level){
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
 * @return	{String}	hash key
 */
_get_hash_key = function(text) {
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
		fs = '' + fs;
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
 * @return
 * @see
 * 可能的話請改用 {@link CeL.native.parse_function}(F).funcName
 * @since	2010/1/7 22:10:27
 */
get_function_name = function get_function_name(fr, ns, force_load) {
	var _s = get_function_name,
	//	初始化變數 'm'
	m = 0, ft, b, load, k, i;
	if (!fr)
		fr = _s.caller;

	//	get function text (函數的解譯文字)
	if (typeof fr === 'function') {
		if ('toString' in fr) {
			m = fr.toString;
			delete fr.toString;
		}
		ft = '' + fr;
		if (m)
			fr.toString = m;
	} else
		// typeof fr === 'string'
		ft = '' + fr;

	//	以函數的解譯文字獲得函數名
	m = function_name_pattern instanceof RegExp ?
			ft.match(function_name_pattern)
			: function_name_pattern(ft);

	//this.debug('matched ' + m, 1, this.Class + '.get_function_name');
	if (m)
		//	包含引數:	+ '(' + (f ? m[2] : '') + ')';
		return m[1];


	if (b = _s.b)
		load = _s.ns;
	else
		_s.b = b = {}, _s.ns = load = {};

	if (!ns)
		ns = this;

	//	cache functions
	if ((typeof ns === 'function' || this.is_Object(ns)) && ns.Class
					&& (force_load || !load[ns.Class])) {
		for (i in ns)
			if (typeof ns[i] === 'function'){
				k = this._get_hash_key('' + ns[i]);
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
			if (ft === ('' + b))
				return m[i];
		}
};







_// JSDT:_module_
.
null_function = function() {};


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


var max_log_length = 1000;
//_.debug.function_to_call = _.err.function_to_call = _.warn.function_to_call =
_.log.function_to_call =
	typeof JSalert === 'function' ? JSalert :
	typeof WScript === 'object' ? function(m){m=''+m;if(m.length>2*max_log_length)m=m.slice(0,max_log_length)+'\n\n..\n\n'+m.slice(-max_log_length);WScript.Echo(m);} :
	typeof alert === 'object' || typeof alert === 'function' ? function(m){m=''+m;if(m.length>2*max_log_length)m=m.slice(0,max_log_length)+'\n\n..\n\n'+m.slice(-max_log_length);alert(m);} :
	_.null_function;


_.initial_env();


/*
var test_obj = _(2, 'test: Initialization');

test_obj.test_print('OK!');
*/
;


}
)(
	//	In strict mode, this inside globe functions is undefined.
	//	https://developer.mozilla.org/en/JavaScript/Strict_mode
	this	// || typeof window === 'undefined' || window
)
//)	//	void(
;








/*
TODO:

use -> using because of 'use' is a keyword of JScript.

等呼叫時才 initialization


do not eval.
以其他方法取代 eval 的使用。

http://msdn.microsoft.com/en-us/library/2b36h1wa(VS.71).aspx
The arguments object is not available when running in fast mode, the default for JScript .NET. To compile a program from the command line that uses the arguments object, you must turn off the fast option by using /fast-. It is not safe to turn off the fast option in ASP.NET because of threading issues.

*/


typeof CeL === 'function' &&
function(){


var _// JSDT:_module_
= this;



_// JSDT:_module_
.
/**
 * 延展物件 (learned from jQuery):
 * 將 from_name_space 下的 variable_set 延展/覆蓋到 name_space。
 * @since	2009/11/25 21:17:44
 * @param	variable_set	variable set
 * @param	{Object|Function} name_space	extend to what name-space
 * @param	{Object|Function} from_name_space	When inputing function names, we need a base name-space to search these functions.
 * @return	library names-pace
 * @see
 * <a href="http://blog.darkthread.net/blogs/darkthreadtw/archive/2009/03/01/jquery-extend.aspx" accessdate="2009/11/17 1:24" title="jQuery.extend的用法 - 黑暗執行緒">jQuery.extend的用法</a>,
 * <a href="http://www.cnblogs.com/rubylouvre/archive/2009/11/21/1607072.html" accessdate="2010/1/1 1:40">jQuery源码学习笔记三 - Ruby's Louvre - 博客园</a>
 */
extend = function(variable_set, name_space, from_name_space) {
/*
	if(this.is_debug())
		throw new Error('UNDO');
*/
	var _s, i, l;

	if(typeof name_space === 'undefined' || name_space === null)
		//	如果沒有指定擴展的對象，則擴展到自身
		name_space = this;

	if (typeof from_name_space === 'undefined')
		from_name_space = this;
	else if (variable_set === null && _.is_Function(from_name_space))
		variable_set = from_name_space;

	if(typeof variable_set === 'function'){
		if(this.parse_function){
		}else{
			_.warn('Warning: Please include ' + this.Class + '.parse_function() first!');
		}

	}else if(typeof variable_set === 'string'){
		if(name_space === from_name_space)
			;
		else if(variable_set in from_name_space){
			//_.debug('extend (' + (typeof variable_set) + ') ' + variable_set + '\n=' + from_name_space[variable_set] + '\n\nto:\n' + name_space);
			name_space[variable_set] = from_name_space[variable_set];
		}else
			try{
				name_space[variable_set] = this.get_various(variable_set);
				//_.debug(variable_set + ' = ' + name_space[variable_set]);
			}catch(e){
				_.warn(this.Class + '.extend:\n' + e.message);
			}

	} else if (this.is_Array(variable_set)
						&& !this.is_Array(name_space)) {
		for (_s = _.extend, i = 0, l = variable_set.length; i < l; i++) {
			_s(variable_set[i], name_space, from_name_space);
		}

	} else if (this.is_Object(variable_set)
			//|| this.is_Function(variable_set)
			) {
		for(i in variable_set){
			name_space[i] = variable_set[i];
		}
	}

	return this;
};


_// JSDT:_module_
.
/**
 * workaround.
 * 把 name_space 下的 function_name (name_space[function_name]) 換成 new_function。
 * for Lazy Function Definition Pattern.
 * 惰性求值（Lazy Evaluation），又稱懶惰求值、懶漢求值
 * @example
 * library_namespace.replace_function(_, 'to_SI_prefix', to_SI_prefix);
 * @param name_space	which name-space
 * @param {String} function_name	name_space.function_name
 * @param {Function} new_function	replace to what function
 * @return	new_function
 * @see
 * http://realazy.org/blog/2007/08/16/lazy-function-definition-pattern/,
 * http://peter.michaux.ca/article/3556
 */
replace_function = function(name_space, function_name, new_function) {
	if(!name_space)
		return;

	var old_function = name_space[function_name], type = typeof new_function;

	//	TODO: RegExp
	if (type === 'bool' || type === 'string' || type === 'number')
		new_function = new Function('return'
				//	對 String 只是做簡單處理，勢必得再加強。
				+ (type === 'string' ? '"' + type.replace(/\\/g, '\\').replace(/"/g, '\"').replace(/\n/g, '\\n')
						+ '"' : ' '+type));

	name_space[function_name] = new_function;
	//	search for other extends
	if (this[function_name] === old_function)
		this[function_name] = new_function;

	return new_function.apply(name_space, arguments);
};


_// JSDT:_module_
.
/**
 * Get file resource<br/>
 * 用於 include JavaScript 檔之類需求時，取得檔案內容之輕量級函數。<br/>
 * 除 Ajax，本函數亦可用在 CScript 執行中。
 * @example
 * //	get contents of [path/to/file]:
 * var file_contents = CeL.get_file('path/to/file');
 * @param	{String} path	URI / full path. <em style="text-decoration:line-through;">不能用相對path！</em>
 * @param	{String} [encoding]	file encoding
 * @return	{String} data	content of path
 * @return	{undefined}	when error occurred: no Ajax function, ..
 * @throws	uncaught exception @ Firefox: 0x80520012 (NS_ERROR_FILE_NOT_FOUND), <a href="http://www.w3.org/TR/2007/WD-XMLHttpRequest-20070227/#exceptions">NETWORK_ERR</a> exception
 * @throws	'Access to restricted URI denied' 當 access 到上一層目錄時 @ Firefox
 * @see
 * <a href=http://blog.joycode.com/saucer/archive/2006/10/03/84572.aspx">Cross Site AJAX</a>,
 * <a href="http://domscripting.com/blog/display/91">Cross-domain Ajax</a>,
 * <a href="http://forums.mozillazine.org/viewtopic.php?f=25&amp;t=737645" accessdate="2010/1/1 19:37">FF3 issue with iFrames and XSLT standards</a>,
 * <a href="http://kb.mozillazine.org/Security.fileuri.strict_origin_policy" accessdate="2010/1/1 19:38">Security.fileuri.strict origin policy - MozillaZine Knowledge Base</a>
 * Chrome: <a href="http://code.google.com/p/chromium/issues/detail?id=37586" title="between builds 39339 (good) and 39344 (bad)">NETWORK_ERR: XMLHttpRequest Exception 101</a>
 */
get_file = function(path, encoding){
	//with(typeof window.XMLHttpRequest=='undefined'?new ActiveXObject('Microsoft.XMLHTTP'):new XMLHttpRequest()){

	var _s = _.get_file,
	/**
	 * XMLHttpRequest object.
	 * This can't cache.
	 * @inner
	 * @ignore
	 */
	o;

	try{
		o = new ActiveXObject('Microsoft.XMLHTTP');
	}catch(e){
		o = new XMLHttpRequest();
	}

	if (o) {
		var data, type = 'GET';
		if (typeof path === 'string' && path.length > 4096
				&& (data = path.match(/^([^?]{6,200})\?(.+)$/)))
			path = data[1], data = data[2], type = 'PUT';
		else
			data = null;

		o.open(type, path, false);

		if (encoding && o.overrideMimeType)
			/*
			 * old: o.overrideMimeType('text/xml;charset='+encoding);
			 * 但這樣會被當作 XML 解析，產生語法錯誤。
			 */
			o.overrideMimeType('application/json;charset=' + encoding);

		try {
			//	http://www.w3.org/TR/2007/WD-XMLHttpRequest-20070227/#dfn-send
			//	Invoking send() without the data argument must give the same result as if it was invoked with null as argument.
			o.send(data);
			delete _s.error;

		} catch (e) {
			_s.error = e;
			//	Apple Safari 3.0.3 may throw NETWORK_ERR: XMLHttpRequest Exception 101
			//this.warn(this.Class + '.get_file: Loading [' + path + '] failed: ' + e);
			//this.err(e);
			//this.debug('Loading [' + path + '] failed.');

			//e.object = o;	//	[XPCWrappedNative_NoHelper] Cannot modify properties of a WrappedNative @ firefox

			if (location
							&& (o = path.match(/:(\/\/)?([^\/]+)/))
							&& o[2] !== location.hostname) {
				this.warn('get_file: 所要求檔案之 domain [' + o[2]
							+ '] 與所處之 domain [' + location.hostname + '] 不同!<br/>\n您可能需要嘗試使用 '
							+ this.Class + '.include_resource()!');
				throw new Error('get_file: Different domain!');
			}

			o = this.require_netscape_privilege(e, [_s, arguments]);
			//this.debug('require_netscape_privilege return [' + typeof (o) + ('] ' + o).slice(0, 200) + ' ' + (e === o ? '=' : '!') + '== ' + 'error (' + e + ')');
			if (e === o)
				throw e;
			return o;
		}

		//	當在 local 時，成功的話 status === 0。失敗的話，除 IE 外，status 亦總是 0。
		//	status was introduced in Windows Internet Explorer 7.	http://msdn.microsoft.com/en-us/library/ms534650%28VS.85%29.aspx
		//	因此，在 local 失敗時，僅 IE 可由 status 探測，其他得由 responseText 判別。
		//this.debug('Get [' + path + '], status: [' + o.status + '] ' + o.statusText);

		return Math.floor(o.status / 100) > 3 ? [ o.status, o.responseText ] : o.responseText;
	}
	//	else: This browser does not support XMLHttpRequest.

	//	firefox: This function must return a result of type any
	//return undefined;
	return;
};


_// JSDT:_module_
.
/**
 * Ask privilege in mozilla projects: Firefox 2, 3.
 * enablePrivilege 似乎只能在執行的 function 本身或 caller 呼叫才有效果，跳出函數即無效，不能 cache，因此提供 callback。
 * 就算按下「記住此決定」，重開瀏覽器後需要再重新授權。
 * @param {String|Error} privilege	privilege that asked 或因權限不足導致的 Error
 * @param {Function|Array} callback|[callback,arguments]	Run this callback if getting the privilege. If it's not a function but a number(經過幾層/loop層數), detect if there's a loop or run the caller.
 * @return	OK / the return of callback
 * @throws	error
 * @since	2010/1/2 00:40:42
 */
require_netscape_privilege = function require_netscape_privilege(privilege, callback) {
	var _s = require_netscape_privilege, f, i,
	/**
	 * raise error.
	 * error 有很多種，所以僅以 'object' 判定。
	 * @inner
	 * @ignore
	 */
	re = function(m) {
		//this.debug('Error: ' + m);
		throw privilege && typeof privilege === 'object' ?
			//	Error object
			privilege :
			//	new Error (message)
			new Error(m);
	};

	if(!_s.enabled)
		re('Privilege requiring disabled.');

	//	test loop
	//	得小心使用: 指定錯可能造成 loop!
	if (!isNaN(callback) && callback > 0 && callback < 32) {
		try{
			//	@Firefox 4: TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
			for (f = _s, i = 0; i < callback; i++)
				if (f = f.caller)
					//	TODO: do not use arguments
					f = f.arguments.callee;

			if (f === _s)
				// It's looped
				re('Privilege requiring looped.');

			callback = 1;

		}catch (e) {
			// TODO: handle exception
		}

	}

	f = _s.enablePrivilege;
	if (!f && !(_s.enablePrivilege = f = this
				.get_various('netscape.security.PrivilegeManager.enablePrivilege')))
		re('No enablePrivilege get.');

	if (this.is_type(privilege, 'DOMException')
					&& privilege.code === 1012)
		//	http://jck11.pixnet.net/blog/post/11630232
		//	Mozilla的安全機制是透過PrivilegeManager來管理，透過PrivilegeManager的enablePrivilege()函式來開啟這項設定。
		//	須在open()之前呼叫enablePrivilege()開啟UniversalBrowserRead權限。

		//	http://code.google.com/p/ubiquity-xforms/wiki/CrossDomainSubmissionDeployment
		//	Or: In the URL type "about:config", get to "signed.applets.codebase_principal_support" and change its value to true.

		//	由任何網站或視窗讀取私密性資料
		privilege = 'UniversalBrowserRead';

	else if (!privilege || typeof privilege !== 'string')
		re('Unknown privilege.');

	//this.debug('privilege: ' + privilege);
	try {
		//this.log(this.Class + '.require_netscape_privilege: Asking privilege [' + privilege + ']..');
		f(privilege);
	} catch (e) {
		this.warn(this.Class + '.require_netscape_privilege: User denied privilege [' + privilege + '].');
		throw e;
	}

	//this.debug('OK. Get [' + privilege + ']');


	if (callback === 1) {
		//this.debug('再執行一次 caller..');
		callback = _s.caller;
		return callback.apply(this, callback.arguments);

/*		i = callback.apply(this, callback.arguments);
		this.debug(('return ' + i).slice(0, 200));
		return i;
*/
	} else if (typeof callback === 'function')
		// 已審查過，為 function
		return callback();
	else if (this.is_Array(callback))
		return callback[0].apply(this, callback[1]);
};

_// JSDT:_module_
.
/**
 * 當需要要求權限時，是否執行。（這樣可能彈出對話框）
 * @type	Boolean
 */
require_netscape_privilege.enabled = true;



_// JSDT:_module_
.
/**
 * 得知 script file 之相對 base path
 * @param	{String} JSFN	script file name
 * @return	{String} relative base path
 * @example
 * <script type="text/javascript" src="../baseFunc.js"></script>
 * //	引數為本.js檔名。若是更改.js檔名，亦需要同步更動此值！
 * var basePath=get_script_base_path('baseFunc.js');
 * perl: use File::Basename;
 */
get_script_base_path = function(JSFN){
	//alert(JSFN);
	if(!JSFN)
		return (typeof location === 'object' ?
				// location.pathname
				location.href
				: typeof WScript === 'object' ? WScript.ScriptFullName
				//	用在把檔案拉到此檔上時不方便
				//: typeof WshShell === 'object' ? WshShell.CurrentDirectory
				: '').replace(/[^\/\\]+$/, '');

	//	We don't use is_Object or so.
	//	通常會傳入的，都是已經驗證過的值，不會出現需要特殊認證的情況。
	//	因此精確繁複的驗證只用在可能輸入奇怪引數的情況。
	if (typeof document !== 'object')
			return '';

	//	form dojo: d.config.baseUrl = src.substring(0, m.index);
	var i = 0, o = document.getElementsByTagName('script'), l = o.length, j, b, I;

	for (; i < l; i++)
		try {
			//	o[i].src 多是 full path, o[i].getAttribute('src') 僅取得其值，因此可能是相對的。
			j = o[i].getAttribute ? o[i].getAttribute('src') : o[i].src;
			I = j.lastIndexOf(JSFN);
			//alert(j + ',' + JSFN + ',' + I);
			if (I !== -1){
				//	TODO: dirty hack
				if (_.env.script_extension === '.') {
					b = j.slice(I + JSFN.length);
					if (b === 'js' || b === 'txt')
						_.env.script_extension += b,
						_.env.main_script += b;
					else{
						b = '';
						//	遇到奇怪的 extension
						continue;
					}
				}
				//	TODO: test 是否以 JSFN 作為結尾
				b = j.slice(0, I);
			}
		} catch (e) {
		}

	//this.log()

	//	b || './'
	return b || '';
};


var cached_module_path;
_// JSDT:_module_
.
/**
 * get the path of specified module
 * @param {String} module_name	module name
 * @param	{String} file_name	取得在同一目錄下檔名為 file_name 之 path。若填入 '' 可取得 parent 目錄。
 * @return	{String} module path
 */
get_module_path = function(module_name, file_name){
	if(!module_name)
		return module_name;

	//this.debug('load [' + module_name + ']');
	var module_path = cached_module_path
	|| (cached_module_path =
			this.env.registry_path
			|| this.get_script_base_path(this.env.main_script)
			|| this.get_script_base_path()
		);

	module_path += this.split_module_name(module_name).join(/\//.test(module_path)?'/':'\\') + _.env.script_extension;
	//this.debug(module_path);

	if (typeof file_name !== 'undefined')
		module_path = module_path.replace(/[^\/]+$/, file_name);
	else if (this.getFP)
		module_path = this.getFP(module_path, 1);

	//this.debug(module_name + ': ' + module_path);

	return module_path;
};


/*
sample to test:

./a/b
./a/b/
../a/b
../a/b/
a/../b		./b
a/./b		a/b
/../a/b		/a/b
/./a/b		/a/b
/a/./b		/a/b
/a/../b		/b
/a/../../../b	/b
/a/b/..		/a
/a/b/../	/a/
a/b/..		a
a/b/../		a/
a/..		.
./a/b/../../../a.b/../c	../c
../../../a.b/../c	../../../c

*/

//	2009/11/23 22:12:5
if(0)
_// JSDT:_module_
.
deprecated_simplify_path = function(path){
	if(typeof path === 'string'){
		//	去除前後空白
		path = path.replace(/\s+$|^\s+/,'').replace(/\/\/+/g,'/');

		var p, is_absolute = '/' === path.charAt(0);

		while( path !== (p=path.replace(/\/\.(\/|$)/g,function($0,$1){return $1;})) )
			path = p;
		_.debug('1. '+p);

		while (path !== (p = path.replace(
				/\/([^\/]+)\/\.\.(\/|$)/g, function($0, $1, $2) {
					alert( [ $0, $1, $2 ].join('\n'));
					return $1 === '..' ? $0 : $2;
				})))
			path = p;
		_.debug('2. '+p);

		if(is_absolute)
			path = path.replace(/^(\/\.\.)+/g,'');
		else
			path = path.replace(/^(\.\/)+/g,'');
		_.debug('3. '+p);

		if(!path)
			path = '.';
	}

	return path;
};

_// JSDT:_module_
.
/**
 * 轉化所有 /., /.., //
 * @since	2009/11/23 22:32:52
 * @param {String} path	欲轉化之 path
 * @return	{String} path
 */
simplify_path = function(path){
	if(typeof path === 'string'){
		var i, j, l, is_absolute, head;

		path = path
			.replace(/^[\w\d\-]+:\/\//,function($0){head = $0; return '';})
			//	去除前後空白
			//.replace(/\s+$|^\s+/g,'')
			//.replace(/\/\/+/g,'/')
			.split('/');

		i = 0;
		l = path.length;
		is_absolute = !path[0];

		for(;i<l;i++){
			if(path[i] === '.')
				path[i] = '';

			else if(path[i] === '..'){
				j=i;
				while(j>0)
					if(path[--j] && path[j]!='..'){
						path[i] = path[j] = '';	//	相消
						break;
					}
			}
		}

		if(!is_absolute && !path[0])
			path[0] = '.';

		path = path.join('/')
			.replace(/\/\/+/g,'/')
			.replace(is_absolute? /^(\/\.\.)+/g: /^(\.\/)+/g,'')
			;

		if(!path)
			path = '.';

		if(head)
			path = head + path;
	}

	return path;
};



_// JSDT:_module_
.
extend_module_member = function(module, extend_to, callback) {
	var i, l;

	//typeof name_space !== 'undefined' && this.debug(name_space);
	//	處理 extend to what name-space
	if (!extend_to && extend_to !== false
			//	若是在 .setup_module 中的話，可以探測得到 name_space？（忘了）
			//|| typeof name_space !== 'function'
			|| !this.is_Object(extend_to))
		//	預設會 extend 到 library 本身下
		extend_to = this;

	if (extend_to && (i = this.get_module(module))) {
		var ns = i, kw = this.env.not_to_extend_keyword, no_extend = {};
		//this.debug('load [' + module + ']:\nextend\n' + ns);

		if (kw in ns) {
			l = ns[kw];
			if (typeof l === 'string' && l.indexOf(',') > 0)
				l=l.split(',');

			if (typeof l === 'string') {
				no_extend[l] = 1;
			} else if (this.is_Array(l)) {
				for (i = 0; i < l.length; i++)
					//WScript.Echo('no_extend '+l[i]),
					no_extend[l[i]] = 1;
			} else if (this.is_Object(l)) {
				no_extend = l;
			}

			no_extend[kw] = 1;
		}

		//	'*': 完全不 extend
		if (!no_extend['*']) {
			no_extend.Class = 1;
			var no_self = 'this' in no_extend;
			if(no_self)
				delete no_extend['this'];

			l = [];
			for (i in ns)
				if (!(i in no_extend))
					l.push(i);

			//this.debug('load [' + module + ']:\nextend\n' + l + '\n\nto:\n' + (extend_to.Class || extend_to));
			this.extend(l, extend_to, ns);

			/*
			 * extend module itself.
			 * e.g., .net.web -> .web
			 */
			if (!no_self && (i = this.split_module_name(module))
							&& (i = i.pop()) && !(i in this))
						this[i] = ns;
		}

	}


	try {
		i = typeof callback === 'function' && callback();
	} catch (e) {
	}
	return i;
};

_// JSDT:_module_
.
/**
 * Include specified module<br/>
 * 注意：以下的 code 中，CeL.warn 不一定會被執行（可能會、可能不會），因為執行時 code.log 尚未被 include。<br/>
 * 此時應該改用 CeL.use('code.log', callback);<br/>
 * code in head/script/:
 * <pre>
 * CeL.use('code.log');
 * CeL.warn('a WARNING');
 * </pre>
 * **	在指定 callback 時 name_space 無效！
 * **	預設會 extend 到 library 本身下！
 * @param	{String} module	module name
 * @param	{Function} [callback]	callback function | [callback, 進度改變時之 function (TODO)]
 * @param	{Object|Boolean} [extend_to]	extend to which name-space<br/>
 * false:	just load, don't extend to library name-space<br/>
 * this:	extend to global<br/>
 * object:	extend to specified name-space that you can use [name_space]._func_ to run it<br/>
 * (others, including undefined):	extend to root of this library. e.g., call CeL._function_name_ and we can get the specified function.
 * @return	{Error}
 * @return	-1	will execute callback after load, 不代表一定 load 了!
 * @return	{undefined}	no error, OK
 * @example
 * CeL.use('code.log', function(){..});
 * CeL.use(['code.log', 'code.debug']);
 * @note
 * 'use' 是 JScript.NET 的保留字
 */
use = function requires(module, callback, extend_to){
	var _s = requires, i, l, module_path;

	if (!module)
		return;

	/*
	if (arguments.length > 3) {
		l = arguments.length;
		name_space = arguments[--l];
		callback = arguments[--l];
		--l;
		for (i = 0; i < l; i++)
			_s.call(this, arguments[i], callback, name_space);
		return;
	}
	*/

	if (this.is_Array(module)) {
		var error;
		for (i = 0, l = module.length; i < l; i++)
			if (error = _s.call(this, module[i], 0, extend_to))
				return error;
		try {
			i = typeof callback === 'function' && callback();
		} catch (e) {
		}
		return i;
	}

	if (!(module_path = this.get_module_path(module)) || this.is_loaded(module)){
		try {
			i = typeof callback === 'function' && callback();
		} catch (e) {
		}
		return i;
	}

	//this.debug('load [' + module + ']:\ntry to load [' + module_path + ']');

	//	including code
	try {
		try{
			// this.debug('load ['+module_path+']');
			// this.debug('load ['+module_path+']:\n'+this.get_file(module_path, this.env.source_encoding));
			//WScript.Echo(this.eval);
			if (i = this.get_file(module_path, this.env.source_encoding))
				//	eval @ global. 這邊可能會出現 security 問題。
				//	TODO: 以其他方法取代 eval 的使用。
				this.eval_code(i);
			else
				this.warn('Get nothing from [' + module_path + ']! Some error occurred?');
			i = 0;
		} catch (e) {
			i = e;
		}

		if (i && callback) {
			//	不能直接用 get_file()，得採用其他方法。但只在有 callback 時才 include，否則當下 block 的都沒執行，可能出亂子。
			if (typeof window !== 'undefined') {
				// TODO: 在指定 callback 時使 name_space 依然有效。
				this.include_resource(module_path, {
					module : module,
					callback : function(){
							_.extend_module_member(module, extend_to, callback);
					},
					global : this
				});
				//	TODO: 一次指定多個 module 時可以知道進度，全部 load 完才 callback()。
				//	此時 callback=[callback, 進度改變時之 function]
				//	return 進度 Object
				return -1;
			}
			throw i;
		} else
			return _.extend_module_member(module, extend_to, callback);

	} catch (e) {
		//this.err(e);

		// http://www.w3.org/TR/DOM-Level-2-Core/ecma-script-binding.html
		// http://reference.sitepoint.com/javascript/DOMException
		if (this.is_type(e, 'DOMException') && e.code === 1012)
			this.err(this.Class
					+ '.use:\n'
					+ e.message + '\n'
					+ module_path
					+ '\n\n程式可能呼叫了一個'
					+ (typeof location === 'object'
						&& location.protocol === 'file:' ? '不存在的，\n或是繞經上層目錄'
								: 'cross domain')
								+ '的檔案？\n\n請嘗試使用相對路徑，\n或 '
								+ this.Class
								+ '.use(module, callback function, name_space)');
		else if (this.is_type(e, 'Error') && (e.number & 0xFFFF) == 5
				|| this.is_type(e, 'XPCWrappedNative_NoHelper')
						&& ('' + e.message).indexOf('NS_ERROR_FILE_NOT_FOUND') !== -1) {
			this.err(this.Class + '.use: 檔案可能不存在？\n[' + module_path + ']' +
					(this.get_error_message
							? ('<br/>' + this.get_error_message(e))
							: '\n' + e.message
					)
				);
		} else
			this.err(this.Class + '.use: Cannot load [<a href="' + module_path + '">' + module + '</a>]!'
					+ (this.get_error_message
							? ('<br/>' + this.get_error_message(e) + '<br/>')
							: '\n[' + (e.constructor) + '] ' + (e.number ? (e.number & 0xFFFF) : e.code) + ': ' + e.message + '\n'
					)
					+ '抱歉！在載入其他網頁時發生錯誤，有些功能可能失常。\n重新讀取(reload)，或是過段時間再嘗試或許可以解決問題。');
		//this.log('Cannot load [' + module + ']!', this.log.ERROR, e);

		return e;
	}

};



/*
bad: sometimes doesn't work. e.g. Google Maps API in IE
push inside window.onload:
window.onload=function(){
include_resource(p);
setTimeout('init();',2000);
};

way 3:	ref. dojo.provide();, dojo.require();
document.write('<script type="text/javascript" src="'+encodeURI(p)+'"><\/script>');

TODO:
encode

*/
;

_// JSDT:_module_
.
/**
 * include other JavaScript/CSS files.
 * TODO:
 * callback 完 .js 自動移除
 * @param {String} resource path
 * @param {Function|Object} callback
 * 		use_write ? test function{return } : callback function
 * 		/	{callback: callback function, module: module name, global: global object when run callback}
 * @param {Boolean} [use_write]	use document.write() instead of insert a element
 * @param {Number} [type]	1: is a .css file, others: script
 */
include_resource = function include_resource(path, callback, use_write, type) {
	var _s = _.include_resource, s, t, h;
	//this.debug('Loading [' + path + '].');

	if (!_s.loaded){
		s = this.get_include_resource();
		if(!s){
			//	document!=='object': 誤在非 HTML 環境執行，卻要求 HTML 環境下的 resource？
			//if(typeof document==='object')this.warn(this.Class + ".include_resource: Can't load [" + path + "]!");
			return;
		}
		_s.loaded = s[0],
		_s.count = s[1];
	}

	if (this.is_Array(path)) {
		for (s = 0, t = path.length; s < t; s++)
			_s(path[s], callback, use_write, type);
		return;
	}

	if(path in _s.loaded){
		//	已經 load
		typeof callback === 'function' && _s.wait_to_call(callback);
		return;
	}

	if (typeof type === 'undefined')
		type = /\.css$/i.test(path) ? 1 : 0;

	t = 'text/' + (type === 1 ? 'css' : 'javascript');
/*@cc_on
//use_write=1;	//	old old IE hack
@*/
	if (!use_write)
		try {
			// Dynamic Loading
			// http://code.google.com/apis/ajax/documentation/#Dynamic
			s = document.createElement(type === 1 ? 'link' : 'script');
			s.type = t;
			if (type === 1)
				s.href = path,
				// s.media = 'all',//'print'
				s.rel = 'stylesheet';
			else
				//	TODO: see jquery-1.4a2.js: globalEval
				//	if (is_code) s.text = path;
				//s.setAttribute('src', path);
				s.src = path;

			//	http://wiki.forum.nokia.com/index.php/JavaScript_Performance_Best_Practices
			//	** onload 在 local 好像無效
			var done = false;
			s.onload = s.onreadstatechange = function() {
				var r;
				//_.debug('Loading [' + path + '] .. ' + this.readyState);
				if (!done && (!(r = this.readyState) || r === 'loaded' || r === 'complete')) {
					done = true;
					//_.debug('[' + (this.src || s.href) + '] loaded.');

					//this.onload = this.onreadystatechange = null;
					try{
						delete this.onload;
						delete this.onreadystatechange;
					}catch (e) {
						//	error on IE5~7: Error: Object doesn't support this action
						this.onload = this.onreadystatechange = null;
					}

					_s.loaded[path] = _s.count++;

					if(callback)
						_s.wait_to_call(callback);
				}
			};

			h = (document.getElementsByTagName('head')[0] || document.body.parentNode
					.appendChild(document.createElement('head')));

			h.appendChild(s);

			//this.debug('HTML:\n' + document.getElementsByTagName('html')[0].innerHTML);
			/*
			 * from jquery-1.4a2.js:
			 * Use insertBefore instead of appendChild to circumvent an IE6 bug
			 *  when using globalEval and a base node is found.
			 * This arises when a base node is used (#2709).
			 * @see
			 * http://github.com/jquery/jquery/commit/d44c5025c42645a6e2b6e664b689669c3752b236
			 * 不過這會有問題: 後加的 CSS file 優先權會比較高。因此，可以的話還是用 appendChild。
			 */
			//h.insertBefore(s, h.firstChild);

			//	隨即移除會無效。 .css 移除會失效。
			if (type !== 1)
				setTimeout(function() {
					h.removeChild(s);
					h = s = null;
				}, 8000);

			return s;

		} catch (e) {
		}

	//this.debug('Writing code for [' + path + '].');
	if (use_write
			|| typeof use_write === 'undefined'
			)
		document.write(type === 1 ?
				'<link type="' + t + '" rel="stylesheet" href="' + path + '"><\/link>'
				: '<script type="' + t + '" src="' + path
					// language="JScript"
					+ '"><\/script>');

	//	若是到這邊還沒 load，會造成問題。
	_s.loaded[path] = _s.count++;

	if (callback)
		_s.wait_to_call(callback);
};

_// JSDT:_module_
.
/**
 * 已經 include_resource 了哪些 JavaScript 檔（存有其路徑）.
 * loaded{路徑} = index,
 * 本定義可省略(only for documentation)
 * TODO:
 * data[index] = [time stamp, path],
 * @type	{Object}
 */
include_resource.loaded = null;


_// JSDT:_module_
.
/**
 * 已經 include_resource 了多少個 JavaScript 檔.
 * 本定義可省略(only for documentation)
 * @type Number
 */
include_resource.count = 0;

_// JSDT:_module_
.
include_resource.wait_to_call = function(callback, do_test) {
	//alert('include_resource.wait_to_call:\n' + _.to_module_name(callback.module));

	if (typeof callback === 'function')
		//	不是 module，僅僅為指定 function 的話，直接等一下再看看。
		//	TODO: 等太久時 error handle
		window.setTimeout(callback, 200);

	else if (_.is_Object(callback) && callback.global)
		if (callback.global.is_loaded(callback.module))
			if (typeof callback.callback === 'function')
				callback.callback();
			else if (typeof callback.callback === 'string')
				_.use(callback.callback);
			// TODO
			// else..

		else {
			/**
			 * 還沒 load，所以再等一下。 the function it self, not 'this'.
			 * @inner
			 * @ignore
			 */
			var _s = _.include_resource.wait_to_call, _t = this;
			window.setTimeout(function() {
				_s.call(_t, callback);
			}, 50);
		}
};

//if (typeof include_resource === 'function')
//	_.extend(null, include_resource, _.include_resource);


_// JSDT:_module_
.
get_include_resource = function(split) {
	if (typeof document !== 'object' || !document.getElementsByTagName)
		//	誤在非 HTML 環境執行，卻要求 HTML 環境下的 resource？
		return;

	var i, nodes = document.getElementsByTagName('script'), h, hn, count = 0, p, l;
	if (split)
		h = {
			script : {},
			css : {}
		},
		hn = h.script;
	else
		hn = h = {};

	l = nodes.length;
	for (i = 0; i < l; i++)
		if (p = this.simplify_path(nodes[i].src))
			hn[p] = 1, count++;

	nodes = document.getElementsByTagName('link');
	if (split)
		hn = l.css;

	l = nodes.length;
	for (i = 0; i < l; i++)
		if (p = this.simplify_path(nodes[i].href))
			hn[p] = 1, count++;

	return [ h, count ];
};


_// JSDT:_module_
.
/**
 * include resource of module.
 * @example
 * //	外部程式使用時，通常用在 include 相對於 library 本身路徑固定的檔案。
 * //	例如 file_name 改成相對於 library 本身來說的路徑。
 * CeL.include_module_resource('../../game/game.css');
 * @param {String} file_name	與 module 位於相同目錄下的 resource file name
 * @param {String} [module_name]	呼叫的 module name。未提供則設成 library base path，此時 file_name 為相對於 library 本身路徑的檔案。
 * @return
 * @since	2010/1/1-2 13:58:09
 */
include_module_resource = function(file_name, module_name) {
	//var m = this.split_module_name.call(this, module_name);
	//if (m)m[m.length - 1] = file_name;
	return this.include_resource.call(this,
			this.get_module_path(module_name || this.Class, file_name));
};



_// JSDT:_module_
.
get_module = function(module_name) {
	module_name = this.split_module_name.call(this, module_name);

	//	TODO: test module_name.length
	if(!module_name)
		return null;

	var i = 0, l = module_name.length, name_space = this;
	//	一層一層 call name-space
	while (i < l)
		try {
			name_space = name_space[module_name[i++]];
		} catch (e) {
			return null;
		}

	return name_space;
};



_// JSDT:_module_
.
/**
 * 預先準備好下層 module 定義時的環境。<br/>
 * 請盡量先 call 上層 name-space 再定義下層的。
 * @param	{String} module_name	module name
 * @param	{Function} code_for_including	若欲 include 整個 module 時，需囊括之 code。
 * @return	null	invalid module
 * @return	{Object}	下層 module 之 name-space
 * @return	undefined	something error, e.g., 未成功 load，code_for_including return null, ..
 */
setup_module = function(module_name, code_for_including) {
	module_name = this.split_module_name(module_name);

	//	TODO: test module_name.length
	if(!module_name)
		return null;

	var i = 0, l = module_name.length - 1, name_space = this, name;
	//	一層一層準備好、預定義 name-space
	for (; i < l; i++) {
		if (!name_space[name = module_name[i]])
			//this.debug('預先定義 module [' + this.to_module_name(module_name.slice(0, i + 1)) + ']'),
			name_space[name] = new Function(
					'//	null constructor for module ' +
					this.to_module_name(module_name.slice(0, i + 1)));
		name_space = name_space[name];
	}
	//	name-space 這時是 module 的 parent module。

	if (
			// 尚未被定義或宣告過
			!name_space[name = module_name[l]] ||
			// 可能是之前簡單定義過，例如被上面處理過。這時重新定義，並把原先的 member 搬過來。
			!name_space[name].Class) {

		//	保留原先的 name-space，for 重新定義
		l = name_space[name];

		// extend code, 起始 name-space
		try {
			//this.debug('including code of [' + this.to_module_name(module_name) + ']..'),
			//	TODO: code_for_including(this, load_arguments)
			i = code_for_including(this);
			i.prototype.constructor = i;
			//code_for_including.toString = function() { return '[class_template ' + name + ']'; };
			//i.toString = function() { return '[class ' + name + ']'; };
		} catch (e) {
			this.err(this.Class + '.setup_module: load module ['
					+ this.to_module_name(module_name) + '] error!\n' + e.message);
			i = undefined;
		}
		if (i === undefined)
			return i;
		name_space = name_space[name] = i;

		// 把原先的 member 搬過來
		if (l) {
			delete l.Class;
			//	may use: this.extend()
			for (i in l)
				name_space[i] = l[i];
		}
		name_space.Class = this.to_module_name(module_name);
	}

/*
	l=[];
	for(i in name_space)
		l.push(i);
	WScript.Echo('Get members:\n'+l.join(', '));
*/

	this.set_loaded(name_space.Class, code_for_including);

	return name_space;
};



_// JSDT:_module_
.
/**
 * 是否 cache code。
 * 若不是要重構 code 則不需要。
 * @type	Boolean
 */
cache_code = false;

/**
 * cache 已經 include 之函式或 class
 * @inner
 * @ignore
 */
var loaded_module = {
};


_// JSDT:_module_
.
/**
 * 模擬 inherits
 * @param {String} module_name	欲繼承的 module_name
 * @param initial_arguments	繼承時的 initial arguments
 * @return
 * @see
 * <a href="http://fillano.blog.ithome.com.tw/post/257/17355" accessdate="2010/1/1 0:6">Fillano's Learning Notes | 物件導向Javascript - 實作繼承的效果</a>,
 * <a href="http://www.crockford.com/javascript/inheritance.html" accessdate="2010/1/1 0:6">Classical Inheritance in JavaScript</a>
 */
inherits = function(module_name, initial_arguments) {
	if(!_.cache_code)
		this.debug('inherits: cache code did not setted but want to use inherits function!');

	var c = loaded_module[this.to_module_name(module_name)];
	try {
		if (typeof c === 'function')
			return c(this, initial_arguments);

		this.err('inherits: cache of [' + module_name + '] error!');
	} catch (e) {
		return e;
	}
};


_// JSDT:_module_
.
/**
 * 將輸入的 string 分割成各 module 單元。<br/>
 * need environment_adapter()<br/>
 * ** 並沒有對 module 做完善的審核!
 * @param {String} module_name	module name
 * @return	{Array}	module unit array
 */
split_module_name = function(module_name) {
	//this.debug('[' + module_name + ']→[' + module_name.replace(/\.\.+|\\\\+|\/\/+/g, '.').split(/\.|\\|\/|::/) + ']');
	if (typeof module_name === 'string')
		module_name = module_name.replace(/\.\.+|\\\\+|\/\/+/g, '.').split(/\.|\\|\/|::/);

	if (this.is_Array(module_name)) {
		//	去除 library name
		if (module_name.length>1 && this.Class === module_name[0])
			module_name.shift();
		return module_name;
	} else
		return null;
};



_// JSDT:_module_
.
to_module_name = function(module, separator) {
	if (typeof module === 'function')
		module = module.Class;
	else if (module === this.env.main_script_name)
		module = this.Class;

	if (typeof module === 'string')
		module = this.split_module_name(module);

	var name = '';
	if (this.is_Array(module)) {
		if (typeof separator !== 'string')
			separator = this.env.module_name_separator;
		if (module[0] !== this.Class)
			name = this.Class + separator;
		name += module.join(separator);
	}

	return name;
};



//TODO
_// JSDT:_module_
.
get_requires = function(func){
	if (typeof func === 'function' || typeof func === 'object')
		return func.requires;
};

_// JSDT:_module_
.
unload_module = function(module, g){
};


_// JSDT:_module_
.
/**
 * 判斷 module 是否存在，以及是否破損。
 * @param	{String} module_name	module name
 * @return	{Boolean} module 是否存在以及良好。
 */
is_loaded = function(module_name) {
	// var _s = arguments.callee;
	//this.debug('test ' + this.to_module_name(module_name));
	return !!loaded_module[this.to_module_name(module_name)];
};



_// JSDT:_module_
.
set_loaded = function(module_name, code_for_including) {
	//this.debug(this.to_module_name(module_name));
	loaded_module[this.to_module_name(module_name)] = _.cache_code && code_for_including || true;
};


/**
 * module 的 require 紀錄。
 * use_function_require_queue[module name] = require time.
 * 當 require 超過 2 次則 skip，這是為了預防 Stack overflow。非 1 次即跳出是為了預防發生錯誤的情況。
 * @inner
 * @private
 * @type Object
 */
var use_function_require_queue = {},

/**
 * post_execute[module name] = module load 之後需要執行的函數。
 * //post_execute[module name] 存在表示 load 之後需要執行 module[post_execute_function_name]
 * 當 require 時還未 load 的話，就只好等 load 之後再來設定這些東西了。
 * TODO: 不過還是會有問題，因此需要設定 require 時必需已 load 之 module。
 * @inner
 * @private
 * @type Object
 */
post_execute = {};

//post_execute_function_name = '_post_execute_' + Math.random();


_// JSDT:_module_
.
/**
 * 設定 module load 之後需要執行的函數。
 * @param	{String} module_name	module name
 * @param	{Function} post_execute_function	module load 之後需要執行的函數
 * @return
 * @inner	僅供內部使用
 * @private
 */
set_post_execute = function(module_name, post_execute_function) {
	if(module_name)
		//this.debug('Set post function of module [' + module_name + ']: [' + post_execute_function + ']'),
		post_execute[module_name] = post_execute_function;
};


_// JSDT:_module_
.
/**
 * module 中需要 include function 時使用。<br/>
 * TODO: 輸入 function name 即可
 * @example
 * //	requires (inside module)
 * if(eval(library_namespace.use_function('data.split_String_to_Object')))return;
 * @param function_list	function list
 * @param [return_extend]	設定時將回傳 object
 * @return	error
 * @since
 * 2009/12/26 02:36:31
 * 2009/12/31 22:21:23	add 類似 'data.' 的形式，為 module。
 * 2010/6/14 22:58:18	避免相互 require
 */
use_function = function(function_list, return_extend) {
	///	<returns>error</returns>

/*
	//	若本身已經在需求名單中則放行，避免相互需要造成堆疊空間不足(Out of stack space)或 Stack overflow。..無效，因為 module_name 可能未定義。
	if (typeof module_name === 'string' && module_name)
		if (module_name in use_function_require_queue)
			return 0;
		else
			this.debug('Skip to load module [' + module_name + '] because it is already in the require queue.'),
			use_function_require_queue[module_name] = 1;
*/

	var list = this.is_Array(function_list) ? function_list
			: typeof function_list === 'string' ? function_list
					.split(',') : 0;

	if (!list || !list.length)
		return 1;

	//this.debug('load function [' + list + ']' + (typeof module_name === 'string' && module_name ? ' from [' + module_name + ']' : ''));

	var i = 0, m, l = list.length, n,
	old_module_name,
	module_hash = {},
	variable_hash = {};

	for (; i < l; i++)
		if ((m = this.split_module_name(list[i])) && m.length > 1) {
			//this.debug('load function [' + m + ']');
			//	if(n): 類似 'data.split_String_to_Object' 的形式，為 function。else: 類似 'data.' 的形式，為 module。
			n = m[m.length - 1];
			//if (!n) this.debug('load module [' + this.to_module_name(m) + ']');

			if(!n)
				m.pop();
			variable_hash[n || m[m.length - 1]] = this.to_module_name(m);
			if (n)
				m.pop();
			//this.debug('test module ['+m.join(this.env.module_name_separator)+']: '+this.get_various(m.join(this.env.module_name_separator),this));
			module_hash[m.join(this.env.module_name_separator)] = 1;
		}

	m = [];
	for (i in module_hash)
		if ((i in use_function_require_queue ? ++use_function_require_queue[i] : (use_function_require_queue[i] = 1)) < 2)
			//this.debug('prepare to load module ['+i+']'),
			m.push(i);
		//else this.debug('Skip to load module [' + i + '] because it is already in the require queue with many times.');


	if (m.length){
		//this.debug('module [' + (typeof module_name === 'string' ? module_name: undefined) + '] load:\n' + m);
	
		// include required modules
		try{
		m = this.use(
			n = m,
			//	module_name 為呼叫 modele，在 .use() 中會被重設：eval 時由 modele 裡面的 code 設定。但在 IE 中為 undefined。
			old_module_name = typeof module_name === 'string' ? module_name
					: undefined);
		}catch (e) {
			m=2;// TODO: handle exception
		}
	
		//	消除 require 紀錄：不可不做。因為有時同樣的 module 有不同的 function require。
		for (i = 0; i < n.length; i++)
			;//delete use_function_require_queue[n[i]];
	
		//	回存已被更改的 module_name，/*並消除 require 紀錄。*/
		if (old_module_name)
			//delete use_function_require_queue[module_name = old_module_name];
			module_name = old_module_name;
	
		//	use 失敗: 需要 callback？
		//if (m) this.debug('use [' + function_list + '] 失敗!');
		if (m)
			return 2;

		module_hash = 0;
	}
	else
		//	所有需求皆已在 queue 中，因此最後總**有機會（不包括發生錯誤的情況！）**會被 load，故 skip。
		module_hash = [];


	//	每次 include 皆執行，盡量早一點設定 reference，預防有 M_A loading 中 要求 M_B.F_B，被這麼跳過而未執行，造成 M_A 中 呼叫 F_B（實為 M_B.F_B） 時 error；因為尚未設定，直接跳出了的情形。
	for (i in post_execute)
		try {
			//this.debug('execute post function of module [' + i + ']: [' + post_execute[i] + ']');
			post_execute[i]();
			//this.debug('delete post function of module [' + i + ']');
			delete post_execute[i];
		} catch (e) {
			// TODO: unknown error
		}


	if(!return_extend)
		l = [];

	//	設定 required variables
	for (i in variable_hash) {
		n = variable_hash[i];
		//this.debug('load [' + n + ']: ' + this.get_various(n));

		if (!module_hash &&
				//	test if this function exists
				typeof (m = this.get_various(n)) !== 'function') {
			//	delete it if doesn't exists
			delete variable_hash[i];
			this.err(this.Class + '.use_function: load [' + n + '] error: ' + (m || "Doesn't defined?"));
		} else if (!return_extend) {
			l.push(i + '=' +
					//	預防有保留字，所以用 bracket notation。例如 Chrome 中會出現 'Unexpected token native'。
					//	Dot Notation and Square Bracket Notation in JavaScript	http://www.dev-archive.net/articles/js-dot-notation/
					n.replace(/\.([a-z\d_]+)/gi, '["$1"]'));
			if (module_hash)
				module_hash.push(i);
		}
	}

	//if (!return_extend) this.debug('@[' + (typeof module_name === 'string' ? module_name: undefined) + ']: ' + (l.length ? 'var ' + ( module_hash ? module_hash.join(',') + ';library_namespace.set_post_execute(module_name,function(){' + l.join(',') + ';})' : l.join(',') ) + ';0' : ''));

	//	應注意 module_name 為保留字之類的情況，會掛在這邊 return 後的 eval。
	return return_extend ? variable_hash :
		l.length ? 'var ' + (
			module_hash ?
				module_hash.join(',') + ';library_namespace.set_post_execute(module_name,function(){' + l.join(',') + ';})' :
				l.join(',')
		) + ';0'
		//	error?
		: '';
};


/**
 * 為一些比較舊的版本或不同瀏覽器而做調適。
 * @since	2010/1/14 17:58:31
 * @inner
 * @private
 * @ignore
 */
function environment_adapter() {
	/*
	 * workaround:
	 * 理論上 '.'.split(/\./).length 應該是 2，但 IE 5~8 中卻為 0!
	 * 用 .split('.') 倒是 OK.
	 * TODO:
	 * 應該增加可以管控與回復的手段，預防有時需要回到原有行為。
	 * @since	2010/1/1 19:03:40
	 */
	if ('.'.split(/\./).length === 0)
		(function() {
			var _String_split = String.prototype.split,
				is_Regexp = _.object_tester('RegExp');
			String.prototype.split = function(r) {
				return is_Regexp(r) ?
						_String_split.call(this.valueOf().replace(
								r.global ? r :
									// TODO: 少了 multiline
									new RegExp(r.source, r.ignoreCase ? 'ig' : 'g'),
							'\0'), '\0') :
						_String_split.call(this, r);
			};
		})();
}

environment_adapter();

}.apply(CeL);







//args=args.concat(['turnCode.js']);

//	不作 initialization
//CeL.no_initialization = 0;

if (typeof CeL === 'function' && CeL.env.script_name === CeL.env.main_script_name
		&& !CeL.no_initialization)
	try {
		(function() {
			// WScript.Echo(CeL.env.script_name);
			// CeL.debug(CeL.env.script_name);


			//	將 path 寫入 registry
			CeL.use('OS.Windows');
			CeL.use('OS.Windows.registry');
			// CeL.debug(CeL.reg);
			//WScript.Echo(CeL.reg);

			var path_key_name = CeL.env.registry_path_key_name,
			//	此時 script 即為 main_script
			library_base_path = CeL.env.script_base_path,
			path_in_registry = CeL.reg.getValue(path_key_name) || '(null)';
			WScript.Echo('registry:\n' + path_in_registry + '\npath now:\n'
					+ library_base_path);
			if (path_in_registry !== library_base_path) {
				WScript.Echo('Change the base path of [' + CeL.Class + '] from:\n'
						+ path_in_registry + '\n to\n' + library_base_path
						+ '\n\nkey name:\n' + path_key_name);
				CeL.reg.setValue.cid = 1;
				CeL.reg.setValue(path_key_name, library_base_path, 0, 0, 1);
				CeL.reg.setValue(CeL.env.registry_base + 'main_script',
						library_base_path + CeL.env.script_name, 0, 0, 1);
				CeL.reg.setValue.cid = 0;
			}


			//	TODO
			//	拖曳檔案到本檔案上面時之處置。
			if (
					// args instanceof Array
					typeof args === 'object') {
				// getEnvironment();
				// alert('Get arguments ['+args.length+']\n'+args.join('\n'));
				if (args.length) {
					var i = 0, p, enc, f, backupDir = dBasePath('kanashimi\\www\\cgi-bin\\program\\log\\');
					if (!fso.FolderExists(backupDir))
						try {
							fso.CreateFolder(backupDir);
						} catch (e) {
							backupDir = dBasePath('kanashimi\\www\\cgi-bin\\game\\log\\');
						}
						if (!fso.FolderExists(backupDir))
							try {
								fso.CreateFolder(backupDir);
							} catch (e) {
								if (2 === alert('無法建立備份資料夾[' + backupDir
										+ ']！\n接下來的操作將不會備份！', 0, 0, 1 + 48))
									WScript.Quit();
								backupDir = '';
							}
							// addCode.report=true; // 是否加入報告
							for (; i < args.length; i++)
								if ((f = dealShortcut(args[i], 1))
										.match(/\.(js|vbs|hta|s?html?|txt|wsf|pac)$/i)
										&& isFile(f)) {
									p = alert(
											'是否以預設編碼['
											+ ((enc = autodetectEncode(f)) == simpleFileDformat ? '內定語系('
													+ simpleFileDformat + ')'
													: enc) + ']處理下面檔案？\n' + f,
													0, 0, 3 + 32);
									if (p === 2)
										break;
									else if (p === 6) {
										if (backupDir)
											fso.CopyFile(f, backupDir + getFN(f), true);
										addCode(f);
									}
								}
				} else if (1 === alert('We will generate a reduced ['
						+ CeL.env.script_name + ']\n  to [' + CeL.env.script_name
						+ '.reduced.js].\nBut it takes several time.', 0, 0,
						1 + 32))
					reduceScript(0, CeL.env.script_name + '.reduced.js');
			}// else window.onload=init;

			// CeL._iF=undefined;
		})();
	} catch (e) {
		// TODO: handle exception
	}



/*

//test WinShell	http://msdn.microsoft.com/en-us/library/bb787810(VS.85).aspx
if (0) {
alert(WinShell.Windows().Item(0).FullName);

var i, cmd, t = '', objFolder = WinShell.NameSpace(0xa), objFolderItem = objFolder
		.Items().Item(), colVerbs = objFolderItem.Verbs(); // 假如出意外，objFolder==null
for (i = 0; i < colVerbs.Count; i++) {
	t += colVerbs.Item(i) + '\n';
	if (('' + colVerbs.Item(i)).indexOf('&R') != -1)
		cmd = colVerbs.Item(i);
}
objFolderItem.InvokeVerb('' + cmd);
alert('Commands:\n' + t);

// objShell.NameSpace(FolderFrom).CopyHere(FolderTo,0); // copy folder
// objFolderItem=objShell.NameSpace(FolderFrom).ParseName("clock.avi");objFolderItem.Items().Item().InvokeVerb([動作]);
// objShell.NameSpace(FolderFromPath).Items.Item(mName).InvokeVerb();

// Sets or gets the date and time that a file was last modified.
// http://msdn.microsoft.com/en-us/library/bb787825(VS.85).aspx
// objFolderItem.ModifyDate = "01/01/1900 6:05:00 PM";
// objShell.NameSpace("C:\Temp").ParseName("Test.Txt").ModifyDate =
// DateAdd("d", -1, Now()) CDate("19 October 2007")

// Touch displays or sets the created, access, and modified times of one or
// more files. http://www.stevemiller.net/apps/
}

//測試可寫入的字元:0-128,最好用1-127，因為許多編輯器會將\0轉成' '，\128又不確定
if (0) {
var t = '', f = 'try.js', i = 0;
for (; i < 128; i++)
	t += String.fromCharCode(i);
if (simpleWrite(f, t))
	alert('Write error!\n有此local無法相容的字元?');
else if (simpleRead(f) != t)
	alert('內容不同!');
else if (simpleWrite(f, dQuote(t) + ';'))
	alert('Write error 2!\n有此local無法相容的字元?');
else if (eval(simpleRead(f)) != t)
	alert('eval內容不同!');
else
	alert('OK!');
}

*/





//}catch(e){WScript.Echo('There are some error in function.js!\n'+e.message);throw e;}



//CeL.use('code.log');
//CeL.warn('test_print: ' + CeL.code.log.Class);


//]]>

