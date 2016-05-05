var toast = require('utils/toast');
var links_keys = require('utils/links_keys');
var menuitem = require('utils/menuitem');

exports.deletedevice = function(name){
	var devicename = name;
	
	//Function to get the device ID 
	function get_device(devicename){
		var xhr = Ti.Network.createHTTPClient({
		    onload: function onLoad(){ 
		    	Ti.API.info("Loaded: " + this.status + ": " + this.responseText);	
		        var json_resp = this.responseText;
		        var JSONdata = JSON.parse(json_resp);
		        //check if any devices found by checking the devices.length
		        if(JSONdata.devices.length>0){
			        for (var i=0;i<JSONdata.devices.length;i++){
			        	var devices = JSONdata.devices[i];
			        	Ti.API.info('*********'+devices.id);
			        	//Call delete device function
			        	delete_device(devices.id); 
			        }
			     }
			     else{
			     	toast.show_toast('No matching device found in DB',Ti.UI.NOTIFICATION_DURATION_SHORT);
			     }	        	
		    },
		    onerror: function onError() {
		        alert("Errored: " + this.status + ": " + this.responseText);
		    }
		});			
			xhr.open("GET",links_keys.query_url+'where='+'{'+'"name"'+':'+'"'+devicename.toLowerCase()+'"'+'}');
			var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
			xhr.setRequestHeader("Authorization", authstr);
			xhr.send();
	};
	
	//Function to delete the device from the DB	
	function delete_device(deviceID){
		var xhr = Ti.Network.createHTTPClient({
			    onload: function onLoad() {
			        toast.show_toast('Device '+devicename+' deleted successfully',Ti.UI.NOTIFICATION_DURATION_LONG);
			    },
			    onerror: function onError() {
			        alert("Errored: " + this.status + ": " + this.responseText);
			    }
			});
			
			xhr.open("DELETE",links_keys.delete_one_url+deviceID);
			var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
			xhr.setRequestHeader("Authorization", authstr);
			xhr.send();
	}
	
	//Calling the get_device function
	get_device(devicename);
	
};

