var scan = require('utils/scanner');
var toast = require('utils/toast');
var links_keys = require('utils/links_keys');
var menuitem = require('utils/menuitem');

exports.deletedevice = function(){
	//var query_url = "https://fb18656801fcf0c8f4148618f7729e5b03104cb1.cloudapp-enterprise-preprod.appctest.com/api/device/query?";

	var single_del_int_win = Ti.UI.createWindow({title:'Delete a device',layout:'vertical',backgroundImage:'main_bg.jpg'});
	var scan_button = Ti.UI.createButton({title:'Scan QR code on the device',top:10});
	var lbl = Ti.UI.createLabel({text:'                     \n                     OR\n\nEnter Serial No of the device:'});
	var txtfld = Ti.UI.createTextField({top:10, width:300});
	var but = Ti.UI.createButton({title:"Delete",top:20});
	
	var win_placeholder = 'single_del_int_win';
	
	var id = '';
	//function to query for the device using the serial no & get its ID
	function get_device(){
		if(txtfld.value==""){
			alert('Please scan the QR code or manually enter the serial no.');
		}
		else{
			var xhr = Ti.Network.createHTTPClient({
		    onload: function onLoad(){ 
		    	Ti.API.info("Loaded: " + this.status + ": " + this.responseText);
			        		        
				var tabledata = [];			
		        var json_resp = this.responseText;
		        var JSONdata = JSON.parse(json_resp);
		        //check if any devices found by checking the devices.length
		        if(JSONdata.devices.length>0){
			        for (var i=0;i<JSONdata.devices.length;i++){
			        	var devices = JSONdata.devices[i];
			        	Ti.API.info("ID of the device: "+devices.id);
			        	//Delete function called
			        	delete_device(devices.id); 
			        }
			     }
			     else{
			     	txtfld.value="";
			     	toast.show_toast('No matching device found in DB',Ti.UI.NOTIFICATION_DURATION_SHORT);
			     }	        	
		    },
		    onerror: function onError() {
		        alert("Errored: " + this.status + ": " + this.responseText);
		    }
		});			
			xhr.open("GET",links_keys.query_url+'where='+'{'+'"serial_number"'+':'+'"'+txtfld.value.toLowerCase()+'"'+'}');
			var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
			xhr.setRequestHeader("Authorization", authstr);
			xhr.send();
		}
	};
	
	//Function to delete the device from the DB	
	function delete_device(deviceID){
		var xhr = Ti.Network.createHTTPClient({
			    onload: function onLoad() {
			    	//Removing the listener to listen to event fired from scanner
			        Ti.App.removeEventListener('code scanned device delete',callback);
			        toast.show_toast('Device '+txtfld.value+' deleted successfully',Ti.UI.NOTIFICATION_DURATION_SHORT);
			        //setting the text field to empty
			        txtfld.value="";
			    },
			    onerror: function onError() {
			        alert("Errored: " + this.status + ": " + this.responseText);
			        //setting the text field to empty
			        txtfld.value="";
			        //Removing the listener to listen to event fired from scanner
			        Ti.App.removeEventListener('code scanned device delete',callback);
			    }
			});
			
			xhr.open("DELETE",links_keys.delete_one_url+deviceID);
			var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
			xhr.setRequestHeader("Authorization", authstr);
			xhr.send();
	}
	
	var scanned_data=[];
	//callback function for the "code scanned device delete" event listener
	var callback = function(e){
   		scanned_data = e.data;
		txtfld.value = scanned_data[5];	
	};
	
	//event listener for the scan button
	scan_button.addEventListener('click',function(){
		scan.scanner(win_placeholder);
		Ti.App.addEventListener('code scanned device delete',callback);
	});
	
	//event listener for the delete button
	but.addEventListener('click',function(){
		get_device(this.responseText);		      
	});
	
	//Adding the menu items to the window
	menuitem.showmenuitems(single_del_int_win);
	
	single_del_int_win.add(scan_button);
	single_del_int_win.add(lbl);
	single_del_int_win.add(txtfld);
	single_del_int_win.add(but);
	single_del_int_win.open();
};

