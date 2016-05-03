var logout_usr = require('user_logic/logout');
var non_admin_landing = require('landing_pages/landing_page_nonadmin');
var create_usr = require('user_logic/createuser');

exports.showmenuitems=function(window){
	var activity = window.activity;

	activity.onCreateOptionsMenu = function(e){
	  var menu = e.menu;
	  var logout = menu.add({
	    title: "Logout",
	    itemID: logout,
	    icon:  "/images/logout.png",
	    showAsAction: Titanium.Android.SHOW_AS_ACTION_ALWAYS
	  });
	  
	  var createuser = menu.add({
	    title: "Create User",
	    itemID: createuser,
	    icon:  "/images/register.png",
	    showAsAction: Titanium.Android.SHOW_AS_ACTION_ALWAYS
	  });
	  
	  logout.addEventListener("click", function(e) {
	    logout_usr.logout_user(window);
	    non_admin_landing.non_admin_landing();
	  });
	  
	  createuser.addEventListener("click", function(e) {
	    create_usr.create_user();
	  });
	};
};
