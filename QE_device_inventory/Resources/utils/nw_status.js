var toast = require('utils/toast');

exports.nw_status=function(){
	if(!Ti.Network.getOnline()){
		toast.show_toast('Device is not connected to the internet.\nApp usage will be hampered',Ti.UI.NOTIFICATION_DURATION_LONG);
		Ti.API.warn('Device is not connected to the internet.\nApp usage will be hampered');
	}
	else{
		Ti.Network.addEventListener('change',function(){
			if(!Ti.Network.getOnline()){
				toast.show_toast('Device is not connected to the internet.\nApp usage will be hampered',Ti.UI.NOTIFICATION_DURATION_LONG);
				Ti.API.warn('Device is not connected to the internet.\nApp usage will be hampered');
			}
		});
	}
};
