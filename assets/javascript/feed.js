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

        crammingCliques.forEach(async function(clique) {

            var attending = false;
            var attendingCount = 1; //1 becuase the host will attend
            console.log(clique.attendees);
            if (clique.attendees !== null && clique.attendees !== undefined) {
                var attendeesList = Object.keys(clique.attendees).map(function(key) {
                    return clique.attendees[key];
                });


                attendeesList.forEach(function(attendee) {
                    attendingCount++;
                    if (userSessionEntity.email === attendee.attendee) {
                        attending = true;
                    }
                });
            }
            //divClique.append($("<h6>").addClass("card-text").attr("id", "cliqueAttendees").text(attendingCount + " people attending"));
            var divClique = $("<div>").addClass("col-sm-3").attr("id", clique.id);

            var divCliqueCard = $("<div>").addClass("card feedCard");

            var titleElement = $("<h3>").addClass("card-title feedCardTitle").text(clique.title);
            var cardBlock = $("<div>").addClass("card-block");
            cardBlock.append(titleElement);
            divCliqueCard.append(cardBlock);

            var btnModal = $("<button>").addClass("btn btn-primary").text("Details");
            btnModal.attr("type", "button");
            btnModal.attr("data-toggle", "modal");
            btnModal.attr("data-target", "#modal" + clique.id);
            var cardFooter = $("<div>").addClass("card-footer feedCardFooter").text(attendingCount + " attending this event");
            cardFooter.append(btnModal);
            divCliqueCard.append(cardFooter);
            divClique.append(divCliqueCard);

            $("#divCliques").append(divClique)

            var cliqueHost = await getUserDetailsByEmail(clique.host);
            console.log(cliqueHost[0]);

            var divModalHeader = $("<div>").addClass("modal-header");
            var pModalUser = $("<p>");
            var imgHost = $("<img>").addClass("rounded-circle").attr("src", cliqueHost[0].imageUrl).attr("width","50").attr("height","50");
            pModalUser.append(imgHost);
            pModalUser.append($("<span>").html(" Organizer: "+ cliqueHost[0].name));
            divModalHeader.append(pModalUser);
            var btnCliqueModalClose = $("<button>").addClass("close");
            btnCliqueModalClose.attr("type", "button");
            btnCliqueModalClose.attr("data-dismiss", "modal");
            btnCliqueModalClose.attr("aria-label", "Close");
            btnCliqueModalClose.append($("<span>").attr("aria-hidden", "true").text("x"));
            divModalHeader.append(btnCliqueModalClose);


            var divModalBody = $("<div>").addClass("modal-body");
            divModalBody.append($("<p>").text("Date & Time: " + clique.date + " at " + clique.time));
            divModalBody.append($("<p>").text("Location: " + clique.where));
            divModalBody.append($("<p>").text("Description: " + clique.description));


            //for events for which user is the owner, have manage button
            var divModalFooter = $("<div>").addClass("modal-footer");
            if (userSessionEntity.email === clique.host) {
                //divClique.append($("<btn>").addClass("btn btn-primary").attr("id", "cliqueManage").text("Manage"));
                var btnCliqueManage = $("<button>").addClass("btn btn-secondary").attr("id", "cliqueManage").attr("data-info",clique.id).text("Manage");
                divModalFooter.append(btnCliqueManage);

            } else {
                //for events for which user is not attending, have the register button
                //for events for which user is already attending, have the derister button
                if (attending === true) {
                    //divClique.append($("<btn>").addClass("btn btn-primary").attr("id", "cliqueDeRegister").text("De-register"));
                    var btnCliqueManage = $("<button>").addClass("btn btn-secondary").attr("id", "cliqueDeRegister").attr("data-info",clique.id).text("De-register");
                    divModalFooter.append(btnCliqueManage);

                } else {
                    //divClique.append($("<btn>").addClass("btn btn-primary").attr("id", "cliqueRegister").text("Register"));
                    var btnCliqueManage = $("<button>").addClass("btn btn-secondary").attr("id", "cliqueRegister").attr("data-info",clique.id).text("Register");
                    divModalFooter.append(btnCliqueManage);

                }
            }



            var divModalContent = $("<div>").addClass("modal-content");
            divModalContent.append(divModalHeader);
            divModalContent.append(divModalBody);
            divModalContent.append(divModalFooter);

            var divModalDialog = $("<div>").addClass("modal-dialog modal-dialog-centered").attr("role", "document");
            divModalDialog.append(divModalContent);

            var divCliqueModal = $("<div>").addClass("modal fade").attr("id", "modal" + clique.id);
            divCliqueModal.attr("tabindex", "-1");
            divCliqueModal.attr("role", "dialog");
            divCliqueModal.attr("aria-labelledby", "exampleModalCenterTitle");
            divCliqueModal.attr("aria-hidden", "true");
            divCliqueModal.append(divModalDialog);

            $("#divCliques").append(divCliqueModal);

        });
    };
    loadAllCliques();

    //setup the click event handler on register button
    //validate again to make sure user us not already marked to register
    //update database table with users attending the event info
    //remove the register button and replace it with deregister button
    $(document).on("click", "#cliqueRegister", async function(event) {
        console.log("In function #cliqueRegister");

        var cliqueId = $(this).attr("data-info");
        await registerCliques(cliqueId, userSessionEntity.email);
        var cliqueDetails = await getCliqueDetails(cliqueId);
        var cliqueHostDetails = await getUserDetailsByEmail(cliqueDetails[0].host);
        if(cliqueHostDetails[0].receiveTextNotification && (cliqueHostDetails[0].phone !== null || cliqueHostDetails[0].phone !== undefined)){
            mobileNotifyHost(cliqueHostDetails[0].phone,"Cramming user "+userSessionEntity.email+ " will be joining your clique titled "+cliqueDetails[0].title);    
        }
        
        $(this).text("De-Register");
        $(this).attr("id", "cliqueDeRegister");
    });


    //setup the click event handler on deregister button
    //validate again to make sure user is already marked as register
    //update database table by removing the users attending the event info
    //remove the deregister button and replace it with register button
    $(document).on("click", "#cliqueDeRegister", async function(event) {
        console.log("In function #cliqueDeRegister");

        var cliqueId = $(this).attr("data-info");
        await deregisterCliques(cliqueId, userSessionEntity.email);
        $(this).text("Register");
        $(this).attr("id", "cliqueRegister");

    });


    //have a database event handler for new events
    //add a new event dynamically to the page

    //have a database event handler for register/deregister events
    //add or remove attendees dynamically to the page

});