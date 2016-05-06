var Cloud = require('ti.cloud');
var landing_pg_admin = require('landing_pages/landing_page_admin');
var landing_pg_nonadmin = require('landing_pages/landing_page_nonadmin');
var create_user = require('user_logic/createuser');
var toast = require('utils/toast');
var nwstatus = require('utils/nw_status');
var logout = require('user_logic/logout');

exports.admin_login = function(){	
	var main_login_win = Ti.UI.createWindow({title:'Admin Login',layout:'vertical',backgroundImage:'main_bg.jpg'});
	var login_lbl = Ti.UI.createLabel({text:'Please enter your details to login :',top:20,font:{fontWeight:"bold"}});
	var username_lbl = Ti.UI.createLabel({text:'Username:',top:20});
	var username_txt = Ti.UI.createTextField({width:200,top:10});
	var password_lbl = Ti.UI.createLabel({text:'Password:',top:20});
	var password_txt = Ti.UI.createTextField({width:200,top:10,passwordMask:true});
	var login_img = Ti.UI.createImageView({top:30,width:50,height:50,image:'/images/login.png'});
	var login_but_lbl = Ti.UI.createLabel({text:'Login',font:{fontSize:13,fontWeight:"bold"}});
	var info_lbl = Ti.UI.createLabel({left:120,font:{fontSize:8},text:'Username will be your appcelerator email address\nForgot password?                              Contact admin',top:160});	
	var fields = [ username_txt, password_txt ];

	
    function submitForm() {
    	if((username_txt.value&&password_txt.value)==""){
    		alert("Please enter all details");
    	}
    	else{
	        for (var i = 0; i < fields.length; i++) {
	            if (!fields[i].value.length) {
	                fields[i].focus();                                                                                                                                                                                                                                                               
	                return;
	            }
	            fields[i].blur();
	        }
	
	        Cloud.Users.login({
	            login: username_txt.value,
	            password: password_txt.value
	        }, function (e) {
	            if (e.success) {
	                var user = e.users[0];
	                //checking if user is an admin to login if not then don't allow login
	                if(user.admin == 'true'){
		                username_txt.value = password_txt.value = '';
						landing_pg_admin.landing();
						//close the admin login window so that it does not show up when logging out.
						main_login_win.close();
					}
					else{
						//Logging out if user is not an admin
						Cloud.Users.logout(function (e) {
					        if (e.success) {
					            Ti.API.info('Blocked nonadmin access');
					        }
					        else {
					            alert((e.error && e.message) || e);
					        }
					    });
						username_txt.value = password_txt.value = '';
						toast.show_toast('Only admin has access.\nYou are not an admin.',Ti.UI.NOTIFICATION_DURATION_SHORT);
					}
	            }
	            else {
	                 alert('Error:\n' +((e.error && e.message) || JSON.stringify(e)));
	            }
	        });
	     }
    }

    login_img.addEventListener('click', submitForm);
    
    for (var i = 0; i < fields.length; i++) {
        fields[i].addEventListener('return', submitForm);
    }
    
    //Android back listener to close the main login win & open the non admin admin page if the user decides to go back from the login page
    main_login_win.addEventListener('androidback',function(){
    	landing_pg_nonadmin.non_admin_landing();
    	main_login_win.close();
    });
    //create_usr_img.addEventListener('click',function(){create_user.create_user();});
    
    main_login_win.add(login_lbl);
	main_login_win.add(username_lbl);
	main_login_win.add(username_txt);
	main_login_win.add(password_lbl);
	main_login_win.add(password_txt);
	main_login_win.add(login_img);
	main_login_win.add(login_but_lbl);
	main_login_win.add(info_lbl);
	main_login_win.open();
};
