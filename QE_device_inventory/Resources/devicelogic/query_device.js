var scan = require('utils/scanner');
var toast = require('utils/toast');
var links_keys = require('utils/links_keys');
var deviceinfo = require('devicelogic/device_info');

exports.query_device = function(window){	
	//UI components for query device window
	var device_query_win = Ti.UI.createWindow({title:"Query Device",backgroundImage:'main_bg.jpg',layout:'vertical'});	
	var scan_but = Ti.UI.createButton({title:"Scan QR code on Device",top:30});		
	var info_lbl = Ti.UI.createLabel({left:15,top:20,text:"                                               OR           \n\n                  Enter the name of the device to search:"});
	var value_txt_fld = Ti.UI.createTextField({top:5,width:200,editable:true});
	var run_query_but =  Ti.UI.createButton({title:'Search',top:10});
	var results_win = Ti.UI.createWindow({title:"Query Results",backgroundImage:'main_bg.jpg'});
	
	var win_placeholder = 'device_query_win';
	
	//Search bar for the table view
	var search = Titanium.UI.createSearchBar({
	    showCancel:true,
	    hintText:'Search',
	    height:45,
	    top:0,
	});
	
	search.addEventListener('change', function(e){
		e.value; // search string as user types
		//listView.searchText = e.value;
	});
		
	search.addEventListener('return', function(e){
		search.blur(); //Blur the search bar when return is hit on the keyboard
	});
		
	search.addEventListener('cancel', function(e){
		search.blur(); //Blur the search bar when cancel is hit on the keyboard
	});
	
	results_win.addEventListener('focus',function(){
		search.blur(); //Blur the search bar when results window is focused
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
	                top:30,left:'80%',width:20,height:20
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
	
	var deviceSection = Ti.UI.createListSection({});
	
	var deviceDataSet = [];
	
	var platform_imageview = Ti.UI.createImageView({});
	var platform_lbl = Ti.UI.createLabel({});
	var os_ver_lbl = Ti.UI.createLabel({});
	var model_lbl = Ti.UI.createLabel({});
	var name_lbl = Ti.UI.createLabel({});
	
	//function for sending request, sends serial no or name
	function send_req(tagid,name){
		//if name = null send serial number in the request
		if(name==null){
			//Emptying the sections & deviceDataSet so that old scan results are cleared from the list view 
			sections = [];
			deviceDataSet = [];
			
			var xhr = Ti.Network.createHTTPClient({
			    onload: function onLoad(){ 
			    	Ti.API.info("Loaded: " + this.status + ": " + this.responseText);		
			        var json_resp = this.responseText;
			        var JSONdata = JSON.parse(json_resp);
			        //check if any devices found by checking the devices.length
			        if(JSONdata.devices.length>0){
				        for (var i=0;i<JSONdata.devices.length;i++){
				        	var devices = JSONdata.devices[i];    	
				        	
				        	if(devices.platform.toLowerCase()=="android"){
				        		platform_imageview.backgroundImage='/images/android.png';
				        	}
				        	else if(devices.platform.toLowerCase()=="windows"){
				        		platform_imageview.backgroundImage='/images/windows.png';
				        	}
				        	else{
				        		platform_imageview.backgroundImage='/images/apple.png';
				        	}
				        	
				        	platform_lbl.text = "PLATFORM:    "+devices.platform;
				        	os_ver_lbl.text = "OS VER:    "+devices.os_ver;
				        	model_lbl.text = "MODEL:    "+devices.model;
				        	name_lbl.text = "NAME:    "+devices.name;
			
							deviceDataSet.push({ platform: {text: platform_lbl.text,height:50}, 
								os_ver: {text: os_ver_lbl.text,height:46}, 
								model: {text: model_lbl.text,height:45}, 
								name: {text: name_lbl.text,height:45}, 
								pic: {image: platform_imageview.backgroundImage},
								properties:{title:devices.name,itemID:devices.name,searchableText:devices.platform+devices.os_ver+devices.model+devices.name,height:140}
							});
							
							deviceSection.setItems(deviceDataSet);
							sections.push(deviceSection);
							listView.setSections(sections);
				          	    		        	
				            //Change the header of the table view	
				        	deviceSection.headerTitle=JSONdata.devices.length+" device/s found";	
				        }
				        //Show toast for the number of devices found   
				        toast.show_toast("Found "+JSONdata.devices.length+" device/s.",Ti.UI.NOTIFICATION_DURATION_SHORT);
				        
				        //removing the event listener after the table view with the results is displayed
						Ti.App.removeEventListener('code scanned device query',callback);						
						//Opening the results window if device is found 
						results_win.add(listView);
						results_win.open({modal:true});
						
				       }
				       else{
				       	Ti.API.info('No device with '+tagid+'found in DB');
				       	toast.show_toast('No device with '+tagid+' found in DB',Ti.UI.NOTIFICATION_DURATION_SHORT);
				       	
				       	//removing the event listener after the table view with the results is displayed
				        Ti.App.removeEventListener('code scanned device query',callback);
				       }			
			    },
			    onerror: function onError() {
			        alert("Errored: " + this.status + ": " + this.responseText);
			    }
			});
				
				xhr.open("GET",links_keys.query_url+'where='+'{'+'"tag_id"'+':'+'"'+tagid+'"'+'}');
				var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
				xhr.setRequestHeader("Authorization", authstr);
				xhr.send();
			}
			//if serial number = null send name from the text field in the request.
			else{
				//Emptying the sections & deviceDataSet so that old scan results are cleared from the list view 
				sections = [];
				deviceDataSet = [];
				
				var xhr = Ti.Network.createHTTPClient({
			    onload: function onLoad(){ 
			    	Ti.API.info("Loaded: " + this.status + ": " + this.responseText);	
			        var json_resp = this.responseText;
			        var JSONdata = JSON.parse(json_resp);
			        //check if any devices found by checking the devices.length
			        if(JSONdata.devices.length>0){
				        for (var i=0;i<JSONdata.devices.length;i++){
				        	var devices = JSONdata.devices[i];    	
				        	
				        	if(devices.platform.toLowerCase()=="android"){
				        		platform_imageview.backgroundImage='/images/android.png';
				        	}
				        	else if(devices.platform.toLowerCase()=="windows"){
				        		platform_imageview.backgroundImage='/images/windows.png';
				        	}
				        	else{
				        		platform_imageview.backgroundImage='/images/apple.png';
				        	}
				        	
				        	platform_lbl.text = "PLATFORM:    "+devices.platform;
				        	os_ver_lbl.text = "OS VER:    "+devices.os_ver;
				        	model_lbl.text = "MODEL:    "+devices.model;
				        	name_lbl.text = "NAME:    "+devices.name;
			
							deviceDataSet.push({ platform: {text: platform_lbl.text,height:50}, 
								os_ver: {text: os_ver_lbl.text,height:46}, 
								model: {text: model_lbl.text,height:45}, 
								name: {text: name_lbl.text,height:45}, 
								pic: {image: platform_imageview.backgroundImage},
								properties:{title:devices.name,itemID:devices.name,searchableText:devices.platform+devices.os_ver+devices.model+devices.name,height:140}
							});
							
							deviceSection.setItems(deviceDataSet);
							sections.push(deviceSection);
							listView.setSections(sections);
				          	    		        	
				            //Change the header of the table view	
				        	deviceSection.headerTitle=JSONdata.devices.length+" device/s found";	
				        }   
				        //Show toast for the number of devices found   
				        toast.show_toast("Found "+JSONdata.devices.length+" device/s.",Ti.UI.NOTIFICATION_DURATION_SHORT);
				        //removing the event listener after the tableview with the results is displayed
						Ti.App.removeEventListener('code scanned device query',callback);
				        //Opening the results window if device is found 
				        results_win.add(listView);
						results_win.open({modal:true});
				       }
				       else{
				       	Ti.API.info('No device with '+name+' found in DB');
				       	toast.show_toast('No device with '+name+' found in DB',Ti.UI.NOTIFICATION_DURATION_SHORT);
				       	//removing the event listener after the tableview with the results is displayed
						Ti.App.removeEventListener('code scanned device query',callback);
				       }
			    },
			    onerror: function onError() {
			        alert("Errored: " + this.status + ": " + this.responseText);
			    }
			});
				
				xhr.open("GET",links_keys.query_url+'where='+'{'+'"name"'+':'+'"'+name+'"'+'}');
				var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
				xhr.setRequestHeader("Authorization", authstr);
				xhr.send();	
			}
	}
	
	var scanned_data = '';
	//callback function for 'code scanned device query' listener.
	var callback = function(e){
   		scanned_data = e.data;
		//sending request with serial no we got from the scanner.
		send_req(scanned_data,null);
	};
	
	scan_but.addEventListener('click',function(){
		scan.scanner(win_placeholder);
		//Add an event listener for the event fired by scanner.js
		Ti.App.addEventListener('code scanned device query',callback);
	});
	
	run_query_but.addEventListener('click',function(){
		if(value_txt_fld.value==""){
			alert('Enter the device name.');
		}
		else{
			//sending request with name from the text field.
			send_req(null,value_txt_fld.value.toLowerCase());
		}
		//emptying the text field after run is hit.
		value_txt_fld.value="";
	});
	
	device_query_win.addEventListener('androidback',function(){
		device_query_win.close();
	});
	
	//Getting device info
	listView.addEventListener('itemclick',function(e){
		var item = deviceSection.getItemAt(e.itemIndex);
		var a = item.name.text;
		var name = a.substring(9);
		deviceinfo.device_info(name);
	});
	
	device_query_win.add(scan_but);
	device_query_win.add(info_lbl);
	device_query_win.add(value_txt_fld);
	device_query_win.add(run_query_but);
	
	//Opening the device_query_win window as modal window.
	device_query_win.open({modal:true});
};
