var menuitem = require('utils/menuitem');
var non_admin_landing = require('landing_pages/landing_page_nonadmin');
var newdevice = require('devicelogic/create_device');
var getandroiddevice = require('devicelogic/get_android_devices');
var getiosdevice = require('devicelogic/get_ios_devices');
var getwindowsdevice = require('devicelogic/get_windows_devices');
var getalldevice = require('devicelogic/get_all_devices');
var updatedevice = require('devicelogic/update_device');
var deletedevice = require('devicelogic/delete_logic/delete_main_pg');
var querydevice = require('devicelogic/query_device');
var logout = require('user_logic/logout');
var add_device_csv = require('devicelogic/parse_csv');
var get_all_checkedout_devices = require('devicelogic/checkout/get_all_checkedout_devices');
var manage_users = require('user_logic/manage_users');

exports.landing=function(){	
	var main_win = Ti.UI.createWindow({
		title:"Admin Window",
		backgroundImage:'main_bg.jpg'
	});
	
	var admin_scr_view = Ti.UI.createScrollView({
		width:Ti.UI.FILL,
		bottom:70,
		backgroundImage:'main_bg.jpg',
		showVerticalScrollIndicator:true
	});
	
	var create_device_button = Ti.UI.createButton({
		title:"Add device",
		top:10,
		height:75,
		left:0,
		width:'50%'
	});
	
	var query_device_button = Ti.UI.createButton({
		top:10,
		title:"Query devices",
		height:75,
		right:0,
		width:'50%'
	});
	
	var get_android_device_button = Ti.UI.createButton({
		top:100,
		title:"Get Android devices",
		height:75,
		left:0,
		width:'50%'
	});
	
	var get_ios_device_button = Ti.UI.createButton({
		top:100,
		title:"Get IOS devices",
		height:75,
		right:0,
		width:'50%'
	});
	
	var get_windows_device_button = Ti.UI.createButton({
		top:190,
		title:"Get Windows devices",
		height:75,
		left:0,
		width:'50%'
	});
	
	var get_all_device_button = Ti.UI.createButton({
		top:190,
		title:"Get All Devices",
		height:75,
		right:0,
		width:'50%'
	});
	
	
	var delete_device_button = Ti.UI.createButton({
		top:280,
		title:"Delete device/s",
		height:75,
		left:0,
		width:'50%'
	});
	
	var add_device_csv_but = Ti.UI.createButton({
		top:280,
		title:"Add device/s from CSV file",
		height:75,
		right:0,
		width:'50%'
	});
	
	var get_checkedout_device_but = Ti.UI.createButton({
		top:370,
		title:"Get Checked out devices",
		height:75,
		left:0,
		width:'50%'
	});
	
	var manage_users_but = Ti.UI.createButton({
		top:370,
		title:"Manage Users",
		height:75,
		right:0,
		width:'50%'
	});
	
	var logout_img = Ti.UI.createImageView({
		bottom:20,
		width:45,
		height:45,
		left:'25%',
		image:'/images/logout.png'
	});
	
	var logout_but_lbl = Ti.UI.createLabel({
		bottom:3,
		text:'Logout',
		left:'26%',
		font:{fontSize:13,fontWeight:"bold"}
	});
	
	var create_usr_img = Ti.UI.createImageView({
		bottom:20,
		width:45,
		height:45,
		right:'25%',
		image:'/images/register.png'
	});
	
	var createuser_but_lbl = Ti.UI.createLabel({
		bottom:3,
		text:'Create User',
		right:'22%',
		font:{fontSize:13,fontWeight:"bold"}
	});
	
	menuitem.showmenuitems(main_win);
	
	create_device_button.addEventListener('click',function(){
			newdevice.create_device();	
	});
	
	query_device_button.addEventListener('click',function(){
		//passing admin as that logout button & register user menu items does show
		querydevice.query_device('admin');
	});
	
	get_android_device_button.addEventListener('click',function(){
	
		getandroiddevice.get_android_device();
	});
	
	get_ios_device_button.addEventListener('click',function(){
		getiosdevice.get_ios_device();
	});
	
	get_windows_device_button.addEventListener('click',function(){
		getwindowsdevice.get_windows_device();
	});
	
	get_all_device_button.addEventListener('click',function(){
		getalldevice.get_all_device();
	});
	
	
	delete_device_button.addEventListener('click',function(){
		deletedevice.delete_main_pg();
	});
	
	add_device_csv_but.addEventListener('click',function(){
		add_device_csv.parsecsv();
	});
	
	get_checkedout_device_but.addEventListener('click',function(){
		get_all_checkedout_devices.get_checkedout_devices();
	});
	
	manage_users_but.addEventListener('click',function(){
		manage_users.manage_users();
	});
	
	logout_img.addEventListener('click',function(){
		logout.logout_user(main_win);
		non_admin_landing.non_admin_landing();
	});
	
	main_win.addEventListener('androidback',function(){
		non_admin_landing.non_admin_landing();
	});
	
	create_usr_img.addEventListener('click',function(){
		create_user.create_user();
	});
	
	//Android back listener to logout when back button is pressed.
	main_win.addEventListener('androidback',function(){
		logout.logout_user(main_win);
	});
	
	main_win.add(create_device_button);
	main_win.add(query_device_button);
	main_win.add(get_android_device_button);
	main_win.add(get_ios_device_button);
	main_win.add(get_windows_device_button);
	main_win.add(get_all_device_button);
	main_win.add(add_device_csv_but);
	main_win.add(delete_device_button);
	main_win.add(get_checkedout_device_but);
	main_win.add(manage_users_but);			
	main_win.open();
};
