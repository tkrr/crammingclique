$(function() {
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

    // Google login initialization
    var googleAuth;
    var googleUser;
    /**
     * Listener method for sign-out live value.
     *
     * @param {boolean} val the updated signed out state.
     */
    var signinChanged = function(val) {
        console.log('Signin state changed to ', val);
        document.getElementById('signed-in-cell').innerText = val;
    };


    gapi.load("auth2", function() {
        googleAuth = gapi.auth2.init({
            client_id: "245751156594-tp337vitvvl9ltm4jhpoirm249v20tsf.apps.googleusercontent.com",
            scope: "profile"
        });
        googleLogin(document.getElementById("btnLogin"));
        googleLogin(document.getElementById("btnRegisterNewUser"));
        // Listen for sign-in state changes.
        //googleAuth.isSignedIn.listen(signinChanged);

    });


    function googleLogin(element) {
        googleAuth.attachClickHandler(element, {},
            function(googleUser) {
                console.log("google login successful");

                //Store the entity object in sessionStorage where it will be accessible from all pages of the site.
                var userSessionEntity = {};
                userSessionEntity.id = googleUser.getBasicProfile().getId();
                userSessionEntity.name = googleUser.getBasicProfile().getName();
                userSessionEntity.imageUrl = googleUser.getBasicProfile().getImageUrl();
                userSessionEntity.email = googleUser.getBasicProfile().getEmail();
                userSessionEntity.idToken = googleUser.getAuthResponse().id_token;
                sessionStorage.setItem("userSessionEntity", JSON.stringify(userSessionEntity));

                database.ref("/crammingUsers").orderByChild("email").equalTo(googleUser.getBasicProfile().getEmail()).once("value", function(snapshot) {
                    if (snapshot.val() !== null) {
                        console.log("record found: " + snapshot);
                        window.location.href = "feed.html";
                        return;
                    } else {
                        console.log("user is not null");
                        var crammingUser = {
                            "id": googleUser.getBasicProfile().getId(),
                            "name": googleUser.getBasicProfile().getName(),
                            "imageUrl": googleUser.getBasicProfile().getImageUrl(),
                            "email": googleUser.getBasicProfile().getEmail(),
                            "phone": "",
                            "receiveTextNotification": true
                        };
                        database.ref("/crammingUsers").push(crammingUser);
                        window.location.href = "profile.html";
                    }

                });
            },
            function(error) {
                console.log("failed signin" + error);
            });
    }



    $(document).on("click", "#navSignout", async function(event) {
        console.log("In function Signout");

        googleAuth.signOut().then(function() {
            sessionStorage.removeItem("userSessionEntity");
            console.log('User signed out.');
            window.location.href = "index.html";
        });
    });
});