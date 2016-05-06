var Cloud = require('ti.cloud');
var scan = require('utils/scanner');
var date = require('utils/getdate');
var links_keys = require('utils/links_keys');
var toast = require('utils/toast');

exports.device_checkout = function(){
	var checkout_win = Ti.UI.createWindow({title:'Device Checkout',backgroundImage:'main_bg.jpg'});
	var info_lbl1 = Ti.UI.createLabel({left:15,top:40,text:'Step 1: ',font:{fontWeight:"bold"}});
	var scan_but1 = Ti.UI.createButton({width:200,height:80,left:70,title:'Scan QR code on your employee badge', top:25});
	var scan_done_tick1 = Ti.UI.createImageView({top:55,image:'/images/ok.png',right:110,width:20,height:20});
	var info_lbl2 = Ti.UI.createLabel({left:15,top:140,text:'Step 2: ',font:{fontWeight:"bold"}});
	var scan_but2 = Ti.UI.createButton({width:200,height:80,left:70,title:'Scan QR code on the device', top:125});
	var scan_done_tick2 = Ti.UI.createImageView({top:160,image:'/images/ok.png',right:110,width:20,height:20});
	var info_lbl3 = Ti.UI.createLabel({left:30,top:250,font:{fontWeight:"bold"}});
	var checkout_but = Ti.UI.createButton({title:'checkout', top:300});
	
	var win_placeholder1 = 'checkout_win_userbatch';
	var win_placeholder2 = 'checkout_win_deviceinfo';
	
	//Initialize variables to null
	var user = '';
	var dept = '';
	var email = '';
	var user_type = '';
	var checked_out = '';
	var checkout_date = '';
	
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
	var update_checked_in= '';
	var update_checkedin_on= '';
	var DBID= '';
	
	
	//hide ticks, info label & checkout button initially
	scan_done_tick1.hide();
	scan_done_tick2.hide();
	info_lbl3.hide();
	checkout_but.hide();
	
	//Scanned data array for employee batch & the callback function for it
	var scanned_data1=[];
	var a='';
	var callback1 = function(e){
		scanned_data1 = e.data;
		a = scanned_data1.split(",");
		//if the batch scanned is not of a employee then alert the user to first scan the employee batch
		if(a[3]!='staff'){
			alert('Please scan your employee badge first.');
			Ti.App.removeEventListener('code scanned user scan',callback1);
		}
		//if employee batch is scanned then continue
		else{
			user = a[0];
			email = a[1];
			dept = a[2];
			user_type = a[3];		
			//show the first tick after employee batch is scanned successfully
			scan_done_tick1.show();
			Ti.App.removeEventListener('code scanned user scan',callback1);
		}	
	};
	
	//Scanned data array for device & the callback function for it
	var scanned_data2;
	var callback2 = function(e){
		//Assign the obtained device tag id to scanned data 2 variable
   		scanned_data2 = e.data;
   		//Check of the device is scanned if not then alert the user.
   		if(scanned_data2==''){
   			alert('Please scan the barcode code on the device.');
   			Ti.App.removeEventListener('code scanned device info',callback2);
   		}
   		//If the device is scanned continue
   		else{				
			//Show the second tick of the device is scanned successfully.
			scan_done_tick2.show();
			//Set the text for the info label
			info_lbl3.text = 'Hello '+user+' ,\nTo checkout device press the checkout button below.';
			//Show the info label
			info_lbl3.show();
			//Show the checkout button
			checkout_but.show();
			//Ti.App.removeEventListener('code scanned device info',callback2);
			}
		};
	
	
	
	scan_but1.addEventListener('click',function(){
		scan.scanner(win_placeholder1);
		Ti.App.addEventListener('code scanned user scan',callback1);	
	});
	
	scan_but2.addEventListener('click',function(){
		if(a[0]==undefined){
			alert('Please scan employee batch first.');
		}
		else{
			scan.scanner(win_placeholder2);
			Ti.App.addEventListener('code scanned device info',callback2);
		}
	});
	
	function checkout(tagid){
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
		        	Ti.App.removeEventListener('code scanned device info',callback2);
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
		        		update_checked_in=devices.checked_in;
		        		update_checkedin_on=devices.checkedin_on;
		        		
		        		DBID=devices.id;
		        		//Checking if the device is already checked out by checking the checked out field.
		        		if(devices.checkedout=='true'){
		        			toast.show_toast('You can not checkout this device as it is already checked out.',Ti.UI.NOTIFICATION_DURATION_SHORT);
		        			Ti.App.removeEventListener('code scanned device info',callback2);
		        		}
		        		//If the device is not checked out then do this
		        		else{
		        			checked_out='true';
		        			update_checked_in = 'false';
		        			checkout_date = date.getDate();
		        			update_checkedin_on = 'NA';
		        			//Call update device function
		        			update_device(DBID,update_name,update_platform,update_os_ver,update_make,update_model,update_serial_number,update_IMEI,update_phone_no,update_notes,update_network,update_arch,update_registered,update_inventoried,update_devicetype,update_tag_id,checked_out,user,checkout_date,email,update_checked_in,update_checkedin_on);
		        			//Send checkout email
		        			checkout_email('checkout_template',email,user,update_name,update_model,update_platform,update_os_ver);
		        			//Send checkout email to Administrator
		        			checkout_email('checkout_template_admin','lchoudhary@appcelerator.com','Lokesh',update_name,update_model,update_platform,update_os_ver);
		        			Ti.App.removeEventListener('code scanned device info',callback2);
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
		    "name": name,
		    "platform": platform,
		    "os_ver": os_ver,
		    "make": make,
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
	
	function checkout_email(template,email,user,devicename,device,running_platform,device_os_ver){
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
		        Ti.API.info('Checkout email sent to '+email);			        
		        var info_alert = Ti.UI.createAlertDialog({
		        	message:'You will be receiving a checkout email shortly at '+email,
		        	ok:'Ok',
		        	title:'Device checkout successfull'
		        	});		        	
		        	info_alert.show(); 
		        	info_alert.addEventListener('click',function(){
		        		checkout_win.close();
		        	});		        	      
		    } else {
		        alert('Error:\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	}
	
	
	checkout_but.addEventListener('click',function(){
		//After hitting checkout check if device is already checked out if no then checkout the device & send an email to the user
		//passing the tag id of the device obtained inside scanned_data2 variable after scanning device.
		checkout(scanned_data2);	
	});
	
	checkout_win.add(info_lbl1);
	checkout_win.add(scan_but1);
	checkout_win.add(scan_done_tick1);
	checkout_win.add(info_lbl2);
	checkout_win.add(scan_but2);
	checkout_win.add(scan_done_tick2);
	checkout_win.add(info_lbl3);
	checkout_win.add(checkout_but);
	checkout_win.open({modal:true});
};
