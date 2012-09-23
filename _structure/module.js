
/**
 * @name	CeL function for module/package
 * @fileoverview
 * 本檔案包含了呼叫其他 library 需要用到的 function。
 * @since	2010/1/8 22:21:36
 */


/*
TODO:

瘦身

use -> using because of 'use' is a keyword of JScript.

等呼叫時才 initialization


http://headjs.com/#theory
Head JS :: The only script in your HEAD


do not use eval.
以其他方法取代 eval 的使用。

http://msdn.microsoft.com/en-us/library/2b36h1wa(VS.71).aspx
The arguments object is not available when running in fast mode, the default for JScript .NET. To compile a program from the command line that uses the arguments object, you must turn off the fast option by using /fast-. It is not safe to turn off the fast option in ASP.NET because of threading issues.


Multiversion Support
http://requirejs.org/docs/api.html

*/


typeof CeL === 'function' &&
(function(_) {

'use strict';


//var _// JSDT:_module_
//= this;


/**
 * 延展物件 (learned from jQuery):
 * 將 from_name_space 下的 variable_set 延展/覆蓋到 name_space。
 * @param	variable_set	variable set
 * @param	{Object|Function} name_space	extend to what name-space
 * @param	{Object|Function} from_name_space	When inputing function names, we need a base name-space to search these functions.
 * @returns	library names-pace
 * @see
 * <a href="http://blog.darkthread.net/blogs/darkthreadtw/archive/2009/03/01/jquery-extend.aspx" accessdate="2009/11/17 1:24" title="jQuery.extend的用法 - 黑暗執行緒">jQuery.extend的用法</a>,
 * <a href="http://www.cnblogs.com/rubylouvre/archive/2009/11/21/1607072.html" accessdate="2010/1/1 1:40">jQuery源码学习笔记三 - Ruby's Louvre - 博客园</a>
 * @since	2009/11/25 21:17:44
 */
function extend(variable_set, name_space, from_name_space) {

	if(typeof name_space === 'undefined' || name_space === null)
		//	如果沒有指定擴展的對象，則擴展到 library 自身
		name_space = extend.default_target;

	if (typeof from_name_space === 'undefined')
		from_name_space = extend.default_target;
	else if (variable_set === null && _.is_Function(from_name_space))
		variable_set = from_name_space;

	var i, l;

	if (_.is_Object(variable_set)
			//	若 function 另外處理，依現行實作會出問題！
			|| _.is_Function(variable_set)
			) {
		if (from_name_space)
			for (i in variable_set)
				name_space[i] = from_name_space[variable_set[i] || i];
		else
			for (i in variable_set)
				name_space[i] = variable_set[i];

	} else if (_.is_Array(variable_set)
				&& !_.is_Array(name_space)) {
		for (i = 0, l = variable_set.length; i < l; i++) {
			extend(variable_set[i], name_space, from_name_space);
		}

	} else if (typeof variable_set === 'string') {
		if (!from_name_space)
			from_name_space = _;

		if(name_space === from_name_space)
			;
		else if(variable_set in from_name_space){
			//_.debug('extend (' + (typeof variable_set) + ') ' + variable_set + '\n=' + from_name_space[variable_set] + '\n\nto:\n' + name_space);
			name_space[variable_set] = from_name_space[variable_set];
		}else
			try{
				name_space[variable_set] = _.get_variable(variable_set);
				//_.debug(variable_set + ' = ' + name_space[variable_set]);
			}catch(e){
				_.warn(_.Class + '.extend:\n' + e.message);
			}

	} else if (typeof variable_set === 'function') {
		if (_.parse_function) {
			//	TODO
			throw 'TODO';
		} else {
			_.warn('Warning: Please include ' + _.Class + '.parse_function() first!');
		}

	} 

	return name_space;
};

//extend.default_target = _;

_// JSDT:_module_
.
extend = extend;



_// JSDT:_module_
.
/**
 * 設定 name_space 下的 function_name 待執行時換作 initializor 的 return。
 * 換句話說，執行 name_space 下的 function_name (name_space[function_name]) 時把 name_space[function_name] 換成 new_function (initializor 的 return)。
 * for Lazy Function Definition Pattern.
 * 惰性求值（lazy evaluation or call-by-need），又稱懶惰求值、懶漢求值。
 * TODO:
 * 使用本函數不能完全解決先前已經指定 identifier 的情況。因此對於會使用本函數的函數，盡量別使用 .use_function() 來 include，否則可能會出現問題!
 * @example
 * <code>
 * library_namespace.set_initializor('function_name', function(){return function(){};}, _);
 * </code>
 * 
 * @param {String}function_name	function name to replace: name_space.function_name
 * @param {Function}initializor	will return function identifier to replace with
 * @param name_space	in which name-space
 * @returns	new_function
 * @see
 * http://realazy.org/blog/2007/08/16/lazy-function-definition-pattern/,
 * http://peter.michaux.ca/article/3556
 */
set_initializor = function(function_name, initializor, name_space) {
	var do_replace;
	if (arguments.length < 3 && _.is_Function(function_name)
			&& (do_replace = _.get_function_name(function_name)))
		//	e.g., library_namespace.set_initializor(get_HTA, _);
		name_space = initializor,
		initializor = function_name,
		function_name = do_replace
		//, _.debug('Get function name [' + function_name + '].')
		;

	if (!name_space)
		name_space = _;
	if (!initializor)
		initializor = name_space[function_name];

	do_replace = function() {
		//_.debug(name_space[function_name] === do_replace);
		//_.debug(name_space.Class + '[' + function_name + ']=' + name_space[function_name]);
		//_.debug('do_replace=' + do_replace);
		var old_function = name_space[function_name],
		new_function;
		if (old_function === do_replace) {
			try {
				new_function = initializor.apply(_, arguments);
				//_.debug('new_function = [' + (typeof new_function) + ']' + new_function);
			} catch (r) {
				//	可能因時機未到，或是 initialization arguments 不合適。不作 replace。
				return r;
				//throw r;
			}

			if (typeof new_function !== 'function')
				//	確定會回傳 function 以供後續執行。
				initializor = new_function,
				new_function = function() {
					//_.debug('new function return [' + initializor + '].', 1, 'set_initializor');
					return initializor;
				};

			// searching for other extends
			if (_[function_name] === old_function)
				_.debug('Replace base name-space function [' + function_name + '].', 1, 'set_initializor'),
				_[function_name] = new_function;
			else
				_.debug('Base name-space function [' + function_name + ']: ' + _[function_name] + '.', 1, 'set_initializor');

			//	設定 name_space[function_name]。
			_.debug('Replace function [' + function_name + '].', 1, 'set_initializor');
			name_space[function_name] = new_function;
			//_.debug(name_space[function_name] === do_replace);
			//_.debug(name_space.Class+'['+function_name+']='+name_space[function_name]);
		} else {
			if(_.is_debug(2))
				_.warn('set_initializor: The function [' + function_name + '] had replaced with a new one.');
			new_function = old_function;
		}

		//_.debug('new function: ' + new_function);
		//_.debug('return ' + new_function.apply(_, arguments));
		return new_function.apply(_, arguments);
	};

	return name_space[function_name] = do_replace;
};



//----------------------------------------------------------------------------------------------------------------------------------------------------------//

/**
 * XMLHttpRequest object type cache.
 * {Number} 0: no XMLHttpRequest, 1: new XMLHttpRequest_type(), 2: new ActiveXObject('Microsoft.XMLHTTP').
 * @inner
 * @ignore
 */
var XMLHttpRequest_type = 0;

var is_Opera = _.is_WWW(true) && navigator.appName === 'Opera';

/**
 * Get file resource by {@link XMLHttpRequest}<br />
 * 依序載入 resource，用於 include JavaScript 檔之類需求時，取得檔案內容之輕量級函數。<br />
 * 除 Ajax，本函數亦可用在 CScript 執行中。
 * @example
 * //	get contents of [path/to/file]:
 * var file_contents = CeL.get_file('path/to/file');
 * @param	{String} path	URI / full path. <em style="text-decoration:line-through;">不能用相對path！</em>
 * @param	{String} [encoding]	file encoding
 * @returns	{String} data	content of path
 * @returns	{undefined}	when error occurred: no Ajax function, ..
 * @throws	uncaught exception @ Firefox: 0x80520012 (NS_ERROR_FILE_NOT_FOUND), <a href="http://www.w3.org/TR/2007/WD-XMLHttpRequest-20070227/#exceptions">NETWORK_ERR</a> exception
 * @throws	'Access to restricted URI denied' 當 access 到上一層目錄時 @ Firefox
 * @see
 * <a href=http://blog.joycode.com/saucer/archive/2006/10/03/84572.aspx">Cross Site AJAX</a>,
 * <a href="http://domscripting.com/blog/display/91">Cross-domain Ajax</a>,
 * <a href="http://forums.mozillazine.org/viewtopic.php?f=25&amp;t=737645" accessdate="2010/1/1 19:37">FF3 issue with iFrames and XSLT standards</a>,
 * <a href="http://kb.mozillazine.org/Security.fileuri.strict_origin_policy" accessdate="2010/1/1 19:38">Security.fileuri.strict origin policy - MozillaZine Knowledge Base</a>
 * Chrome: <a href="http://code.google.com/p/chromium/issues/detail?id=37586" title="between builds 39339 (good) and 39344 (bad)">NETWORK_ERR: XMLHttpRequest Exception 101</a>
 */
function get_file(path, encoding) {
	//with(typeof window.XMLHttpRequest=='undefined'?new ActiveXObject('Microsoft.XMLHTTP'):new XMLHttpRequest()){

	//_.debug('XMLHttpRequest type: ' + XMLHttpRequest_type, 1, 'get_file');

	var data,
	type = 'GET',
	/**
	 * XMLHttpRequest object.
	 * Can't cache this object.
	 * @inner
	 * @ignore
	 */
	o = XMLHttpRequest_type === 1 ?
			new XMLHttpRequest()
			: new ActiveXObject('Microsoft.XMLHTTP');

	//	4096: URL 長度限制，與瀏覽器有關。
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

		//	若檔案不存在，會 throw.
		o.send(data);

		delete get_file.error;

	} catch (e) {
		//	Chome: XMLHttpRequest cannot load file:///X:/*.js. Cross origin requests are only supported for HTTP.
		//	Opera 11.50: 不會 throw，但是 .responseText === ''。
		//	Apple Safari 3.0.3 may throw NETWORK_ERR: XMLHttpRequest Exception 101
		get_file.error = e;

		//_.warn(_.Class + '.get_file: Loading [' + path + '] failed: ' + e);
		//_.err(e);
		//_.debug('Loading [' + path + '] failed.');

		//e.object = o;	//	[XPCWrappedNative_NoHelper] Cannot modify properties of a WrappedNative @ firefox

		if (
				//	5: 系統找不到指定的資源。
				(e.number & 0xFFFF) !== 5
				&& _.is_WWW() && (o = path.match(/:(\/\/)?([^\/]+)/))
				&& o[2] !== window.location.hostname) {
			//	在 .set_run() 的情況下，稍後會自動採用 .include_resource()。
			if (_.is_debug())
				_.warn('get_file: 所要求檔案之 domain [' + o[2]
							+ '] 與所處之 domain [' + window.location.hostname + '] 不同!<br />\n您可能需要嘗試使用 '
							+ _.Class + '.include_resource()!');
			throw new Error('get_file: Different domain!');
		}

		o = _.require_netscape_privilege(e, [get_file, arguments]);
		//_.debug('require_netscape_privilege return [' + typeof (o) + ('] ' + o).slice(0, 200) + ' ' + (e === o ? '=' : '!') + '== ' + 'error (' + e + ')');
		if (e === o)
			throw e;

		return o;
	}

	//	workaround for Opera: Opera 11.50: 不會 throw，但是 .responseText === ''。
	if (o.responseText === '' && is_Opera)
		throw new Error('get_file: Nothing get @ Opera');

	//	當在 local 時，成功的話 status === 0。失敗的話，除 IE 外，status 亦總是 0。
	//	status was introduced in Windows Internet Explorer 7.	http://msdn.microsoft.com/en-us/library/ms534650%28VS.85%29.aspx
	//	因此，在 local 失敗時，僅 IE 可由 status 探測，其他得由 responseText 判別。
	//_.debug('Get [' + path + '], status: [' + o.status + '] ' + o.statusText);

	return Math.floor(o.status / 100) > 3 ? [ o.status, o.responseText ] : o.responseText;
}

_// JSDT:_module_
.
get_file = get_file;


_// JSDT:_module_
.
is_HTA = _.is_WWW()
	//	http://msdn.microsoft.com/en-us/library/ms536496(v=vs.85).aspx
	//	HTAs do not support the AutoComplete in HTML forms feature, or the window.external object.
	&& window.external === null
	&& window.ActiveXObject
	&& (_.HTA = document.getElementsByTagName('APPLICATION'))
	&& _.HTA.length === 1;

try{
	//	在 HTA 中，XMLHttpRequest() 比 ActiveXObject('Microsoft.XMLHTTP') 更容易遇到拒絕存取。例如在同一目錄下的 .txt 檔。
	//	但在 IE 中，ActiveXObject 可能造成主動式內容之問題。
	if (_.is_HTA && new ActiveXObject('Microsoft.XMLHTTP'))
		XMLHttpRequest_type = 2;
	else
		throw 1;
} catch (e) {
	try {
		if (new XMLHttpRequest())
			XMLHttpRequest_type = 1;
		else
			throw 1;
	} catch (e) {
		try {
			if (new ActiveXObject('Microsoft.XMLHTTP'))
				XMLHttpRequest_type = 2;
		} catch (e) {
		}
	}
}
//WScript.Echo(XMLHttpRequest_type);

if (!XMLHttpRequest_type) {
	if (typeof require === 'function'
		&& (XMLHttpRequest_type = require('fs'))) {
		//	for node.js
		XMLHttpRequest_type = XMLHttpRequest_type.readFileSync;
		_.get_file = function(path, encoding) {
			//	for node.js
			var data, i, l, tmp;
			try{
				data = XMLHttpRequest_type(path, encoding);
			}catch (e) {
				data = XMLHttpRequest_type(path);
			}

			if (typeof data !== 'string') {
				// auto detect encoding
				l = data.length;
				tmp = [];
				if (data[0] === 255 && data[1] === 254) {
					//_.debug(path + ': UTF-16LE');
					// pass byte order mark (BOM), the first 2 bytes.
					i = 2;
					while (i < l)
						tmp.push(String.fromCharCode(data[i++] + 256 * data[i++]));
				} else if (data[0] === 254 && data[1] === 255) {
					//_.debug(path + ': UTF-16BE');
					// pass byte order mark (BOM), the first 2 bytes.
					i = 2;
					while (i < l)
						tmp.push(String.fromCharCode(data[i++] * 256 + data[i++]));
				} else {
					if (l > 1)
						console.log('get_file: Unknown BOM: ' + data[0] + ',' + data[1]);
					//	ascii
					i = 0;
					while (i < l)
						tmp.push(String.fromCharCode(data[i++]));
				}
				data = tmp.join('');
			}

			return data;
		};

	} else if (typeof _configuration === 'object'
						&& typeof File === 'function') {
		//	for jslibs
		LoadModule('jsio');
		_.get_file = function(path) {
			//_configuration.stderr(path);
			var c, i,
			data = new File(path).Open('r').Read(),
			l = data.length, tmp = [],
			next_code = function() {
				c = data.charCodeAt(i++);
				return c < 0 ? c + 256 : c;
			};

			_configuration.stderr(path + ': ' + data.charCodeAt(0) + ',' + data.charCodeAt(1));
			if(data.charCodeAt(0) === -1 && data.charCodeAt(1) === -2) {
				//_.debug(path + ': UTF-16LE');
				for (i = 2; i < l;)
					tmp.push(String.fromCharCode(next_code() + 256 * next_code()));
				data = tmp.join('');
			} else if(data.charCodeAt(0) === -2 && data.charCodeAt(1) === -1) {
				//_.debug(path + ': UTF-16BE');
				for (i = 2; i < l;)
					tmp.push(String.fromCharCode(next_code() * 256 + next_code()));
				data = tmp.join('');
			}

			return data;
		};

	} else if (typeof Stream === 'function') {
		//	for JSDB
		_.get_file = function(path) {
			//_.log('get_file: ' + path);
			try {
				return new Stream(path
						//, 'r'
						).readFile();
			} catch (e) {
				//CeL.log(e.message);
			}

			var data = new Stream(path, 'b'), tmp = [],
			BOM = [data.readUInt8(), data.readUInt8() ];
			if (BOM[0] === 255 && BOM[1] === 254) {
				// _.debug(path + ': UTF-16LE');
				while (!data.eof)
					tmp.push(String.fromCharCode(data.readUInt8() + 256 * data.readUInt8()));
			} else if (BOM[0] === 254 && BOM[1] === 255) {
				// _.debug(path + ': UTF-16BE');
				while (!data.eof)
					tmp.push(String.fromCharCode(data.readUInt8() * 256 + data.readUInt8()));
			} else {
				data.rewind();
				while (!data.eof)
					tmp.push(data.get());
			}
			data.close();
			return tmp.join('');
		};

	} else
		_.get_file = function() {
			// No XMLHttpRequest object.

			var m = 'get_file: This scripting engine does not support XMLHttpRequest.';
			_.warn(m);
			throw new Error(m);
			// firefox: This function must return a result of type any.
			//return undefined;
		};

}





_// JSDT:_module_
.
/**
 * Ask privilege in mozilla projects: Firefox 2, 3.
 * get_file() 遇到需要提高權限時使用。
 * enablePrivilege 似乎只能在執行的 function 本身或 caller 呼叫才有效果，跳出函數即無效，不能 cache，因此提供 callback。
 * 就算按下「記住此決定」，重開瀏覽器後需要再重新授權。
 * @param {String|Error} privilege	privilege that asked 或因權限不足導致的 Error
 * @param {Function|Array} callback|[callback,arguments]	Run this callback if getting the privilege. If it's not a function but a number(經過幾層/loop層數), detect if there's a loop or run the caller.
 * @returns	OK / the return of callback
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
		//_.debug('Error: ' + m);
		throw privilege && typeof privilege === 'object' ?
			//	Error object
			privilege :
			//	new Error (message)
			new Error(m);
	};

	if (!_s.enabled)
		re('Privilege requiring disabled.');

	//	test loop
	//	得小心使用: 指定錯可能造成 loop!
	if (!isNaN(callback) && callback > 0 && callback < 32) {
		try{
			//	@Firefox 4: TypeError: 'caller', 'callee', and 'arguments' properties may not be accessed on strict mode functions or the arguments objects for calls to them
			for (f = _s, i = 0; i < callback; i++) {
				f = f.caller;
				if (f)
					//	TODO: do not use arguments
					f = f.arguments.callee;
			}

			if (f === _s)
				// It's looped
				re('Privilege requiring looped.');

			callback = 1;

		}catch (e) {
			// TODO: handle exception
		}

	}

	f = _s.enablePrivilege;
	//_.debug('enablePrivilege: ' + f);
	if (!f && !(_s.enablePrivilege = f =
					_.get_variable('netscape.security.PrivilegeManager.enablePrivilege')))
		//	更改設定，預防白忙。
		_s.enabled = false,
		re('No enablePrivilege get.');

	if (_.is_type(privilege, 'DOMException')
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

	//_.debug('privilege: ' + privilege);
	try {
		//_.log(_.Class + '.require_netscape_privilege: Asking privilege [' + privilege + ']..');
		f(privilege);
	} catch (e) {
		if (privilege !== 'UniversalBrowserRead' || !_.is_local())
			_.warn(_.Class + '.require_netscape_privilege: User denied privilege [' + privilege + '].');
		throw e;
	}

	//_.debug('OK. Get [' + privilege + ']');


	if (callback === 1) {
		//_.debug('再執行一次 caller..');
		try{
			callback = _s.caller;
		}catch (e) {
			// TODO: handle exception
		}
		return callback.apply(_, callback.arguments);

/*		i = callback.apply(_, callback.arguments);
		_.debug(('return ' + i).slice(0, 200));
		return i;
*/
	} else if (_.is_Function(callback))
		// 已審查過，為 function
		return callback();
	else if (_.is_Array(callback))
		return callback[0].apply(_, callback[1]);
};

