$(function() {
    Materialize.updateTextFields();
    //get the current user from session 
    var userSessionEntity = {
        "email": "ravish.rao@gmail.com",
        "name": "Ravish Rao",
        "imageUrl": "https://lh4.googleusercontent.com/-Iof98iTcQO8/AAAAAAAAAAI/AAAAAAAAIsk/7mP2ynQOq9U/s96-c/photo.jpg",
        "phone": "034394922",
        "receiveTextNotification": true
    };
    //var userSessionEntity = JSON.parse(sessionStorage.getItem("userSessionEntity"));
    console.log("email from session: ");
    //get connection to database

    //get the user details stored in database
    async function loadProfileData() {
        try {
            var users = await getUserDetailsByEmail(userSessionEntity.email);
            console.log(users);
        } catch (e) {
            console.log(e);
        }
        //prepopulate the profile fields from data pulled from the table                   
        $("#userImg").attr("src", users[0].imageUrl);
        $("#userName").val(users[0].name);
        $("#userNameLabel").addClass("active")
        $("#emailinput").val(users[0].email);
        $("#emailinputLabel").addClass("active")
        if (users[0].phone !== null || users[0].phone !== undefined) {
            $("#phoneNum").val(users[0].phone);
            $("#phoneNumLabel").addClass("active")

        }
        $("#mobileNotification").attr("checked", users[0].receiveTextNotification);
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
                "name": $("#userName").val(),
                "imageUrl": userSessionEntity.imageUrl,
                "email": userSessionEntity.email,
                "phone": $("#phoneNum").val(),
                "receiveTextNotification": $("#mobileNotification").is(":checked")
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
                    "name": $("#userName").val(),
                    "phone": $("#phoneNum").val(),
                    "receiveTextNotification": $("#mobileNotification").is(":checked")
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