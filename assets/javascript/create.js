$(function() {
    var userSessionEntity = null;

    function initializeEventForm(){
        /*var userSessionEntity = {
            "email": "someuser",
            "name": "Ravish Rao",
            "imageUrl": "https://lh4.googleusercontent.com/-Iof98iTcQO8/AAAAAAAAAAI/AAAAAAAAIsk/7mP2ynQOq9U/s96-c/photo.jpg"
        };*/
        userSessionEntity = JSON.parse(sessionStorage.getItem("userSessionEntity"));
        $("#h5EventHost").html("Hosted by <strong>" + userSessionEntity.name + "  </strong><img src='"+ userSessionEntity.imageUrl + "' class='rounded-circle' width='50' height='50'>");
    };
    initializeEventForm();

    function initAutocomplete() {
        // Create the autocomplete object, restricting the search to geographical
        // location types.
        var autocomplete = new google.maps.places.Autocomplete(
            (document.getElementById("eventLoc")));

    };
    initAutocomplete();

    //save button clink event
    $(document).on("click", "#btnCreateEvent", async function(event) {
        event.preventDefault();
        //validate the data
        //if error throw error back
        //update the database with details

        console.log("on click event");

        var crammingClique = {
            "id": null,
            "host": userSessionEntity.email,
            "title": $("#eventTitle").val(),
            "description": $("#eventDesc").val(),
            "where": $("#eventLoc").val(),
            "date": $("#eventDt").val(),
            "time": $("#eventTm").val(),
        };

        try {
            var insertStatus = await insertNewEventDetails(crammingClique);
        } catch (e) {
            console.log(e);
            console.log("I am at 6");
        }
        //redirect the feed page
        window.location.href = "feed.html";
    });


    $('.datepicker').pickadate({
        selectMonths: true, // Creates a dropdown to control month
        selectYears: 15, // Creates a dropdown of 15 years to control year,
        today: 'Today',
        clear: 'Clear',
        close: 'Ok',
        closeOnSelect: false // Close upon selecting a date,
    });

    $('.timepicker').pickatime({
        default: 'now', // Set default time: 'now', '1:30AM', '16:30'
        fromnow: 0, // set default time to * milliseconds from now (using with default = 'now')
        twelvehour: false, // Use AM/PM or 24-hour format
        donetext: 'OK', // text for done-button
        cleartext: 'Clear', // text for clear-button
        canceltext: 'Cancel', // Text for cancel-button
        autoclose: false, // automatic close timepicker
        ampmclickable: true, // make AM PM clickable
        aftershow: function() {} //Function for after opening timepicker
    });

    $('#newCrammingCluqueEvent').on('keyup keypress', function(e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode === 13) {
            e.preventDefault();
            return false;
        }
    });

});