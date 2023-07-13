const form = document.getElementById('signupForm'); 
const username = document.getElementById('username');
const genderRadio = document.getElementsByName('genderRadio');
const phone = document.getElementById('phone');
const email = document.getElementById('email');
const password = document.getElementById('password');
const repassword = document.getElementById('repassword');

const setError = (element, message, e) => {
    e.preventDefault();
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success');
};
const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');
    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};
const isValidEmail = email => {
    //const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const re =/[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}/;
    return re.test(String(email).toLowerCase());
}

const setVisible = (x) => {
    var element = document.getElementById(x);
    element.style.display = 'block'; 
}
  
const setHide = (x) => {
    var element = document.getElementById(x);
    element.style.display = 'none'; 
}

function validateInputs(e) {
    setSuccess(username);
    setSuccess(phone);
    setSuccess(email);
    setSuccess(password);
    setSuccess(repassword);

    const usernameValue = username.value.trim();
    const phoneValue = phone.value.trim();
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const repasswordValue = repassword.value.trim();

    if(usernameValue === '') {
        setError(username, 'Please enter name', e);
        username.focus();
        return false;
    }  
    else{
        setSuccess(username);
    }

    const phoneno = /^\d{10}$/;
    if(phoneValue === ""){
        setSuccess(phone);
    }
    else if(!phoneValue.match(phoneno)){
        setError(phone, 'Enter valid number', e);
        phone.focus();
        return false;
    }
    else{
        setSuccess(phone);
    }

    if(emailValue === '') {
        setError(email, 'Please enter email', e);
        email.focus();
        return false;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address', e);
        email.focus();
        return false;
    } 
    else{
        setSuccess(email);
    }

    if(passwordValue === '') {
        setError(password, 'Please enter password', e);
        password.focus();
        return false;
    }
    else{
        setSuccess(password);
    }

    if(repasswordValue === '') {
        setError(repassword, 'Please confirm password', e);
        repassword.focus();
        return false;
    } else if(repasswordValue !== passwordValue){
        setError(repassword, 'Password incorrect', e);
        repassword.focus();
        return false;
    }
    else{
        setSuccess(repassword);
    }

    return true;
}

// const btnSubmit = document.getElementById('btn-submit');

// btnSubmit.addEventListener('click', function () {
//     console.log('submit btn click was recorded');

//     if(validateInputs(e)) {
//         form.submit();
//     }
// });

form.addEventListener('submit', function(e) {
    //e.preventDefault();
    console.log('form submit was recorded');
    if(validateInputs(e)){ // ---------------------- >enable this
        if(document.getElementById('btn-submit').innerText === "ADD USER")
            alert("User added Successfully!");
        else if(document.getElementById('btn-submit').innerText === "SIGNUP")
            alert("Signup successfull! Please login to continue");
        //setVisible('loading');
        //form.reset();
        
        // fetch('/users', {method: 'POST'})
        //     .then(function(response) {
        //         if(response.ok) {
        //             console.log('User data submitted');
        //             form.reset();
        //             setHide('loading');
        //             return;
        //         }
        //         throw new Error('User data submission request failed.');
        //     })
        //     .catch(function(error) {
        //         console.log(error);
        // });
    }
})