_// JSDT:_module_
.
/**
 * 當需要要求權限時，是否執行。（這樣可能彈出對話框）
 * Firefox 5 之後，就算要求了，對 local 也沒用，甚至會 hang 住掛掉，因此取消了。
 * @type	Boolean
 */
require_netscape_privilege.enabled = false;


//----------------------------------------------------------------------------------------------------------------------------------------------------------//

// we only need simple JSON.parse @ .get_script_base_path
var parse_JSON = typeof JSON === 'object' &&  JSON.parse ||
function(text, reviver) {
	try {
		//	borrow from Google, jQuery
		//	TODO: 對 String 只是做簡單處理，勢必得再加強。
		var o = ((new Function("return({o:" + text + "\n})"))()).o, i, v, to_delete = [];
		if (_.is_Object(o)) {
			if (_.is_Function(reviver)) {
				for (i in o)
					if (typeof (v = reviver(i, o[i])) === 'undefined')
						// 在這邊 delete o[i] 怕會因不同實作方法影響到 o 的結構。
						to_delete.push(i);
					else if (o[i] !== v)
						o[i] = v;

				if (to_delete.length)
					for (i in to_delete)
						delete o[to_delete[i]];
			}
			return o;
		} else
			return {};
	} catch (e) {
		if (_.is_debug(2))
			_.err('JSON.parse: SyntaxError: [' + text + ']');
		//throw e;
	}
};


_// JSDT:_module_
.
/**
 * 得知 script file 之相對 base path
 * @param	{String} JSFN	script file name (NOT path name)
 * @returns	{String} relative base path
 * @example
 * <script type="text/javascript" src="../baseFunc.js"></script>
 * //	引數為本.js檔名。若是更改.js檔名，亦需要同時更動此值！
 * var basePath = get_script_base_path('baseFunc.js');
 * perl: use File::Basename;
 */
get_script_base_path = function(JSFN) {
	//alert('JSFN: '+JSFN);
	if(!JSFN)
		return (_.is_WWW() ?
				// unescape(window.location.pathname)
				unescape(window.location.href)
				: typeof WScript === 'object' ? WScript.ScriptFullName
				//	用在把檔案拉到此檔上時不方便
				//: typeof WshShell === 'object' ? WshShell.CurrentDirectory
				: '').replace(/[^\/\\]+$/, '');

	//	We don't use is_Object or so.
	//	通常會傳入的，都是已經驗證過的值，不會出現需要特殊認證的情況。
	//	因此精確繁複的驗證只用在可能輸入奇怪引數的情況。
	if (!_.is_WWW())
		return '';

	//	form dojo: d.config.baseUrl = src.substring(0, m.index);
	var i = 0, o = document.getElementsByTagName('script'), l = o && o.length || 0, j, base_path, index, node;

	for (; i < l; i++)
		try {
			//	o[i].src 多是 full path, o[i].getAttribute('src') 僅取得其值，因此可能是相對的。
			j = node = o[i];
			j = j.getAttribute && j.getAttribute('src') || j.src;

			index = j.lastIndexOf(JSFN);
			//alert(j + ',' + JSFN + ',' + I);
			if (index !== -1){
				//	正規化: URL 使用 '/' 而非 '\'
				//	TODO: 尚未完善。
				if (j.indexOf('/') === -1 && j.indexOf('\\') !== -1)
					j = j.replace(/\\/g, '/');

				if (setup_extension && JSFN === _.env.main_script_name)
					setup_extension(j.slice(index + JSFN.length), node);

				//	TODO: test 是否以 JSFN 作為結尾
				base_path = j.slice(0, index);
				break;
			}
		} catch (e) {
		}

	//_.log()

	//	base_path || './'
	return base_path || '';
};

//	TODO: dirty hack
var setup_extension = function(extension, node) {
	if (extension === '.js' || extension === '.txt'){
		//	TODO: unload 時 delete .script_node
		//_.script_node = node;
		var env = _.env, config, match;
		try {
			config = node.innerText || (config = node.firstChild) && config.nodeValue;
			//	IE8 沒有 .innerText || .nodeValue
			if(!config && typeof (config = node.innerHTML)==='string'){
				config=(match=config.match(/^[\s\n]*<!--(.+?)-->[\s\n]*$/))
					?match[1]
					:config.replace(/<!--([\s\S]*?)-->/g,'');
			}
			if (config && (config = parse_JSON(config)))
				env.script_config = config;
		} catch (e) {
			_.err('setup_extension: Invalid configuration: [' + node.outerHTML + ']');
		}

		env.main_script = env.main_script.replace(new RegExp('\\'
				+ env.script_extension + '$'), extension);
		env.script_extension = extension;

		//alert(env.main_script + '\n' + env.script_extension);

		//	done.
		setup_extension = null;
	}
};

