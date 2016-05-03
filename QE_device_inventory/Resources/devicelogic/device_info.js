var links_keys = require('utils/links_keys');

exports.device_info=function(devicename){
	Ti.API.info('name is '+devicename);
	//var device_info_win = Ti.UI.createWindow({title:'Device: '+devicename,modal:true, height:'350',width:300,backgroundColor:'#808080'});
	var device_info_win = Ti.UI.createWindow({modal:true,backgroundColor:'transparent'});
	var view = Ti.UI.createView({height:450,width:350,backgroundColor:'#808080',borderColor:'white',borderRadius:10,elevation:60});
	var ok_but = Ti.UI.createButton({title:'OK',bottom:0,right:0,width:60});
	
	var seperator = Ti.UI.createLabel({text:'-----------------------------------------------------------------------------------',top:40, left:10});
	var platform_lbl = Ti.UI.createLabel({top:60, left:10});
	var os_ver_lbl = Ti.UI.createLabel({top:80, left:10});
	var model_lbl = Ti.UI.createLabel({top:100, left:10});
	var name_lbl = Ti.UI.createLabel({top:20, left:10,font:{fontWeight:"bold"}});
	var make_lbl = Ti.UI.createLabel({top:120, left:10,});	        	
	var ser_no_lbl = Ti.UI.createLabel({top:140, left:10});
	var IMEI_lbl = Ti.UI.createLabel({top:160, left:10});
	var phone_no_lbl = Ti.UI.createLabel({top:180, left:10});
	var notes_lbl = Ti.UI.createLabel({top:200, left:10});
	var network_lbl = Ti.UI.createLabel({top:220, left:10});
	var arch_lbl = Ti.UI.createLabel({top:240, left:10});
	var registered_lbl = Ti.UI.createLabel({top:260, left:10});
	var device_type_lbl = Ti.UI.createLabel({top:280, left:10});
	var tag_id_lbl = Ti.UI.createLabel({top:300, left:10});
	var checkedout_lbl = Ti.UI.createLabel({top:320, left:10});
	var checkedoutby_lbl = Ti.UI.createLabel({top:340, left:10});
	var checkedouton_lbl = Ti.UI.createLabel({top:360, left:10});
	var useremail_lbl = Ti.UI.createLabel({top:380, left:10});
	var checkedin_lbl = Ti.UI.createLabel({top:400, left:10});
	var checkedinon_lbl = Ti.UI.createLabel({top:420, left:10});
	
	var xhr = Ti.Network.createHTTPClient({
	    onload: function onLoad() {
	        Ti.API.info("Loaded: " + this.status + ": " + this.responseText);
	  
	        var json_resp = this.responseText;
	        var JSONdata = JSON.parse(json_resp);
	        Ti.API.info("Device Count: "+JSONdata.devices.length);
	        for (var i=0;i<JSONdata.devices.length;i++){
	        	var devices = JSONdata.devices[i];
	        	
	        	platform_lbl.text="PLATFORM:    "+devices.platform;
	        	os_ver_lbl.text="OS VER:    "+devices.os_ver;
	        	model_lbl.text="MODEL:    "+devices.model;
	        	name_lbl.text="NAME:    "+devices.name;
	        	make_lbl.text="MAKE:    "+devices.make;
	        	ser_no_lbl.text="SERIAL NO:    "+devices.serial_number;
	        	IMEI_lbl.text="IMEI:    "+devices.IMEI;
	        	phone_no_lbl.text="PHONE NO:    "+devices.phone_no;
	        	notes_lbl.text="NOTES:    "+devices.notes;
	        	network_lbl.text="NETWORK:    "+devices.network;
	        	arch_lbl.text="ARCH:    "+devices.arch;
	        	registered_lbl.text="REGISTERED:    "+devices.registered;
	        	device_type_lbl.text="DEVICE TYPE:    "+devices.devicetype;
	        	tag_id_lbl.text="TAG ID:    "+devices.tag_id;
	        	checkedout_lbl.text="C'ed OUT:    "+devices.checkedout;  
	        	checkedoutby_lbl.text="C'ed OUT BY:    "+devices.checkedout_by;
	        	checkedouton_lbl.text="C'ed OUT ON:    "+devices.checkedout_on;
	        	useremail_lbl.text="USER EMAIL:    "+devices.user_email;	
	        	checkedin_lbl.text="C'ed IN:    "+devices.checkedin;
	        	checkedinon_lbl.text="C'ed IN ON:    "+devices.checkedin_on;
	        }
	    },
	    onerror: function onError() {
	        alert("Errored: " + this.status + ": " + this.responseText);
	    }
	});
	
	xhr.open("GET",links_keys.query_url+'where='+'{'+'"name"'+':'+'"'+devicename+'"'+'}');
	var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
	xhr.setRequestHeader("Authorization", authstr);
	xhr.send();
	
	ok_but.addEventListener('click',function(){
		device_info_win.close();
	});
	
	view.add(name_lbl);
	view.add(seperator);
	view.add(platform_lbl);
	view.add(os_ver_lbl);
	view.add(model_lbl);
	view.add(make_lbl);
	view.add(ser_no_lbl);
	view.add(IMEI_lbl);
	view.add(phone_no_lbl);
	view.add(notes_lbl);
	view.add(network_lbl);
	view.add(arch_lbl);
	view.add(registered_lbl);
	view.add(device_type_lbl);
	view.add(tag_id_lbl);
	view.add(checkedout_lbl);
	view.add(checkedoutby_lbl);
	view.add(checkedouton_lbl);
	view.add(useremail_lbl);
	view.add(checkedin_lbl);
	view.add(checkedinon_lbl);
	view.add(ok_but);
	device_info_win.add(view);
	device_info_win.open();
};
