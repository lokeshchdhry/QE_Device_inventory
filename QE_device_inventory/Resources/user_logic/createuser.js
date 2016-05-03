var Cloud = require('ti.cloud');

exports.create_user = function(){
	
	var new_usr_win = Ti.UI.createWindow({title:"Create User",layout:'vertical',backgroundImage:'main_bg.jpg'});
	var pagelbl = Ti.UI.createLabel({top:10,text:'Please enter information below:',font:{fontWeight:'bold'}});
	var username_lbl = Ti.UI.createLabel({top:20,text:'UserName :'});
	var username_fld = Ti.UI.createTextField({top:0,width:200});
	var email_lbl = Ti.UI.createLabel({top:10,text:'Email :'});
	var email_fld = Ti.UI.createTextField({top:0,width:200});
	var fn_lbl = Ti.UI.createLabel({top:10,text:'First Name :'});
	var fn_fld = Ti.UI.createTextField({top:0,width:200});
	var ln_lbl = Ti.UI.createLabel({top:10,text:'Last Name :'});
	var ln_fld = Ti.UI.createTextField({top:0,width:200});
	var pw_lbl = Ti.UI.createLabel({top:10,text:'Password :'});
	var pw_fld = Ti.UI.createTextField({top:0,width:200});
	var conf_pw_lbl = Ti.UI.createLabel({top:10,text:'Confirm Password :'});
	var conf_pw_fld = Ti.UI.createTextField({top:0,width:200});
	var admin_switch = Ti.UI.createSwitch({style:Titanium.UI.Android.SWITCH_STYLE_CHECKBOX,title:'Admin',top:0});
	var create_but = Ti.UI.createButton({title:'Create',top:20});
	
	new_usr_win.add(pagelbl);
	new_usr_win.add(username_lbl);
	new_usr_win.add(username_fld);
	new_usr_win.add(email_lbl);
	new_usr_win.add(email_fld);
	new_usr_win.add(fn_lbl);
	new_usr_win.add(fn_fld);
	new_usr_win.add(ln_lbl);
	new_usr_win.add(ln_fld);
	new_usr_win.add(pw_lbl);
	new_usr_win.add(pw_fld);
	new_usr_win.add(conf_pw_lbl);
	new_usr_win.add(conf_pw_fld);
	new_usr_win.add(admin_switch);
	new_usr_win.add(create_but);
	new_usr_win.open();
	
	var fields = [ username_fld, email_fld, fn_fld, ln_fld, pw_fld, conf_pw_fld];
	var admin_value = '';
	
	function submitForm(){
		if(admin_switch.value=='undefined'){
	        	admin_value='false';
	        }
	        else{
	        	admin_value='true';
	        }
	        
		if((email_fld.value&&fn_fld.value&&ln_fld.value&&pw_fld.value&&conf_pw_fld.value)==''){
			alert("Please fill in all details");
		}
		else{
	        for (var i = 0; i < fields.length; i++) {
	            if (!fields[i].value.length) {
	                fields[i].focus();
	                return;
	            }
	            fields[i].blur();
	        }
	        if (pw_fld.value != conf_pw_fld.value) {
	            alert('Passwords do not match!');
	            conf_pw_fld.focus();
	            return;
	        }
	            
	        create_but.hide();
	        	
			Cloud.Users.create({
				admin:admin_value,
				username:username_fld.value,
			    email: email_fld.value,
			    first_name: fn_fld.value,
			    last_name: ln_fld.value,
			    password: pw_fld.value,
			    password_confirmation: conf_pw_fld.value
				}, function (e) {
				    if (e.success) {
				        var user = e.users[0];
				        Ti.API.info('******'+admin_value);
				        Ti.API.info('******'+user.admin);
				        alert('Created! You are now logged in as: ' + '"'+user.username+'"');
				        email_fld.value=fn_fld.value=ln_fld.value=pw_fld.value=conf_pw_fld.value='';
				        create_but.show();
				        
				    } else {
				        alert('Error:\n' +
				            ((e.error && e.message) || JSON.stringify(e)));
				    }		    
				});
			new_usr_win.close();
		}
	}
	
	
	create_but.addEventListener('click',submitForm);
	for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }
};
