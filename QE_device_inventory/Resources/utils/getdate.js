exports.getDate=function(){
	var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    var seconds = currentTime.getSeconds();
    var month = currentTime.getMonth() + 1;
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();

    if (hours < 10) { hours = "0" + hours};    
    if (minutes < 10) { minutes = "0" + minutes};
    if (seconds < 10) { seconds = "0" + seconds};

    var time_info =  month + "/" + day + "/" + year + " -  " + hours + ":" + minutes + ":" + seconds;
    return time_info;
};
