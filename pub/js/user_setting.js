$(function(){
})

$(document).on('click', '.btn-set-user-password', function() {
    let _password = $("#u_password").val();
    if(_password == '') { 
        alert("Password empty.");
        return 0;
    } else if(_password == $("#u_password_confirm").val()) {
        if(_password.length > 5) {
            var _post_data = {
                user_id : $("#u_user_id").val(),
                passwd : $("#u_password").val()
            }
            $.post('/user_password', _post_data, function(res) {
                //console.log(res);
                if(res.code == 0) {
                    alert("Password changed.");
                    window.location.href = '/user_setting';
                } else {
                    alert("Can not change password.");
                }
                
            })
        } else {
            alert('Password must more than 6 character.');
        }
    } else {
        alert("Password not same.");
        return 0;
    }
});
