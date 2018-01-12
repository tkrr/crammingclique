var googleAuth;
var googleUser;

gapi.load("auth2", function() {
    googleAuth = gapi.auth2.init({
        client_id: "245751156594-tp337vitvvl9ltm4jhpoirm249v20tsf.apps.googleusercontent.com",
        scope: "profile"
    });
    attachSignin(document.getElementById("btn-login"));
});


function attachSignin(element) {
    console.log(element);
    googleAuth.attachClickHandler(element, {},
        function(googleUser) {
        	console.log("success signin");
            $("#btn-login").text("Sign Out");
            console.log(googleUser.getBasicProfile().getName());
            console.log(googleUser.getBasicProfile().getImageUrl());
        },
        function(error) {
        	console.log("failed signin" + error);

            alert(JSON.stringify(error, undefined, 2));
        });
}