
/**
 * @name	CeL integer function
 * @fileoverview
 * 本檔案包含了整數 (integer) 的 functions，相當/類似於 BigInteger, bigint, Large number。<br />
 * 在純 javascript 的環境下，藉由原生計算功能，盡可能提供高效的大數計算。<br />
 * integer 大數基本上即為 Integer.BASE 進位制之數字系統。
 *
 * @example
 * <code>
 * CeL.run('data.math.integer');
 * var integer = new CeL.integer('654561264556287547824234523');
 * CeL.log(integer.add('096527893048039647894'));
 * </code>
 *
 * @since	2013/9/8 13:42:58
 */


/*
TODO:

https://en.wikipedia.org/wiki/Arbitrary-precision_arithmetic

http://msdn.microsoft.com/zh-tw/library/system.numerics.biginteger.aspx
http://docs.oracle.com/javase/7/docs/api/java/math/BigInteger.html


https://github.com/silentmatt/javascript-biginteger
https://github.com/peterolson/BigInteger.js
https://github.com/peterolson/BigRational.js
https://github.com/cwacek/bigint-node/blob/master/lib/bigint.js

http://www.leemon.com/crypto/BigInt.html
http://www-cs-students.stanford.edu/~tjw/jsbn/
http://java.sun.com/javase/6/docs/api/java/math/BigInteger.html


規格書:

integer = new Integer(number,        do not set fraction = false, base = default base);
integer = new Integer(number String, base of String,              base = default base);
integer = new Integer(Integer,       (ignored),                   base = default base);

// digit Array
integer[{integer}digit index] = the digit of base ^ (index + exponent)
integer[KEY_NEGATIVE]		= {Undefined|Boolean}this integer is negative
integer[KEY_BASE]			= {natural number}base of this integer
integer[KEY_EXPONENT]		= {integer}exponent of this integer
integer[KEY_CACHE]			= {Undefined|Array}cache String of value
integer[KEY_CACHE][base]	= {String}value in base
integer[KEY_TYPE]			= {Undefined|Number}NaN / Infinity
integer[KEY_FACTORS]		= {Undefined|Array}factors / 因數
integer[KEY_FACTORS].sort(function(a,b){var na=Array.isArray(a),nb=Array.isArray(b);return na^nb?na^0:na&&nb?a.length-b.length||a[a.length-1]-b[b.length-1]:a-b;});


*/



