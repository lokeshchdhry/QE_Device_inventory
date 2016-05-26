var create_user = require('user_logic/createuser');
var login = require('user_logic/admin_login');
var non_admin = require('landing_pages/landing_page_nonadmin');

var isAndroid = false;
var isIOS = false;
if(Ti.Platform.osname=='android'){
	isAndroid = true;
}
else if(Ti.Platform.osname=='iphone'){
	isIOS = true;
}
else{
	alert('Invalid platform.This app cannot run on this platform');
}
Ti.API.info('Android: '+isAndroid);
Ti.API.info('IOS: '+isIOS);

non_admin.non_admin_landing();




	
