var user_table = null;
var user_session_table = null;
var user_action_table = null;

$(function() {
    if(user_table != null) user_table.destroy();
    
    user_table = $('#user_table').DataTable({
      processing: true,
      serverSide: false,
      ajax: {
          url: '/list_user',
          type: 'POST',
          data: {}
      },
      columns: [
        { data: 'email' },
        { data: {},
            render: function (data) {
                if(data.type == 'admin') return data.fullname + ' (*)';
                else if(data.status == '0') return data.fullname + ' (X)';
                else return data.fullname;
            } 
        },
        { data: 'message' },
        { data: {},
        render: function() {
            let html='';
            html += '<div class="btn-group mr-5" role="group">';
            html += '<button class="btn btn-info btn-sm btn-edit-user">edit</button>';
            html += '<button class="btn btn-warning btn-sm btn-password-user">password</button>';
            html += '<button class="btn btn-danger btn-sm btn-delete-user">delete</button>';
            html += '</div>';
            return html;
        }
        }
      ],
      createdRow:(row,data) => {
        $(row).attr('user_id', data._id);
      }
    });
    
    
})
$(".btn-user-session-list").on("click", function() {
    let modal = $("#modalUserSessionList");
    /* $.post('/list_user_sessions', {
        } , function(res) {
        console.log(res.data);
    }) */
    if(user_session_table != null) user_session_table.destroy();
    user_session_table = $('#user_session_table').DataTable({
        processing: true,
        serverSide: false,
        ajax: {
            url: '/list_user_sessions',
            type: 'POST',
            data: {}
        },
        order: [[2, 'desc']],
        columns: [
        { data: 'username' },
        { data: 'email' },
        { data: 'company' },
        { data: 'expires',
            render: (data) => {
                //console.log(data)
                var date = new Date(data);
                year = date.getFullYear();
                month = date.getMonth()+1;
                dt = date.getDate();
                hr = date.getHours();
                mn = date.getMinutes();

                if (dt < 10) {
                dt = '0' + dt;
                }
                if (month < 10) {
                month = '0' + month;
                }
                return (dt + '/' + month + '/'+ year + ' ' + hr + ':' + mn);
            }  
        }
        ]
    });
    modal.modal('show');
});

$(".btn-user-action-logs").on("click", function() {
    let modal = $("#modalUserActionList");
    if(user_action_table != null) user_action_table.destroy();
    user_action_table = $('#user_action_table').DataTable({
        processing: true,
        serverSide: false,
        scrollY: '360px',
        ajax: {
            url: '/list_user_logs',
            type: 'POST',
            data: {}
        },
        order: [[2, 'desc']],
        columns: [
          { data: 'username' },
          { data: 'action' },
          { 
            data: 'createdAt',
            render: (data) => {
                //console.log(data)
                var date = new Date(data);
                year = date.getFullYear();
                month = date.getMonth()+1;
                dt = date.getDate();
                hr = date.getHours();
                mn = date.getMinutes();

                if (dt < 10) {
                    dt = '0' + dt;
                }
                if (month < 10) {
                    month = '0' + month;
                }
                return (dt + '/' + month + '/'+ year + ' ' + hr + ':' + mn);
            } 
          }
        ]
    })
    modal.modal('show');
});
$(document).on("click",".btn-edit-user",function() {
    var data = user_table.row($(this).parents('tr')).data();
    var modal = $("#modalUserEdit");
    modal.find('#e_fullname').val(data.fullname);
    modal.find('#e_email').val(data.email);
    modal.find('#e_username').val(data.email);
    modal.find('#e_user_email').val(data.email);
    modal.find('#e_detail').val(data.message);
    modal.find('#e_right').val(data.right);
    modal.find('#e_user_id').val(data._id);
    modal.find('#e_select_status').val(data.status).trigger("change");
    modal.find('#e_select_type').val(data.type).trigger("change");
    modal.modal('show');
});

$(document).on("click",".btn-password-user",function() {
    var data = user_table.row($(this).parents('tr')).data();
    var modal = $("#modalChangePassword");
    modal.find("#c_user_id").val(data._id);
    modal.find("#c_user_name").val(data.name);
    modal.find("#c_password").val(null);
    modal.find("#c_password_change").val(null);
    modal.modal("show");
})

$(document).on("click",".btn-set-password-user",function() {
    var modal = $("#modalChangePassword");
    if(modal.find("#c_password").val() == '') { 
        alert("Password empty.");
        return 0;
    } else if(modal.find("#c_password").val() == modal.find("#c_password_confirm").val()) {
        if(modal.find("#c_password").val().length > 5) {
            var _post_data = {
                user_id : modal.find("#c_user_id").val(),
                passwd : modal.find("#c_password").val()
            }
            $.post('/user_password', _post_data, function(res) {
                //console.log(res);
                if(res.code == 0) {
                    alert("Password changed.");
                } else {
                    alert("Can not change password.");
                }
                modal.modal('hide');
            })
        } else {
            alert('Password must more than 6 character.');
        }
    } else {
        alert("Password not same.");
        return 0;
    }
})

$(document).on("click",".btn-save-user",function() {
    var modal = $("#modalUserEdit");
    var _post_data = {
        fullname : modal.find('#e_fullname').val(),
        email : modal.find('#e_email').val(),
        username : modal.find('#e_username').val(),
        message : modal.find('#e_detail').val(),
        right : modal.find('#e_right').val(),
        user_id : modal.find('#e_user_id').val(),
        status : modal.find('#e_select_status').val(),
        type : modal.find('#e_select_type').val()
    };
    if(_post_data.email == $('#e_user_email').val()) {
        delete _post_data.email;
    };
    $.post('/user_save', _post_data, function(res) {
        //console.log(res);
        if(res.code == 0) {
            alert("User was saved.");
        } else {
            alert("Can not save this user : " + res.msg );
        }
    })
    modal.modal('hide');

    setTimeout( function () {
        user_table.ajax.reload();
    },1000);
});

$(document).on("click",".btn-delete-user",function() {
    var data = user_table.row($(this).parents('tr')).data();
    var _post_data = {
        user_id : data._id,
        type : data.type
    }
   if(confirm("Delete user?")) {
        $.post('/user_delete', _post_data, function(res) {
            //console.log(res);
            if(res.code == 0) {
                alert("User deleted.")
            } else {
                alert("Can not delete user.")
            }
        })
    }
    setTimeout( function () {
        user_table.ajax.reload();
    },1000);
});

$('#modalUserEdit').on('click', 'button.close', function (eventObject) {
    $('#modalUserEdit').modal('hide');
});
$('#modalChangePassword').on('click', 'button.close', function (eventObject) {
    $('#modalChangePassword').modal('hide');
});
$('#modalUserSessionList').on('click', 'button.close', function (eventObject) {
    $('#modalUserSessionList').modal('hide');
});
$('#modalUserActionList').on('click', 'button.close', function (eventObject) {
    $('#modalUserActionList').modal('hide');
});