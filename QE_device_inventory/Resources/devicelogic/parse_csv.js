var toast = require('utils/toast');
var links_keys = require('utils/links_keys');

exports.parsecsv=function(){	
	var main_parse_win = Ti.UI.createWindow({
		title:"Import CSV File",
		backgroundImage:'main_bg.jpg',
		layout:'vertical'
	});
	
	var parse_button = Ti.UI.createButton({
		title:"Parse CSV file",
		top:30,
		height:100,
	});
	
	var parse_lbl = Ti.UI.createLabel({
		top:20,
		text:"This will download & parse the CSV file.\nIt will also update the database automatically."
	});
	
	var tabledata = [];
	var log_tbl_view = Ti.UI.createTableView({top:100,width:Ti.UI.Fill,separatorColor:'black',data:tabledata,backgroundColor:'white'});
	
	function createrow(lbltext){
		var row = Ti.UI.createTableViewRow({className:'logtbl',height:50});
    	var log_lbl = Ti.UI.createLabel({left:5,text:lbltext,color:'black'});
    	row.add(log_lbl);
    	tabledata.push(row);
	};
	
	var count=0;
	//This function will add devices returned by check_exists() function to DB.
	function add_device(name,platform,os_ver,make,model,serialno,IMEI,phone_no,notes,network,arch,registered,devicetype,tag_id,checkedout,checkedout_by,checkedout_on,user_email,checkedin,checkedin_on){
		var xhr = Ti.Network.createHTTPClient({
			    onload: function onLoad() {
			        Ti.API.info("Loaded: " + this.status + ": " + this.responseText);
			        if((this.status) == 201){
			        	Ti.API.info("Device "+name+" with platform "+platform+" & SerialNo "+serialno+" added successully");			        	
			        	count++;
			        	//Creating row for log table view
			        	createrow(count+'. Device "'+name+'" with platform "'+platform+'" added to DB.');
			        }
			        log_tbl_view.data=tabledata;
			        //toast.show_toast(count+' devices added to DB',Ti.UI.NOTIFICATION_DURATION_SHORT);
			        Ti.API.info(count+' devices added to DB');
			        toast.show_toast(count+' device/s added.',Ti.UI.NOTIFICATION_DURATION_SHORT);
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
				"name": name.toLowerCase(),
				"platform": platform.toLowerCase(),
				"os_ver": os_ver,
			    "make": make.toLowerCase(),
			    "model": model.toLowerCase(),
			    "serial_number": serialno,
			    "IMEI": IMEI.toLowerCase(),
			    "phone_no": phone_no,
		    	"notes": notes.toLowerCase(),
		    	"network": network.toLowerCase(),
		    	"arch": arch.toLowerCase(),
    			"registered": registered,
    			"devicetype": devicetype.toLowerCase(),
    			"tag_id": tag_id,
    			"checkedout": checkedout,
    			"checkedout_by": checkedout_by.toLowerCase(),
    			"checkedout_on": checkedout_on,
    			"user_email": user_email.toLowerCase(),
    			"checkedin": checkedin,
    			"checkedin_on": checkedin_on
    			})); 
	}
	
	
	//This function will check if device already exists in DB & if it does not it will add to the DB & skip others.
	function check_exists(entry){
			Ti.API.info(entry[5]);
			 var xhr = Ti.Network.createHTTPClient({
			    onload: function onLoad() {
			        //alert("Loaded: " + this.status + ": " + this.responseText);
			        Ti.API.info("Loaded: " + this.status + ": " + this.responseText);
			        
			        var json_resp = this.responseText;
			        var JSONdata = JSON.parse(json_resp);
			        Ti.API.info(JSONdata.devices.length);
			        if(JSONdata.devices.length==0){
			        	Ti.API.info(entry[5]+' does not exist****************');
			        	add_device(entry[0],entry[1],entry[2],entry[3],entry[4],entry[5],entry[6],entry[7],entry[8],entry[9],entry[10],entry[11],entry[12],entry[13],entry[14],entry[15],entry[16],entry[17],entry[18]);   //Function to add device to DB.
			        }
			        else{
			        	Ti.API.info(entry[5]+' exist, skipped adding to DB******************');
			        	//toast.show_toast(entry[5]+' already exists.Skipping import');
			        	createrow('Device "'+entry[0]+'" exist, skipped adding to DB');
			        }
			        log_tbl_view.data=tabledata;
			    },
			    onerror: function onError() {
			        alert("Errored: " + this.status + ": " + this.responseText);
			    }
			});	
			xhr.open("GET",links_keys.query_url+'where='+'{'+'"'+'serial_number'+'"'+':'+'"'+entry[5]+'"'+'}');
			var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
			xhr.setRequestHeader("Authorization", authstr);
			xhr.send();
	};
	
	//This function will download the CSV file parse it & sent it to arrow app to check if device already exists in the DB.
	function download(){
		var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'device_data2.csv');
		Ti.API.info('File exists: '+f.deleteFile());
		if(f.exists){
			f.deleteFile();
			Ti.API.info('File exists after delete: '+f.deleteFile());
		}
		var xhr = Titanium.Network.createHTTPClient({
			onload: function() {
				// first, grab a "handle" to the file where you'll store the downloaded data
				var f = Ti.Filesystem.getFile(Ti.Filesystem.applicationDataDirectory,'device_data2.csv');
				f.write(this.responseData); // write to the file
				Ti.App.fireEvent('file_downloaded', {status:f.exists()});
			},
			timeout: 10000
		});
		xhr.open('GET',links_keys.csv_file_url);
		xhr.send();
			
		var listener_callback=function(e){
			if(e.status){
				Ti.API.info('Finished file download: '+e.status);
				Ti.API.info('File exists after download: '+f.exists());
				var csv = f.read();
				var points = [];
				var lines = csv.toString().split("\n");
	
				for (var c=0;c<lines.length;c++)
					{
					    var line = lines[c];
					    var a = line.split(",");
					    if (a.length > 1)
					    {
					        var name = a[0];
					        var platform = a[1];
					        var os_ver= a[2];
					        var make = a[3];
					        var model = a[4];
					        var serialno = a[5];
					        var IMEI = a[6];
					        var phone_no = a[7];
					        var notes = a[8];
					        var network = a[9];
					        var arch = a[10];
					        var registered = a[11];
					        var devicetype = a[12];
					        var tag_id = a[13];
					        var checkedout = a[14];
					        var checkedout_by = a[15];
					        var checkedout_on = a[16];
					        var user_email = a[17];
					        var checkedin = a[18];
					        var checkedin_on = a[19];
					        var entry = [name,platform,os_ver,make,model,serialno,IMEI,phone_no,notes,network,arch,registered,devicetype,tag_id,checkedout,checkedout_by,checkedout_on,user_email,checkedin,checkedin_on];
					        points[c]=entry;
					      	
					      	//Function call to check if device already exists in DB.
					      	check_exists(entry);
					    } 			       
					}
			}
			else{
				Alert('Failed to download file for parsing.');
				Ti.API.error('Failed to download file for parsing.');
			}
			//Adding event listener for CSV download done & file exists.
			Ti.App.removeEventListener('file_downloaded',listener_callback);
		};
		//Removing the event listener.
		Ti.App.addEventListener('file_downloaded', listener_callback);	
	}
	
	parse_button.addEventListener('click',function(){
		if (Ti.Filesystem.hasStoragePermissions()) {
			       Ti.API.info("App has file permissions");
			       //Clearing the log table view when parse button is pressed.
			       tabledata=[];
			       log_tbl_view.data=tabledata;
				   download();
			       //parse();
			   } else { 
			       Ti.Filesystem.requestStoragePermissions(function(e) {
			                if (e.success === true) {
			                	Ti.API.info("Filesystem Permissions Granted");
			                    download();
			                    //parse();
			                } else {
			                    alert("Access denied, error: " + e.error);
			                }
			       });
			   }		   	
		});
		
	main_parse_win.add(parse_button);
	main_parse_win.add(parse_lbl);
	main_parse_win.add(log_tbl_view);
	main_parse_win.open({modal:true});
};


