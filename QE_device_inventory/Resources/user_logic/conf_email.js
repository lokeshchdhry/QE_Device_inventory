var Cloud = require('ti.cloud');

exports.resend_conf_email=function(){
	var resend_conf_win = Ti.UI.createWindow({title:'Resend Confirmation Email'});
	var email_fld = Ti.UI.createTextField({top:20,width:250});
	var view = Ti.UI.createView({width:300,height:200,backgroundColor:'grey',layout:'vertical'});
	var info_lbl = Ti.UI.createLabel({top:20,left:20,right:10,text:'Please enter your email below to resend account confirmation email:'});
	var ok_but = Ti.UI.createButton({top:20,title:'OK'});
	
	ok_but.addEventListener('click',function(){
		if(email_fld.value==''){
			alert('Please enter your email address');
		}
		else{
			Cloud.Users.resendConfirmation({
			    email: email_fld.value
			}, function (e) {
			    if (e.success) {
			        resend_conf_win.close();
					alert('Confirmation email resent to '+email_fld.value);
			    }
			    else {
			        alert(error(e));
			    }
			});
			
		}
	});
	
	view.add(info_lbl);
	view.add(email_fld);
	view.add(ok_but);
	resend_conf_win.add(view);
	resend_conf_win.open({modal:true});
};