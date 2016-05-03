var Cloud = require('ti.cloud');
var toast = require('utils/toast');

var status = false;
exports.logout_user=function(win){
	Cloud.Users.logout(function (e) {
        if (e.success) {
            toast.show_toast('Logged Out Successfully',Ti.UI.NOTIFICATION_DURATION_SHORT);
			win.close();
        }
        else {
            alert((e.error && e.message) || e);

        }
    });
};
