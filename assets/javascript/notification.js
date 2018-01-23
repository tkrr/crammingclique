function mobileNotifyHost(toMobileNumber, msg) {

    var fd = new FormData();
    fd.append("Body", msg);
    fd.append("To", "+1"+toMobileNumber);
    fd.append("From", "+18179681159");
    console.log(fd);

    $.ajax({
        url: 'https://api.twilio.com/2010-04-01/Accounts/ACf2a2d437f8d915118340617c6af60a97/Messages.json',
        data: fd,
        processData: false,
        contentType: false,
        type: 'POST',
        beforeSend: function(xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + btoa("ACf2a2d437f8d915118340617c6af60a97" + ":" + "77a36fb272fb581051865330b4dd354d"));
        },
        success: function(data) {
        	//Error handing in future
            console.log("Successfully sent notification");
        }
    });
};