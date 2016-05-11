var scan = require('utils/scanner');
var toast = require('utils/toast');
var links_keys = require('utils/links_keys');

exports.create_device = function(){	
	var device_add_win = Ti.UI.createWindow({title:"Add Device",backgroundImage:'main_bg.jpg'});	
	var device_add_scr_view = Ti.UI.createScrollView({width:Ti.UI.FILL,height:Ti.UI.FILL,layout:'vertical'});
	var log_lbl_tagid = Ti.UI.createLabel({top:0,text:'Tag ID:(Make QRcode using this number) '});
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
	var submit = Ti.UI.createButton({top:10,title:'Add'});
	
	function randomNo(min, max){
		return Math.round(Math.random() * (max - min) + min);
	}
	
	tagid_txtfld.addEventListener('focus',function(){
		tagid_txtfld.value = randomNo(1000,50000);
		//alert('Make a bar code for the device with tag id: '+tagid_txtfld.value);
		Ti.API.info(tagid_txtfld.value);
	});
		
	//Add function
	 function add(){
		var xhr = Ti.Network.createHTTPClient({	
		    onload: function onLoad() {
		        Ti.API.info("Loaded: " + this.status + ": " + this.responseText);
		        if((this.status) == 201){
		        	//alert("Device added successfully");
		        	toast.show_toast("Device added successfully",Ti.UI.NOTIFICATION_DURATION_SHORT);
		        	device_add_win.close();
		        }
		    },
		    onerror: function onError() {
		        alert("Errored: " + this.status + ": " + this.responseText); 
		    }
		});		
		xhr.open("POST", links_keys.create_url);
		var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
		xhr.setRequestHeader("Authorization", authstr);
		xhr.setRequestHeader("Content-Type","application/json");
		xhr.send(JSON.stringify({
			"name": name_txtfld.value.toLowerCase(),
			"platform": platform_txtfld.value.toLowerCase(),
			"os_ver": os_ver_txtfld.value.toLowerCase(),
		    "make": make_txtfld.value.toLowerCase(),
		    "model": model_txtfld.value.toLowerCase(),
		    "serial_number": ser_no_txtfld.value.toLowerCase(),
		    "IMEI": IMEI_txtfld.value.toLowerCase(),
		    "phone_no": phoneno_txtfld.value.toLowerCase(),
		    "notes": notes_txtfld.value.toLowerCase(),
		    "network": network_txtfld.value.toLowerCase(),
		    "arch": arch_txtfld.value.toLowerCase(),
			"registered": registered_txtfld.value.toLowerCase(),
			"devicetype": devicetype_txtfld.value.toLowerCase(),
			"tag_id": tagid_txtfld.value
		 }));
	};
			
	//Checks if the scanned device already exists in the DB.
	function check_exists_serial(serial){
			 var xhr = Ti.Network.createHTTPClient({
			    onload: function onLoad() {
			        //alert("Loaded: " + this.status + ": " + this.responseText);
			        Ti.API.info("Loaded: " + this.status + ": " + this.responseText);
			        
			        var json_resp = this.responseText;
			        var JSONdata = JSON.parse(json_resp);
			        Ti.API.info(JSONdata.devices.length);
			        if(JSONdata.devices.length==0){
			        	Ti.API.info(serial+' does not exist****************');
			        	//If device with serial number does not exists already in the DB then check for tag ID
			        	check_exists_tagid(tagid_txtfld.value);
			        }
			        else{
			        	Ti.API.info(serial+' exist, skipped adding to DB******************');
			        	toast.show_toast('Device with the given serial already exists in DB.\nSkipping import',Ti.UI.NOTIFICATION_DURATION_SHORT);
			        }
			    },
			    onerror: function onError() {
			        alert("Errored: " + this.status + ": " + this.responseText);
			    }
			});	
			xhr.open("GET",links_keys.query_url+'where='+'{'+'"'+'serial_number'+'"'+':'+'"'+ser_no_txtfld.value.toLowerCase()+'"'+'}');
			var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
			xhr.setRequestHeader("Authorization", authstr);
			xhr.send();
	};
	
	//Checks if the tag ID of the device already exists in the DB.
	function check_exists_tagid(tagid){
			 var xhr = Ti.Network.createHTTPClient({
			    onload: function onLoad() {
			        //alert("Loaded: " + this.status + ": " + this.responseText);
			        Ti.API.info("Loaded: " + this.status + ": " + this.responseText);
			        
			        var json_resp = this.responseText;
			        var JSONdata = JSON.parse(json_resp);
			        Ti.API.info(JSONdata.devices.length);
			        if(JSONdata.devices.length==0){
			        	Ti.API.info(tagid+' does not exist****************');
			        	add();
			        }
			        else{
			        	Ti.API.info(tagid+' exist, skipped adding to DB******************');
			        	toast.show_toast('Device with given tag id already exists in DB. Please generate a different tag id.\nSkipping import',Ti.UI.NOTIFICATION_DURATION_SHORT);
			        }
			    },
			    onerror: function onError() {
			        alert("Errored: " + this.status + ": " + this.responseText);
			    }
			});	
			xhr.open("GET",links_keys.query_url+'where='+'{'+'"'+'tag_id'+'"'+':'+'"'+tagid_txtfld.value+'"'+'}');
			var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
			xhr.setRequestHeader("Authorization", authstr);
			xhr.send();
	};

	//Event listener for the Add button
	submit.addEventListener('click',function(){
		//Check if any of the textfield's is empty
		if((tagid_txtfld.value&&devicetype_txtfld.value&&name_txtfld.value&&platform_txtfld.value&&os_ver_txtfld.value&&make_txtfld.value&&model_txtfld.value&&ser_no_txtfld.value&&IMEI_txtfld.value&&phoneno_txtfld.value&&network_txtfld.value&&arch_txtfld.value&&notes_txtfld.value&&registered_txtfld.value)==''){
			alert('Please fill in all details.\nPut N/A where ever applicable.');
		}
		else{
			//Calling the check_exists function
			check_exists_serial(ser_no_txtfld.value);
			}		
	});

	device_add_scr_view.add(log_lbl_tagid);
	device_add_scr_view.add(tagid_txtfld);
	device_add_scr_view.add(log_lbl_devicetype);
	device_add_scr_view.add(devicetype_txtfld);	
	device_add_scr_view.add(log_lbl_name);
	device_add_scr_view.add(name_txtfld);	
	device_add_scr_view.add(log_lbl_platform);
	device_add_scr_view.add(platform_txtfld);
	device_add_scr_view.add(log_lbl_os_ver);
	device_add_scr_view.add(os_ver_txtfld);
	device_add_scr_view.add(log_lbl_make);
	device_add_scr_view.add(make_txtfld);
	device_add_scr_view.add(log_lbl_model);
	device_add_scr_view.add(model_txtfld);
	device_add_scr_view.add(log_lbl_ser_no);
	device_add_scr_view.add(ser_no_txtfld);
	device_add_scr_view.add(log_lbl_IMEI);
	device_add_scr_view.add(IMEI_txtfld);
	device_add_scr_view.add(log_lbl_phoneno);
	device_add_scr_view.add(phoneno_txtfld);
	device_add_scr_view.add(log_lbl_notes);
	device_add_scr_view.add(notes_txtfld);
	device_add_scr_view.add(log_lbl_network);
	device_add_scr_view.add(network_txtfld);
	device_add_scr_view.add(log_lbl_arch);
	device_add_scr_view.add(arch_txtfld);
	device_add_scr_view.add(log_lbl_registered);
	device_add_scr_view.add(registered_txtfld);
	device_add_scr_view.add(submit);
	device_add_win.add(device_add_scr_view);
	device_add_win.open({modal:true});
};

