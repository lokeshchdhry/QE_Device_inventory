exports.show_toast=function(message,duration){
		// var timelong = Ti.UI.NOTIFICATION_DURATION_LONG;
		// var timeshort = Ti.UI.NOTIFICATION_DURATION_SHORT;
		var toast = Ti.UI.createNotification({
			message:message,
		    duration: duration
		});
		toast.show();
};
