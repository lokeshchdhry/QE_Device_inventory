var admin_login = require('user_logic/admin_login');
var search_device = require('devicelogic/query_device');
var device_checkout = require('devicelogic/checkout/checkout');
var device_checkin = require('devicelogic/checkin/checkin');

exports.non_admin_landing=function(){
	var non_admin_win = Ti.UI.createWindow({title:"QE Device Inventory",backgroundImage:'main_bg.jpg',layout:'vertical'});
	var checkout_button = Ti.UI.createButton({title:'Checkout device',top:10,height:75,width:'50%'});
	var checkin_button = Ti.UI.createButton({top:10,title:"Checkin device",height:75,width:'50%'});
	var search_button = Ti.UI.createButton({title:'Search device',top:10,height:75,width:'50%'});
	var admin_login_img = Ti.UI.createImageView({width:45,height:45,image:'/images/login.png',top:250});
	var admin_login_lbl = Ti.UI.createLabel({text:'Admin Login',font:{fontSize:12,fontWeight:"bold"}});
	
	search_button.addEventListener('click',function(){
		//passing non admin as that logout button & register user menu items does not show
		search_device.query_device('nonadmin');
	});
	
	admin_login_img.addEventListener('click',function(){
		admin_login.admin_login();
		//Close the non admin win so that it does not show up after logging out again.
		non_admin_win.close();
	});
	
	checkin_button.addEventListener('click',function(){
		device_checkin.device_checkin();
	});
	
	checkout_button.addEventListener('click',function(){
		device_checkout.device_checkout();
	});
	
	non_admin_win.add(checkin_button);
	non_admin_win.add(checkout_button);
	non_admin_win.add(search_button);
	non_admin_win.add(admin_login_img);
	non_admin_win.add(admin_login_lbl);
	non_admin_win.open();
};
