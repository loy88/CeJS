
/**
 * @name	CeL rational number function
 * @fileoverview
 * 本檔案包含了整數 (rational number) 的 functions，相當/類似於 BigRational, BigQuotient (numerator and denominator), BigDecimal。<br />
 * 在純 javascript 的環境下，藉由原生計算功能，盡可能提供高效的大數計算。<br />
 *
 * @example
 * <code>
 * CeL.run('data.math.rational');
 * </code>
 *
 * @since	
 */


/*
TODO:

規格書:

rational = new Rational(numerator, denominator, base);

rational = new Rational(10783, 2775);
rational = new Rational('10783/2775');
rational = new Rational('3+2458/2775');
rational = new Rational('3.88_576');

numerator 10783
denominator 2775

integer part 整數部分 == quotient == continued fraction[0]
fractional part 分數/小數部分 == remainder / denominator

mixed fraction 帶分數 == integer part + fractional part
vulgar fraction 真分數/假分數 == 

decimal approximation (numerical value) 無限小數 3.88576576576576576576576576
repeating decimal 循環小數 3.88_576

continued fraction 連分數 == [3; 1, 7, 1, 3, 15, 1, 1, 2]

Egyptian fraction expansion 古埃及分數

最簡分數(irreducible fraction)約分 reduce

*/



'use strict';
if (typeof CeL === 'function')
	CeL.run(
	{
		name: 'data.math.rational',
		require: 'data.code.compatibility|data.native|data.math.GCD|data.math.factorization',
		code: function (library_namespace) {

			//	requiring
			var GCD, factorization;
			eval(this.use());

			// ---------------------------------------------------------------------//
			// 定義基本常數。
			var
			KEY_NUMERATOR = 'numerator',
			KEY_DENOMINATOR = 'denominator'
			;

			// ---------------------------------------------------------------------//
			// 初始調整並規範基本常數。


			// ---------------------------------------------------------------------//
			// 工具函數


			// ---------------------------------------------------------------------//
			//	definition of module integer

			/**
			 * 任意大小、帶正負號的有理數。rational number instance.
			 *
			 * @example
			 * <code>
			 * </code>
			 *
			 * @class	Integer 的 constructor
			 * @constructor
			 */
			function Rational(numerator, denominator, base) {
				this[KEY_NUMERATOR] = numerator;
				this[KEY_DENOMINATOR] = denominator;
			}

			//	class public interface	---------------------------

			//	instance public interface	-------------------


			// ---------------------------------------------------------------------//

			function assignment(number) {
				;
			}

			// ---------------------------------------------------------------------//
			//四則運算，即加減乘除， + - * / (+-×÷)**[=]
			//https://en.wikipedia.org/wiki/Elementary_arithmetic

			//和
			function add(number) {
				;
			}

			//差
			function subtract(number) {
				return this.add(number, true);
			}

			function multiply(number) {
			}

			function divide() {
			}

			function square() {
			}

			function power(exponent, modulus) {
			}

			function square_root(precision) {
			}

			function log(base) {
			}

			return Rational;
		}

	});
