var scanditsdk = require('com.mirasense.scanditsdk');

exports.scanner=function(win){
	var internal = win;

	if(Ti.Platform.osname == 'iphone' || Ti.Platform.osname == 'ipad'){
		Titanium.UI.iPhone.statusBarHidden = true;
	}

	if (Ti.Media.hasCameraPermissions()) {
		openScanner();
	} else {
		Ti.Media.requestCameraPermissions(function(e) {
			if (e.success) {
				openScanner();
			} else {
				alert('You denied camera permission.');
			}
		});
	}

	
	// Sets up the scanner and starts it in a new window.
	function openScanner(){
		// First set the app key and which direction the camera should face.
		scanditsdk.appKey = "SuKVyaBV/2iDJroHDMUNYnlGOt6MR/XcjSsp97Vs6lM"; 
		scanditsdk.cameraFacingPreference = 0;
	
		// Only after setting the app key instantiate the Scandit SDK Barcode Picker view
		var picker = scanditsdk.createView({
			width:250,
			height:350
		});
		// Before calling any other functions on the picker you have to call init()
		picker.init();
		
		picker.setVibrateEnabled = true;
		// add a tool bar at the bottom of the scan view with a cancel button (iphone/ipad only)
		picker.showToolBar(true);
		
		var view = Ti.UI.createView({height:Ti.UI.SIZE,width:Ti.UI.SIZE,borderRadius:10,elevation:60});
	
		// Create a window to add the picker to and display it. 		
		var window = Titanium.UI.createWindow({            
				title:'Scanner',
				navBarHidden:false
		});
		
		// Set callback functions for when scanning succeeds and for when the 
		// scanning is canceled. This callback is called on the scan engine's
		// thread to allow you to synchronously call stopScanning or
		// pauseScanning. Any UI specific calls from within this function 
		// have to be issued through setTimeout to switch to the UI thread
		// first.
		picker.setSuccessCallback(function(e) {
			picker.stopScanning();
			
			setTimeout(function() {
				window.close();
				window.remove(picker);
				//alert("success (" + e.symbology + "): " + e.barcode);
				var entry =[];
			    Ti.API.info('Success called with barcode: ' + e.barcode);
			        var result = e.barcode;
			        // var a = result.split(",");
				    // if (a.length > 1)
				    // {
				        // var name = a[0];
				        // var platform = a[1];
				        // var os_ver= a[2];
				        // var make = a[3];
				        // var model = a[4];
				        // var serialno = a[5];
				        // var IMEI = a[6];
				        // var phone_no = a[7];
				        // var notes = a[8];
				        // var network = a[9];
				        // var arch = a[10];
				        // var registered = a[11];
				        // var type = a[12];
				        // var entry = [name,platform,os_ver,make,model,serialno,IMEI,phone_no,notes,network,arch,registered,type];
			    // }
			    
			    switch(internal)
			    {
			    	case 'device_add_win':
			    	Ti.App.fireEvent('code scanned device add',{data:result,fired:true});
			    	
			    	case 'device_query_win':
			    	Ti.App.fireEvent('code scanned device query',{data:result,fired:true});
			    	
			    	case 'single_del_int_win':
			    	Ti.App.fireEvent('code scanned device delete',{data:result,fired:true});
			    	
			    	case 'checkout_win_userbatch':
			    	Ti.App.fireEvent('code scanned user scan',{data:result,fired:true});
			    	
			    	case 'checkout_win_deviceinfo':
			    	Ti.App.fireEvent('code scanned device info',{data:result,fired:true});
			    	
			    	case 'checkin_win_userbatch':
			    	Ti.App.fireEvent('checkin code scanned user scan',{data:result,fired:true});
			    	
			    	case 'checkin_win_deviceinfo':
			    	Ti.App.fireEvent('checkin code scanned device info',{data:result,fired:true});
			    }
			},1000);
		});
		
		picker.setCancelCallback(function(e) {
			picker.stopScanning();
			window.close();
			window.remove(picker);
		});
	
		window.add(view);
		view.add(picker);
		window.addEventListener('open', function(e) {
			picker.startScanning();		// startScanning() has to be called after the window is opened. 
		});
		window.open({modal:true});
	};
};