//----------------------------------------------------------------------------------------------------------------------------------------------------------//


_// JSDT:_module_
.
/**
 * test 是否符合 module pattern.
 * TODO: improve
 * @param {String} test_string	string to test
 * @returns	{Boolean}	是否符合 module pattern
 */
is_module_pattern = function(test_string){
	var r = _.env.module_identifier_RegExp;
	if (!r) {
		//	initial module_identifier_RegExp
		r = _.env.identifier_RegExp.source;
		r = _.env.module_identifier_RegExp = new RegExp('^' + r
				+ '(\\.' + r + ')*$');
	}

	return r.test(test_string);
};


_// JSDT:_module_
.
/**
 * test function.request 的項目是否為 module.
 * 以 ./ 開頭可以確保必定是 path.
 * TODO:
 * 現在還有很大問題!
 * @param {String} resource_string	resource to test
 * @returns	{Boolean}	resource 是否為 module (true: is module, false: is URL?)
 */
request_item_maybe_module = function(resource_string) {
	return typeof resource_string !== 'string'
		|| resource_string.charAt(0) === '.'
		|| resource_string.charAt(0) === '/'
		|| resource_string.indexOf(':') !== -1
		// || resource_string.indexOf('%')!==-1
		|| /\.(js|css)$/i.test(resource_string) ?
			false
		: /\.$/.test(resource_string)
		|| _.is_module_pattern(resource_string);
};


/**
 * library 相對於 HTML file 的 base path
 */
var library_base_path,

setup_library_base_path = function() {
	if(!library_base_path){
		library_base_path = _.env.registry_path
			|| _.get_script_base_path(_.env.main_script_name)
			|| _.get_script_base_path();

		if (!library_base_path
				&& _.is_Object(_.get_old_namespace())
				&& (library_base_path = _.get_old_namespace().library_path)) {
			if (/^[^\/]/.test(library_base_path)) {
				//	library_base_path is relative path
				//_.debug(_.get_script_full_name());
				library_base_path = _.simplify_path(_.get_script_full_name().replace(/[^\\\/]*$/, library_base_path));
			}
			library_base_path = _.simplify_path(library_base_path).replace(/[^\\\/]*$/, '');
		}

		if (library_base_path) {
			//_.debug('library base path: [' + library_base_path + ']');
			setup_library_base_path = function() {
				return library_base_path;
			};
		} else
			_.warn(_.Class + ': Cannot detect the library base path!');
	}

	return library_base_path;
};

_// JSDT:_module_
.
/**
 * get the path of specified module.
 * @example
 * //	存放 data 的 path
 * path = library_namespace.get_module_path(this, '');
 * 
 * @param {String} module_name	module name
 * @param	{String} file_name	取得在同一目錄下檔名為 file_name 之 path。若填入 '' 可取得 parent 目錄。
 * @returns	{String} module path
 */
