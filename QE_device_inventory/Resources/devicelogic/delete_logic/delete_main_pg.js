var single_delete = require('devicelogic/delete_logic/delete_device');
var all_delete = require('devicelogic/delete_logic/delete_all');
var menuitem = require('utils/menuitem');

exports.delete_main_pg=function(){
	var delete_main_win = Ti.UI.createWindow({title:'Delete Main Page',layout:'vertical',backgroundImage:'main_bg.jpg'});
	var single_delete_but = Ti.UI.createButton({title:'Delete Single device',top:10,height:100,width:'50%'});
	var all_delete_but = Ti.UI.createButton({title:"Delete All Devices",top:10,height:100,width:'50%'});
	
	single_delete_but.addEventListener('click',function(){
		single_delete.deletedevice();
	});
	
	all_delete_but.addEventListener('click',function(){
		all_delete.deleteall();
	});
	
	//Adding the menu items to the window
	menuitem.showmenuitems(delete_main_win);
	
	delete_main_win.add(single_delete_but);
	delete_main_win.add(all_delete_but);	
	delete_main_win.open();
};
