exports.reset_pw=function(){
	var reset_pw_win = Ti.UI.createWindow({title:'Password Reset'});
	var email_fld = Ti.UI.createTextField({top:20,width:250});
	var view = Ti.UI.createView({width:300,height:200,backgroundColor:'grey',layout:'vertical'});
	var info_lbl = Ti.UI.createLabel({top:20,left:20,right:10,text:'Please enter your email below to reset your password:'});
	var ok_but = Ti.UI.createButton({top:20,title:'OK'});
	
	ok_but.addEventListener('click',function(){
		if(email_fld.value==''){
			alert('Please enter your email address');
		}
		else{
			Cloud.Users.requestResetPassword({
			    email: email_fld.value
			}, function (e) {
			    if (e.success) {
			    	reset_pw_win.close();
					alert('Reset email sent to '+email_fld.value);
			        Ti.API.info('Success: Reset Request Sent');
			    } else {
			        alert('Error:\n' +
			            ((e.error && e.message) || JSON.stringify(e)));
			    }
			});		
		}
	});
	
	view.add(info_lbl);
	view.add(email_fld);
	view.add(ok_but);
	reset_pw_win.add(view);
	reset_pw_win.open({modal:true});
};
