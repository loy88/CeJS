
/**
 * @name	CeL function for source code.
 * @fileoverview
 * 本檔案包含了處理 source code 的 functions。
 * @since	
 */


if (typeof CeL === 'function')
CeL.setup_module('data.code',
function(library_namespace, load_arguments) {

//	nothing required


/**
 * null module constructor
 * @class	處理 source code 的 functions
 */
var _// JSDT:_module_
= function() {
	//	null module constructor
};

/**
 * for JSDT: 有 prototype 才會將之當作 Class
 */
_// JSDT:_module_
.prototype = {
};



/**
 * 類似 sprintf，處理 escape sequence 字串之 function.
 * 
 * @example <code>
 * CeL.set_run('data.code',function(){var e=CeL.parse_escape('00%M0\\\\\\\\\\%Mg\\a1\\n1\\s1\\a222',function(s){return s.replace(/%M/g,'_');});CeL.info(e.replace(/\n/g,'<br />'));CeL.assert(e==='00_0\\\\%Mga1\n1s1a222');});
 * </code>
 * 
 * @param {String}string
 *            欲格式化之字串 / source text.
 * @param {Object|String}option
 *            選擇性功能: {<br />
 *            {character}escape: escape character,<br />
 *            {Object}escape_length: escape sequence length,<br />
 *            {Function}handle: 處理 source text (非 escape sequence) 之 function,<br />
 *            {Function}escape_handle: 處理 escape sequence 之 function.<br /> }
 * 
 * @returns {Array} source text list:<br />
 *          [source text, escape sequence, source text, escape sequence, ..]
 */
function parse_escape(string, option) {
	var
	/**
	 * 搜索到 match 之部分
	 */
	match,
	/**
	 * 搜索之 pattern
	 */
	parse_RegExp,
	/**
	 * 下次檢索的起始點
	 */
	start_index = 0,
	/**
	 * <a href="http://en.wikipedia.org/wiki/Escape_character"
	 * accessdate="2012/3/24 11:16" title="Escape character">escape character</a>
	 * 
	 * @type {character}
	 */
	e_c = '\\',
	/**
	 * escape sequence length.<br />
	 * default: 1.<br />
	 * 為處理不定長 escape sequence. 這裡僅列出需要特別注意的。
	 * 
	 * @type {Object}
	 */
	e_l = {
		// TODO: [\d],
		u : 4,
		U : 8,
		x : 2
	},
	/**
	 * handle function.<br />
	 * 處理 source text (非 escape sequence) 之 function.
	 * 
	 * @type {Function}
	 */
	handle,
	/**
	 * Single Character Escape Sequences
	 * 
	 * @type {Object}
	 */
	s_c_e_s = {
		u : to_char,
		U : to_char,
		x : to_char,
		// '"' : '\"', "'" : "\'", '\\' : '\\',
		b : '\b',
		t : '\t',
		n : '\n',
		v : '\v',
		f : '\f',
		r : '\r'
	},
	/**
	 * escape sequence handle function.<br />
	 * 處理 escape sequence 之 function.
	 * 
	 * @type {Function}
	 */
	e_s_handle = function(s, a) {
		//library_namespace.debug(s + ': additional [' + a + '], ');
		if (s in s_c_e_s) {
			var f = s_c_e_s[s];
			s = typeof f === 'function' ? f(s, a) : f;
		}
		return s;
	},
	/**
	 * 回傳之 source text list:<br />
	 * [source text, escape sequence, source text, escape sequence, ..]
	 * 
	 * @type {Array}
	 */
	source_text_list = [];

	/**
	 * Unicode to character.
	 * 
	 * @param {character}c
	 *            escape sequence 的種類: x, u, U, ..
	 * @param {String}x
	 *            hexadecimal digits /[\da-f]/i
	 * 
	 * @returns {character} character
	 */
	function to_char(c, x) {
		//library_namespace.debug('U+' + x + ': [' + String.fromCharCode(parseInt(x, 16)) + ']');
		return String.fromCharCode(parseInt(x, 16));
	}

	/**
	 * 處理 match 之部分:<br />
	 * [source text, escape sequence]
	 * 
	 * @param {String}s
	 *            source text
	 * @param {String}e_s
	 *            escape sequence
	 */
	function handle_slice(s, e_s) {
		//library_namespace.debug(start_index + ': [' + s + ']<em>|</em>' + (e_s || ''));
		if (s && handle)
			s = handle(s);
		if (e_s) {
			var l, e = '';
			if (e_s in e_l) {
				e = string.substr(start_index, l = e_l[e_s]);
				//library_namespace.debug('(' + l + ') [' + e_s + e + ']');
				parse_RegExp.lastIndex = (start_index += l);
			}
			if (e_s_handle)
				e_s = e_s_handle(e_s, e);
			else if (e !== '')
				e_s += e;
			source_text_list.push(s, e_s);
		} else if (s)
			source_text_list.push(s);
	}

	if (typeof option === 'string')
		e_c = option;
	else if (typeof option === 'function')
		handle = option;
	else if (library_namespace.is_Object(option)) {
		if (option.escape)
			e_c = option.escape;
		if (option.escape_length)
			e_l = option.escape_length;
		if (option.handle)
			handle = option.handle;
		if (option.escape_handle)
			e_s_handle = option.escape_handle;
	}

	parse_RegExp = new RegExp('((.|\n)*?)\\' + e_c + '(.)', 'g');

	//library_namespace.debug('[' + string + ']');
	while (match = parse_RegExp.exec(string)) {
		start_index = parse_RegExp.lastIndex;
		handle_slice(match[1], match[3]);
	}
	handle_slice(string.slice(start_index));

	return handle ? source_text_list.join('') : source_text_list;
};


_// JSDT:_module_
.
parse_escape = parse_escape;





return (
	_// JSDT:_module_
);
}


);

