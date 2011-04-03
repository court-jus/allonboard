//@+leo-ver=5-thin
//@+node:celine.20110403213834.1544: * @file cookies.js
//@@language javascript
//@@tabwidth -4
//@+others
//@+node:celine.20110403213834.1545: ** createCookie
function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}
//@+node:celine.20110403213834.1546: ** readCookie

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}
//@+node:celine.20110403213834.1547: ** eraseCookie

function eraseCookie(name) {
	createCookie(name,"",-1);
}
//@-others

//@-leo