'use strict';
if (typeof CeL === 'function')
	CeL.run(
	{
		name: 'data.math.integer',
		require: 'data.code.compatibility|data.native',
		code: function (library_namespace) {

			//	requiring
			//var GCD, factorization;
			//eval(this.use());

			// ---------------------------------------------------------------------//
			// 定義基本常數。

			//assert: isNaN(KEY_*)
			// {safe integer} MIN_BASE <= instance[KEY_BASE] <= MAX_BASE
			// instance[KEY_BASE] 初始設定完後，除非歸零，否則不可再改變!
			var KEY_BASE = 'base',
			// sign. true: *this* is negative, false/undefined: positive.
			KEY_NEGATIVE = 'negative',
			//{Integer}[exponent]	輸入數值標記之科學記數法指數 in instance[KEY_BASE]。default 0.
			KEY_EXPONENT = 'exponent',
			//僅為大數整數分解（因數分解, integer factorization）存在。
			// this[KEY_FACTORS] = [ {safe integer}scalar純量, Integer, ..]
			KEY_FACTORS = 'factors',
			// instance[KEY_CACHE][base] = string in base;
			KEY_CACHE = 'cache',
			//instance[KEY_TYPE] = NaN / Infinity; unset: instance is normal number.
			// ** instance[\d] 本身僅存儲純數字。
			KEY_TYPE = 'type',

			// 本 library 所允許之最大可安全計算整數。MAX_SAFE_INTEGER <= Number.MAX_SAFE_INTEGER。
			MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER,

			// see for_each_digit()
			//之後再作初始化。
			//assert: 0 < MIN_BASE <= MAX_BASE
			MIN_BASE = 0,
			// assert: MAX_BASE * MAX_BASE < MAX_SAFE_INTEGER + 2
			// see change_base_to(), for_each_digit()
			//	為方便乘法處理，因此取自乘不致 overflow ( > MAX_SAFE_INTEGER) 之值，預防 overflow 用。
			MAX_BASE = Math.floor(Math.sqrt(MAX_SAFE_INTEGER)),

			//可辨認之數字字串。
			//	[ full , sign, integer part 整數部分, fractional part 小數部分, exponent 指數 ]
			PATTERN_NUMBER = /([+\-]?)([\d]*)(?:\.([\d]+))?(?:[eE]([+\-]?\d+))?/,
			PATTERN_NUMBER_HEX = /([+\-]?)([\da-z]*)(?:\.([\da-z]+))?(?:[eE]([+\-]?\d+))?/,

			DECIMAL_BASE = (1 + '0'.repeat(Math.log10(MAX_SAFE_INTEGER) >> 1)) | 0,
			//	default base.
			DEFAULT_BASE = DECIMAL_BASE,

			MULTIPLICATION_BOUNDARY = multiplication_boundary(DEFAULT_BASE),

			/**
			 * parseInt( , radix) 可處理之最大 radix，<br />
			 * 與 Number.prototype.toString ( [ radix ] )<br />
			 * 可用之最大基數 (radix, base)。<br />
			 * 10 Arabic numerals + 26 Latin alphabet.<br />
			 * 之後再作初始化。
			 *
			 * @inner
			 * @see
			 * <a href="http://en.wikipedia.org/wiki/Hexadecimal" accessdate="2013/9/8 17:26">Hexadecimal</a>
			 */
			MAX_RADIX = 0,
			//之後再作初始化。
			MIN_RADIX = 0,
			// 應與 parseInt() 一致。
			DEFAULT_RADIX = parseInt('10'),
			HEX_RADIX = parseInt('0x10'),
			PATTERN_HEX = new RegExp('^0x([0-9a-f]{' + Number.MAX_SAFE_INTEGER.toString(HEX_RADIX).length + ',})$', 'i'),

			// 數字過大，parseInt() 無法獲得精確數值時使用 DEFAULT_DIGITS。不分大小寫。應與 parseInt() 一致。
			// assert: DEFAULT_DIGITS.length === MAX_RADIX
			// assert: DEFAULT_DIGITS.toLowerCase() === DEFAULT_DIGITS
			DEFAULT_DIGITS = '',
			DEFAULT_DIGITS_CACHE,

			// 乘法單位元素
			// https://en.wikipedia.org/wiki/Identity_element
			// number * MULTIPLICATIVE_IDENTITY === number
			// 2/2, 3/3, ..
			MULTIPLICATIVE_IDENTITY = 1 / 1,
			// http://en.wikipedia.org/wiki/Absorbing_element
			// number * ABSORBING_ELEMENT === ABSORBING_ELEMENT
			ABSORBING_ELEMENT = 0,
			//https://en.wikipedia.org/wiki/Exponentiation
			//(any number) ^ 0 === Math.pow(number, 0) === ZERO_EXPONENT
			//Math.pow(2, 0), Math.pow(3, 0), ..
			ZERO_EXPONENT = Math.pow(1, 0),

			trim_0,

			// Array 或 Uint32Array。
			array_type = Array,
			// array_clone(from, to[, assignment]): 在不改變 to 之 reference 下，將 to 之陣列內容改為與 from 相同。
			array_clone,
			//reset digits of (this)
			array_reset,
			//
			shift_digits;


			// ---------------------------------------------------------------------//
			// 初始調整並規範基本常數。

			/**
			 * 工具函數：轉換 ['a','b','c'] → {a:0,b:1,c:2}。
			 *
			 * @param	{Array}[base]	輸入數值採用之進位制基底/數字 digit 字集。
			 *
			 * @return	回傳 cache 物件。
			 *
			 * @inner
			 */
			function digit_cache(base) {
				var digits = library_namespace.null_Object();
				base.forEach(function (digit, index) {
					if (digit.length !== 1)
						library_namespace.err('Invalid digit: [' + digit + '].');
					else if (digit in digits)
						library_namespace.err('Digit already exists: [' + digit + '] = ' + digits[digit]);
					else
						digits[digit] = index;
				});
				return digits;
			}

			// 工具函數
			//truncation
			function Array_reset(array, length) {
				// 或可參考:
				// http://stackoverflow.com/questions/1232040/how-to-empty-an-array-in-javascript
				length = array.length - (length || 0);
				while (0 < length--)
					array.pop();
				return array;
			}

			function General_reset(array) {
				var i = array.length;
				while (0 < i--)
					array[i] = 0;
				return [];
			}

			function Array_clone(from, to) {
				if (from !== to) {
					Array_reset(to);
					array_type.prototype.push.apply(to, from);
				}
			}

			function General_clone(from, to) {
				if (from !== to) {
					var index = to.length, l = from.length;
					if (index < l) {
						library_namespace.warn('General_clone: Target array has a shorter length!');
						//index = l;
					} else
						while (l < index)
							//高位補 0。
							to[--index] = 0;
					//assert: index <= from.length, should be (from.length).
					while (0 < index--)
						to[index] = from[index];
				}
			}

			// 清理高數位的 0。
			function Array_trim_0(integer, preserve) {
				var index = integer.length;
				// 1 < index: 直接保留最後一個，省得麻煩。
				if (preserve === undefined)
					preserve = 1;
				//assert: integer[index] is integer
				while (preserve < index-- && integer[index] === 0);
				integer.length = index + 1;
				return integer;
			}

			//exponent>0 時會去掉尾數 exponent 個 digits。
			//exponent<0 時會補上尾數 exponent 個 digits。
			function Array_shift_digits(integer, exponent) {
				if (exponent |= 0) {
					integer[KEY_EXPONENT] += exponent;
					if (0 < exponent)
						integer.splice(0, exponent);
					else {
						var a = new Array(-exponent);
						a.fill(0);
						Array.prototype.unshift.apply(integer, a);
					}
				}
			}

			function General_shift_digits(integer, exponent) {
				if (exponent |= 0) {
					integer[KEY_EXPONENT] += exponent;
					if (0 < exponent)
						for (var i = 0, l = integer.length; i < l; i++)
							integer[i] = i + exponent < l ? integer[i + exponent] : 0;
					else
						for (var i = integer.length - 1; 0 <= i; i--)
							integer[i] = i + exponent < 0 ? 0 : integer[i + exponent];
				}
			}


			//找出最小可用之 radix。
			while (Number.isNaN(parseInt('1', ++MIN_RADIX)));
			try {
				for (; ; MAX_RADIX++)
					//console.log(MAX_RADIX + ' ' + DEFAULT_DIGITS);
					// will be '0123456789abcdefghijklmnopqrstuvwxyz'
					DEFAULT_DIGITS += MAX_RADIX < DEFAULT_RADIX ? MAX_RADIX.toString() : MAX_RADIX.toString(MAX_RADIX + 1);
			} catch (e) { }
			// 將 DEFAULT_DIGITS 轉成小寫。
			DEFAULT_DIGITS = DEFAULT_DIGITS.toLowerCase();
			DEFAULT_DIGITS_CACHE = digit_cache(DEFAULT_DIGITS.split(''));

			//規範 MAX_SAFE_INTEGER
			if (MAX_SAFE_INTEGER > Number.MAX_SAFE_INTEGER)
				MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;

			//決定 MIN_BASE
			while ((MAX_SAFE_INTEGER / ++MIN_BASE | 0) < 0);

			(function () {
				// 測試 array_type 可存取 attributes。
				var a = array_type && new array_type(2), b;
				if (a)
					a[KEY_BASE] = 9;
				if (!a || a[KEY_BASE] !== 9)
					// assert: Array 可存取 attributes。
					a = new (array_type = Array);
				else if (0 < a.BYTES_PER_ELEMENT) {
					// for TypedArray, 決定 MAX_BASE。
					// 1 byte = 8 bits
					b = Math.floor(Math.sqrt(1 << 8 * a.BYTES_PER_ELEMENT));
					if (b < MAX_BASE) {
						if (a.BYTES_PER_ELEMENT < 4)
							library_namespace.warn('所使用之 array type 能存放之值過小，將影響效能！');
						MAX_BASE = b;
					} else if (MAX_BASE < b)
						// 一般說來，TypedArray 不可能存放超過 Number.MAX_SAFE_INTEGER 之整數值，因此不應該執行到這！
						library_namespace.err('所使用之 array type 能存放超過最大可安全計算整數 Number.MAX_SAFE_INTEGER 之值，恐造成錯誤計算結果！');
				}

				// 決定可用的 .push() 等 array 工具函數。
				if (array_type.prototype.push) {
					array_type.prototype.push.apply(a = new array_type, [4, 3]);
					if (a[1] === 3 && a.length === 2) {
						a.length = 0;
						if (a.length === 0) {
							//可設定 .length
							array_clone = Array_clone;
							array_reset = Array_reset;
							trim_0 = Array_trim_0;
							shift_digits = Array_shift_digits;
						}
					}
				}
				if (!array_clone) {
					array_clone = General_clone;
					//無法設定 .length
					array_reset = General_reset;
					trim_0 = function (integer) {
						return integer;
					};
					shift_digits = General_shift_digits;
				}
			})();

			// ---------------------------------------------------------------------//
			// 工具函數

			//為正規 base。
			function valid_base(base) {
				// assert: MAX_BASE === MAX_BASE | 0
				if (base === (base | 0) && MIN_BASE <= base && base <= MAX_BASE
					//&& base !== Integer.prototype[KEY_BASE]
					)
					return base;
			}

			// 超過此界限，與元素(Integer digit)相乘時即有可能超過 Number.MAX_SAFE_INTEGER。
			// boundary(base+2)<Number.MAX_SAFE_INTEGER
			function multiplication_boundary(base) {
				//assert: return > 1
				return valid_base(base) ? Math.floor(MAX_SAFE_INTEGER / base) : MULTIPLICATION_BOUNDARY;
			}


			// 若為準確次方，則回傳次方數。
			// number = base ^ count_exponent(number, base)
			function count_exponent(number, base) {
				if (number < base)
					return -count_exponent(base, number);

				var exponent = 0;
				while (number !== 0 && 0 === number % base)
					number /= base, exponent++;
				if (number === ZERO_EXPONENT)
					return exponent;
			}

			function do_modified(integer) {
				delete integer[KEY_CACHE];
			}

			// ---------------------------------------------------------------------//
			//	definition of module integer

			/**
			 * 任意大小、帶正負號的整數。integer instance.
			 *
			 * @example
			 * <code>
			 * CeL.log((new CeL.integer('876567896')).op('*','6456789976545678'));
			 * </code>
			 *
			 * @class	Integer 的 constructor
			 * @constructor
			 */
			function Integer(number) {
				var integer = new_instance();
				if (1 < arguments.length || number !== undefined)
					assignment.apply(integer, arguments);

				return integer;
			}

			//	class public interface	---------------------------

			function Integer_compare(number1, number2) {
				if (typeof number1 === 'number' && typeof number2 === 'number')
					return number1 - number2;

				if (!is_Integer(number1))
					number1 = new Integer(number1, null, is_Integer(number2) && number2[KEY_BASE]);
				return number1.compare(number2);
			}

			//get the extreme value (極端值: max/min) of input values
			function extreme(values, get_minima) {
				var index = values.length, extreme_value, value, compare;
				if (!index)
					//ES6: Math.max: If no arguments are given, the result is −∞.
					return get_minima ? Infinity : -Infinity;

				extreme_value = values[--index];
				while (0 < index--) {
					//WARNING: 當碰上許多大數時，會出現需要多次轉換 extreme_value 成 Integer 的效能低下情形!
					//但若許多數字不同底，而最大的是 String，則可能獲得部分效能。
					if (Number.isNaN(compare = Integer_compare(extreme_value, value = values[index])))
						//ES6: Math.max: If any value is NaN, the result is NaN.
						return NaN;

					if (get_minima ? compare > 0 : compare < 0)
						extreme_value = value;

					//依規範，必須掃描一次，確定沒 NaN。不可中途跳出。
					if (false && (get_minima ? compare > 0 : compare < 0)
						//當有改變時才偵測。
						&& typeof (extreme_value = value) === 'number' && !Number.isFinite(extreme_value = value))
						break;
				}
				return extreme_value;
			}

			//range:
			//1 – Number.MAX_SAFE_INTEGER 當作 digits
			//Number.MAX_SAFE_INTEGER + 1 – Number.MAX_VALUE || (is_Integer(range) && !(KEY_TYPE in range)) 當作 max value
			//其他採預設值 digits = 2
			function random(range, base) {
				var r, i;

				if (0 < range && isFinite(range))
					if (!Number.isSafeInteger(range = +range))
						range = new Integer(range, null, base);

				if (is_Integer(range) && !(KEY_TYPE in range)) {
					//求極值之最大位元
					for (i = range.length; 0 < i && range[--i] < 2 ;);
					if (range[i] < 2)
						range = 0;
					else {
						r = new Integer(0, null, base);
						r[i] = Math.floor(range[i] * Math.random());
						range = i;
					}
				}

				//其他情況採預設值 digits = 2
				if (!(0 < range) || !Number.isSafeInteger(range))
					range = 2;

				//assert: range = {natural number}digits

				if (!r)
					r = new Integer(0, null, base);

				for (base = r[KEY_BASE]; 0 < range;)
					r[--range] = Math.floor(base * Math.random());

				return r;
			}

			library_namespace.extend({
				random: random,
				max: function () {
					// get max()
					return extreme(arguments);
				},
				min: function () {
					// get min()
					return extreme(arguments, true);
				},
				compare: Integer_compare
			}, Integer);

			//	instance public interface	-------------------

			//	每個位數存放 {safe integer} 0 – 此數-1，大於等於 此數 即須進位。
			//read-only
			Integer.prototype[KEY_BASE] = DEFAULT_BASE;
			// 預設為 0 次方。
			Integer.prototype[KEY_EXPONENT] = 0;

			// https://en.wikipedia.org/wiki/Operation_(mathematics)
			var OP_REFERENCE = {
				'+': add,
				'-': subtract,
				'*': multiply,
				'/': divide,
				'%': modulo,
				'^': power,
				'=': assignment,
				'==': compare
			};

			library_namespace.extend(OP_REFERENCE, Integer.prototype);

			library_namespace.extend({
				forEach: Array.prototype.forEach,

				// 下面全部皆為 assignment，例如 '+' 實為 '+='。
				assignment: assignment,

				// add_assignment
				add: add,
				// subtract_assignment
				subtract: subtract,
				// multiply_assignment
				multiply: multiply,
				// divide_assignment
				division: division,
				divide: divide,
				div: divide,
				modulo: modulo,
				mod: modulo,

				power: power,
				pow: power,
				square_root: square_root,
				sqrt: square_root,
				square: square,
				// 至此為 assignment。

				clone: function () {
					return new Integer(this);
				},
				//偶數的
				is_even: function (test_odd) {
					return !(KEY_TYPE in this) && this[KEY_EXPONENT] === 0
						//
						&& this.modulo(2) === (test_odd ? 1 : 0);
				},
				//奇數的,單數的
				is_odd: function () {
					return this.is_odd(true);
				},

				//https://en.wikipedia.org/wiki/Absolute_value
				abs: function (negative) {
					if ((negative = !!negative) !== !!this[KEY_NEGATIVE])
						do_modified(this), this[KEY_NEGATIVE] = negative;
					return this;
				},
				//變換正負號。
				negate: function () {
					do_modified(this);
					this[KEY_NEGATIVE] = !this[KEY_NEGATIVE];
					return this;
				},
				is_positive: function () {
					return 0 < this.valueOf(TYPE_TEST);
				},
				is_negative: function () {
					return !!this[KEY_NEGATIVE];
				},
				// https://en.wikipedia.org/wiki/Sign_(mathematics)
				// https://en.wikipedia.org/wiki/Sign_function
				sign: function (negative) {
					// NaN: 0
					return this[KEY_NEGATIVE] ? -1 : 0 < this.valueOf(TYPE_TEST) ? 1 : 0;
				},

				round: round,
				floor: function (digit) {
					return this.round(digit, -Infinity);
				},
				ceil: function (digit) {
					return this.round(digit, Infinity);
				},

				log: log,
				factorial: factorial,

				compare_amount: compare_amount,
				compare: compare,
				equals: function (number) {
					return this.compare(number) === 0;
				},

				//maybe_prime: maybe_prime,

				op: operate,
				for_each_digit: for_each_digit,
				valueOf: valueOf,
				toString: toString
			}, Integer.prototype);

			// setup Integer constructor after Integer.prototype setted.
			var new_instance = Array.derive(Integer, array_type),
			//
			is_Integer = (new Integer) instanceof Integer ? function (number) {
				return number instanceof Integer;
			} : array_type === Array ? Array.isArray
			//
			: library_namespace.type_tester(library_namespace.is_type(new array_type));

			// ---------------------------------------------------------------------//

			/**
			 * assignment value of integer instance.<br />
			 * 僅設定單一值。
			 *
			 * @param	{Number|String|Integer}number 輸入數值(value/number)大小。
			 * @param	{natural number|String|Array}[base]	輸入數值採用之進位制基底/數字 digit 字集。區分大小寫。
			 * @param	{natural number}[to_base]	內採基底/進位制。
			 *
			 * @example
			 * <code>
			 * CeL.log((new CeL.integer('876567896')).op('*','6456789976545678'));
			 * </code>
			 *
			 * @return	回傳 integer 物件。
			 */
			function assignment(number, base, to_base) {

				/**
				 * 前期處理: String → Number / Integer<br />
				 * 轉換指定進位的數字文字，成為{Number}純量或 {Integer} 物件。<br />
				 * treat arguments as: (number_String, base, to_base)
				 *
				 * @see
				 * <a href="http://en.wikipedia.org/wiki/Numerical_digit" accessdate="2010/4/16 20:47">Numerical digit</a>
				 */
				if (typeof number === 'string' && (number = number.trim())) {
					// 正規化(normalize) base

					// {Array}base → {String}base
					if (Array.isArray(base)) {
						base.forEach(function (digit) {
							if (digit.length !== 1)
								library_namespace.err('assignment: Invalid digit of base: [' + digit + '].');
						});
						base = base.join('');
					}
					if (typeof base === 'string' && DEFAULT_DIGITS.startsWith(base.toLowerCase()))
						// 使用 DEFAULT_DIGITS。
						base = base.length;

					if (typeof base === 'string' ? base.length < 2
						//base is number
						: base !== (base | 0) || base < MIN_RADIX || MAX_RADIX < base) {
						if (base)
							library_namespace.err('assignment: Invalid base: [' + base + ']');
						base = undefined;
					}

					var digits, value;

					if (value = number.match(PATTERN_HEX))
						number = value[1], base = HEX_RADIX;

					if (typeof base === 'string') {
						digits = digit_cache(base.split(''));
						value = number.split('');
						number = new Integer(0, null, base = base.length);

						// 嘗試以 native method 取得。
					} else if (Number.isSafeInteger(value = base ? parseInt(number, base) : parseFloat(number)))
						number = value;

						// 數字過大，native method 無法獲得精確數值時使用 DEFAULT_DIGITS。不分大小寫。基本上應與 parseInt() 一致。

						// 將轉成小寫。
						//	[ full , sign, integer part 整數部分, fractional part 小數部分, decimal exponent 指數 ]
					else if (value = (value = number.toLowerCase()).match(PATTERN_NUMBER)
						//
						|| value.match(PATTERN_NUMBER_HEX)) {
						if (!base)
							base = DEFAULT_RADIX;
						number = new Integer(0, null, base);
						//處理 sign
						if (value[1] === '-')
							number[KEY_NEGATIVE] = true;
						//處理指數
						value[4] |= 0;
						if (value[3]) {
							//處理掉 fractional part 小數部分
							value[4] -= value[3].length;
							value[2] += value[3];
						}
						if ((digits = value[2].match(/^(.*)(0+)$/))
							//1e4: 若是 exponent 不大，則基本上無須處理，直接展開即可。
						&& (value[4] < 0 || 1e4 < value[4] + digits[2].length)) {
							//去掉最後的 0
							value[4] += digits[2].length;
							value[2] = digits[1];
						}
						if (value[4])
							//1e4: 若是 exponent 不大，則基本上無須處理，直接展開即可。
							if (value[4] < 0 || 1e4 < value[4])
								number[KEY_EXPONENT] = value[4];
							else
								value[2] += '0'.repeat(value[4]);

						value = value[2].split('');
						digits = DEFAULT_DIGITS_CACHE;

					} else {
						library_namespace.err('assignment: Invalid number string: [' + number + '].');
						number = NaN;
					}

					if (Array.isArray(value)) {
						//base: {natural number}length of base.
						//digits: {Object}base cache.
						//value: {Array}digits of specified base
						// number: 欲轉換 base 之 {Integer}。

						value.reverse();
						//Array.map()
						value.forEach(function (digit, index) {
							if (digit in digits)
								number[index] = digits[digit];
							else
								library_namespace.err('assignment: Invalid number digit: [' + digit + '].');
						});
						if (!to_base && count_exponent(DEFAULT_BASE, base))
							to_base = DEFAULT_BASE;
					}
				}


				// ---------------------------------------
				if (is_Integer(number)) {
					// 已經是 Integer 了。
					// clone, deep_copy。

					//let to_base === this[KEY_BASE], base === number[KEY_BASE]
					// 無設定 to_base 時，將 base 視作 to_base。
					//assert: number[KEY_BASE] 為正規 base。
					to_base = valid_base(to_base || base) || number[KEY_BASE];
					base = number[KEY_BASE];

					if (this !== number || base !== to_base) {
						if (this === number)
							number = new Integer(number);
						else {
							// copy attributes.
							this[KEY_NEGATIVE] = number[KEY_NEGATIVE];

							if (KEY_CACHE in number) {
								var array = this[KEY_CACHE] = [];
								number[KEY_CACHE].forEach(function (string, radix) {
									array[radix] = string;
								});
							} else
								delete this[KEY_CACHE];

							if (KEY_FACTORS in number) {
								var array = this[KEY_FACTORS] = [];
								number[KEY_FACTORS].forEach(function (factor) {
									if (factor)
										array.push(is_Integer(factor) ? new Integer(factor) : factor);
								});
							} else
								delete this[KEY_FACTORS];
						}

						do_modified(this);

						this[KEY_BASE] = to_base;

						if (KEY_TYPE in number) {
							this[KEY_TYPE] = number[KEY_TYPE];
							delete this[KEY_EXPONENT];
							array_reset([], this);

						} else if (to_base === base || number.length < 2 && !(to_base <= number[0])) {
							if (number[KEY_EXPONENT])
								this[KEY_EXPONENT] = number[KEY_EXPONENT];
							else
								delete this[KEY_EXPONENT];
							array_clone(number, this);

						} else {
							// change base to / set base / 數字基底的轉換
							//http://en.wikipedia.org/wiki/Change_of_base
							//http://en.wikipedia.org/wiki/Base_conversion

							var exponent = count_exponent(to_base, base), to_digit_Array = array_reset(this),
							scalar = 0,
							base_now = ZERO_EXPONENT;

							// 對 exponent 做特殊處置，增加效率。
							if (0 < exponent) {
								// e.g., base 10 → to_base 100
								if (number[KEY_EXPONENT]) {
									//因為會改變 number，因此新造一個。
									number = new Integer(number);
									if (0 < number[KEY_EXPONENT]) {
										// e.g., base=1e1, to_base=1e7, 23e(+17*1) = 23000e(+2*7)
										this[KEY_EXPONENT] = number[KEY_EXPONENT] / exponent | 0;
										shift_digits(number, -number[KEY_EXPONENT] % exponent);
									} else {
										// e.g., base=1e1, to_base=1e7, 23e(-17*1) = 230000e(-3*7)
										this[KEY_EXPONENT] = (number[KEY_EXPONENT] / exponent | 0) - 1;
										shift_digits(number, -(number[KEY_EXPONENT] % exponent) - exponent);
									}
								}

								number.forEach(function (digit, index) {
									scalar += digit * base_now;
									if ((index + 1) % exponent === 0)
										to_digit_Array.push(scalar), scalar = 0, base_now = ZERO_EXPONENT;
									else
										base_now *= base;
								});
								if (scalar)
									to_digit_Array.push(scalar);
								array_clone(to_digit_Array, this);

							} else if (exponent < 0) {
								// e.g., base 100 → to_base 10
								exponent = -exponent;
								if (number[KEY_EXPONENT])
									// e.g., base=1e7, to_base=1e1, 2300e(+2*7) = 2300e(+14*1)
									// e.g., base=1e7, to_base=1e1, 2300e(-2*7) = 2300e(-14*1)
									this[KEY_EXPONENT] = exponent * number[KEY_EXPONENT];
								number.forEach(function (digit, index) {
									for (var i = 0; i < exponent; i++)
										to_digit_Array.push(digit % to_base), digit = digit / to_base | 0;
								});
								trim_0(to_digit_Array);
								array_clone(to_digit_Array, this);

							} else {
								var fraction = 0, index, boundary = multiplication_boundary(to_base);

								if (number[KEY_EXPONENT]) {
									//因為會改變 number，因此新造一個。
									number = new Integer(number);
									if (0 < number[KEY_EXPONENT])
										//直接展開
										shift_digits(number, -number[KEY_EXPONENT]);
									else {
										library_namespace.err('assignment: Unable to convert from base ' + base + ' to base ' + to_base + ' with exponent ' + number[KEY_EXPONENT] + ' without loss of significance.');
										//計算 fraction
										index = -number[KEY_EXPONENT];
										for (var fraction_base = ZERO_EXPONENT; fraction_base && index;)
											fraction += number[--index] * (fraction_base /= base);
										//去掉 fraction
										shift_digits(number, -number[KEY_EXPONENT]);
									}
								}

								index = number.length;
								while (0 < index--) {
									base_now *= base;
									scalar = scalar * base + number[index];
									if (boundary < base_now * base || index === 0) {
										this.for_each_digit(function (digit, carry, index) {
											// 除了積本身，這邊可能出現 scalar<=(boundary-1), carry<=(base-1)。
											// (base-1)*boundary+(boundary-1)+(base-1) <= Number.MAX_SAFE_INTEGER
											// This is also the limit of (base), therefore:
											// MAX_BASE<=Math.sqrt(Number.MAX_SAFE_INTEGER+2),
											// boundary<=(Number.MAX_SAFE_INTEGER+2)/base-1,
											return digit * base_now + carry + (index ? 0 : scalar);
										});
										//reset
										scalar = 0, base_now = ZERO_EXPONENT;
									}
								}

								if (fraction)
									this.add(fraction, this[KEY_NEGATIVE]);

								if (0 === number.length)
									//assert: Array.(number)
									number.push(0);
							}
						}
					}

					// ---------------------------------------
				} else {
					if (typeof number !== 'number') {
						library_namespace.err('assignment: Invalid number: [' + number + '].');
						number = NaN;
					}

					if (base !== to_base
						//
						|| this.valueOf(TYPE_TEST) !== number) {
						do_modified(this);

						// value/scalar純量 to digit Array.
						// treat arguments as: (number, do not set fraction = false, to_base)

						// 對於非數字，無法斷定。
						if (number < 0)
							number = -number,
							this[KEY_NEGATIVE] = true;
						else
							delete this[KEY_NEGATIVE];

						delete this[KEY_FACTORS];
						delete this[KEY_EXPONENT];

						if (!isFinite(number)) {
							//NaN, Infinity, -Infinity
							this[KEY_TYPE] = number;
							array_reset(this);

						} else {
							delete this[KEY_TYPE];
							//to_base 實為欲轉換之標的 base。
							if (to_base = valid_base(to_base))
								this[KEY_BASE] = to_base;
							else
								to_base = this[KEY_BASE];
							//base 實為是否不轉換小數部分。
							if (base && number !== Math.floor(number)) {
								//number 有小數部分。
								library_namespace.warn('assignment: Number has a fractional part: [' + number + '].');
								number = Math.floor(number);
							}
							if (number < to_base && number === (number | 0))
								// 僅設定scalar純量部份。
								array_clone([number], this);

							else {
								var digit_Array = array_reset(this);

								//assert: 1 < to_base
								if (number !== Math.floor(number)) {
									// 當 base_now === 0，表示系統已無法處理較這更小的數字，再保留這之下的數值已無意義。
									for (var base_now = ZERO_EXPONENT, reminder = number % 1; reminder && (base_now /= to_base) ;)
										digit_Array.unshift((reminder *= to_base) | 0), reminder %= 1;
									this[KEY_EXPONENT] = -digit_Array.length;
									number = Math.floor(number);
								} else if (!Number.isSafeInteger(number))
									//test only
									library_namespace.warn('assignment: Number is too large: [' + number + '].');

								while (0 < number) {
									digit_Array.push(number % to_base);
									number = Math.floor(number / to_base);
								}
								array_clone(digit_Array, this);
							}
						}
					}
				}

				return this;
			}


			function get_test_value(number) {
				return is_Integer(number) ? number.valueOf(TYPE_TEST) : +number;
			}


			/**
			 * 測試大小/比大小。僅比較量之大小，忽略符號。
			 * @param number	the number to compare
			 * @return	{Number}	0:==, <0:<, >0:>
			 * @_name	_module_.prototype.compare_to
			 */
			// return < 0 : this < number
			// return === 0 : this === number
			// return > 0 : this > number
			// return others : invalid number
			function compare_amount(number) {
				if (this === number)
					return 0;

				var i = typeof number === 'string' ? 0 : get_test_value(number), l;
				if ((KEY_TYPE in this) || !isFinite(i))
					// NaN 等極端數字的情形。
					return Math.floor(this[KEY_TYPE]) - Math.floor(i);

				// 強制轉成同底的 Integer 再處理。
				if (!is_Integer(number) || this[KEY_BASE] !== number[KEY_BASE])
					number = new Integer(number, null, this[KEY_BASE]);

				i = this.length, l = i - number.length;
				if (!l)
					//找到第一個兩者不同的位數。
					while (0 < i-- && !(l = (this[i] || 0) - (number[i] || 0)));

				return l;
			}

			/**
			 * 測試大小/比大小
			 * @param number	the number to compare
			 * @return	{Number}	0:==, <0:<, >0:>
			 * @_name	_module_.prototype.compare_to
			 */
			function compare(number) {
				var c = typeof number === 'string' ? 0 : get_test_value(number);
				if ((KEY_TYPE in this) || !isFinite(c))
					// NaN 等極端數字的情形。
					return this[KEY_TYPE] - c;

				if (!is_Integer(number))
					number = new Integer(number, null, this[KEY_BASE]);

				if (this[KEY_NEGATIVE] ^ number[KEY_NEGATIVE])
					return this[KEY_NEGATIVE] ? -1 : 1;

				c = this.compare_amount(number);
				return this[KEY_NEGATIVE] ? -c : c;
			}



			// 工具函數
			// 將 this integer instance 自低位依 callcack() 處理至高位，
			// 結果存至 target_Integer[跳過 target_shift 個] || this。
			// 可自動處理進退位。無法處理 overflow 問題。
			// assert: callcack() 任一回傳，皆 isSafeInteger() === true。
			function for_each_digit(callcack, target_Integer, target_shift) {
				if (!target_Integer)
					target_Integer = this;
				target_shift |= 0;

				var base = target_Integer[KEY_BASE], carry = 0, length = this.length, index = 0, digit;
				if (!Number.isSafeInteger(base))
					library_namespace.err('for_each_digit: Invalid base: [' + base + '].');

				for (; index < length || carry !== 0 ; index++, target_shift++)
					// 當 index >= length，僅作進位處理。
					if (typeof (digit = index < length ? callcack(this[index] || 0, carry, index)
						// 當 this 皆 callcack() 過後，僅處理進退位。
						: carry + (target_Integer[target_shift] || 0)) === 'number') {
						if (base <= digit) {
							// 處理進位。
							// assert: 0 < (digit / base | 0)
							// MIN_BASE: 因為用 `|0`，故 base < 5 會出現問題:
							// (Number.MAX_SAFE_INTEGER / 4 | 0) < 0, 0 < (Number.MAX_SAFE_INTEGER / 5 | 0)
							carry = digit / base | 0;
							digit %= base;
						} else if (digit < 0 && index < length) {
							// 處理退位。
							carry = digit / base | 0;
							//確保 digit >=0
							if ((digit %= base) < 0)
								carry--, digit += base;
						} else
							carry = 0;
						target_Integer[target_shift] = digit;
					} else
						carry = 0;

				trim_0(target_Integer);

				if (carry)
					library_namespace.err('for_each_digit: carry [' + carry + '] left.');
				return carry;
			}

			// ---------------------------------------------------------------------//
			//四則運算，即加減乘除， + - * / (+-×÷)**[=]
			//https://en.wikipedia.org/wiki/Elementary_arithmetic

			//和
			function add(addend, is_subtract) {
				// test if addend is zero.
				if (Number.isNaN(this[KEY_TYPE]) || get_test_value(addend) === 0)
					return this;

				// 強制轉成同底的 Integer 再處理。
				if (!is_Integer(addend) || this[KEY_BASE] !== addend[KEY_BASE])
					addend = new Integer(addend, null, this[KEY_BASE]);

				if ((KEY_TYPE in this) || (KEY_TYPE in addend)) {
					addend = addend.valueOf(TYPE_TEST);
					//do simulation: 模擬與 NaN 等極端數字作運算。
					addend = this.valueOf(TYPE_TEST) + (is_subtract ? -addend : addend)
					if (addend !== this.valueOf(TYPE_TEST))
						this.assignment(addend);
					return this;
				}

				// 至此特殊值處理完畢。
				do_modified(this);

				var reverse = (is_subtract ^= this[KEY_NEGATIVE] ^ addend[KEY_NEGATIVE])
				//當兩數正負不同，且 abs(this) < abs(addend) 時，即需要反向，
				//將 addend 放在前項，改成 this = (addend - this)。
				&& this.compare_amount(addend) < 0,
				//
				shift = addend[KEY_EXPONENT] - this[KEY_EXPONENT];

				if (reverse)
					this[KEY_NEGATIVE] = !this[KEY_NEGATIVE];

				if (shift < 0)
					//為了位數對齊，須補足不足的位數。
					shift_digits(this, shift), shift = 0;

				addend.for_each_digit(
					// (addend digit, carry, index)
					(reverse ? function (d, c, i) { return c + d - (this[i] || 0); }
					: is_subtract ? function (d, c, i) { return c + (this[i] || 0) - d; }
					: function (d, c, i) { return c + (this[i] || 0) + d; }).bind(this)
				, this,
				//位數對齊。
				shift);

				if (this[KEY_NEGATIVE] && !this.valueOf(TYPE_TEST))
					delete this[KEY_NEGATIVE];

				return this;
			}

			//差
			function subtract(number) {
				return this.add(number, true);
			}



			//乘除法之先期處理。
			//@inner
			function multiply_preprocess(integer, number, is_division) {
				var value = get_test_value(number);
				// NaN (+-×÷) number = NaN
				if (Number.isNaN(integer[KEY_TYPE])
					// test if number is MULTIPLICATIVE_IDENTITY.
					|| value === MULTIPLICATIVE_IDENTITY && (!is_division || !integer[KEY_EXPONENT]))
					return;

				if (value === -MULTIPLICATIVE_IDENTITY && (!is_division || !integer[KEY_EXPONENT])) {
					//Be sure not 0, NaN.
					if (integer.valueOf(TYPE_TEST)) {
						do_modified(integer);
						integer[KEY_NEGATIVE] = !integer[KEY_NEGATIVE];
					}
					return;
				}

				if (!is_Integer(number) || integer[KEY_BASE] !== number[KEY_BASE])
					// 強制轉成同底的 Integer 再處理。
					number = new Integer(number, null, integer[KEY_BASE]);

				if (value === ABSORBING_ELEMENT
					//
					|| (KEY_TYPE in integer) || (KEY_TYPE in number)
					//
					|| integer.valueOf(TYPE_TEST) === ABSORBING_ELEMENT) {
					//do simulation: 模擬與 NaN 等極端數字作運算。
					var v = integer.valueOf(TYPE_TEST), r;
					if (is_division) {
						r = v / value;
						value = v % value;
					} else
						value = v * value;
					if (value !== v)
						integer.assignment(value);
					return r;
				}

				// 至此特殊值處理完畢。
				do_modified(integer);

				return number;
			}


			// number multiplier

			// test:
			// check base & value: Integer (test if .is_safe_integer(true)===0, ±1, NaN)
			// show error and exit: NaN, ±Infinity
			// exit: 1
			// set sign and exit: -1
			// set value and exit: 0
			// translate to Integer: safe integer(e.g., 123), 1.23e123, '123'+'4'.repeat(400), '123'+'4'.repeat(16); the string type & negative
			// has a fractional part (有小數部分): .123, 1.123, 1903719924734991.36479887; the string type & negative; '123'+'4'.repeat(16)+'.1234'

			//TODO: https://en.wikipedia.org/wiki/Sch%C3%B6nhage%E2%80%93Strassen_algorithm
			function multiply(number) {
				if (number = multiply_preprocess(this, number)) {
					// copy factors, cache 用
					if (!(KEY_FACTORS in this))
						this[KEY_FACTORS] = [];
					this[KEY_FACTORS].push(number);

					this[KEY_EXPONENT] += number[KEY_EXPONENT];

					if (number[KEY_NEGATIVE])
						this[KEY_NEGATIVE] = !this[KEY_NEGATIVE];

					//	scalar * this，結果放在 target_digit_Array。
					var target_digit_Array = [];
					target_digit_Array[KEY_BASE] = this[KEY_BASE];

					// assert: number 任一元素與 this 任一元素相乘，皆 isSafeInteger() === true。
					number.forEach(function (scalar, shift) {
						if (scalar)
							this.for_each_digit(function (digit, carry, index) {
								// assert: target_digit_Array[] is natural number < base
								// 除了積本身，這邊可能出現 carry<=(base-2), target_digit_Array[]<=(base-1), 共 (2*base-3)。
								// assert: Number.isSafeInteger(base*base-2)
								// therefore: base<=Math.sqrt(Number.MAX_SAFE_INTEGER+2)
								return digit * scalar + carry + (target_digit_Array[index + shift] || 0);
							}, target_digit_Array, shift);
					}, this);

					//回存。
					array_clone(target_digit_Array, this);

					//預防中空跳號。
					if (Array.isArray(this)) {
						var index = this.length;
						while (0 < index--)
							if (this[index] === undefined)
								this[index] = 0;
					}
					if (this[KEY_NEGATIVE] && !this.valueOf(TYPE_TEST))
						delete this[KEY_NEGATIVE];
				}

				return this;
			}

			// this → remainder。
			// return {digit Array}quotient
			// https://en.wikipedia.org/wiki/Euclidean_division
			//TODO: precision
			function division(denominator, precision) {
				if (!is_Integer(denominator = multiply_preprocess(this, denominator, true))) {
					if (denominator === undefined)
						// denominator == ±1
						if (Number.isNaN(this[KEY_TYPE]))
							// NaN (+-×÷) number = NaN
							denominator = NaN;
						else if (get_test_value(this)) {
							// integer / ±1 = ±d, remainder 0.
							denominator = new Integer(this);
							this.assignment(0);
						} else
							denominator = 0;
					return denominator;
				}

				// (dividend or numerator) ÷ (divisor or denominator) = quotient + remainder / denominator
				var numerator = this, base = this[KEY_BASE], quotient = new Integer(0, null, base),
				// N: the highest digits of numerator.
				// D: the highest digits of denominator.
				N, NI, D, DI, Q, next_N, next_D;

				quotient[KEY_EXPONENT] = this[KEY_EXPONENT] - denominator[KEY_EXPONENT];

				//When denominator is bigger than numerator, the quotient will be 0 and the remainder will be numerator itself.
				while (0 < (DI = denominator.length) && DI <= (NI = numerator.length)) {
					// Get ths first non zero digit D of denominator.
					// 使用 while 的原因:對 Uint32Array 之類無法保證前幾位不為 0。
					while (!(D = denominator[--DI]) && 0 < DI);

					// Get ths first non zero digit N of numerator.
					while (!(N = numerator[--NI]) && 0 < NI);
					// 多取一位 numerator，確保 N > D。
					if (N <= D && 0 < NI && DI < NI)
						N = N * base + numerator[--NI];

					if (NI < DI || N < D)
						break;
					//assert: N >= D, NI >= DI

					//決定 Q = thie next digit of quotient
					// assert: (N + 1) / D | 0 === Math.floor((N + 1) / D)
					if (DI === 0)
						//There is no digits of denominator lefting. The quotient digit has no other possibility.
						Q = N / D | 0;
					else
						//考慮兩個因素:
						//N, D 將在 Number.isSafeInteger() 的範圍內，一直乘到 N/(D+1)|0===(N+1)/D|0 為止。此兩數為當前 quotient 最高位數之可能值範圍。
						while (((Q = N / (D + 1) | 0) < ((N + 1) / D | 0))
							//
							&& 0 < DI
							&& Number.isSafeInteger(next_N = N * base + numerator[NI - 1])
							&& Number.isSafeInteger(next_D = D * base + denominator[DI - 1])) {
							N = next_N; NI--;
							D = next_D; DI--;
						}

					// 通常發生在 numerator 極為接近 denominator 之 Q 或 Q+1 倍時，會無法判別應該用 Q 或 Q+1。
					if (Q === 0) {
						// assert: numerator, denominator 前面幾位大小相同。
						// assert: index of quotient Array === NI - DI，尚未 borrowed。
						// 確認 numerator, denominator 孰大孰小。
						if (N === D)
							while (0 < DI && numerator[--NI] === denominator[--DI]);
						if (N < D || numerator[NI] < denominator[DI])
							if (--NI < DI)
								// numerator now (= reminder) < denominator
								break;
							else
								Q = base - 1;
						else
							// 剛好足夠減一。
							Q = 1;
					}

					//NI → index of quotient Array, the diff of numerator and denominator.
					NI -= DI;
					quotient[NI] = (quotient[NI] || 0) + Q;

					//numerator → reminder
					// numerator -= Q * denominator * base ^ (index of quotient Array = NI)
					denominator.for_each_digit(function (digit, carry, index) {
						//assert: numerator[index + NI] >= 0, carry <= 0, digit <= 0, Q > 0
						return carry + (numerator[index + NI] || 0) - Q * digit;
					}, numerator, NI);
					//assert: numerator >= 0
				}

				//處理需要進位的情況。雖然不常見，偶爾還是會發生，甚至連續進位，因此到最後才一次處理。
				quotient.for_each_digit(function (digit, carry) {
					return digit + carry;
				});

				// remainder 不受 denominator 正負影響。
				// quotient 受 denominator 正負影響。
				if (quotient.valueOf(TYPE_TEST))
					// quotient is not 0 or NaN
					//e.g., 4/-5
					quotient[KEY_NEGATIVE] = this[KEY_NEGATIVE] ^ denominator[KEY_NEGATIVE];

				if (!this.valueOf(TYPE_TEST))
					// remainder is not 0 or NaN
					delete this[KEY_NEGATIVE];

				// this → remainder,
				// return {digit Array}quotient
				return quotient;
			}

			function divide() {
				return this.assignment(division.apply(this, arguments));
			}

			function modulo(modulus) {
				//if (KEY_TYPE in this) this.assignment(NaN); else
				if (Number.isSafeInteger(modulus) && !(KEY_TYPE in this) && this[KEY_EXPONENT] === 0) {
					var base = this[KEY_BASE] % modulus,
					base_remainder = ZERO_EXPONENT, remainder = 0, index = 0;
					do {
						if (this[index]) {
							remainder += this[index] * base_remainder;
							remainder %= modulus;
						}
						base_remainder = base_remainder * base % modulus;
					} while (++index < this.length && 0 < base_remainder);
					this.assignment(this[KEY_NEGATIVE] ? -remainder : remainder);

				} else
					division.apply(this, arguments);

				return this;
			}


			// ---------------------------------------------------------------------//


			//https://en.wikipedia.org/wiki/Rounding
			//precision: 小數點後第 precision 位，可為負數
			//direct: directed rounding: undefined, 0, Infinity, -Infinity
			function round(precision, direct) {
				//最後得去掉 precision 位。
				if (0 < (precision = (-precision | 0) - this[KEY_EXPONENT])) {
					do_modified(this);
					var index = precision, value;
					if (isNaN(direct)) {
						//nearest
						//http://mathworld.wolfram.com/NearestIntegerFunction.html
						//四捨六入五成雙/best fraction
						//NOT 四捨五入
						if ((value = this[KEY_BASE]) < (index = 2 * this[index - 1])
							//
							|| value === index && this[precision] % 2)
							this[precision]++;

					} else if (!isFinite(direct)) {
						//floor, ceil
						//無條件捨去法/無條件進位法
						while (0 < index && !(value = this[--index]));
						if (value && (0 < direct) ^ this[KEY_NEGATIVE])
							this[precision]++;
					}
					//else: treat as truncate

					shift_digits(this, precision);
				}
				return this;
			}


			// ---------------------------------------------------------------------//
			//advanced functions

			/*
			https://en.wikipedia.org/wiki/Square_(algebra)
			
			(please copy to a plain text)
			自乘時，乘法截圖: (下列數字皆為序號 index)
									5	4	3	2	1	0
								×	5	4	3	2	1	0
			-----------------------------------------------------------------------------------------------
									5×0	4×0	3×0	2×0	1×0	0×0
								5×1	4×1	3×1	2×1	1×1	1×0
							5×2	4×2	3×2	2×2	2×1	2×0
						5×3	4×3	3×3	3×2	3×1	3×0
					5×4	4×4	4×3	4×2	4×1	4×0
				5×5	5×4	5×3	5×2	5×1	5×0
			
			-----------------------------------------------------------------------------------------------
			注:加起來為序號 n 的組合:
				10	9	8	7	6	5	4	3	2	1	0
			
			** 除了自乘1倍外，皆為兩倍積。
			
			i:
				10	9	8	7	6	5	4	3	2	1	0
			i + 1 - this_length(6):
				5	4	3	2	1	0	1	-2	-3	-4	-5
			j start:
				5	4	3	2	1	0	0	0	0	0	0
			j end:
				5	4	4	3	3	2	2	1	1	0	0
			
			*/
			function square() {
				do_modified(this);
				//不處理虛數與複數。
				delete this[KEY_NEGATIVE];
				this[KEY_EXPONENT] *= 2;

				var i = 0, j, this_length = this.length, length = 2 * this_length, result = new Array(length--), product, value;
				//初始化。
				result.fill(0);

				for (; i < length ; i++)
					for (j = Math.max(0, i + 1 - this_length) ; 2 * j <= i; j++)
						if (product = this[j] * this[i - j]) {
							if (2 * j < i)
								product *= 2;
							if (Number.isSafeInteger(value = result[i] + product))
								result[i] = value;
							else
								//手動進位。
								result[i + 1]++, result[i] -= Number.MAX_SAFE_INTEGER - product;
						}

				//將 {Array}result → this
				for_each_digit.call(result, function (digit, carry) {
					return digit + carry;
				}, this);

				return this;
			}

			//https://en.wikipedia.org/wiki/Exponentiation
			//http://en.wikipedia.org/wiki/Exponentiation_by_squaring
			//{natural number}exponent
			//{natural number}modulus = base^this.exponent
			//TODO: modulus
			function power(exponent, modulus) {
				if (1 < (exponent = +exponent) && exponent === (exponent >> 0)) {
					do_modified(this);

					for (var product = this; ;) {
						if (exponent % 2 === 1)
							if (product !== this)
								//array multiply: this *= product
								this.multiply(product);
							else if (1 < exponent)
								product = new Integer(this);

						if ((exponent >>= 1) === 0)
							break;

						product.square();
					}

				} else if (exponent === 0)
					this.assignment(ZERO_EXPONENT);

				else if (exponent !== 1)
					library_namespace.err('power: Invalid exponent: [' + exponent + '].');

				return this;
			}

			//9741
			var square_root_base = Math.floor(Math.sqrt(Math.sqrt(MAX_SAFE_INTEGER)));
			//for debug
			square_root_base = 1000;
			/*
			https://en.wikipedia.org/wiki/Square_root
			https://en.wikipedia.org/wiki/Methods_of_computing_square_roots


			slow method (don't use this):
			(please copy to a plain text)
			精準/準確直式開方 以  BASE = 100^2 = 10000 為例，sqrt(294565622121) = 542739：
			accumulate        54   27   39  reminder
			 54             2945 6562 2121
			+54             2916              ① q=Math.sqrt(2945)|0 = 54, 54×54 = 2916
			10827             29 6562         ② reminder=296562, accumulate=10800, q=reminder/accumulate|0 = 27, 自 q 起找尋 (accumulate+q)×q <= reminder 之最大數 q (if(reminder-accumulate*q<q*q)q--;)，即為 27。
			+  27             29 2329         ③ 10827×27 = 292329
			1085439              4233 2121    ④ reminder=42332121, accumulate=1085400, q=reminder/accumulate|0 = 39, 自 q 起找尋 (accumulate+q)×q <= reminder 之最大數 q (if(reminder-accumulate*q<q*q)q--;)，即為 39。
			     39              4233 2121    ⑤ 1085439×39 = 42332121
			                             0    ⑥ reminder=0, done.
			*/
			//{Undefined|natural number}digit
			//WARNING: this will get floor(sqrt(this))
			function square_root(precision) {
				if (this[KEY_NEGATIVE])
					//不處理虛數與複數。
					return this.assignment(NaN);
				if (KEY_TYPE in this)
					return this[KEY_TYPE];

				// 至此特殊值處理完畢。
				do_modified(this);

				//use Newton's method: x1 = (x0 + number / x0) / 2

				//決定 initial value

				//assert: this[this.length - 1] > 0
				var index = this.length - 1, index_sr = index / 2 | 0, base = this[KEY_BASE];
				if (!index_sr)
					//assert: this.length <= 2
					return this.assignment(Math.floor(Math.sqrt((this[1] || 0) * base + (this[0] || 0))));

				var sr = new Integer(0, null, base), _sr = this[index--];
				while (2 * (index_sr - 1) < index)
					_sr = _sr * base + this[--index];
				_sr = Math.floor(Math.sqrt(_sr)) + 1;
				sr[index = index_sr] = _sr / base | 0;
				//保證 initial value >= sqrt(this)
				sr[--index] = _sr % base;
				while (0 < index)
					sr[--index] = 0;

				for (; ;) {
					//use Newton's method: x1 = (number / x0 + x0) / 2
					_sr = new Integer(this).division(sr).add(sr).division(2);
					if (Math.abs(sr[0] - _sr[0]) < 2)
						//若是兩數僅差 1，則可回傳。
						for (index = 1; ;) {
							if (sr[index] !== _sr[index])
								break;
							if (++index === sr.length)
								return this.assignment(sr[0] < _sr[0] ? sr : _sr);
						}
					sr = _sr;
				}

			}

			//https://en.wikipedia.org/wiki/Logarithm
			//default base: e
			//return Number
			function log(base) {
				if (this[KEY_NEGATIVE])
					//不處理虛數與複數。
					return NaN;
				if (KEY_TYPE in this)
					return this[KEY_TYPE];

				// 至此特殊值處理完畢。

				var exponent = 0, value = this, quotient;
				if (base) {
					base = new Integer(quotient = base, null, this[KEY_BASE]);
					if (base[KEY_TYPE] || !(base.compare(ZERO_EXPONENT) > 0)) {
						library_namespace.err('Invalid base: [' + quotient + '].');
						return NaN;
					}

					// 盡量取得整數次方。
					for (value = new Integer(this) ; ; exponent++, value = quotient) {
						quotient = value.division(base);
						if (value.compare(0) !== 0)
							break;
					}

					//assert: is_Integer(base)
					//assert: this = value * base ^ {0|natural number}exponent in base
					//assert value === value % base > 0
				}

				//將 value 轉成可表現之最大精度 {Number}。
				value = value.valueOf(TYPE_info_for_large);

				value = typeof value === 'number' ? Math.log(value)
					//assert: value = [{Number}large value, {0|natural number}exponent in this[KEY_BASE]]
					: value[1] * Math.log(this[KEY_BASE]) + Math.log(value[0]);

				if (base) {
					if (value)
						value /= base.log();
					value += exponent;
				}

				return value;
			}

			//https://en.wikipedia.org/wiki/Factorial
			//階乘
			function factorial() {
				var last = this.valueOf();
				if (!Number.isSafeInteger(last) || !(last >= 0)) {
					library_namespace.err('factorial: invalid number: ' + last);
					return this;
				}

				do_modified(this);
				this.assignment(1);
				if (last === 0)
					return this;

				for (var i = 2; i <= last; i++)
					this.multiply(i);

				return this;
			}

			//http://en.wikipedia.org/wiki/Miller%E2%80%93Rabin_primality_test
			function maybe_prime(base) {
				do_modified(this);
				//	TODO
				throw new Error('maybe_prime: Not Yet Implemented!');
				return this;
			}

			//https://en.wikipedia.org/wiki/Lehmer%27s_GCD_algorithm
			function GCD() {
				//	TODO
				throw new Error('GCD: Not Yet Implemented!');
				return;
			}

			function LCM() {
				//	TODO
				throw new Error('LCM: Not Yet Implemented!');
				return;
			}

			//prime factorization 因數分解
			function factorization(base) {
				do_modified(this);
				//	TODO
				throw new Error('factorization: Not Yet Implemented!');
				return [];
			}


			// ---------------------------------------------------------------------//

			/**
			 * front end of operation(運算)
			 * @param {String}operator	operator
			 * @param number	the second integer
			 * @return	計算後的結果
			 * @see
			 * https://en.wikipedia.org/wiki/Operation_(mathematics)
			 * <a href="http://www.javaworld.com.tw/jute/post/view?bid=35&amp;id=30169&amp;tpg=1&amp;ppg=1&amp;sty=1&amp;age=0#30169" accessdate="2010/4/16 20:47">JavaWorld@TW Java論壇 - post.view</a>
			 * @_name	_module_.prototype.op
			 */
			function operate(operator, number, flag) {
				var target;
				if (operator.slice(-1) === '=') {
					if (operator === '===')
						return this === number;
					if (operator !== '=' && operator !== '==')
						operator = operator.slice(0, -1);
					target = this;
				} else
					target = new Integer(this);

				if (operator in OP_REFERENCE)
					OP_REFERENCE[operator].call(target, number, flag);
				else
					library_namespace.err('operate: Invalid operator [' + operator + ']!');

				return target;
			}

			// ---------------------------------------------------------------------//

			//當數字過大，轉回傳 {String}
			var TYPE_String_for_large = 1,
			//return [value, exponent]: this = value * base ^ exponent
			TYPE_info_for_large = 2,
			//與 NaN 等極端數字作運算用。
			TYPE_TEST = 3;
			//WARNING: 若回傳非 Number.isSafeInteger()，則會有誤差，不能等於最佳近似值。
			function valueOf(type) {
				var value;
				if (KEY_TYPE in this)
					value = this[KEY_TYPE];

				else if (type === TYPE_TEST && this.length < 2) {
					if ((value = this[0] || 0) && this[KEY_EXPONENT])
						value *= Math.pow(base, this[KEY_EXPONENT]);

				} else {
					var index = this.length, base = this[KEY_BASE], next_value;
					for (value = 0; 0 < index--; value = next_value)
						if (!isFinite(next_value = value * base + this[index])) {
							if (!type)
								// normal: 強迫回傳 {Number}
								value = Infinity;
							else if (type === TYPE_info_for_large)
								return [value, index + 1 + this[KEY_EXPONENT]];
							else if (type === TYPE_String_for_large) {
								value = Math.log10(value) + Math.log10(base) * (index + 1 + this[KEY_EXPONENT]);
								value = Math.pow(10, value % 1) + 'e+' + (value | 0);
							} else
								//TYPE_TEST
								//與 NaN 等極端數字相較，再大的 Integer 都只是小兒科。因為不在乎精度，無須再處理。
								//但須注意 assignment() 之使用。
								;
							break;
						}

					if (this[KEY_EXPONENT]
						//確定 type !== TYPE_String_for_large，因為已處理過。
						&& typeof value === 'number' && value) {
						next_value = value * Math.pow(base, this[KEY_EXPONENT]);
						if (type === TYPE_info_for_large && (!isFinite(next_value)
							//維持同樣精度。
							|| Number.isSafeInteger(value) && !Number.isSafeInteger(next_value)))
							return [value, this[KEY_EXPONENT]];
						value = next_value;
					}
				}
				return this[KEY_NEGATIVE] ? typeof value === 'number' ? -value : '-' + value : value;
			}

			function toString(radix) {
				var base, zero = 0;
				if (radix && isNaN(radix))
					radix = (base = Array.isArray(radix) ? radix : String(radix).split('')).length;
				else if (!(MIN_RADIX <= radix && radix <= MAX_RADIX))
					radix = DEFAULT_RADIX;
				if (!base && this[KEY_CACHE] && this[KEY_CACHE][radix])
					return this[KEY_CACHE][radix];

				var digits, value;
				if (KEY_TYPE in this)
					digits = [this[KEY_TYPE]];
				else {
					if (!base)
						//assert: 'ab'[1]==='b'
						base = DEFAULT_DIGITS;
					zero = base[0];
					digits = [];
					value = new Integer(this, radix);
					value.forEach(function (digit) {
						digits.push(base[digit]);
					});
					if (value = value[KEY_EXPONENT])
						if (0 < value)
							digits.unshift(zero.repeat(value));
						else {
							if (digits.length < (value = -value))
								//補足長度。
								if (digits.fill)
									digits.fill(zero, digits.length, value);
								else
									for (var i = digits.length; i < value;)
										digits[i++] = zero;
							digits.splice(value, 0, '.');
							while (digits[0] == zero)
								//去除末端的 '0'
								digits.shift();
							if (digits[0] === '.')
								digits.shift();
						}
				}

				//去除前導的 '0'
				if (value = digits.length)
					while (0 < --value && digits[value] == zero)
						digits.pop();
				else
					digits = [zero];

				if (this[KEY_NEGATIVE])
					digits.push('-');

				digits.reverse();

				if (!this[KEY_CACHE])
					this[KEY_CACHE] = [];
				return this[KEY_CACHE][radix] = digits.join('');
			}


			// ---------------------------------------------------------------------//

			return Integer;
		}

	});
