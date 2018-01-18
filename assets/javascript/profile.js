$(function() {

    //get the current user from session 
    var userSessionEntity = JSON.parse(sessionStorage.getItem("userSessionEntity"));
    console.log("email from session: ");
    //get connection to database

    //get the user details stored in database
    async function loadProfileData() {
        try {
            var users = await getUserDetailsByEmail(userSessionEntity.email);
            console.log(users);
        } catch (e) {
            console.log(e);
            console.log("I am at 6");
        }
        //prepopulate the profile fields from data pulled from the table                   
        $("#validationName").val(users[0].name);
        $("#userImg").attr("src", users[0].imageUrl);
        $("#phoneNum").val(users[0].phone);
        $("#customCheck1").attr("checked", users[0].receiveTextNotification);


    };
    loadProfileData();




    //save button clink event
    $(document).on("click", "#saveProfileButton", async function(event) {
        event.preventDefault();
        //validate the data
        //if error throw error back
        //update the database with details
        console.log("on click event");

        var users = await getUserDetailsByEmail(userSessionEntity.email);
        console.log(users);
        if (users.length === 0) {
            console.log("Error!! record not found.");
            var crammingUser = {
                "id": userSessionEntity.id,
                "name": $("#validationName").val(),
                "imageUrl": userSessionEntity.imageUrl,
                "email": userSessionEntity.email,
                "phone": $("#phoneNum").val(),
                "receiveTextNotification": $("#customCheck1").is(":checked")
            };
            try {
                var insertStatus = await insertNewUserDetails(crammingUser);
            } catch (e) {
                console.log(e);
                console.log("I am at 6");
            }

        } else {
            console.log("user found" + users[0].name);
            try {
                var updateStatus = await updateUserDetailsByEmail(userSessionEntity.email, {
                    "name": $("#validationName").val(),
                    "phone": $("#phoneNum").val(),
                    "receiveTextNotification": $("#customCheck1").is(":checked")
                });
            } catch (e) {
                console.log(e);
                console.log("I am at 6");
            }

            if (updateStatus === true) {
                console.log("DB updated");
            } else {
                console.log("DB update failed");
            }

        }
        //redirect the feed page
        window.location.href = "feed.html";
    });


});