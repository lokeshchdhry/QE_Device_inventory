var toast = require('utils/toast');
var links_keys = require('utils/links_keys');
var deviceinfo = require('devicelogic/device_info');

exports.get_checkedout_devices = function(){	
	var win = Ti.UI.createWindow({title:"Checked Out Devices",backgroundImage:'main_bg.jpg'});
	
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
	
	win.addEventListener('focus',function(){
		search.blur(); //Blur the search bar when window is focused
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
	
	var listSection = Ti.UI.createListSection({});
	
	var listDataSet = [];
	
	var platform_imageview = Ti.UI.createImageView({});
	var platform_lbl = Ti.UI.createLabel({});
	var os_ver_lbl = Ti.UI.createLabel({});
	var model_lbl = Ti.UI.createLabel({});
	var name_lbl = Ti.UI.createLabel({});
	
	function getdata(){
		var xhr = Ti.Network.createHTTPClient({
		    onload: function onLoad() {
		        Ti.API.info("Loaded: " + this.status + ": " + this.responseText);
		  
		        var json_resp = this.responseText;
		        var JSONdata = JSON.parse(json_resp);
		        Ti.API.info("Device Count: "+JSONdata.devices.length);
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
	
					listDataSet.push({ platform: {text: platform_lbl.text,height:50}, 
						os_ver: {text: os_ver_lbl.text,height:46}, 
						model: {text: model_lbl.text,height:45}, 
						name: {text: name_lbl.text,height:45}, 
						pic: {image: platform_imageview.backgroundImage},
						properties:{title:devices.name,itemID:devices.name,searchableText:devices.platform+devices.os_ver+devices.model+devices.name,height:140}
						});
					
					listSection.setItems(listDataSet);
					sections.push(listSection);
					listView.setSections(sections);
		        	
		        	 //Change the header of the table view	
		        	listSection.headerTitle=JSONdata.devices.length+" device/s found";	
		        }   
		        toast.show_toast("Found "+JSONdata.devices.length+" device/s.",Ti.UI.NOTIFICATION_DURATION_SHORT);
		        
		    },
		    onerror: function onError() {
		        alert("Errored: " + this.status + ": " + this.responseText);
		    }
		});
		
		xhr.open("GET",links_keys.query_url+'where='+'{'+'"checkedout"'+':'+'"'+true+'"'+'}');
		var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
		xhr.setRequestHeader("Authorization", authstr);
		xhr.send();
	}
	
	listView.addEventListener('itemclick',function(e){
		var item = listSection.getItemAt(e.itemIndex);
		var a = item.name.text;
		var name = a.substring(9);
		deviceinfo.device_info(name);
	});
	
	//getting the windows activity for the menu item
	var activity = win.activity;

	activity.onCreateOptionsMenu = function(e){
	  var menu = e.menu;
	  var refresh = menu.add({
	    title: "Refresh",
	    itemID: refresh,
	    icon:  "/images/refresh.png",
	    showAsAction: Titanium.Android.SHOW_AS_ACTION_ALWAYS
	  });
	  
	  refresh.addEventListener("click", function(e) {
	  	   //Empty the list data set so that the list view can be reloaded
			listDataSet = [];
			//Calling get data function to get data from DB
			getdata();
	  });
	};
	
	//Calling get data function to get data from DB & display it when the get android devices button is clicked
	getdata();
	
	win.add(listView);
	win.open({modal:true});	
};