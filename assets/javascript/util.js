var path = window.location.pathname;
var page = path.split("/").pop();
function checkLoggedIn() {
	console.log(page);
	console.log(sessionStorage.getItem("userSessionEntity"))
    if (page != "index.html" && sessionStorage.getItem("userSessionEntity") == null) {
        console.log("redirecting");
        window.location.href = "index.html";
        return;

    }
};
checkLoggedIn();
