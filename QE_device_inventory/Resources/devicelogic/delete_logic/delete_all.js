var links_keys = require('utils/links_keys');

exports.deleteall=function(){	
	var warn_view = Ti.UI.createView({height:Ti.UI.SIZE,width:Ti.UI.SIZE});
	var warn_lbl = Ti.UI.createLabel({text:'Confirm Delete all devices from DB ?\nThis can not be undone !!!',font:{fontWeight:"bold"},color:'red',top:10});
	warn_view.add(warn_lbl);	
		
	var optdlg = Ti.UI.createOptionDialog({androidView:warn_view, buttonNames: ['Delete','Cancel']});
	optdlg.show();
	
	 optdlg.addEventListener('click',function(e){
		 if((e.index) == 0){
			 var xhr = Ti.Network.createHTTPClient({
		     onload: function onLoad() {
		         Ti.API.info("Loaded: " + this.status + ": " + this.responseText);
		         if(this.status==204){
			        	 alert("All Devices deleted successfully");
			         }
		     },
		     onerror: function onError() {
		         alert("Errored: " + this.status + ": " + this.responseText);
		     }
		 });
		
		 xhr.open("DELETE",links_keys.delete_all_url);
		 var authstr = 'Basic ' + Ti.Utils.base64encode(links_keys.prod_key);
		 xhr.setRequestHeader("Authorization", authstr);
		 xhr.send();
		 }
		 else{
			optdlg.hide();
		 }
	 });
};