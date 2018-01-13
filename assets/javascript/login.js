// Initialize Firebase
var firebaseConfig = {
    apiKey: "AIzaSyCxL4l6YBouk-C92wcTeZ_sZbzQDcR00hE",
    authDomain: "crammingclique.firebaseapp.com",
    databaseURL: "https://crammingclique.firebaseio.com",
    projectId: "crammingclique",
    storageBucket: "crammingclique.appspot.com",
    messagingSenderId: "321767599885"
};
firebase.initializeApp(firebaseConfig);


// Create a variable to reference the database
var database = firebase.database();

var googleAuth;
var googleUser;

gapi.load("auth2", function() {
    googleAuth = gapi.auth2.init({
        client_id: "245751156594-tp337vitvvl9ltm4jhpoirm249v20tsf.apps.googleusercontent.com",
        scope: "profile"
    });
    console.log("api initialized");

    attachSignin(document.getElementById("btn-login"));
});


function attachSignin(element) {
    console.log(element);
    googleAuth.attachClickHandler(element, {},
        function(googleUser) {
            console.log("success signin");
            //$("#btn-login").text("Sign Out");
            console.log(googleUser.getBasicProfile().getName());
            console.log(googleUser.getBasicProfile().getImageUrl());

            var userEntity = {};
            userEntity.id = googleUser.getBasicProfile().getId();
            userEntity.name = googleUser.getBasicProfile().getName();
            userEntity.imageUrl = googleUser.getBasicProfile().getImageUrl();
            userEntity.email = googleUser.getBasicProfile().getEmail();
            userEntity.idToken = googleUser.getAuthResponse().id_token;

            //Store the entity object in sessionStorage where it will be accessible from all pages of the site.
            sessionStorage.setItem("userEntity", JSON.stringify(userEntity));

            var user = database.ref("/crammingUsers/email").equalTo(googleUser.getBasicProfile().getEmail());
            console.log("user in db: " + user);
            if (user === null) {
                console.log("user is null");
                var crammingUser = {
                    "id": googleUser.getBasicProfile().getId(),
                    "name": googleUser.getBasicProfile().getName(),
                    "imageUrl": googleUser.getBasicProfile().getImageUrl(),
                    "email": googleUser.getBasicProfile().getEmail(),
                    "phone": ""
                };

                database.ref("/crammingUsers").push(crammingUser);
            }

            window.location.href = "feed.html";
        },
        function(error) {
            console.log("failed signin" + error);


        });
}

function signOut() {
    googleAuth.signOut().then(function() {
        console.log('User signed out.');
    });
}

function checkIfLoggedIn() {
    if (sessionStorage.getItem("userEntity") == null) {
        return false;
    } else {
        return true;
    }
}