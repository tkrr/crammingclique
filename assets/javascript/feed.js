$(function() {
    //get the current user from session
    //get the current user from session 
    var userSessionEntity = {
        "email": "someuser"
    };
    //var userSessionEntity = JSON.parse(sessionStorage.getItem("userSessionEntity"));
    console.log("In onload on feed.js");

    //get all events from database
    async function loadAllCliques() {
        console.log("In function loadAllCliques");

        var crammingCliques = await getAllCliques();
        //prepopulate all feed data pulled from the table
        crammingCliques.forEach(function(clique) {
            var divClique = $("<div>").addClass("card").attr("id", clique.id);
            divClique.append($("<h6>").addClass("card-text").attr("id", "cliqueTitle").text(clique.title));
            divClique.append($("<h6>").addClass("card-text").attr("id", "cliqueWhen").text(clique.date + " " + clique.time));
            divClique.append($("<h6>").addClass("card-text").attr("id", "cliqueWhere").text(clique.where));
            divClique.append($("<h6>").addClass("card-text").attr("id", "cliqueHost").text(clique.host));
            divClique.append($("<p>").addClass("card-text").attr("id", "cliqueDescription").text(clique.description));

            var attending = false;
            var attendingCount = 1; //1 becuase the host will attend
            var attendeesList = Object.keys(clique.attendees).map(function(key) {
                return clique.attendees[key];
            });

            attendeesList.forEach(function(attendee) {
                attendingCount++;
                if (userSessionEntity.email === attendee.attendee) {
                    attending = true;
                }
            });

            divClique.append($("<h6>").addClass("card-text").attr("id", "cliqueAttendees").text( attendingCount +" people attending"));
            

            //for events for which user is the owner, have manage button
            if (userSessionEntity.email  === clique.host) {
                divClique.append($("<btn>").addClass("btn btn-primary").attr("id", "cliqueManage").text("Manage"));
            } else {
                //for events for which user is not attending, have the register button
                //for events for which user is already attending, have the derister button
                if (attending === true) {
                    divClique.append($("<btn>").addClass("btn btn-primary").attr("id", "cliqueDeRegister").text("De-register"));
                } else {
                    divClique.append($("<btn>").addClass("btn btn-primary").attr("id", "cliqueRegister").text("Register"));
                }
            }
            $("#divCliques").append(divClique)
        });
    };
    loadAllCliques();

    //setup the click event handler on register button
    //validate again to make sure user us not already marked to register
    //update database table with users attending the event info
    //remove the register button and replace it with deregister button
    $(document).on("click", "#cliqueRegister", async function(event) {
        console.log("In function #cliqueRegister");

        var cliqueId = $(this).closest("div").attr("id");
        await registerCliques(cliqueId, userSessionEntity.email);
        $(this).text("De-Register");
        $(this).attr("id", "cliqueDeRegister");
    });


    //setup the click event handler on deregister button
    //validate again to make sure user is already marked as register
    //update database table by removing the users attending the event info
    //remove the deregister button and replace it with register button
    $(document).on("click", "#cliqueDeRegister", async function(event) {
        console.log("In function #cliqueDeRegister");

        var cliqueId = $(this).closest("div").attr("id");
        await deregisterCliques(cliqueId, userSessionEntity.email);
        $(this).text("Register");
        $(this).attr("id", "cliqueRegister");

    });


    //have a database event handler for new events
    //add a new event dynamically to the page

    //have a database event handler for register/deregister events
    //add or remove attendees dynamically to the page

});