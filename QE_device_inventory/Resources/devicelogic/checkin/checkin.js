var Cloud = require('ti.cloud');
var scan = require('utils/scanner');
var date = require('utils/getdate');
var links_keys = require('utils/links_keys');
var toast = require('utils/toast');


exports.device_checkin=function(){
	var checkin_win = Ti.UI.createWindow({title:'Device Checkin',backgroundImage:'main_bg.jpg',layout:'vertical'});
	var info_lbl2 = Ti.UI.createLabel({left:40,right:40,top:20,text:'Scan the QR code on the device & the device will be automatically checked in.',font:{fontWeight:"bold"}});
	var scan_but2 = Ti.UI.createButton({width:200,height:100,title:'Scan QR code on the device', top:50});
	
	var win_placeholder2 = 'checkin_win_deviceinfo';
	
	//Initialize variables to null
	var checked_in = '';
	var checkin_date = '';
	var checked_out = ''; 
	var checkout_date = '';
	var user = '';
	var user_email = '';
	
	var update_name= '';
	var update_platform= '';
	var update_os_ver= '';
	var update_make= '';
	var update_model= '';
	var update_serial_number= '';
	var update_IMEI= '';
	var update_phone_no= '';
	var update_notes= '';
	var update_network= '';
	var update_arch= '';
	var update_registered= ''; 
	var update_inventoried= '';
	var update_devicetype= '';
	var update_tag_id= '';
	var update_checkedout_by='';
	var update_user_email= '';
	var update_checked_in= '';
	var update_checkedin_on= '';
	var DBID= '';

	//Scanned data array for device & the callback function for it
	var scanned_data2;
	var callback2 = function(e){
   		//Assign the obtained device tag id to scanned data 2 variable
   		scanned_data2 = e.data;
   		//Check of the device is scanned if not then alert the user.
   		if(scanned_data2==''){
   			alert('Please scan the QR code on the device.');
   			Ti.App.removeEventListener('checkin code scanned device info',callback2);
   		}
   		//If the device is scanned continue
   		else{				
			//Call the check in function
			checkin(scanned_data2);
			}
	};
	
	scan_but2.addEventListener('click',function(){
			scan.scanner(win_placeholder2);
			Ti.App.addEventListener('checkin code scanned device info',callback2);
	});
	
	
	function checkin(tagid){
	//First get device info
		var xhr = Ti.Network.createHTTPClient({
		    onload: function onLoad() {
		        Ti.API.info("Loaded: " + this.status + ": " + this.responseText);
		        
		        var json_resp = this.responseText;
		        var JSONdata = JSON.parse(json_resp);
		        Ti.API.info(JSONdata.devices.length);
		        if(JSONdata.devices.length==0){
		        	Ti.API.info(tagid+' does not exist****************');
		        	toast.show_toast('Device does not exists in DB.',Ti.UI.NOTIFICATION_DURATION_SHORT);
		        	Ti.App.removeEventListener('checkin code scanned device info',callback2);
		        	//scan_done_tick2.show();
		        }
		        else{
		        	//If it exists in DB
		        	Ti.API.info(tagid+' exist in DB******************');
		        	for (var i=0;i<JSONdata.devices.length;i++){
		        		var devices = JSONdata.devices[i];
		        		//Assigning variables values which are not going to change to original values
		        		update_name=devices.name;
		        		update_platform=devices.platform;
		        		update_os_ver=devices.os_ver;
		        		update_make=devices.make;
		        		update_model=devices.model;
		        		update_serial_number=devices.serial_number;
		        		update_IMEI=devices.IMEI;
		        		update_phone_no=devices.phone_no;
		        		update_notes=devices.notes;
		        		update_network=devices.network;
		        		update_arch=devices.arch;
		        		update_registered=devices.registered;
		        		update_inventoried=devices.inventoried;
		        		update_devicetype=devices.devicetype;
		        		update_tag_id=devices.tag_id;
		        		update_user_email=devices.user_email;
		        		
		        		DBID=devices.id;
		        		//Checking if the device is already checked out by checking the checked out field.
		        		if(devices.checkedin=='true'){
		        			toast.show_toast('You can not checkin this device as it is already checked in.',Ti.UI.NOTIFICATION_DURATION_SHORT);
		        			Ti.App.removeEventListener('checkin code scanned device info',callback2);
		        		}
		        		//If the device is not checked out then do this
		        		else{     			
		        			checked_out = 'false';
		        			user = 'NA';
		        			checkout_date = 'NA';
		        			email = 'NA';
		        			checked_in = 'true';
		        			checkedin_on = date.getDate();
							//Calling the update device function
		        			update_device(DBID,update_name,update_platform,update_os_ver,update_make,update_model,update_serial_number,update_IMEI,update_phone_no,update_notes,update_network,update_arch,update_registered,update_inventoried,update_devicetype,update_tag_id,checked_out,user,checkout_date,email,checked_in,checkedin_on);
		        			//Sending check in email to user who checked out the device
		        			checkin_email('checkin_template',update_user_email,update_checkedout_by,update_name,update_model,update_platform,update_os_ver);
		        			//Sending check in email to administrator
		        			checkin_email('checkin_template_admin','lchoudhary@appcelerator.com','Lokesh',update_name,update_model,update_platform,update_os_ver);
		        			Ti.App.removeEventListener('checkin code scanned device info',callback2);
		        		}
		        	}    
		        }
		    },
		    onerror: function onError() {
		        alert("Errored: " + this.status + ": " + this.responseText);
		        Ti.App.removeEventListener('code scanned user scan',callback2);
		    }
		});	
		xhr.open("GET",links_keys.query_url+'where='+'{'+'"'+'tag_id'+'"'+':'+'"'+tagid+'"'+'}');
		var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
		xhr.setRequestHeader("Authorization", authstr);
		xhr.send();
	}
	
	function update_device(dbid,name,platform,os_ver,make,model,serialno,IMEI,phoneno,notes,network,arch,registered,inventoried,devicetype,tagid,checkedout,user,checkedouton,useremail,checkedin,checkedinon){
		var xhr = Ti.Network.createHTTPClient({
		    onload: function onLoad() {
		        Ti.API.info("Loaded: " + this.status + ": " + this.responseText);
		        if(this.status=='204'){
		        	toast.show_toast("Device "+name+" checked in successfully.",Ti.UI.NOTIFICATION_DURATION_SHORT);
		        }
		        else{
		        	alert('Please check for Status: '+this.status);
		        }
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
		    "model": model,
		    "serial_number": serialno,
		    "IMEI": IMEI,
		    "phone_no": phoneno,
		    "notes": notes,
		    "network": network,
		    "arch": arch,
		    "registered": registered,
		    "inventoried": inventoried,
		    "devicetype": devicetype,
		    "tag_id": tagid,
		    "checkedout": checkedout,
		    "checkedout_by": user,
		    "checkedout_on": checkedouton,
		    "user_email": useremail,
		    "checkedin": checkedin,
		    "checkedin_on": checkedinon
		}));
	}
	
	function checkin_email(template,email,user,devicename,device,running_platform,device_os_ver){
		Cloud.Emails.send({
		    template: template,
		    recipients: email,
		    first_name: user,
		    device_name : devicename,
		    device : device,
		    running_platform : running_platform,
		    device_os_ver : device_os_ver
		}, function (e) {
		    if (e.success) {
		        Ti.API.info('Checkin email sent to '+email);			             
		    } else {
		        alert('Error:\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	}
	
	checkin_win.add(info_lbl2);
	checkin_win.add(scan_but2);
	//checkin_win.add(scan_done_tick2);
	checkin_win.open({modal:true});
};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   