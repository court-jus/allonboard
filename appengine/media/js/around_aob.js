//@+leo-ver=5-thin
//@+node:celine.20110403213834.1543: * @file around_aob.js
//@@language javascript
//@@tabwidth -4
//@+others
//@+node:celine.20110403213834.1548: ** setNickname
function setNickname(frm)
    {
    var data = dojo.formToObject(frm);
    createCookie('aob_nickname', data.nickname, 12);
    window.location.reload();
    return false;
    }
//@-others
//@-leo