get_module_path = function(module_name, file_name){
	module_name = get_module_name(module_name);
	var m;
	if (!module_name || !(m = _.split_module_name(module_name)))
		return module_name;

	//_.debug('test [' + module_name + ']', 1, 'get_module_path');
	var module_path = library_base_path || setup_library_base_path();
	//_.debug('library_base_path: ' + library_base_path, 1, 'get_module_path');

	module_path += m.join(/\//.test(module_path)?'/':'\\') + _.env.script_extension;
	//_.debug('module_path: ' + module_path, 1, 'get_module_path');

	if (typeof file_name !== 'undefined')
		module_path = module_path.replace(/[^\/]+$/, file_name);
	else if (_.getFP)
		module_path = _.getFP(module_path, 1);

	//_.debug(module_name + ': return [' + module_path + ']', 1, 'get_module_path');

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

//	2009/11/23 22:12:5 廢除!
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
 * @returns	{String} path
 */
simplify_path = function(path){
	if(typeof path === 'string'){
		var i, j, l, is_absolute, head;

		path = path
			.replace(/^[\w\d\-]+:\/\//, function($0) {
						head = $0;
						return '';
					})
			//	去除前後空白
			//.replace(/\s+$|^\s+/g,'')
			//.replace(/\/\/+/g,'/')
			.split(/[\/\\]/);

		i = 0;
		l = path.length;
		is_absolute = !path[0];

		for (; i < l; i++) {
			if(path[i] === '.')
				path[i] = '';

			else if(path[i] === '..'){
				j = i;
				while (j > 0)
					if (path[--j] && path[j] != '..') {
						// 相消
						path[i] = path[j] = '';
						break;
					}
			}
		}

		if(!is_absolute && !path[0])
			path[0] = '.';

		path = path.join(_.env.path_separator)
			.replace(/[\/\\]{2,}/g, _.env.path_separator)
			.replace(is_absolute ? /^([\/\\]\.\.)+/g : /^(\.[\/\\])+/g, '')
			;

		if(!path)
			path = '.';

		if(head)
			path = head + path;
	}

	return path;
};



/**
 * 載入 module 時執行 extend 工作。
 * @param module
 * @param extend_to
 * @param {Function} callback
 * @returns
 * @inner
 * @ignore
 */
var extend_module_member = function(module, extend_to, callback) {
	var i, l;

	//typeof name_space !== 'undefined' && _.debug(name_space);
	//	處理 extend to what name-space
	if (!extend_to && extend_to !== false
			//	若是在 .setup_module 中的話，可以探測得到 name_space？（忘了）
			//|| typeof name_space !== 'function'
			|| !_.is_Object(extend_to))
		//	預設會 extend 到 library 本身下
		extend_to = _;

	if (extend_to && (i = _.get_module(module))) {
		var ns = i, kw = _.env.not_to_extend_keyword, no_extend = {};
		//_.debug('load [' + module + ']:\nextend\n' + ns);

		if (kw in ns) {
			l = ns[kw];
			if (typeof l === 'string' && l.indexOf(',') > 0)
				l = l.split(',');

			if (typeof l === 'string') {
				no_extend[l] = 1;
			} else if (_.is_Array(l)) {
				for (i = 0; i < l.length; i++)
					// WScript.Echo('no_extend '+l[i]),
					no_extend[l[i]] = 1;
			} else if (_.is_Object(l)) {
				no_extend = l;
			}

			no_extend[kw] = 1;
		}

		//	'*': 完全不 extend
		if (!no_extend['*']) {
			no_extend.Class = 1;
			//	this: 連 module 本身都不 extend 到 library name-space 下
			var no_self = 'this' in no_extend;
			if(no_self)
				delete no_extend['this'];

			l = [];
			for (i in ns)
				if (!(i in no_extend))
					l.push(i);

			//_.debug('load [' + module + ']:\nextend\n' + l + '\n\nto:\n' + (extend_to.Class || extend_to));
			_.extend(l, extend_to, ns);

			/*
			 * extend module itself.
			 * e.g., .net.web -> .web
			 */
			if (!no_self && (i = _.split_module_name(module))
							&& (i = i.pop()) && !(i in _))
						_[i] = ns;
		}

	}


	try {
		i = _.is_Function(callback) && callback(undefined, module);
	} catch (e) {
	}
	return i;
};




_// JSDT:_module_
.
/**
 * 不使用 eval 的方法，get the module namespace of specific module name.
 * @param	{String} module_name	module name
 * @returns	null	some error occurred
 * @returns	namespace of specific module name
 */
get_module = function(module_name) {
	module_name = _.split_module_name.call(_, module_name);

	//	TODO: test module_name.length
	if(!module_name)
		return null;

	var i = 0, l = module_name.length, name_space = _;
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
 * 載入 module。
 * <p>
 * 本函數會預先準備好下層 module 定義時的環境，但請盡量先 call 上層 name-space
 * 再定義下層的，否則可能會出現問題，如 memory leak 等。
 * </p>
 * 
 * @param {String}
 *            [module_name]
 *            <p>
 *            module name to register: 本 module 之 name(id)
 *            </p>
 * @param {Function}
 *            code_for_including
 *            <p>
 *            若欲 include 整個 module 時，需囊括之 code。
 *            </p>
 *            code_for_including(
 *            		{Function} library_namespace:	namespace of library,
 *            		load_arguments:	呼叫時之 argument(s)
 *            )
 * @returns null
 *          <p>
 *          invalid module
 *          </p>
 * @returns {Object}
 *          <p>
 *          下層 module 之 name-space
 *          </p>
 * @returns undefined
 *          <p>
 *          something error, e.g., 未成功 load，code_for_including
 *          return null, ..
 *          </p>
 */
setup_module = function(module_name, code_for_including, parent_module_name) {
	// adapt arguments
	var i, l, name_space, allow_inherit, post_action,
	/**
	 * translate {String} code_for_including to function
	 */
	name = function() {
		//	null module constructor
		if (!code_for_including)
			code_for_including = function() {
				return _.null_function;
			};

		else if (typeof code_for_including === 'string')
			code_for_including =
				// (new Function(code_for_including)).bind(CeL)
				new Function('library_namespace', 'load_arguments', code_for_including);
	};

	if (typeof module_name === 'string') {
		name();
		if (_.is_Function(code_for_including)
				|| _.is_Object(code_for_including))
			code_for_including.module_name = module_name;

	} else {
		code_for_including = module_name;
		// TODO: 不設定時會從呼叫時之 path (directory + file name) 取得
	}

	if (_.is_Object(code_for_including)) {
		name_space = code_for_including;
		code_for_including = name_space.code;
		delete name_space.code;
		name();

		_.extend(name_space, code_for_including);

	} else
		name();

	if (!module_name && !(module_name = code_for_including.module_name)) {
		_.err('The module name is not specified!');
		_.debug(code_for_including);
		return null;
	}

	//	sub module
	if (_.is_Object(l = code_for_including.sub_module)) {
		name_space = module_name + _.env.module_name_separator;
		for (i in l)
			_.setup_module(name_space + i, l[i], module_name);
	}

	//_.debug('prepare to setup module [' + module_name + ']', 1, 'setup_module');

	/**
	 * 測試 dependency list 是不是皆已 loaded。
	 * 會合併 parent module 之 request。
	 * <dl>
	 * <dt>依 (module name-space).require 設定 dependency list</dt>
	 * <dd>(module name-space).require_module = module name[]</dd>
	 * <dd>(module name-space).require_variable = {variable_name: full_name_with_module_name}</dd>
	 * <dd>(module name-space).require_URL = URL[]</dd>
	 * </dl>
	 * TODO:
	 * 就算輸入 module path 亦可自動判別出為 module 而非普通 resource。
	 */
	var require = _.parse_require(code_for_including.require, code_for_including.require_separator, parent_module_name && module_require_chain[parent_module_name]), URL_to_load, module_to_load;
	if (_.is_Object(require)) {
		_.extend( {
			require_module : 'module_to_load',
			require_variable : 'variable',
			require_URL : 'URL_to_load'
		}, code_for_including, require);

		if (_.is_Array(require.module_to_load)
				&& require.module_to_load.length)
			module_to_load = require.module_to_load;

		if (_.is_Array(require.URL_to_load)
				&& require.URL_to_load.length)
			URL_to_load = require.URL_to_load;
	}


	if (module_to_load || URL_to_load) {

		//_.debug('module [' + (typeof module_name === 'string' ? module_name: undefined) + '] need to load:\n' + module_to_load, 1, 'setup_module');

		//	check 登錄
		if (module_name in module_require_chain) {
			//	可能是循環參照(circular dependencies)，還是執行 module code_for_including
			//	若本身已經在需求名單中則放行，避免相互需要造成堆疊空間不足(Out of stack space)或 Stack overflow。
			if (_.is_debug())
				_.warn('Skip to load dependencies [' + module_to_load + '] of module [' + module_name
						+ '] because the module is already in the require chain.\nmodule 正在需求鏈中。也許是循環參照(circular dependencies)？');

		}else{

			//	登錄: module_name 正在 call。若由其他 module call 的，那就登錄此 parent module。
			module_require_chain[parent_module_name || module_name] = require;

			// include required modules
			if (module_to_load && _.use(module_to_load)) {
				//	若有失敗、未載入之 dependencies，則不載入 module。
				if (!_.is_local() && _.is_debug() || _.is_debug(2)) {
					_.warn(_.Class + '.setup_module: Module [' + module_name + '] failure to load dependencies [' + module_to_load + ']. You have to load it later.');
				}

				//	throw and wait .include_resource() to call callback(path, module_name)
				//	為了預防後面還有 code 而繼續執行下去，所以採用 throw 而非 return。
				throw new Error(_.Class + '.setup_module: Module [' + module_name + '] 無法以 Ajax load required module!\nrequired module list: ['+module_to_load+']');
			}

			if (URL_to_load) {
				// 嘗試直接載入
				//	URL_to_load is Array.
				for (i = 0; i < URL_to_load.length; i++)
					try {
						if (l = _.get_file(i = URL_to_load[i]))
							_.eval_code(l);
						else
							throw 1;

					} catch (e) {
						_.err('module [' + (typeof module_name === 'string' ? module_name : undefined) + '] load URL [' + i
								+ '] error. You have to load it later.');
						// return and wait .include_resource() to call callback(path, module_name)
						throw new Error(_.Class + '.setup_module: module [' + module_name + '] 無法以 Ajax 來 load required URL [' + i + ']!');
					}
			}

		}

	}
	// else	所有需求皆已在 queue 中，因此最後總**有機會（不包括發生錯誤的情況！）**會被 load，故 skip。


	var module_name_list = _.split_module_name(module_name);
	if (!module_name_list) {
		_.err('Illegal module name: [' + module_name + ']!');
		_.debug(code_for_including);

		//	執行完清除載入中之登錄
		if(module_name in module_require_chain)
			delete module_require_chain[module_name];

		return null;
	}

	//	若皆載入: 準備執行 module code_for_including
	//	一層一層準備好、預定義 name-space
	for (i = 0, l = module_name_list.length - 1, name_space = _; i < l; i++) {
		if (!name_space[name = module_name_list[i]])
			/**
			 * <code>
			 * _.debug('預先定義 module [' + _.to_module_name(module_name.slice(0, i + 1)) + ']'),
			 * </code>
			 */
			name_space[name] = new Function(
					'//	null constructor for module ' +
					_.to_module_name(module_name_list.slice(0, i + 1)));
		name_space = name_space[name];
	}
	//	name_space 這時是 module 的 parent module。

	if (
			// 尚未被定義或宣告過
			!name_space[name = module_name_list[l]] ||
			// 可能是之前簡單定義過，例如被上面處理過。這時重新定義，並把原先的 member 搬過來。
			!name_space[name].Class) {

		// 保留原先的 name-space，for 重新定義
		l = name_space[name];

		// extend code, 起始 name-space
		try {
			/**
			 * 真正執行 module code.
			 * <code>
			 * _.debug('including code of [' + _.to_module_name(module_name) + ']..'),
			 * </code>
			 * TODO: code_for_including(_, load_arguments)
			 */
			i = code_for_including.call(code_for_including, _,
				{
					//	這樣在 module 中可以 load_arguments.module_name 來取得 module name。
					module_name : module_name
				});
			//	http://developer.51cto.com/art/200907/134913.htm
			if (!i.prototype.constructor)
				i.prototype.constructor = i;
			if ('allow_inherit' in i) {
				allow_inherit = i.allow_inherit;
				delete i.allow_inherit;
			}
			if ('post_action' in i) {
				post_action = i.post_action;
				delete i.post_action;
			}
			//code_for_including.toString = function() { return '[class_template ' + name + ']'; };
			//i.toString = function() { return '[class ' + name + ']'; };
		} catch (e) {
			_.err(_.Class + '.setup_module: load module [' + _.to_module_name(module_name) + '] error!\n' + e.message);
			i = undefined;
		}

		if (i === undefined)
			//	error?
			return undefined;

		name_space = name_space[name] = i;

		// 把原先的 member 搬過來
		if (l) {
			delete l.Class;
			//	may use: _.extend()
			//	** 因 name_space 為 function，extend() 預設會當作 function 處理，可能會出問題！
			extend(l, name_space);
			//for (i in l) name_space[i] = l[i];
		}
		name_space.Class = _.to_module_name(module_name);
	}

/*
	l=[];
	for(i in name_space)
		l.push(i);
	WScript.Echo('Get members:\n'+l.join(', '));
*/

	//	執行完清除載入中之登錄。
	if(module_name in module_require_chain)
		delete module_require_chain[module_name];

	set_loaded(name_space.Class, code_for_including, allow_inherit);

	//	處理在 module setup/設定 時尚無法完成的工作，例如 including external resources。
	if (post_action) {
		if (!_.is_Array(post_action))
			post_action = [ post_action ];
		for (i = 0; i < post_action.length; i++) {
			if (typeof post_action[i] === 'function') {
				try {
					post_action[i].call(name_space, _);
				} catch (e) {
					_.warn('setup_module [' + module_name + ']: error to running post action ' + i + '/' + post_action.length + '.');
					_.err(e);
				}
			}
		}
	}

	_.debug('module [' + module_name + '] loaded.', 2, 'setup_module');

	return name_space;
};



_// JSDT:_module_
.
/**
 * 是否 cache code。
 * 若不是要重構 code 則不需要。
 * undefined: 依照預設
 * Boolean: 明確設定，但如此即無法繼承。
 * @type	Boolean, undefined
 */
cache_code = /*_.is_debug() || */ undefined;

/**
 * cache 已經 include 之函式或 class。
 * loaded_module[module_name] =
 * 		undefined: 尚未載入。
 * 		{Boolean} true	已經載入，但未 cache code。
 * 		{Function} code	已經載入，這是 cache 了的 code。
 * @inner
 * @ignore
 * @type Object
 */
var loaded_module = {
};


/**
 * 紀錄 **正在 load** 之 module 所需之 dependency list。
 * module_require_chain[module_name] = [未載入之 dependency list by .parse_require()] requesting now.
 * 
 * ** 這一項僅在 .setup_module() 發現 dependency list 尚未載入完時，預防循環 request 而用。
 * @inner
 * @ignore
 * @type Object
 */
var module_require_chain = {
};



_// JSDT:_module_
.
/**
 * 將輸入的 string 分割成各 module 單元。<br />
 * need environment_adapter()<br />
 * ** 並沒有對 module 做完善的審核!
 * @param {String} module_name	module name
 * @returns	{Array}	module unit array
 */
split_module_name = function(module_name) {
	//_.debug('[' + module_name + ']→[' + module_name.replace(/\.\.+|\\\\+|\/\/+/g, '.').split(/\.|\\|\/|::/) + ']');
	if (typeof module_name === 'string')
		module_name = module_name
			//.replace(/\.\.+|\\\\+|\/\/+/g, '.')
			.replace(/[\\\/]/g, '.')
			.split(/[.\\\/]|::/);

	if (_.is_Array(module_name) && module_name.length) {
		//	去除 library name
		if (module_name.length > 1 && _.Class === module_name[0])
			module_name.shift();
		return module_name;
	} else
		return null;
};


/**
 * 取得建構 code 之 module name。不以 library name 起始。
 * // get_module_name()
 * code_for_including.module_name === 'module_name';
 * // _.to_module_name()
 * library_name.module_parent.module_child.Class === 'library_name.module_parent.module_child' === 'library_name.module_name';
 * TODO:
 * 有效率的整合 get_module_name() 與 _.to_module_name()
 * @param code_for_including
 * @returns {String} module name
 */
var get_module_name = function(code_for_including) {
	//_.debug('module_name: ' + (_.is_Function(code_for_including) && code_for_including.module_name ? code_for_including.module_name : code_for_including), 1, 'get_module_name');
	//_.debug('Class: ' + (_.is_Function(code_for_including) && code_for_including.Class ? code_for_including.Class : code_for_including), 1, 'get_module_name');

	return _.is_Function(code_for_including) && code_for_including.module_name ?
			code_for_including.module_name
			: code_for_including;
};


_// JSDT:_module_
.
/**
 * 取得 module 之 name。以 library name 起始。
 * @returns {String} module name start with library name
 */
to_module_name = function(module, separator) {
	if (_.is_Function(module))
		module = module.Class;
	else if (module === _.env.main_script_name)
		module = _.Class;

	if (typeof module === 'string')
		module = _.split_module_name(module);

	var name = '';
	if (_.is_Array(module)) {
		if (typeof separator !== 'string')
			separator = _.env.module_name_separator;
		if (module[0] !== _.Class)
			name = _.Class + separator;
		name += module.join(separator);
	}

	return name;
};



//TODO
_// JSDT:_module_
.
get_require = function(func) {
	if (_.is_Function(func) || _.is_Object(func))
		return func.require;

	if (_.is_Function(func = loaded_module[_.to_module_name(func)]))
		return func.require_module;
};

//TODO
_// JSDT:_module_
.
unload_module = function(module, g){
	///	<returns>error</returns>
	if(_.is_debug())
		throw new Error('TODO');

};


_// JSDT:_module_
.
/**
 * 判斷 module 是否存在，
 * TODO
 * 以及是否破損。
 * @param	{String} module_name	module name
 * @param	{Array} module_name	module name list
 * @returns	{Boolean} 所指定 module 是否全部存在以及良好。
 */
is_loaded = function(module_name) {
	if (_.is_Array(module_name)) {
		for ( var i = 0, l = module_name.length; i < l; i++)
			if (!loaded_module[_.to_module_name(module_name[i])])
				return false;
		return true;
	}

	// var _s = arguments.callee;
	//_.debug('test ' + _.to_module_name(module_name));

	/*
	var code = loaded_module[_.to_module_name(module_name)], sub_module, prefix;
	if (_.is_Function(code) && (sub_module = code.sub_module)) {
		sub_module = sub_module.split('|');
		prefix = module_name + _.env.module_name_separator;
		for ( var i = 0, l = module_name.length; i < l; i++){
			_.debug('check [' + prefix + sub_module[i] + ']', 1, 'is_loaded');
			if (!_.is_loaded(prefix + sub_module[i]))
				return false;
		}
		return true;
	}
	*/

	return module_name in loaded_module ?
			//	return full module name.
			loaded_module[module_name] : !!loaded_module[_.to_module_name(module_name)];
};



/**
 * 設定登記 module 已載入。
 * @inner
 * @private
 */
var set_loaded = function(module_name, code_for_including, cache_code) {
	//	登記 full module name。e.g., 'data.code'.
	loaded_module[module_name = _.to_module_name(module_name)]
		= (cache_code || _.cache_code) && code_for_including || true;
	//_.debug(module_name);

	//	登記單純 module name。e.g., 'code'.
	var index = module_name.lastIndexOf(_.env.module_name_separator);
	if (index !== -1)
		loaded_module[module_name.slice(index + 1)] = module_name;
};





function get_include_resource(split) {
	if (!_.is_WWW(true))
		//	誤在非 HTML 環境執行，卻要求 HTML 環境下的 resource？
		//if(typeof document==='object')_.warn(_.Class + ".include_resource: Can't load [" + path + "]!");
		return undefined;

	var i, nodes = document.getElementsByTagName('script'), h, hn, count = 0, p, l;

	function normalize(p) {
		//alert(p);
		//	正規化: URL 使用 '/' 而非 '\'
		//if (p.indexOf('/') === -1 && p.indexOf('\\') !== -1)
		//	p = p.replace(/\\/g, '/');
		//alert(p);
		return _.simplify_path(p);
	}

	if (split)
		h = {
			script : {},
			css : {}
		},
		hn = h.script;
	else
		hn = h = {};

	l = nodes.length;
	for (i = 0; i < l; i++) {
		p = normalize(nodes[i].src);
		if (p)
			hn[p] = 1, count++;
	}

	nodes = document.getElementsByTagName('link');
	if (split)
		hn = l.css;

	l = nodes.length;
	for (i = 0; i < l; i++) {
		p = normalize(nodes[i].href);
		if (p)
			hn[p] = 1, count++;
	}

	return [ h, count ];
};

/**
 * 已經 include_resource 了哪些 JavaScript 檔（存有其路徑）。預防重複載入。
 * included_path[path] =
 * 		undefined: 尚未載入。
 * 		true	已經載入。
 * 
 * TODO:
 * included_path[index] = [time stamp, path],
 * @inner
 * @ignore
 * @type Object
 */
var included_path;

function included_path_init(){
	var s = get_include_resource();
	if(s)
		included_path = s[0];
	return included_path || {};
}


_// JSDT:_module_
.
is_included = function(path) {
	return !!(included_path || included_path_init())[path];
};

var set_included = function(path, timeout_id) {
	(included_path || included_path_init())[path] = timeout_id;
},

get_included = function(path) {
	return (included_path || included_path_init())[path];
};



_// JSDT:_module_
.
/**
 * include resource of module.
 * 
 * @example <code>
 * //	外部程式使用時，通常用在 include 相對於 library 本身路徑固定的檔案。
 * //	例如 file_name 改成相對於 library 本身來說的路徑。
 * CeL.include_module_resource('../../game/game.css');
 * 
 * library_namespace.include_module_resource('select_input.css', this);
 * </code>
 * 
 * @param {String}
 *            file_name 與 module 位於相同目錄下的 resource file name
 * @param {String}
 *            [module_name] 呼叫的 module name。<br>
 *            未提供則設成 library base path，此時 file_name 為相對於 library 本身路徑的檔案。
 * @param {Function}[callback]
 *            回撥函式。
 * @returns
 * @since 2010/1/1-2 13:58:09
 */
include_module_resource = function(file_name, module_name, callback) {
	//var m = _.split_module_name.call(_, module_name);
	//if (m) m[m.length - 1] = file_name;
	return _.include_resource.call(_,
			_.get_module_path(get_module_name(module_name) || _.Class, file_name), callback);
};



//----------------------------------------------------------------------------------------------------------------------------------------------------------//


_// JSDT:_module_
.
/**
 * Include specified module.<br />
 * 
 * 會先嘗試使用 XMLHttpRequest 同步(synchronously)的方式依序取得、載入 module。
 * 無法以 XMLHttpRequest 循序載入時，若未設定 callback，會回傳錯誤。若設定 callback，則會插入 node，以非同步(asynchronously)的方式載入 module，於載入完成執行 callback。
 * 		若因為 browser 安全性設定等問題而無法取得，則會回傳 -1，表示將以非同步(asynchronously)的方式載入 module。因為 module 尚未載入，在此階段尚無法判別此 module 所需之 dependency list。此 list 會被作為引數傳入 callback。
 * 
 * 注意：以下的 code 中，CeL.warn 不一定會被執行（可能會、可能不會），因為執行時 log 可能尚未被 include。<br />
 * 此時應該改用 CeL.set_run('application.log', callback);<br />
 * code in head/script/:
 * <code>
 * CeL.use('code.log');
 * CeL.warn('WARNING message');
 * </code>
 * **	在指定 callback 時 name_space 無效！
 * **	預設會 extend 到 library 本身之下！
 * @param	{String} module	module name
 * @param	{Function} [callback]	callback function | [callback, 進度改變時之 function (TODO)]
 * @param	{Object|Boolean} [extend_to]	extend to which name-space<br />
 * 		false:	just load, don't extend to library name-space<br />
 * 		this:	extend to global<br />
 * 		object:	extend to specified name-space that you can use [name_space]._func_ to run it<br />
 * 		(others, including undefined):	extend to root of this library. e.g., call CeL._function_name_ and we can get the specified function.
 * @returns	{Error}
 * @returns	-1	will execute callback after load, 不代表 load module 了!
 * @returns	{undefined}	no error, OK
 * @example
 * CeL.use('code.log', function(){..});
 * CeL.use(['code.log', 'code.debug']);
 * @note
 * 'use' 是 JScript.NET 的保留字.
 */
use = function requires(module, callback, extend_to, force){
	var _s = requires, i, l, module_path;

	//_.debug('load [' + module + ']');
	if (!module)
		return undefined;

	/*
	if (arguments.length > 3) {
		l = arguments.length;
		name_space = arguments[--l];
		callback = arguments[--l];
		--l;
		for (i = 0; i < l; i++)
			_s.call(_, arguments[i], callback, name_space);
		return undefined;
	}
	*/

	if (_.is_Array(module)) {
		var error;
		for (i = 0, l = module.length; i < l; i++) {
			error = _s.call(_, module[i], 0, extend_to);
			if (error)
				return error;
		}
		try {
			i = _.is_Function(callback) && callback(undefined, module);
		} catch (e) {
		}
		return i;
	}

	if (!force && _.is_loaded(module)
			|| !(module_path = _.get_module_path(module))) {
		try {
			i = _.is_Function(callback)
			&& callback(undefined, module);
		} catch (e) {
		}
		return i;
	}

	//_.debug('load [' + module + ']:\ntry to load [' + module_path + ']');

	//	including code
	try {
		try{
			//_.debug('load [' + module_path + ']');
			//_.debug(_.get_file(module_path, _.env.source_encoding));
			//WScript.Echo(_.eval);
			i = _.get_file(module_path, _.env.source_encoding);
			if (i)
				//	eval @ global. 這邊可能會出現 security 問題。
				//	TODO: 以其他方法取代 eval 的使用。
				_.eval_code(i);
			else
				//console.log('Get no result from [' + module_path + ']! Some error occurred?'),
				_.warn('Get no result from [' + module_path + ']! Some error occurred?');
			i = 0;
		} catch (e) {
			i = e;
		}

		if (!i) {
			//	以 .get_file() 依序載入成功。
			return extend_module_member(module, extend_to, callback);
		}

		//	以 .get_file() 依序載入失敗。
		if (callback && _.is_WWW()) {
			//	不能直接用 .get_file()，得採用其他方法的狀況。但只在有 callback 時才 include，否則當下 block 的都沒執行，可能出亂子。
			//	** 較新之 browser 通常需要使用 callback 的方法，不能使用 "CeL.use('module');_do_some_thing_;"!!
			// TODO: 在指定 callback 時使 name_space 依然有效。
			_.include_resource(module_path, {
					module : module,
					callback : function() {
						extend_module_member(module, extend_to, callback);
					},
					start : new Date(),
					timeout : module_timeout,
					global : _
				},
				//	正在 call(循環參照?)則強制 include。
				module in module_require_chain
			);

			//	TODO: 一次指定多個 module 時可以知道進度，全部 load 完才 callback()。
			//	此時 callback=[callback, 進度改變時之 function]
			//	return 進度 Object
			return -1;
		}
		throw i;

	} catch (e) {
		//_.err(e);

		//	若為 local，可能是因為瀏覽器安全策略被擋掉了。
		if (!_.is_local() || _.is_debug(2)) {
			// http://www.w3.org/TR/DOM-Level-2-Core/ecma-script-binding.html
			// http://reference.sitepoint.com/javascript/DOMException
			if (_.is_type(e, 'DOMException') && e.code === 1012) {
				_.err(_.Class + '.use:\n' + e.message + '\n'
					+ module_path + '\n\n程式可能呼叫了一個'
					+ (_.is_local() ? '不存在的，\n或是繞經上層目錄'
							: 'cross domain')
							+ '的檔案？\n\n請嘗試使用相對路徑，\n或加入  callback: '
							+ _.Class + '.use(module, callback function, name_space)');
			} else if (
					//	系統找不到指定的資源/存取被拒。
					_.is_type(e, 'Error') && (e.number & 0xFFFF) === 5
					|| _.is_type(e, 'XPCWrappedNative_NoHelper')
							&& ('' + e.message).indexOf('NS_ERROR_FILE_NOT_FOUND') !== -1) {
				if (_.is_debug())
					_.err(_.Class + '.use: 檔案可能不存在或存取被拒？\n[' + module_path + ']' +
						(_.get_error_message
								? ('<br />' + _.get_error_message(e))
								: '\n' + e.message
						)
					);
			} else
				_.err(_.Class + '.use: Cannot load [<a href="' + module_path + '">' + module + '</a>]!'
					+ (_.get_error_message
							? ('<br />' + _.get_error_message(e) + '<br />')
							: '\n[' + (e.constructor) + '] ' + (e.number ? (e.number & 0xFFFF) : e.code) + ': ' + e.message + '\n'
					)
					+ '抱歉！在載入其他網頁時發生錯誤，有些功能可能失常。\n重新讀取(reload)，或是過段時間再嘗試或許可以解決問題。');
			//_.log('Cannot load [' + module + ']!', _.log.ERROR, e);
		}

		return e;
	}

};


_// JSDT:_module_
.
is_local = function() {
	//	cache
	return (_.is_local = _.constant_function(!_.is_WWW() || window.location.protocol === 'file:'))();
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


var default_timeout = _.is_local() ?
		// 若短到 3s， 在大檔案作 auto_TOC() 會逾時。
		6000 : 30000,
		//	module 專屬。
		module_timeout = _.is_local() ? 80 : 800;

/**
 * Including other JavaScript/CSS files asynchronously.
 * 
 * TODO:
 * timeout for giving up
 * use document.createElementNS()
 * http://headjs.com/#theory
 * 
 * @param {String} resource path
 * @param {Function|Object} callback
 * 		use_write ? test function{return } : callback function(path)
 * 		/	{callback: callback function(path, module), module: module name, global: global object when run callback}
 * @param {Boolean} [use_write]	use document.write() instead of insert a element to <head>
 * @param {Number} [type]	1: is a .css file, others: script
 */
function include_resource(path, callback, force, timeout, type, use_write) {
	if (!_.is_WWW())
		return undefined;

	var s, t, h;

	if (_.is_Array(path)) {
		for (s = 0, t = path.length; s < t; s++)
			include_resource(path[s], callback, use_write, type);
		return undefined;
	}

	if (_.is_Object(force) && arguments.length === 3) {
		timeout = force.timeout;
		type = force.type;
		use_write = force.use_write;
		force = force.force;
	}

	path = _.simplify_path(path);
	if(!force && _.is_included(path)){
		//	已經載入完成
		_.is_Function(callback) && include_resource.wait_to_call(callback, path);
		return undefined;
	}
	set_included(path);

	/* const */
	var css = 1, js = 0;
	//_.debug('Including [' + path + '].', 1, 'include_resource');
	if (typeof type === 'undefined')
		type = /\.css$/i.test(path) ? css : js;

	//	TODO: for <a href="http://en.wikipedia.org/wiki/JSONP" accessdate="2012/9/14 23:50">JSONP</a>
	t = 'text/' + (type === css ? 'css' : 'javascript');
/*@cc_on
//use_write=1;	//	old old IE hack
@*/
	if (!use_write)
		try {
			// Dynamic Loading / lazy loading
			// http://code.google.com/apis/ajax/documentation/#Dynamic
			//	http://en.wikipedia.org/wiki/Futures_and_promises
			s = document.createElement(type === css ? 'link' : 'script');
			s.width = s.height = 0;

			//	http://wiki.forum.nokia.com/index.php/JavaScript_Performance_Best_Practices
			//	** onload 在 local 好像無效
			var done = false;
			//	TODO:
			//	http://www.xdarui.com/articles/66.shtml
			//	使用 attachEvent 註冊事件，然後用 detachEvent。在ie6上就算把onreadystatechange重置為null了，但只是把引用給斷開了，而回調還存在內存之中，只是無法訪問了而已，有可能造成內存的溢出。
			s.onload = s.onreadystatechange = function(e) {
				var r;
				//_.debug('Loading [' + path + '] .. ' + this.readyState);
				//alert('Loading [' + path + '] .. ' + s.readyState);

				//	navigator.platform === 'PLAYSTATION 3' 時僅用 'complete'? from requireJS
				if (!done && (!(r = this.readyState /* 'readyState' in this ? this.readyState : e.type !== 'load' */) || r === 'loaded' || r === 'complete')) {
					done = true;
					//_.debug('[' + (this.src || s.href) + '] loaded.');
					//alert('[' + (this.src || s.href) + '] loaded.');

					//this.onload = this.onreadystatechange = null;
					try{
						delete this.onload;
					}catch (e) {
						//	error on IE5–9: Error: Object doesn't support this action
						this.onload = null;
					}
					try{
						delete this.onreadystatechange;
					}catch (e) {
						//	error on IE5–9: Error: Object doesn't support this action
						this.onreadystatechange = null;
					}

					//	callback 完自動移除 .js。隨即移除會無效。.css 移除會失效。CSS 不設定 timeout。
					setTimeout(function() {
						if (type !== css && h)
							h.removeChild(s);
						h = s = null;
					}, 1);

					//	.css 移除會失效。CSS 不設定 timeout。
					var tid = get_included(path);
					if (tid) {
						clearTimeout(tid);
						set_included(path, 0);
					}

					if(callback)
						include_resource.wait_to_call(callback, path);
				}
			};

			s.type = t;
			if (type === css)
				//	.css 移除會失效。CSS 不設定 timeout。
				// s.media = 'all',//'print'
				s.rel = 'stylesheet',
				s.href = path;
			else {
				set_included(path, setTimeout(function() {
					_.warn('include_resource: Loading failed (timeout ' + timeout + ' ms): [' + path + ']');
					//alert('include_resource: Loading failed (timeout ' + timeout + ' ms): [' + path + ']');

					// 自動移除 .js。
					if (h)
						h.removeChild(s);
					h = s = null;

					if(callback)
						include_resource.wait_to_call(callback, path, true);
				}, timeout || default_timeout));

				//	TODO: see jquery-1.4a2.js: globalEval
				//	if (is_code) s.text = path;
				//	http://www.lampblog.net/2010/12/html5%E4%B8%ADscript%E7%9A%84async%E5%B1%9E%E6%80%A7%E5%BC%82%E6%AD%A5%E5%8A%A0%E8%BD%BDjs/
				//	如果 async 屬性為 true，則腳本會相對於文檔的其餘部分異步執行，這樣腳本會可以在頁面繼續解析的過程中來執行。
				//	如果 async 屬性為 false，而 defer 屬性為 true，則腳本會在頁面完成解析時得到執行。
				//	如果 async 和 defer 屬性均為 false，那麼腳本會立即執行，頁面會在腳本執行完畢繼續解析。
				//	http://www.cnblogs.com/darrel/archive/2011/08/02/2124783.html
				//	當script的 async 屬性被置為 true 時，腳本的執行序為異步的。即不按照掛載到 Dom 的序順執行 ，相反如果是 false 則按掛載的順序執行。
				s.async = true;
				//s.setAttribute('src', path);
				s.src = path;
			}

			//	HTML5: document.head === document.getElementsByTagName('head')[0]
			if(h = document.head || document.getElementsByTagName('head')[0]
					|| (document.body.parentNode || document.body).appendChild(document.createElement('head'))
					)
				//h.parentNode.insertBefore(s, h);
				h.appendChild(s);

			//_.debug('HTML:\n' + document.getElementsByTagName('html')[0].innerHTML);
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

			return s;

		} catch (e) {
		}

	//_.debug('Writing code for [' + path + '].');
	//	直接寫入，
	//	TODO: 若在 window.onload 之後使用會清空頁面!
	if (use_write
			|| typeof use_write === 'undefined' // && TODO: 正在 load 頁面
			)
		document.write(type === css ?
				//	TODO: security concern: 對 path 作 filter
				'<link type="' + t + '" rel="stylesheet" href="' + encodeURI(path) + '"><\/link>'
				: '<script type="' + t + '" src="' + encodeURI(path)
					// language="JScript"
					+ '"><\/script>');

	//	若是到這邊還沒 load，會造成問題。
	//set_included(path);

	if (callback)
		include_resource.wait_to_call(callback, path);
}

_// JSDT:_module_
.
include_resource = include_resource;


/**
 * 準備 callback
 * @inner
 * @private
 * @ignore
 */
include_resource.wait_to_call = function(callback, path, failed) {
	//alert('include_resource.wait_to_call:\n' + _.to_module_name(callback.module));

	if (_.is_Function(callback))
		//	不是 module，僅僅為指定 function 的話，直接等一下再看看。
		//	TODO: 等太久時 error handle
		setTimeout(function() {
			callback(path, undefined, failed);
		}, 200);

	else if (_.is_Object(callback) && callback.global) {
		//	是 module。
		var using_time, loaded = callback.global.is_loaded(callback.module);
		if (loaded
				|| (using_time = new Date() - callback.start) > callback.timeout) {
			//	若某 module 很快就 loaded，則剩下的應當亦可很快 loaded。除非是其他 domain 的。
			if (loaded && module_timeout > (using_time *= 10))
				module_timeout = using_time;

			//	依 callback 的類型處理 callback
			if(_.is_Function(callback.callback))
				//	直接執行
				callback.callback(path, callback.module, failed);

			else if (typeof callback.callback === 'string')
				//	load 另一個 module
				_.use(callback.callback);
			// TODO
			// else..

		} else {
			/**
			 * 還沒載入完成，所以再等一下。 the function it self, not 'this'.
			 * @inner
			 * @ignore
			 */
			var _s = _.include_resource.wait_to_call, _t = this, _a = arguments;
			setTimeout(function() {
				_s.apply(_t, _a);
			}, 50);
		}
	}
};

//if (_.is_Function(include_resource))
//	_.extend(null, include_resource, _.include_resource);



/*

CeL.set_run(running sequence: [commands]|[required sequence])
	[commands]/動作串
		[],
		function_to_run
			[optional] {object} function_to_run.config
			執行次序：
			[optional: run_first, on load required] function_to_run.run_first = function(is prepared?): [bool] time (ms) to re-check
			[optional] function_to_run.require = [require sequence]
			[optional: prepared, before trigger] function_to_run.before_load = function()
			[optional] waiting for function_to_run.trigger =
				觸發時機/trigger action time
				[string] action name | number = 0
				onload: 'load' (default), {number} timeout (ms)
			function_to_run.send_argument = (default: auto detect)
			function_to_run = function() event handler
			TODO: after_load

	[required sequence]/前置條件/先備條件/prerequisite/necessary
		{string} library module name to import, {string} file path(image/JavaScript files/CSS), {number} timeout (ms)

		.charAt(0)==='.' || .charAt(0)==='/' || .indexOf(':')!==-1
			//|| .indexOf('%')!==-1
			|| /\.(js|css)$/i	→URL

		i=env.identifier_RegExp.source;
		env.module_identifier_RegExp=new RegExp('^'+i+'(\\.'+i+')*$');	→module

		else→URL

		∴'path1.sub1.sub2'→'./path1.sub1.sub2'



CeL.set_run.error=function(message){
	;
};
CeL.set_run.load={resource:status};

CeL.use('module_name');
CeL.load('resource path');


2011/6/22 17:43:50,2011/7/31 00:11:52







.set_run(running sequence)


//	同步 loading set: 可同時 load 的 {String|Function} module/path/function
synchronous_group = {
	//check: {Function},

	//	.to_run 會先執行，而後 delete
	to_run[]: [{Function} function],
	//	to load
	to_load_path{}: [{String} path],
	//	有幾個 resources 需要 load
	path_count: integer count of to_load_path,
	to_load_module{}: [{String} module],
	module_count: integer count of to_load_module,

	//	可能闕如: 下一組
	next_group: next synchronous_group{},

	//	可能闕如: timeout 用
	start_time: integer,
	//	已設定之 timeout (ms)
	timeout: integer,

	//	可能闕如: 臨時新增用，是為了預防有 call C，但 dependency 為 A→B→C 的情況。重複使用 queue 但不檢查 require 可能造成 B 與 C 被放在同一 synchronous_group。
	require: {}
};




臨時/後續/後來新增:

原先	［C,E]
發現B→C	[B,E]→[C]
發現D→E	[B,D]→[E]→[C]
發現A→B	[A,D]→[B]→[E]→[C]

2011/8/8 00:07:06



*/

_// JSDT:_module_
.
/**
 * control/setup source codes to run.
 * 基本上使用非同步(asynchronously)的方式，除非所需資源已經載入，或是有辦法以 {@link XMLHttpRequest} 取得資源。
 * 
 * @example
 * var sr;
 * CeL.set_run(
 * 	function(){sr = CeL.set_run;},
 * 	function(){
 * 		sr('module_name', function(){
 * 			// FunctionBody
 * 		});
 * 	});
 * 
 * 
 * TODO:
 * set_run() 無法在 [] 中設定執行次序(running sequence)。
 * 
 * TODO:
 * <code>
 * //	將所有 function 與 module 一視同仁。
 * sr('module_name', function(){
 * 	CeL.import('module_name', {module_function_1:0});
 * 
 * 	CeL.module_function_1('11') === module_function_1('11');
 * 
 * 	var instance=new CeL.module_name.module_class_1;
 * 	instance.print(112);
 * });
 * </code>
 * 
 * @param	running sequence: list of
 * 		{Function} function to run/欲執行之 function → change .to_run
 * 		| {Integer} timeout (ms): 僅能保證上次 function 執行至此次 function 一定會等超過這段時間 → change .start_time, .timeout
 * 		| {String} library module name to import → change .to_load_module, .module_count
 * 		| {String} URL/file path (image/JavaScript files/CSS) → change .to_load_path, .path_count
 * 		| {Array} 另一組同時 loading set: [{String|Function|Integer}, ..] → 拆開全部當作同時 loading
 * 		| TODO: {Object}	loading with additional config
 * 
 * @since 2011/8/4 22:31:47
 */
set_run;

if (!_.is_WWW())
	_.set_run = normal_set_run;
else
	//	(_.set_run)(): 確保初始化程序被執行。
	(_.set_run = function() {
		if (!set_run_before_ready_queue) {
			if (document.readyState === "complete")
				return (_.set_run = normal_set_run).apply(this, arguments);

			var loaded = function() {
				if (document.addEventListener)
					document.addEventListener("DOMContentLoaded", loaded, false);
				else
					window.detachEvent("onload", loaded);

				_.set_run = normal_set_run;

				if (set_run_before_ready_queue
						&& set_run_before_ready_queue.length) {
					set_run_before_ready_queue.push(function() {
						set_run_before_ready_queue = null;
					});
					check_run(set_run_before_ready_queue, 0);
				}
			};

			if (document.addEventListener) {
				// https://developer.mozilla.org/en/Gecko-Specific_DOM_Events
				document.addEventListener("DOMContentLoaded", loaded, false);
			} else if (window.attachEvent) {
				window.attachEvent("onload", loaded);
			} else {
				_.err('set_run: No event listener!');
				var old_onload = window.onload;
				window.onload = old_onload ? function() {
					old_onload();
					loaded();
				} : loaded;
			}

			set_run_before_ready_queue = [
				// 初始化程序
				setup_library_base_path, initialization_config ];
		}

		if (arguments.length)
			// 為了預防有相依關係，這邊不採 Array.prototype.push()。
			set_run_before_ready_queue = set_run_before_ready_queue
					.concat(Array.prototype.slice.call(arguments));
	})();


var set_run_before_ready_queue;

/**
 * 初始化 user 設定: 處理在 <script> 中插入的初始設定。
 * 
 * TODO:
 * 若是設定:
 * <code>
 * {"set_run":["css.css","js.js"]}
 * </code>
 * 則 .js 可能執行不到，會被跳過。
 */
function initialization_config() {
	var set_run_queue = _.env.script_config;
	if (_.is_Object(set_run_queue)
			&& (set_run_queue = set_run_queue.set_run))
		check_run(_.is_Array(set_run_queue) ? set_run_queue
				: [ set_run_queue ], 0);
}




/**
 * DOM 載入後，正常 .set_run 之前置作業。
 */
function normal_set_run() {
	//_.debug('process ' + arguments.length + ' items.', 2, 'normal_set_run');
	if (arguments.length > 0)
		//Array.prototype.slice.call(arguments)
		check_run(arguments, 0);
}


/**
 * .set_run main process.
 * 
 * @param {Arguments} work_queue
 *            sequence of set_run.arguments. 不修改 work_queue===set_run.arguments，直接以 work_queue_index 為開始值。
 * @param {Integer} work_queue_index
 *            index of work queue
 * @param {Object}
 *            [synchronous_group] 正在 running 的 set.
 * 
 * @since 2011/8/4 22:31:47
 * 2011/8/8 23:27:15, –2011/8/11 18:29:51	rewrite
 */
function check_run(work_queue, work_queue_index, synchronous_group) {

	var work_queue_length = work_queue.length, work_set;
	// 沒有累積的 synchronous_group 時，才繼續處理指定的工作。否則先處理之。
	if (!synchronous_group) {

		//	取得下一工作組。
		while (!(work_set = work_queue[work_queue_index++])) {
			if (work_queue_index >= work_queue_length) {
				//if (work_queue_index >= work_queue_length)
				//	_.debug('處理完畢: [' + work_queue_length + '] [' + Array.prototype.slice.call(work_queue) + ']', 2, 'check_run');
				return;
			}
		}

		var to_run = [], to_load_path = {}, path_count = 0, to_load_module = {}, module_count = 0, timeout = 0,
		/**
		 * 增加項目至當前的 synchronous_group.
		 */
		add_item = function(item) {
			// TODO:
			// {Object} loading with additional config

			var v;
			if (typeof item === 'string'
				&& (v = _.get_variable(item)))
				//alert(item),
				item = v;

			if (_.is_Array(item)) {
				// {Array} 另一組同時 loading set: [{String|Function|Integer}, ..] →
				// 拆開全部當作同時 loading
				for ( var i = 0; i < item.length; i++)
					add_item(item[i]);

			} else if (_.is_Function(item)) {
				// {Function} function to run → to_run
				if (!item.require) {
					//	TODO
					// check if the function require something first.
					to_run.push(item);
				} else
					to_run.push(item);

			} else if (typeof item === 'string') {
				if (_.request_item_maybe_module(item)) {
					//	TODO: 若是已 cached 則跳過。
					//_.debug('treat resource [' + item + '] as module ' + module_count, 2, 'check_run');
					if (!(item in to_load_module) && !_.is_loaded(item))
						to_load_module[item] = 0, module_count++;
				} else if (!(item in to_load_path) && !_.is_included(item))
					//_.debug('treat resource [' + item + '] as URL ' + path_count, 2, 'check_run'),
					to_load_path[item] = 0, path_count++;

			} else if ((item = Math.floor(item)) > timeout) {
				// {Integer} timeout
				timeout = item;

			} else {
				// 其他都將被忽略!
				_.warn('check_run: Unknown item: [' + item + ']');
			}
		};

		// add item to synchronous_group
		add_item(work_set);

		// 初始化 initialization synchronous_group
		synchronous_group = {};

		if (timeout)
			// 設定好時間
			synchronous_group.start_time = new Date(),
			synchronous_group.timeout = timeout;
		if (to_run.length)
			synchronous_group.to_run = to_run;
		if (path_count)
			synchronous_group.path_count = path_count,
			synchronous_group.to_load_path = to_load_path;
		if (module_count)
			synchronous_group.module_count = module_count,
			synchronous_group.to_load_module = to_load_module;

		//_.debug(module_count + '個同步載入 resources 設定完畢。', 2, 'check_run');
	}


	//_.debug('開始處理當前的 synchronous_group, work_queue ' + work_queue_index + '/' + work_queue_length, 2, 'check_run');

	var s, index,

/*

臨時/後續/後來新增:
如果 check 發現 _path_ dependencies 尚未 load，則把 dependencies 加入 to_load_path|to_load_module，去除 (to_load_path|to_load_module)[_path_]，
新增一 synchronous_group， next_group.(to_load_path|to_load_module) = _path_ 並設置 synchronous_group.require{} = dependencies

原先	［C,E]
發現B→C	[B,E]→[C]
發現D→E	[B,D]→[E]→[C]
發現A→B	[A,D]→[B]→[E]→[C]

*/
	/**
	 * 臨時/後續新增項目至當前的 synchronous_group.
	 * callback 用.
	 */
	afterwards_add = function(item, item_is_path) {

		var
		require = _.is_Function(item) ?
			_.parse_require(item.require, item.require_separator) :
			/** module */
			module_require_chain[item],

		to_load_path = require.URL_to_load,
		to_load_module = require.module_to_load;

		if (!to_load_path && !to_load_module)
			return 1;


		var i, resource, changed = false, s, n;

		//	把 dependencies: URL 加入 synchronous_group
		if (to_load_path) {
			//	synchronous_group 可能並沒有 .path_count
			if (isNaN(synchronous_group.path_count))
				s = synchronous_group.to_load_path = {},
				synchronous_group.path_count = 0;
			else
				s = synchronous_group.to_load_path;

			//	to_load_path is Array.
			for (i = 0; i < to_load_path.length; i++) {
				if (resource = to_load_path[i]) {
					_.debug('URL load dependency: [' + resource + ']→[' + item + ']', 2, 'check_run.afterwards_add');
					if(resource in s)
						//	假如是同一批的 M1, M2 都需要 P0，則跑到 M2 時 P0 不需要設定第二次，但需要把 M2 移到下一批次。
						if ((n = synchronous_group.next_group) && !(item in n.to_load_path))
							n.to_load_path[item] = 0,
							n.path_count++;
						else {
							if (_.is_debug() && (!n || _.is_debug(2)))
								_.warn('check_run.afterwards_add: 無法把 URL [' + item + '] 移到下一批次: 下一批次' + (n ? '不存在' : '已有此 URL') + '!');
						}
					else
						//	因為是指向 Object，因此不需要再設定 synchronous_group.to_load_path。為防節外生枝，直接改 .path_count，不 cache。
						s[resource] = 0, synchronous_group.path_count++, changed = true, load_URL(resource);
				}
			}

			//show_set('after afterwards_add URL dependency changed');
		}

		//	把 dependencies: module 加入 synchronous_group
		if(to_load_module){
			//	synchronous_group 可能並沒有 .module_count
			if (isNaN(synchronous_group.module_count))
				s = synchronous_group.to_load_module = {},
				synchronous_group.module_count = 0;
			else
				//	s: 當前欲載入之 module
				s = synchronous_group.to_load_module;

			//	to_load_module is Array.
			for (i = 0; i < to_load_module.length; i++) {
				if (resource = to_load_module[i]) {
					_.debug('module load dependency: [' + resource + ']→[' + item + ']', 2, 'check_run.afterwards_add');
					if (resource in s)
						// 假如是同一批的 M1, M2 都需要 M0，則跑到 M2 時 M0 不需要設定第二次，但需要把 M2 移到下一批次。
						if ((n = synchronous_group.next_group) && !(item in n.to_load_module))
							n.to_load_module[item] = 0,
							n.module_count++;
						else {
							if (_.is_debug() && (!n || _.is_debug(2)))
								//	不存在:此錯誤或可忽略?
								_.warn('check_run.afterwards_add: 無法把 module [' + item + '] 移到下一批次: 下一批次' + (n ? '已有此 module' : '不存在') + '!');
						}
					else
						//	因為是指向 Object，因此不需要再設定 synchronous_group.to_load_module。為防節外生枝，直接改 .module_count，不 cache。
						s[resource] = 0, synchronous_group.module_count++, changed = true, load_module(resource);
				}
			}

			//show_set('after afterwards_add module dependency changed');
		}

		if (changed && item) {
			//show_set('準備將 [' + item + '] 從 synchronous_group 搬到 next_group');

			s = synchronous_group.next_group;
			if (s)
				s = {
					next_group : s
				};
			else {
				s = {};
				if ('timeout' in synchronous_group)
					_.extend( {
						timeout : 0,
						start_time : 0
					}, s, synchronous_group);
			}
			synchronous_group.next_group = s;

			if (item_is_path) {
				(s.to_load_path = {})[item] = 0;
				s.path_count = 1;
			} else if (typeof item === 'string') {
				(s.to_load_module = {})[item] = 0;
				s.module_count = 1;
			} else if (_.is_Function(item)) {
				s.to_run = [ item ];
			}
			//else warn();

			//show_set('已將 [' + item + '] 從 synchronous_group 搬到 next_group');
		} else
			return 2;

	},

	//	debug 用
	//TODO: Object.keys(obj)
	//	https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Object/keys
	get_Object_key = function(o) {
		if (_.is_Array(o))
			return o;
		//if (!_.is_Object(o)) return undefined;
		var i, l = [];
		for(i in o)
			l.push(i);
		return l;
	},

	//	debug 用
	show_set = function(from) {
		if(_.is_debug(2)){
			var ptr = synchronous_group, s_data = [ '預計先後載入同步載入組: ' + (from || '') ], d;
			do {
				d = ptr.to_load_module ? get_Object_key(ptr.to_load_module) : 0;
				s_data.push(
						d?
								'[' + (ptr.module_count === d.length ? ptr.module_count : '<em>登記 ' + ptr.module_count + ' != 實際 ' + d.length + '</em>') + '] '
										+ d.join(' <span style="color:#f00">|</span> ')
								: '<span style="color:#888">(none: 此同步載入組無預計載入之 module)</span>'
						);
			} while (ptr = ptr.next_group);
			_.debug(s_data.join('<br />'), 1, 'check_run.show_set');
		}
	},

	//check module_require_chain{module_name}
	/**
	 * 載入間執行之 function.
	 * 有未載入之 dependencies，僅能從 callback 傳入此 module 所需之 dependency list 來處置。
	 * TODO: 確認若是 load 錯誤時，會不會跳過 check_loading 不執行。
	 */
	check_loading = function(path, module_name) {
		//_.debug((module_name ? 'module [' + module_name  + ']/all ' + synchronous_group.module_count : path ? 'path [' + path + ']/all ' + synchronous_group.path_count : '沒有尚未 load 的 resource') + (synchronous_group.timeout ? ', timeout ' + synchronous_group.timeout : ''), 1, 'check_run.check_loading');
		//show_set('check_loading start');

		if (module_name) {

			//	'module_name' is module
			delete synchronous_group.to_load_module[module_name];
			synchronous_group.module_count--;

			if (!_.is_loaded(module_name))
				if (module_require_chain[module_name])
					afterwards_add(module_name);
				else if (typeof module_name === 'string'
						//	external/ 可以放置外部 library/source files.
						&& module_name.indexOf('external.') !== 0)
					//	若有不存在的 module，因為會以 .include_resource 載入，在 MSIE 中會 throw。
					//	可以由判別 browser 改善此體驗。
					_.err('check_run.check_loading: Cannot load module [' + module_name + ']!');

		} else if (path) {

			//	'module_name' is path, 無法判別是否成功 included。
			delete synchronous_group.to_load_path[path];
			synchronous_group.path_count--;

		}

		//	可能因為循環參照(circular dependencies)，這邊的 module 之前已經 load 過，因此需要再作 check。
		//	.. pass
		;

		if (!synchronous_group.module_count
					&& !synchronous_group.path_count){
			var timeout = synchronous_group.timeout
						- (new Date() - synchronous_group.start_time);
			synchronous_group = synchronous_group.next_group;
			move_to_next_group = true;

			//_.debug('Move to next synchronous load group. 本同步載入組已全部載入，' + (synchronous_group ? '進入下一同步載入組。' : work_queue_index < work_queue.length ? '繼續下一組指定的工作 [' + work_queue_index + '/' + work_queue.length + ']。' : '本次指定的 ' + work_queue_index + ' 項工作已全部執行完成。') + (timeout > 4 ? 'timeout ' + timeout + ' 超過 4ms，設定 timeout。' : ''), 1, 'check_run.check_loading');
			if (timeout > 4)
				// TODO: setTimeout 可能不存在!
				setTimeout(function() {
					check_run(work_queue, work_queue_index,
							synchronous_group);
				}, timeout);
			else
				check_run(work_queue, work_queue_index,
						synchronous_group);
			//_.debug('設定完畢', 1, 'check_run.check_loading');
		}
	},

	load_module = function(module_name) {
		//_.debug('use [' + module_name + ']', 1, 'check_run.load_module');
		// .use 會先試試 .get_file()
		_.use(module_name, check_loading);
	},

	load_URL = function(URL, encoding) {
		// 準備載入 resource. ** 在已經 loaded 的情況下有可能直接就執行完 return!
		//_.debug('[' + URL + ']', 1, 'check_run.load_URL');
		if (/\.js$/i.test(URL))
			try{
				// 對 .js 先試試 .get_file()
				var t = _.get_file(URL, encoding);
				//_.debug('Get [' + t + ']', 2, 'check_run.load_URL');
				if (t)
					//	eval @ global. 這邊可能會出現 security 問題。
					//	TODO: 以其他方法取代 eval 的使用。
					_.eval_code(t);

				check_loading(URL);
				return undefined;

			}catch (e) {
				//_.err(e);
			}

		//_.debug('需要作同步 loading resource [' + URL + ']', 1, 'check_run.load_URL');
		_.include_resource(URL, check_loading);
	},

	/**
	 * 是否已經移到下一 group
	 */
	move_to_next_group = false,

	to_load_module, to_load_path;


	// 把能處理的 .to_run function 先執行處理，而後早點 delete 以釋放空間。
	if (s = synchronous_group.to_run) {
		//	對 Array 不能用 for..in: 不能保證，亦不能限制使用者不改變 Array.prototype。
		for (index = 0; index < s.length; index++)
			try {
				// 已經過鑑別，這邊的應該都是 Function。
				s[index]();

			} catch (e) {
				_.err('check_run: ' + e.message);
				_.debug('<code>'
						+ ('' + s[index]).replace(/\n/g, '<br />')
						+ '</code>');
			}
		//_.debug('把能處理的 function 先處理完了，刪除 synchronous_group.to_run 的資料。', 2);
		delete synchronous_group.to_run;
	}


	if(move_to_next_group)
		//	在上一個 load_module() 呼叫 check_loading() 時，可能因為 synchronous_group = synchronous_group.next_group 使得 synchronous_group 已轉換到下一 synchronous load group。
		return undefined;

	if(to_load_module = synchronous_group.to_load_module)
		for (index in to_load_module)
			load_module(index);

	if(move_to_next_group)
		return undefined;

	if(to_load_path = synchronous_group.to_load_path)
		for (index in to_load_path)
			load_URL(index);


	if (!move_to_next_group
			&& !to_load_module
			&& !to_load_path) {
		//_.debug('[' + work_queue_index + '/' + work_queue_length + '] 沒有尚未 load 的 resource (例如只輸入 timeout 或每個 resource 皆 loaded)，手動執行 check_loading。', 1, 'check_run');
		check_loading();
	}

	// 開始蟄伏, waiting for callback
}



//----------------------------------------------------------------------------------------------------------------------------------------------------------//



_// JSDT:_module_
.
/**
 * module 中模擬 inherit 時使用。
 * 
 * TODO:
 * thread-safe
 * 
 * @param {String} parent_module_name	欲繼承的 module_name
 * @param initial_arguments	繼承時的 initial arguments
 * @returns
 * @see
 * <a href="http://fillano.blog.ithome.com.tw/post/257/17355" accessdate="2010/1/1 0:6">Fillano's Learning Notes | 物件導向Javascript - 實作繼承的效果</a>,
 * <a href="http://www.crockford.com/javascript/inheritance.html" accessdate="2010/1/1 0:6">Classical Inheritance in JavaScript</a>
 */
inherit = function(parent_module_name, initial_arguments) {
	if(!_.cache_code && _.cache_code !== undefined)
		_.debug('inherit: cache code did not setted but try to inherit module!');

	var code_for_including = loaded_module[_.to_module_name(parent_module_name)];
	try {
		if (_.is_Function(code_for_including))
			return code_for_including.call(code_for_including, _, initial_arguments);

		_.err('inherit: [' + parent_module_name + '] did not catched!');
	} catch (e) {
		_.err('inherit: running of [' + parent_module_name + '] error!');
		return e;
	}
};




_// JSDT:_module_
.
/**
 * 解析 dependency list 以獲得所需之 module/path/variable name..
 * 
 * @param {Array|String}
 *            dependency_list
 *            <p>
 *            list of dependency function/module/variable required. module 須以
 *            CeL.env.module_name_separator ('.') 結尾。若輸入 String，則以 separator 或 '|' 分割。
 *            </p>
 * @returns {Object} result { variable: {variable_name: full_name}, module:
 *          {module name: loaded or not}, module_to_load: [], URL: {}}
 * @returns {Number} error code
 * @since 2011/8/6 22:10:57
 */
parse_require = function(dependency_list, separator, base_require) {

	if(!dependency_list)
		//	is_Object(undefined) === true!
		return 0;

	var i, module, module_name_separator = _.env.module_name_separator,
	/**
	 * variable name under module
	 */
	var_name,
	/**
	 * 解析出要 extend 到 'this' 下的 variables。
	 * variable_hash[variable name] = 所在 module name.
	 */
	//variable_hash = {},
	/**
	 * 解析出要 extend 到 'this' 下的 variables。
	 * variable_full_name[variable name] = variable full name.
	 */
	variable_full_name,
	/**
	 * 解析出的 URL paths.
	 * URL_hash[URL] = loaded or not;
	 */
	URL_hash,
	/**
	 * 解析出需要 load 的 URL paths.
	 */
	URL_to_load,
	/**
	 * dependency_list 中指定的 module。
	 * module_hash[module name] = loaded or not
	 */
	module_hash,
	/**
	 * 已 load 的 module。
	 */
	//module_loaded = [],
	/**
	 * 要 load 的 module。
	 */
	module_to_load;

	if (typeof dependency_list === 'string')
		dependency_list = dependency_list.split(separator || '|');
	else if (_.is_Object(dependency_list)) {
		//	TODO: 此處實尚未規範，應不可能執行到。
		module = [];
		for (i in dependency_list)
			module.push(dependency_list[i]);
		dependency_list = module;
	} else if (!_.is_Array(dependency_list)) {
		return 1;
	}
	//	至此 dependency_list is Array.

	if (_.is_Object(base_require)) {
		variable_full_name = base_require.variable,
		URL_hash = base_require.URL,
		URL_to_load = base_require.URL_to_load,
		module_hash = base_require.module,
		module_to_load = base_require.module_to_load;

		//variable_hash = {};
	} else {
		variable_full_name = {},
		URL_hash = {},
		URL_to_load = [],
		module_hash = {},
		module_to_load = [];
	}

	//	解析 dependency_list，將所須 functions/modules 置於 variable_hash/module_hash 中。
	for (i = 0; i < dependency_list.length; i++)
		if (_.request_item_maybe_module(module = dependency_list[i])
				&& (module = _.split_module_name(module))) {

			// 類似 'data.split_String_to_Object' 的形式，為 function。
			// 類似 'data.' 的形式，為 module。
			var_name = module.pop();
			if (var_name)
				variable_full_name[var_name] = (
					//variable_hash[var_name] =
					 _.to_module_name(module))
						+ module_name_separator + var_name;
			//_.debug('load module [' + _.to_module_name(module) + ']' + (var_name ? '.' + var_name : ''));

			//_.debug('test module ['+module.join(module_name_separator)+']: '+_.get_module(module)));

			//	不用 _.to_module_name，因為會加油添醋。
			module = module.join(module_name_separator);

			//	確定是否還沒載入，必須 load。還沒載入則放在 module_to_load[] 中。
			if (!(module in module_hash)) {
				if (!(module_hash[module] = _.is_loaded(module)))
					//_.debug('module [' + module + '] need to load first.'),
					module_to_load.push(module);
			}

		} else if (!(module in URL_hash) && !(URL_hash[module] = _.is_included(module)))
			URL_to_load.push(module);


	return {
		//require : dependency_list,
		variable : variable_full_name,

		module : module_hash,
		//module_loaded : module_loaded,
		module_to_load : module_to_load,

		URL : URL_hash,
		URL_to_load : URL_to_load
	};
};


/*
//這得要直接貼在標的 scope 內才有用。
var no_strict_variable_use = (function() {
	var v, i = 0;
	try {
		// find a undefined var_name
		for (;;)
			eval(v = 'tmp_' + i++);
	} catch (i) {
	}

	eval('var ' + v + '=1;');

	try {
		//	OK 表示在 eval 中可以設定 var.
		//	若是 'use strict'; 則不可在 eval() 中置 var.
		return eval(v);
	} catch (i) {
	}
})();
*/

//	http://closure-compiler.appspot.com/
//	這得要直接貼在標的 scope 內才有用。
//var no_strict_variable_use=function(){var a,b=9;try{for(;;)eval(a="t_"+b++)}catch(c){}eval("var "+a+"=1;");try{return eval(a)}catch(d){}}();

_// JSDT:_module_
.
/**
 * module 中需要 include function/module/variable 時設定 local variables 使用。<br />
 * 本函數將把所需 function include 至當前 namespace 下。
 * 
 * TODO: 輸入 function name 即可
 * 
 * @example
 * 
 * //	requires (inside module)
 * //	事先定義 @ 'use strict';
 * var split_String_to_Object;
 * //	之所以需要使用 eval 是因為要 extend 至當前 namespace 下。
 * //	若無法 load CeL.data，將會 throw
 * eval(library_namespace.use_function(this, 'data.split_String_to_Object'));
 * //	use it
 * split_String_to_Object();
 * 
 * //	不用 eval 的方法 1: function 預設都會 extend 至當前 library_namespace 下。
 * library_namespace.use_function(this, 'data.split_String_to_Object');
 * library_namespace.use_function(this, 'data.split_String_to_Object', false);
 * //	若無法 load CeL.data，將會 throw
 * //	use it
 * library_namespace.split_String_to_Object();
 * 
 * //	不用 eval 的方法 2: 設定 extend_to
 * var o={};
 * //	若無法 load CeL.data，將會 throw
 * library_namespace.use_function(this, 'data.split_String_to_Object', o);
 * //	use it
 * o.split_String_to_Object();
 * 
 * @param	{Function|Object} name_space	module name-space
 * @param	{Array|String} dependency_list	list of dependency function/module/variable required. module 須以 '.' 結尾。若輸入 String，則以 ',' 分割。
 * @param	{Function|Object} [extend_to]	若設定將把 variable extend 至 extend_to
 * 
 * @returns	{Number} error code
 * 		1: can't parse dependency_list
 * 
 * @throws	{Error}	有些 module 尚未載入。
 * 
 * @since	2009/12/26 02:36:31
 * 2009/12/31 22:21:23	add 類似 'data.' 的形式，為 module。
 * 2010/6/14 22:58:18	避免相互 require
 */
use_function = function(name_space, extend_to, optional_use, no_strict) {

	var module_name = get_module_name(name_space);

	//_.debug('load function [' + dependency_list + ']' + (typeof module_name === 'string' && module_name ? ' from [' + module_name + ']' : ''));

	var variable_name, value, eval_code = [],
	/**
	 * 要 extend 到 name_space 下的 variables。
	 * variable_hash[variable name] = variable full name, 包括所在 module name.
	 */
	variable_hash = name_space.require_variable;

	no_strict = no_strict && !extend_to ? [] : false;

	//	設定 required variables
	for (variable_name in variable_hash)
		if ((value = _.get_variable(variable_hash[variable_name])) !== undefined) {
			//_.debug('指定 [' + variable_name + ']: ' + value));
			if (extend_to)
				extend_to[variable_name] = value;
			else {
				no_strict && no_strict.push(variable_name);

				eval_code.push('try{' + variable_name + '=' +
						//	預防有保留字，所以用 bracket notation。例如 Chrome 中會出現 'Unexpected token native'。
						//	Dot Notation and Square Bracket Notation in JavaScript	http://www.dev-archive.net/articles/js-dot-notation/
						variable_hash[variable_name].replace(/\.([a-z\d_]+)/gi, '["$1"]') + ';}catch(e){}');
			}

		} else {
			// 可能因為循環參照(circular dependencies)，事實上 required 並未 loaded。
			if(!(module_name in module_require_chain) || _.is_debug(2))
				_.err(_.Class + '.use_function: load [' + variable_hash[variable_name] + '] @ ['
						+ _.to_module_name(module_name) + '] error: The module is not included or defined? You have to load they all later.');

			if (extend_to) {
				extend_to[variable_name] = function() {
					try {
						//	稍後求值，僅對 function 有效。
						return _.get_variable(variable_hash[variable_name]);
					} catch (e) {
					}
				};
			} else {
				no_strict && no_strict.push(variable_name);

				//	稍後求值，僅對 function 有效。
				eval_code.push(variable_name + '=function(){try{return ' + variable_name + '='
						+ variable_hash[variable_name].replace(/\.([a-z\d_]+)/gi, '["$1"]')
						+ ';}catch(e){}};');
			}


			// delete it if doesn't exists
			//delete variable_hash[variable_name];
		}

	//	應注意 module_name 為保留字之類的情況，會掛在這邊 return 後的 eval。
	return extend_to
		|| (no_strict ? 'var ' + no_strict.join(',') + ';' : '') + eval_code.join('');
};


// ----------------------------------------------------------------------------------------------------------------------------------------------------------//

_.initial_env();


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
	 * 理論上 '.'.split(/\./).length 應該是 2，但 IE 5–8 中卻為 0!
	 * 用 .split('.') 倒是 OK.
	 * TODO:
	 * 應該增加可以管控與回復的手段，預防有時需要回到原有行為。
	 * @since	2010/1/1 19:03:40
	 */
	if ('.'.split(/\./).length === 0)
		(function() {
			var _String_split = String.prototype.split,
				is_RegExp = _.object_tester('RegExp');
			String.prototype.split = function(r) {
				return is_RegExp(r) ?
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

}
//	不用 apply()，因為比較舊的瀏覽器沒有 apply()。
)(CeL);

