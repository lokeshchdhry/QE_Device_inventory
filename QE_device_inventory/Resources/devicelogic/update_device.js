var links_keys = require('utils/links_keys');
var toast = require('utils/toast');

exports.update_device = function(name){
	var device_edit_win = Ti.UI.createWindow({title:"Edit Device",backgroundImage:'main_bg.jpg'});
	var device_edit_scr_view = Ti.UI.createScrollView({width:Ti.UI.FILL,height:Ti.UI.FILL,layout:'vertical'});
	var log_lbl_tagid = Ti.UI.createLabel({top:0,text:'Tag ID (Not Editable):'});
	var tagid_txtfld = Ti.UI.createTextField({top:0,width:200,editable:false});
	var log_lbl_devicetype = Ti.UI.createLabel({top:10,text:'Device Type: '});
	var devicetype_txtfld = Ti.UI.createTextField({top:0,width:200});
	var log_lbl_name = Ti.UI.createLabel({top:10,text:'Name: '});
	var name_txtfld = Ti.UI.createTextField({top:0,width:200});		
	var log_lbl_platform = Ti.UI.createLabel({top:10,text:'Platform: '});
	var platform_txtfld = Ti.UI.createTextField({top:0,width:200});
	var log_lbl_os_ver = Ti.UI.createLabel({top:10,text:'OS.Ver: '});
	var os_ver_txtfld = Ti.UI.createTextField({top:0,width:200});
	var log_lbl_make = Ti.UI.createLabel({top:10,text:'Make: '});
	var make_txtfld = Ti.UI.createTextField({top:0,width:200});
	var log_lbl_model = Ti.UI.createLabel({top:10,text:'Model: '});
	var model_txtfld = Ti.UI.createTextField({top:0,width:200});
	var log_lbl_ser_no = Ti.UI.createLabel({top:10,text:'Ser No: '});
	var ser_no_txtfld = Ti.UI.createTextField({top:0,width:200});
	var log_lbl_IMEI = Ti.UI.createLabel({top:10,text:'IMEI: '});
	var IMEI_txtfld = Ti.UI.createTextField({top:0,width:200});
	var log_lbl_phoneno = Ti.UI.createLabel({top:10,text:'Phone No: '});
	var phoneno_txtfld = Ti.UI.createTextField({top:0,width:200});
	var log_lbl_network = Ti.UI.createLabel({top:10,text:'Network: '});
	var network_txtfld = Ti.UI.createTextField({top:0,width:200});
	var log_lbl_arch = Ti.UI.createLabel({top:10,text:'Arch: '});
	var arch_txtfld = Ti.UI.createTextField({top:0,width:200});
	var log_lbl_notes = Ti.UI.createLabel({top:10,text:'Notes: '});
	var notes_txtfld = Ti.UI.createTextField({top:0,width:200});
	var log_lbl_registered = Ti.UI.createLabel({top:10,text:'Registered(Date): '});
	var registered_txtfld = Ti.UI.createTextField({top:0,width:200});
	var log_lbl_checkedout = Ti.UI.createLabel({top:10,text:'Checked Out (Not Editable): '});
	var checkedout_txtfld = Ti.UI.createTextField({top:0,width:200,editable:false});
	var log_lbl_checkedoutby = Ti.UI.createLabel({top:10,text:'Checked Out By (Not Editable): '});
	var checkedoutby_txtfld = Ti.UI.createTextField({top:0,width:200,editable:false});
	var log_lbl_checkedouton = Ti.UI.createLabel({top:10,text:'Checked Out On (Not Editable): '});
	var checkedouton_txtfld = Ti.UI.createTextField({top:0,width:200,editable:false});
	var log_lbl_useremail = Ti.UI.createLabel({top:10,text:'User Email (Not Editable): '});
	var useremail_txtfld = Ti.UI.createTextField({top:0,width:200,editable:false});
	var log_lbl_checkedin = Ti.UI.createLabel({top:10,text:'Checked In (Not Editable): '});
	var checkedin_txtfld = Ti.UI.createTextField({top:0,width:200,editable:false});
	var log_lbl_checkedinon = Ti.UI.createLabel({top:10,text:'Checked In On (Not Editable): '});
	var checkedinon_txtfld = Ti.UI.createTextField({top:0,width:200,editable:false});
	var submit = Ti.UI.createButton({top:10,title:'Done'});
	
	//Variable to store DB ID of the device to edit
	var dbid = '';
	
	//Checks if the device already exists in the DB.
	function check_exists_device(name){
			 var xhr = Ti.Network.createHTTPClient({
			    onload: function onLoad() {
			        //alert("Loaded: " + this.status + ": " + this.responseText);
			        Ti.API.info("Loaded: " + this.status + ": " + this.responseText);
			        
			        var json_resp = this.responseText;
			        var JSONdata = JSON.parse(json_resp);
			        Ti.API.info(JSONdata.devices.length);
			        if(JSONdata.devices.length==0){
			        	Ti.API.info('Device '+name+' does not exist in DB****************');
			        	toast.show_toast('Device with name '+name+' does not exist in DB',Ti.UI.NOTIFICATION_DURATION_SHORT);
			        }
			        else{
			        	Ti.API.info('Device '+name+' exist in DB******************');
			        	for (var i=0;i<JSONdata.devices.length;i++){
		        			var devices = JSONdata.devices[i];
				        	//Filling the text fields with the device data we got after the search
				        	dbid = devices.id;
				        	tagid_txtfld.value = devices.tag_id;
				        	name_txtfld.value = devices.name;
				        	platform_txtfld.value = devices.platform;
				        	os_ver_txtfld.value = devices.os_ver;
				        	make_txtfld.value = devices.make;
				        	model_txtfld.value = devices.model;
				        	ser_no_txtfld.value = devices.serial_number;
				        	IMEI_txtfld.value  = devices.IMEI;
				        	phoneno_txtfld.value = devices.phone_no;
				        	notes_txtfld.value = devices.notes;
				        	network_txtfld.value = devices.network;
				        	arch_txtfld.value = devices.arch;
				        	registered_txtfld.value = devices.registered;
				        	devicetype_txtfld.value = devices.devicetype;
				        	checkedout_txtfld.value = devices.checkedout;
				        	checkedoutby_txtfld.value = devices.checkedout_by;
				        	checkedouton_txtfld.value = devices.checkedout_on;
				        	useremail_txtfld.value = devices.user_email;
				        	checkedin_txtfld.value = devices.checkedin;
				        	checkedinon_txtfld.value = devices.checkedin_on;			        	
				        }
			        }
			    },
			    onerror: function onError() {
			        alert("Errored: " + this.status + ": " + this.responseText);
			    }
			});	
			xhr.open("GET",links_keys.query_url+'where='+'{'+'"'+'name'+'"'+':'+'"'+name.toLowerCase()+'"'+'}');
			var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
			xhr.setRequestHeader("Authorization", authstr);
			xhr.send();
	};
	
	//Function to update the device in DB
	function update_device(dbid,name,platform,os_ver,make,model,serialno,IMEI,phoneno,notes,network,arch,registered,devicetype,tagid,checkedout,user,checkedouton,useremail,checkedin,checkedinon){
		var xhr = Ti.Network.createHTTPClient({
		    onload: function onLoad() {
		        Ti.API.info("Loaded: " + this.status + ": " + this.responseText);
		        toast.show_toast('Device with name '+name+' edited successfully',Ti.UI.NOTIFICATION_DURATION_SHORT);
		    },
		    onerror: function onError() {
		        alert("Errored: " + this.status + ": " + this.responseText);
		    }
		});
		
		xhr.open("PUT", links_keys.update_device_url+dbid);
		var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
		xhr.setRequestHeader("Authorization", authstr);
		xhr.setRequestHeader("Content-Type","application/json");
		xhr.send(JSON.stringify({
		    "name": name.toLowerCase(),
		    "platform": platform.toLowerCase(),
		    "os_ver": os_ver.toLowerCase(),
		    "make": make.toLowerCase(),
		    "model": model.toLowerCase(),
		    "serial_number": serialno.toLowerCase(),
		    "IMEI": IMEI.toLowerCase(),
		    "phone_no": phoneno.toLowerCase(),
		    "notes": notes.toLowerCase(),
		    "network": network.toLowerCase(),
		    "arch": arch.toLowerCase(),
		    "registered": registered.toLowerCase(),
		    //"inventoried": inventoried,
		    "devicetype": devicetype.toLowerCase(),
		    "tag_id": tagid.toLowerCase(),
		    "checkedout": checkedout.toLowerCase(),
		    "checkedout_by": user.toLowerCase(),
		    "checkedout_on": checkedouton,
		    "user_email": useremail.toLowerCase(),
		    "checkedin": checkedin.toLowerCase(),
		    "checkedin_on": checkedinon
		}));
	}
	
	//Call the check function to check if device exists in the DB
	check_exists_device(name);
	
	submit.addEventListener('click',function(){
		update_device(dbid,name_txtfld.value,platform_txtfld.value,os_ver_txtfld.value,make_txtfld.value,model_txtfld.value,ser_no_txtfld.value,IMEI_txtfld.value,phoneno_txtfld.value,notes_txtfld.value,network_txtfld.value,arch_txtfld.value,registered_txtfld.value,devicetype_txtfld.value,tagid_txtfld.value,checkedout_txtfld.value,checkedoutby_txtfld.value,checkedouton_txtfld.value,useremail_txtfld.value,checkedin_txtfld.value,checkedinon_txtfld.value);
		//Close the edit window after hitting done button
		device_edit_win.close();
	});
	
	//device_add_view.add(warn_label);
	device_edit_scr_view.add(log_lbl_tagid);
	device_edit_scr_view.add(tagid_txtfld);
	device_edit_scr_view.add(log_lbl_devicetype);
	device_edit_scr_view.add(devicetype_txtfld);	
	device_edit_scr_view.add(log_lbl_name);
	device_edit_scr_view.add(name_txtfld);	
	device_edit_scr_view.add(log_lbl_platform);
	device_edit_scr_view.add(platform_txtfld);
	device_edit_scr_view.add(log_lbl_os_ver);
	device_edit_scr_view.add(os_ver_txtfld);
	device_edit_scr_view.add(log_lbl_make);
	device_edit_scr_view.add(make_txtfld);
	device_edit_scr_view.add(log_lbl_model);
	device_edit_scr_view.add(model_txtfld);
	device_edit_scr_view.add(log_lbl_ser_no);
	device_edit_scr_view.add(ser_no_txtfld);
	device_edit_scr_view.add(log_lbl_IMEI);
	device_edit_scr_view.add(IMEI_txtfld);
	device_edit_scr_view.add(log_lbl_phoneno);
	device_edit_scr_view.add(phoneno_txtfld);
	device_edit_scr_view.add(log_lbl_notes);
	device_edit_scr_view.add(notes_txtfld);
	device_edit_scr_view.add(log_lbl_network);
	device_edit_scr_view.add(network_txtfld);
	device_edit_scr_view.add(log_lbl_arch);
	device_edit_scr_view.add(arch_txtfld);
	device_edit_scr_view.add(log_lbl_registered);
	device_edit_scr_view.add(registered_txtfld);
	// device_edit_scr_view.add(log_lbl_checkedout);
	// device_edit_scr_view.add(checkedout_txtfld);
	// device_edit_scr_view.add(log_lbl_checkedoutby);
	// device_edit_scr_view.add(checkedoutby_txtfld);
	// device_edit_scr_view.add(log_lbl_checkedouton);
	// device_edit_scr_view.add(checkedouton_txtfld);
	// device_edit_scr_view.add(log_lbl_useremail);
	// device_edit_scr_view.add(useremail_txtfld);
	// device_edit_scr_view.add(log_lbl_checkedin);
	// device_edit_scr_view.add(checkedin_txtfld);
	// device_edit_scr_view.add(log_lbl_checkedinon);
	// device_edit_scr_view.add(checkedinon_txtfld);
	device_edit_scr_view.add(submit);
	device_edit_win.add(device_edit_scr_view);
	device_edit_win.open({modal:true});
};
