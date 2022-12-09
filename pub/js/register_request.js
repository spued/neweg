(function () {
})();

function register_submit() {
    let validate_status = true;
    let message = '';
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const password_confirm = document.getElementById('password_confirm').value;
    document.getElementById('email').value = email;

    // validate username as email
    if(!email.match(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)) {
        validate_status = false;
        message = "Email not correct."
        alert("Error: " + message);
        return false;
    }
    // Validate password
    if(!(password == password_confirm) || (password.length <= 4)) {
        validate_status = false;
        message = "Password not match or not meet requirement."
        alert("Error: " + message);
        return false;
    }
    const form = document.getElementById('register_form');
    /* var formData = new FormData(form);
    formData.append('email', email);
    fetch(formData.action, { 
        method:'post', 
        body: formData 
    }); */
    /* var xhr = new XMLHttpRequest();
    xhr.open("POST", "/register", true); 
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.onload = function(event){ 
        alert("Success, server responded with: " + event.target.response); // raw response
    }; 
    // or onerror, onabort
    xhr.send(JSON.stringify(formData)); */
    var result = form.submit();

    if(result.code == 0) {
        alert('Register OK');
    } else {
        alert('Register Error:' + result.msg);
    }
};
