var toast = require('utils/toast');
var Cloud = require('ti.cloud');
var create_usr = require('user_logic/createuser');

exports.manage_users=function(){
	var manage_users_win = Ti.UI.createWindow({title:'Manage Users',backgroundImage:'main_bg.jpg'});
	
	var id = '';
	//Search bar for the table view
	var search = Titanium.UI.createSearchBar({
	    showCancel:true,
	    hintText:'Search',
	    height:45,
	    top:0,
	});
	
	search.addEventListener('change', function(e){
		e.value; // search string as user types
	});
		
	search.addEventListener('return', function(e){
		search.blur(); //Blur the search bar when return is hit on the keyboard
	});
		
	search.addEventListener('cancel', function(e){
		search.blur(); //Blur the search bar when cancel is hit on the keyboard
	});
	
	manage_users_win.addEventListener('focus',function(){
		search.blur(); //Blur the search bar when window is focused
	});
	
	var myTemplate = {
	    childTemplates: [
	        {                            
	            type: 'Ti.UI.Label',     
	            bindId: 'user',          
	            properties: {            
	                //color: 'white',
	                font: { fontWeight:'bold' },
	                left: 10, top: 10,
	            }
	        },
	        {                            
	            type: 'Ti.UI.Label',     
	            bindId: 'admin',     
	            properties: {           
	                //color: 'white',
	                font: { fontWeight:'bold' },
	                left: 10, top: 30,
	            }
	        },
	        {                           
	            type: 'Ti.UI.Label',     
	            bindId: 'email',          
	            properties: {          
	                //color: 'white',
	                font: { fontWeight:'bold' },
	                left: 10, top: 50,
	            }
	        },
	        {                           
	            type: 'Ti.UI.Label',     
	            bindId: 'id',          
	            properties: {          
	                //color: 'white',
	                font: { fontWeight:'bold' },
	                left: 10, top: 70,
	            }
	        },
	      	{                            
	            type: 'Ti.UI.ImageView', 
	            bindId: 'deletepic',           
	            properties: {          
	                top:30,left:'90%',width:20,height:20
	            },
	            //Event listener for delete 
	            events: {
	                longclick: function (e) {
	                    var item = listSection.getItemAt(e.itemIndex);
	                    var b = item.id.text;
						var user_id = b.substring(9);
						var dialog = Ti.UI.createAlertDialog({
					        title : 'Are you sure want to delete this user',
					        buttonNames : ['Yes','No']
					    });
					    // dialog.addEventListener('click', function(e){
					        // if(e.index == 0){
					        	// //Call the required delete device function & pass the device name as argument to the function
					        	// //delete_usr.delete_user(getcurrentuserid());
					            // listSection.deleteItemsAt(e.itemIndex,1);
					        // }
					    // });
					    // dialog.show();
	                }
	            }
	        }
	    ]
	};
	
	var listView = Ti.UI.createListView({
	    templates: { 'template': myTemplate },
	    separatorColor:'yellow',
	    defaultItemTemplate: 'template',
	    searchView: search,
	    caseInsensitiveSearch : true,
	});
	
	var sections = [];
	
	var listSection = Ti.UI.createListSection({});
	
	var listDataSet = [];
	
	var user_lbl = Ti.UI.createLabel({});
	var admin_lbl = Ti.UI.createLabel({});
	var email_lbl = Ti.UI.createLabel({});
	var id_lbl = Ti.UI.createLabel({});
	var delete_imageview = Ti.UI.createImageView({backgroundImage:'/images/delete.png'});
	
	function getdata(){
		Cloud.Users.query(function (e) {
		    if (e.success) {
		        for (var i = 0; i < e.users.length; i++) {
		            var user = e.users[i];
		            //Set the text for the label's in the listview
		            user_lbl.text = "USER:    "+user.first_name+' '+user.last_name;
		        	admin_lbl.text = "ADMIN:    "+user.admin;
		        	email_lbl.text = "EMAIL:    "+user.email;
		        	id_lbl.text = "ID:    "+user.id;
		        	
		        	listDataSet.push({ user: {text: user_lbl.text,height:50}, 
							admin: {text: admin_lbl.text,height:46}, 
							email: {text: email_lbl.text,height:45},
							id: {text: id_lbl.text,height:45}, 
							deletepic: {image: delete_imageview.backgroundImage},
							properties:{searchableText:user.first_name+user.last_name+user.email+user.admin,height:130}
					});
						
					listSection.setItems(listDataSet);
					sections.push(listSection);
					listView.setSections(sections);
		        	    		        	
		            //Change the header of the table view	
		        	listSection.headerTitle=e.users.length+" user/s found";	
		         }
		         toast.show_toast("Found "+e.users.length+" user/s.",Ti.UI.NOTIFICATION_DURATION_SHORT);
		         
		    } else {
		        alert('Error:\n' +
		            ((e.error && e.message) || JSON.stringify(e)));
		    }
		});
	}
	
	//getting the windows activity for the menu item
	var activity = manage_users_win.activity;
	//Creating the menu item
	activity.onCreateOptionsMenu = function(e){
	  var menu = e.menu;
	  var createuser = menu.add({
	    title: "Create User",
	    itemID: createuser,
	    icon:  "/images/register.png",
	    showAsAction: Titanium.Android.SHOW_AS_ACTION_ALWAYS
	  });
	  
	  var refresh = menu.add({
	    title: "Refresh",
	    itemID: refresh,
	    icon:  "/images/refresh.png",
	    showAsAction: Titanium.Android.SHOW_AS_ACTION_ALWAYS
	  });
	  
	  createuser.addEventListener("click", function(e) {
	    create_usr.create_user();
	  });
	  
	  refresh.addEventListener("click", function(e) {
	  	   //Empty the list data set so that the list view can be reloaded
			listDataSet = [];
			//Calling get data function to get data from DB
			getdata();
	  });
	  
	};
	
	//Calling get data function
	getdata();
	
	manage_users_win.add(listView);
	manage_users_win.open({modal:true});	
};
