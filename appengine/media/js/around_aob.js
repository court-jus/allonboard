function setNickname(frm)
    {
    var data = dojo.formToObject(frm);
    createCookie('aob_nickname', data.nickname, 12);
    window.location.reload();
    return false;
    }
