
/**
 * @name	CeL function for process
 * @fileoverview
 * 本檔案包含了 process 流程控制的 functions。
 * @since	2012/2/3 19:13:49
 */


'use strict';
if (typeof CeL === 'function')
CeL.setup_module('application.process',
function(library_namespace, load_arguments) {

//	nothing required


/**
 * null module constructor
 * @class	process 的 functions
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
	//constructor : _
};






/**
 * 提供給函數設定 flag 用。
 * @param flag_Object
 * @returns
 */
function set_flag(flag_Object) {
	function get_flag(flag) {
		return flag in get_flag ? get_flag[flag] : flag;
	}
	(get_flag.add_flag = function(flag_Object) {
		if (flag_Object)
			for ( var i in flag_Object)
				get_flag[i] = flag_Object[i];
	})(flag_Object);
	return get_flag;
}



/**
 * 設定循序執行(serial execution) 程序，並可以作 stop, resume 等流程控制 (inter-process
 * communication)。<br />
 * 本函數可代替 loop，亦可避免長時間之迴圈操作被 browser 判別為耗時 loop 而 hang 住。<br />
 * 
 * <code>
 * // 單 thread
 * var i=0,s=0;for(;i<99;i++)s+=Math.random();alert(s);
 * // 方法1
 * new CeL.Serial_execute(function(i, d) {d.s+=Math.random();}, {end: 99, run_first: function(d) {d.s=0;}, finish: function(i, d) {alert(d.s);}});
 * // 方法2
 * new CeL.Serial_execute(function() {this.s+=Math.random();}, {end: 99, run_first: function() {this.s=0;}, finish: function() {alert(this.s);}});
 * </code>
 * 
 * @param {Function}loop_thread
 *            loop_thread({Integer}process_to_index) {<br />
 *            return<br />
 *            'SIGABRT': terminated (accident occurred), won't run
 *            pass_across.finish();<br />
 *            others(!0): all done<br /> }
 * 
 * @param {Object}[pass_across]
 *            在各 thread 間傳遞的 data.<br />
 *            {<br />
 *            {String}id : process id (有設定 id 則可以從 Serial_execute.process[id] 控制。),<br />
 *            {Integer}start : start from 哪一序號,<br />
 *            {Integer}process_to : process to 哪一序號,<br />
 *            {Integer}end : 執行至哪一序號: end - 1,<br />
 *            {Integer}interval : 週期間隔(ms),<br />
 *            {Function}handler : 額外設定的 signal handler,<br />
 *            {Function}run_first : run first,<br />
 *            {Function}finish : run after all,<br />
 *            {Boolean}stop_on_error : stop on error of loop_thread(),<br />
 *            }
 * 
 * @returns {Serial_execute}process handler
 * 
 * @since 2012/2/3 18:38:02 初成。<br />
 *        2012/2/4 12:31:53 包裝成物件。
 */
function Serial_execute(loop_thread, pass_across) {
	if (typeof loop_thread !== 'function')
		return;

	this.timer = new Date;

	// 處理 pass_across 中與執行相關，且不允許被 loop_thread 改變的設定。
	if (pass_across) {
		// 作判別是否設定 pass_across 之用，若無設定 pass_across 則為 undefined。
		this.has_data = true;
		this.data = pass_across;
		if ('protected_data' in pass_across) {
			if (library_namespace.is_Object(pass_across.protected_data))
				// 不想被 loop_thread 變更的值。
				this.protected_data = pass_across.protected_data;
			delete pass_across.protected_data;
		}

		// process status
		if (pass_across.id) {
			if (!Serial_execute.process)
				Serial_execute.process = {};

			if (Serial_execute.process[pass_across.id])
				library_namespace.debug('已有相同 id 之 process 執行中! ['
						+ pass_across.id + ']');
			else
				// 作個登記
				Serial_execute.process[this.id = pass_across.id] = this;
		}

	} else
		// 還是給予預設值，省略判斷，簡化流程。
		this.data = {};

	// 處理初始化必要，且不允許被 loop_thread 改變的 methods/設定/狀態值.
	// TODO: 簡化 get_data 之處理。
	library_namespace.extend(this.protected_data ? {
		get_data_obj : function(k) {
			return k in this.protected_data ? this.protected_data : this.data;
		},
		get_data : function(k) {
			return get_data_obj(k)[k];
		}
	} : {
		get_data_obj : function() {
			return this.data;
		},
		get_data : function(k) {
			return this.data[k];
		}
	}, this);

	// start from 哪一序號
	this.get_data_obj('loop_thread').loop_thread = loop_thread;
	// 外包裹執行緒: 可寫在 prototype 中。
	this.package_thread = Serial_execute.package_thread.bind(this);

	if (pass_across && typeof pass_across.run_first === 'function')
		pass_across.run_first.call(this.get_data('loop_thread'), this.data);

	setTimeout(this.package_thread, 0);
}

/**
 * signal 定義。
 * 
 * @see <a href="http://en.wikipedia.org/wiki/Unix_signal" accessdate="2012/2/4
 *      15:35">Unix signal</a>
 */
Serial_execute.signal = set_flag( {
	// running : 0,
	SIGTERM : 15,
	SIGCONT : 18,
	SIGSTOP : 19,
	SIGABRT : 6
});

/**
 * Send signal to specified process.
 * 
 * @param {String|Integer}signal
 *            Serial_execute.signal
 * @param {String}id
 *            id of process
 * @returns
 */
Serial_execute.send = function(signal, id) {
	var process;
	try {
		return (process = Serial_execute.process[id]) ? process.send(signal)
				: new Error('Process does not exist');
	} catch (e) {
		return e;
	}
};

// private: 預設外包裹執行緒
Serial_execute.package_thread = function() {
	var status,
	// signal cache
	signal = Serial_execute.signal,
	data = this.data,
	get_data = this.protected_data ?
		(function(k) {
			return this.get_data(k);
		}).bind(this)
		: function(k) {
			return data[k];
		},
	process_to = get_data('process_to') || get_data('start') || 0,
	end = get_data('end'),
	// debug 用
	id_msg = 'process [' + this.id + '] @ ' + process_to
			+ (isNaN(end) ? '' : ' / ' + end), stop = function() {
		library_namespace.debug('Stop ' + id_msg);
		status = signal.SIGSTOP;
	};

	if ('signal' in this) {
		switch (this.signal) {
		case signal.SIGTERM:
			status = signal.SIGABRT;
			break;
		case signal.SIGSTOP:
			stop();
			// delete this.signal; break;
		default:
			// ignore others
			delete this.signal;
		}
	}

	if (!status)
		try {
			// 實際執行 loop_thread()。
			status = signal(get_data('loop_thread').call(
					get_data('loop_thread'), process_to++,
					this.has_data && this.data));
			this.get_data_obj('process_to')['process_to'] = process_to;
		} catch (e) {
			library_namespace.warn(id_msg + ' failed');
			library_namespace.err(e);
			if (get_data('stop_on_error'))
				stop();
		}
	this.status = status;

	if (!status && (isNaN(end) || process_to < end))
		setTimeout(this.package_thread, get_data('interval') || 0);
	else {
		// (maybe) loop_thread() return true, 收尾/收拾工作.
		if (status !== signal.SIGABRT && status !== signal.SIGSTOP
				&& typeof get_data('finish') === 'function')
			status = signal(get_data('finish').call(get_data('loop_thread'),
					process_to, this.has_data && this.data));
		else if (status === signal.SIGABRT)
			library_namespace.debug('Terminate ' + id_msg);
		if (this.id && (status !== signal.SIGSTOP))
			delete Serial_execute.process[this.id];
		return status;
	}
};

Serial_execute.prototype = {
	constructor : Serial_execute,
	// status : {Integer}status (0:running, others:accident),
	// signal : {Integer}signal recived
	// data : pass across,
	// timer : {Date} start time,

	send : function(send_signal) {
		var
		// signal cache
		signal = Serial_execute.signal;

		send_signal = signal(send_signal);

		if (send_signal === signal.SIGCONT) {
			// 直接喚醒
			if (this.status === signal.SIGSTOP) {
				// 準備 resume
				this.status = 0;
				// ignore 之前的 stop
				if (this.signal === signal.SIGSTOP)
					delete this.signal;
				return this.do_resume();
			}

		} else {
			// 設定 signal
			this.signal = send_signal;
			if (send_signal === signal.SIGTERM
					&& this.status === signal.SIGSTOP)
				return this.do_resume();
			var handler = this.get_data('handler');
			if (typeof handler === 'function')
				// signal handler
				return handler.call(this.get_data('loop_thread'), send_signal,
						this.has_data && this.data);
		}
	},

	// run
	resume : function() {
		return this.send(Serial_execute.signal.SIGCONT);
	},

	// pause
	stop : function() {
		return this.send(Serial_execute.signal.SIGSTOP);
	},

	// terminate
	abort : function() {
		return this.send(Serial_execute.signal.SIGTERM);
	},

	// private
	// {String}id : id
	// {Function}package_thread : 外包裹執行緒,
	// {Boolean}has_data : 作判別是否設定 pass_across 之用，若無設定 pass_across 則為 undefined。,
	// {Object}protected_data : protected data,

	do_resume : function() {
		library_namespace.debug('Resume ' + this.id);
		return this.package_thread();
	}
};


_.Serial_execute = Serial_execute;



/*

// for testing
if (1)
	CeL.set_run( [ 'application.process', 'data.code.compatibility' ],
			function() {
				runCode.setR = 0;
				p = new CeL.Serial_execute(function(i) {
					CeL.log(i);
					if (i > 99)
						return 1;
				}, {
					// id : 't',
					interval : 800,
					finish : function(i, data) {
						CeL.log(data.id + ' done @ ' + i);
					}
				});
				// CeL.Serial_execute.stop('t');
				// p.stop();
			});
// p.resume();
// p.abort();
// CeL.log(p);

if (0)
	CeL.Serial_execute(function(i) {
		CeL.log(i);
		if (i > 99)
			return 1;
	}, {
		finish : function(i, id) {
			CeL.log('done @ ' + i);
		}
	});

if (0)
	new CeL.Serial_execute(function(i) {
		CeL.log(i + ':' + (this.s = (this.s || 0) + i));
	}, {
		finish : function(i, id) {
			CeL.log('done @ ' + i);
		},
		end : 99
	});

if (0)
	new CeL.Serial_execute(function(i) {
		CeL.log(i + ':' + (this.s = (this.s || 0) + i));
	}, {
		start : 1,
		end : 101
	});

*/


return (
	_// JSDT:_module_
);
}


);

