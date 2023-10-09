const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener('click', () =>{
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener('click', () =>{
    container.classList.remove("sign-up-mode");
});


var username;
var password;
var personalname;
var poolData;
var checkUserToken;
    
function registerButton() {

personalname =  document.getElementById("personalnameRegister").value;	
username = document.getElementById("emailInputRegister").value;

if (document.getElementById("passwordInputRegister").value != document.getElementById("confirmationpassword").value) {
    alert("Passwords Do Not Match!")
    throw "Passwords Do Not Match!"
} else {
    password =  document.getElementById("passwordInputRegister").value;	
}

poolData = {
        UserPoolId : _config.cognito.userPoolId, // Your user pool id here
        ClientId : _config.cognito.clientId // Your client id here       
};		
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

var attributeList = [];

var dataEmail = {
    Name : 'email', 
    Value : username, //get from form field
};


var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(dataEmail);

attributeList.push(attributeEmail);

userPool.signUp(username, password, attributeList, null, function(err, result){
    if (err) {
        alert(err.message || JSON.stringify(err));
        return;
    }
    cognitoUser = result.user;
    //change elements of page
    setTimeout(() => {
        document.getElementById("titleheader").innerHTML = "Check your email for a verification link";
        document.getElementById("titleheader").style.display = "block"; 
    }, 1000);

    setTimeout(() => {
        container.classList.remove("sign-up-mode");       
    }, 3000);

});
}



// Login Code
function signInButton() {
    
	var authenticationData = {
        Username : document.getElementById("inputUsernameLogin").value,
        Password : document.getElementById("inputPasswordLogin").value,
    };
	
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    
	var poolData = {
        UserPoolId : _config.cognito.userPoolId, // Your user pool id here
        ClientId : _config.cognito.clientId, // Your client id here
    };
	
    var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
	
    var userData = {
        Username : document.getElementById("inputUsernameLogin").value,
        Pool : userPool,
    };
	
    var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
    
	cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
			var accessToken = result.getAccessToken().getJwtToken();
			checkUserToken = localStorage.setItem("token",accessToken);
            window.location.href = "/profile.html";
        },

        onFailure: function(err) {
            alert(err.message || JSON.stringify(err));
        },
    });
  }

  if( localStorage.getItem("token").length > 0 ) {
    window.location.href = "/profile.html";
  }
