var toast = require('utils/toast');
var links_keys = require('utils/links_keys');
var deviceinfo = require('devicelogic/device_info');
var editdevice = require('devicelogic/update_device');
var deletedevice = require('devicelogic/delete_device');

exports.get_ios_device = function(){
	var get_ios_device_win = Ti.UI.createWindow({title:"All IOS Devices",backgroundImage:'main_bg.jpg'});
	var tabledata = [];
	
	//Search bar for the table view
	var search = Titanium.UI.createSearchBar({
	    showCancel:true,
	    hintText:'Search',
	    height:45,
	    top:0,
	});
	
	search.addEventListener('change', function(e){
		e.value; // search string as user types
	});
		
	search.addEventListener('return', function(e){
		search.blur(); //Blur the search bar when return is hit on the keyboard
	});
		
	search.addEventListener('cancel', function(e){
		search.blur(); //Blur the search bar when cancel is hit on the keyboard
	});
	
	var myTemplate = {
	    childTemplates: [
	        {                            
	            type: 'Ti.UI.Label',     
	            bindId: 'platform',          
	            properties: {            
	                //color: 'white',
	                font: { fontWeight:'bold' },
	                left: 10, top: 10,
	            }
	        },
	        {                            
	            type: 'Ti.UI.Label',     
	            bindId: 'os_ver',     
	            properties: {           
	                //color: 'white',
	                font: { fontWeight:'bold' },
	                left: 10, top: 30,
	            }
	        },
	        {                           
	            type: 'Ti.UI.Label',     
	            bindId: 'model',          
	            properties: {          
	                //color: 'white',
	                font: { fontWeight:'bold' },
	                left: 10, top: 50,
	            }
	        },
	        {                           
	            type: 'Ti.UI.Label',     
	            bindId: 'name',         
	            properties: {           
	                //color: 'white',
	                left: 10, top: 70,
	            }
	        },
	        {                            
	            type: 'Ti.UI.ImageView', 
	            bindId: 'pic',           
	            properties: {          
	                top:30,left:'70%',width:20,height:20
	            }
	        },
	        {                            
	            type: 'Ti.UI.ImageView', 
	            bindId: 'editpic',           
	            properties: {          
	                top:30,left:'80%',width:20,height:20
	            },
	            //Event listener for edit 
	            events: {
	                longclick: function (e) {
	                    var item = listSection.getItemAt(e.itemIndex);
	                    var b = item.name.text;
						var device_name = b.substring(9);
	                    editdevice.update_device(device_name);
	                }
	            }
	        },
	        {                            
	            type: 'Ti.UI.ImageView', 
	            bindId: 'deletepic',           
	            properties: {          
	                top:30,left:'90%',width:20,height:20
	            },
	            //Event listener for edit 
	            events: {
	               longclick: function (e) {
	                    var item = listSection.getItemAt(e.itemIndex);
	                    var b = item.name.text;
						var device_name = b.substring(9);
						var dialog = Ti.UI.createAlertDialog({
					        title : 'Are you sure want to delete '+device_name+' from DB?',
					        buttonNames : ['Yes','No']
					    });
					    dialog.addEventListener('click', function(e){
					        if(e.index == 0){
					        	//Call the required delete device function & pass the device name as argument to the function
					        	deletedevice.deletedevice(device_name);
					            listSection.deleteItemsAt(e.itemIndex,1);
					        }
					    });
					    dialog.show();
	                }
	            }
	        }
	    ]
	};
	
	var listView = Ti.UI.createListView({
	    templates: { 'template': myTemplate },
	    separatorColor:'yellow',
	    defaultItemTemplate: 'template',
	    searchView: search,
	    caseInsensitiveSearch : true,
	});
	
	var sections = [];
	
	var listSection = Ti.UI.createListSection({});
	
	var listDataSet = [];
	
	var platform_imageview = Ti.UI.createImageView({backgroundImage:'/images/apple.png'});
	var edit_imageview = Ti.UI.createImageView({backgroundImage:'/images/edit.png'});
	var delete_imageview = Ti.UI.createImageView({backgroundImage:'/images/delete.png'});
	var platform_lbl = Ti.UI.createLabel({});
	var os_ver_lbl = Ti.UI.createLabel({});
	var model_lbl = Ti.UI.createLabel({});
	var name_lbl = Ti.UI.createLabel({});
	
	var xhr = Ti.Network.createHTTPClient({
	    onload: function onLoad() {
	        Ti.API.info("Loaded: " + this.status + ": " + this.responseText);
	  
	        var json_resp = this.responseText;
	        var JSONdata = JSON.parse(json_resp);
	        Ti.API.info("Device Count: "+JSONdata.devices.length);
	        for (var i=0;i<JSONdata.devices.length;i++){
	        	var devices = JSONdata.devices[i];    	
	        	
	        	platform_lbl.text = "PLATFORM:    "+devices.platform;
	        	os_ver_lbl.text = "OS VER:    "+devices.os_ver;
	        	model_lbl.text = "MODEL:    "+devices.model;
	        	name_lbl.text = "NAME:    "+devices.name;
	        	
	        	listDataSet.push({ platform: {text: platform_lbl.text,height:50}, 
					os_ver: {text: os_ver_lbl.text,height:46}, 
					model: {text: model_lbl.text,height:45}, 
					name: {text: name_lbl.text,height:45}, 
					pic: {image: platform_imageview.backgroundImage},
					editpic: {image: edit_imageview.backgroundImage},
					deletepic: {image: delete_imageview.backgroundImage},
					properties:{title:devices.name,itemID:devices.name,searchableText:devices.platform+devices.os_ver+devices.model+devices.name,height:140}
					});
				
				listSection.setItems(listDataSet);
				sections.push(listSection);
				listView.setSections(sections);
	        	
	        	//Change the header of the table view	
	        	listSection.headerTitle=JSONdata.devices.length+" iOS device/s found";
	        }   
	        toast.show_toast("Found "+JSONdata.devices.length+" device/s.",Ti.UI.NOTIFICATION_DURATION_SHORT);
	        
	    },
	    onerror: function onError() {
	        alert("Errored: " + this.status + ": " + this.responseText);
	    }
	});
	
	var where ='{"platform":"ios"}';
	xhr.open("GET",links_keys.get_ios_devices_url+where);
	var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
	xhr.setRequestHeader("Authorization", authstr);
	xhr.send();
	
	listView.addEventListener('itemclick',function(e){
		var item = listSection.getItemAt(e.itemIndex);
		var a = item.name.text;
		var name = a.substring(9);
		deviceinfo.device_info(name);
	});

	get_ios_device_win.add(listView);
	get_ios_device_win.open({modal:true});	
};

