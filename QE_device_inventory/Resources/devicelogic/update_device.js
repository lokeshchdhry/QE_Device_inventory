var links_keys = require('utils/links_keys');

exports.update_device = function(name){
	var warn_label = Ti.UI.createLabel({text:"NOTE: All fields are required for updating a device.If you want to edit a specific field you will need to fill every field again or else if empty, entries in the db will be deleted."});
	
	var device_add_win = Ti.UI.createWindow({title:"Update Device",backgroundImage:'main_bg.jpg'});
	var device_add_scr_view = Ti.UI.createScrollView({width:Ti.UI.FILL,height:Ti.UI.FILL});
	var device_add_view = Ti.UI.createView({width:Ti.UI.FILL, height:Ti.UI.FILL, layout:'vertical'});
	
	var lbl_id = Ti.UI.createLabel({text:"ID: (Required)"});
	var txt_id = Ti.UI.createTextField({top:10,width:200});
	
	var lbl_name = Ti.UI.createLabel({text:"Name: (Required)"});
	var txt_name = Ti.UI.createTextField({top:10,width:200});
	
	var lbl_platform = Ti.UI.createLabel({text:"Platform: (Required)"});
	var txt_platform = Ti.UI.createTextField({top:10,width:200});
	
	var lbl_os_ver = Ti.UI.createLabel({text:"OS Ver: (Required)"});
	var txt_os_ver = Ti.UI.createTextField({top:5,width:200});
	
	var lbl_make = Ti.UI.createLabel({text:"Make: (Required)"});
	var txt_make = Ti.UI.createTextField({top:10,width:200});
	
	var lbl_model = Ti.UI.createLabel({text:"Model: (Required)"});
	var txt_model = Ti.UI.createTextField({top:5,width:200});
	
	var lbl_ser_no = Ti.UI.createLabel({text:"Serial No: (Required)"});
	var txt_ser_no = Ti.UI.createTextField({top:5,width:200});
	
	var lbl_IMEI = Ti.UI.createLabel({text:"IMEI: (Required)"});
	var txt_IMEI = Ti.UI.createTextField({top:5,width:200});
	
	var submit = Ti.UI.createButton({title:"Update",top:20});
	
	txt_name.value=name;
	
	submit.addEventListener('click',function(){
		// var xhr = Ti.Network.createHTTPClient({
	    // onload: function onLoad() {
	        // alert("Loaded: " + this.status + ": " + this.responseText);
	    // },
	    // onerror: function onError() {
	        // alert("Errored: " + this.status + ": " + this.responseText);
	    // }
	// });
// 	
// 	
	// xhr.open("POST", links_keys.update_device);
	// var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
	// xhr.setRequestHeader("Authorization", authstr);
	// xhr.setRequestHeader("Content-Type","application/json");
	// xhr.send(JSON.stringify({
		// "id":txt_id.value,
		// "name": txt_name.value,
		// "platform": txt_platform.value,
		// "os_ver": txt_os_ver.value,
	    // "make": txt_make.value,
	    // "model": txt_model.value,
	    // "serial_number": txt_ser_no.value,
	    // "IMEI": txt_IMEI.value
	// }));
	device_add_win.close();
	});
	
	//device_add_view.add(warn_label);
	device_add_view.add(lbl_id);
	device_add_view.add(txt_id);
	device_add_view.add(lbl_name);
	device_add_view.add(txt_name);
	device_add_view.add(lbl_platform);
	device_add_view.add(txt_platform);
	device_add_view.add(lbl_os_ver);
	device_add_view.add(txt_os_ver);
	device_add_view.add(lbl_make);
	device_add_view.add(txt_make);
	device_add_view.add(lbl_model);
	device_add_view.add(txt_model);
	device_add_view.add(lbl_ser_no);
	device_add_view.add(txt_ser_no);
	device_add_view.add(lbl_IMEI);
	device_add_view.add(txt_IMEI);
	device_add_view.add(submit);
	device_add_win.add(device_add_scr_view);
	device_add_scr_view.add(device_add_view);
	device_add_win.open({modal:true});	
};
