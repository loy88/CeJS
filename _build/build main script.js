//	<reference /> MUST insert before /* .. */
/// <reference path="../_include/CeL.for_include.js" />

/**
 * @name	CeL base framework build tool using JScript
 * @since	2010/1/9 01:16:35
 * 2010/1/14 20:19:27	整理、簡化。
 */



/*

@ Linux ubuntu:
sudo cp -pru /media/366A99896A994691/USB/cgi-bin/lib/JS /usr/share/javascript/CeL && cd /usr/share/javascript/CeL && find . -type f -exec chmod 644 {} \; && find . -type d -exec chmod 755 {} \;

cd /usr/share/javascript/jquery && sudo wget -O jquery-nightly.js http://code.jquery.com/jquery-nightly.js && sudo chmod go+r jquery-nightly.js

*/

//	[CeL]library_loader_by_registry
try{var o;try{o=new ActiveXObject('Microsoft.XMLHTTP')}catch(e){o=new XMLHttpRequest()}o.open('GET',(new ActiveXObject("WScript.Shell")).RegRead('HKCU\\Software\\Colorless echo\\CeL\\main_script'),false);o.send(null);eval(o.responseText)}catch(e){}
//	[CeL]End

var script_name = 'build_main_script',
library_main_script = 'ce.js',
backup_directory = 'old\\', to_directory = '..\\',
alert_message = function(message) {
	WScript.Echo(script_name + ': ' + message);
},
error_recover = function(message) {
	alert_message(message
			+ '\n\nTry to recover!\n (Or you can stop the process.)');

	var FSO = WScript.CreateObject("Scripting.FileSystemObject");
	try {
		FSO.DeleteFile(to_directory + library_main_script, true);
	} catch (e) {
	}
	FSO.CopyFile(backup_directory + library_main_script, to_directory + library_main_script);
	//FSO = null;

	WScript.Quit(1);
};

if (typeof CeL === 'undefined') {
	error_recover("Can't load library!\n或許檔案路徑並未設定於 registry 之中？");
	//WScript.Echo((new ActiveXObject("WScript.Shell")).RegRead('HKCU\\Software\\Colorless echo\\CeL\\path'));
	//WScript.Quit(1);
}

//WScript.Echo(CeL.env.main_script + "\n" + CeL.env.registry_path + "\n" + CeL.env.registry_path_key_name);
if (CeL.env.main_script)
	library_main_script = CeL.env.main_script;

//CeL.cache_code = true;

CeL.set_debug();

//CeL.use('data.code.log');
//var sl = CeL.log;

//CeL.use('data.code.reorganize');

//CeL.use('application.storage.file');
try{
	//alert_message(CeL.extend.default_target);
	CeL.set_run(['application.OS.Windows.file', 'application.locale.encoding']);
	if (!CeL.is_loaded('application.OS.Windows.file'))
		throw 1;
}catch(e){
	error_recover("Can't load module!\n\nlibrary base path:\n" + CeL.env.registry_path);
	//WScript.Quit(1);
}

var structure_directory = '_structure\\',
	main_structure_file = structure_directory + 'structure.js',
	file_list = [ main_structure_file ],
	target_file = CeL.env.registry_path + library_main_script,
	structure_code;

structure_code = CeL.read_file(CeL.env.registry_path + main_structure_file,
	CeL.env.source_encoding)
	.replace(/\/\/([^\r\n]+)\r?\n/g,
		function($0, $1) {
			return /^\s*add\s/i.test($1) ? $0 : '';
		})
	.replace(/[\r\n\s]*\/\*((.|\n)*?)\*\/[\r\n\s]*/g, '')
	.replace(/\/\/\s*add\s+([a-z]+\.js)/gi,
		function($0, $1) {
			file_list.push($1);
			return CeL.read_file(
					CeL.env.registry_path + structure_directory + $1,
					CeL.env.source_encoding)
					.replace(/\/\*((.|\n)*?)\*\//, '');
		}
	)
	//	特殊處置：第一個 undefined。因為 eclipse 不允許拿 undefined 當引數。
	.replace(/_undefined/,'undefined');

structure_code =
	[
		'',
		'/*',
		'	本檔案為自動生成，請勿手動編輯！',
		'	This file is auto created from ' + file_list.join(', '),
		'		by auto-generate tool: ' + CeL.get_script_name() + '.',
		'*/',
		'',
		'',
		''
	].join(CeL.env.line_separator || '\n')
	+ structure_code;

if (structure_code !== CeL.read_file(target_file)) {
	//	backup
	var FSO = WScript.CreateObject("Scripting.FileSystemObject");
	try {
		FSO.DeleteFile(backup_directory + library_main_script, true);
	} catch (e) {
	}
	//FSO = null;
	CeL.move_1_file(target_file, library_main_script, backup_directory);

	// chmod: change to writeable
	CeL.change_attributes(target_file, -CeL.FSO_attributes.ReadOnly);

	//	write contents
	CeL.write_file(target_file, structure_code, CeL.env.source_encoding);

	// chmod
	CeL.change_attributes(target_file, CeL.FSO_attributes.ReadOnly);
}

