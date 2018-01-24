var path = window.location.pathname;
var page = path.split("/").pop();
function checkLoggedIn() {
    if (page != "index.html" && sessionStorage.getItem("userSessionEntity") == null) {
        console.log("User not signed in. Redirecting to home page.");
        window.location.href = "index.html";
        return;

    }
};
checkLoggedIn();
