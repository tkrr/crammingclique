firebaseConfig = {
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

async function getUserDetailsByEmail(email) {
    console.log("In function getUserDetailsByEmail");
    var usersSnapshot = await database.ref("/crammingUsers").orderByChild("email").equalTo(email).once("value");
    var users = [];
    if (usersSnapshot.val() === null) {
        return null;
    } else {
        usersSnapshot.forEach(function(child) {
            users.push(child.val());
        });
        return users;
    }
};

async function updateUserDetailsByEmail(email, userDetails) {
    console.log("In function updateUserDetailsByEmail");

    var usersSnapshot = await database.ref("/crammingUsers").orderByChild("email").equalTo(email).once("value");

    if (usersSnapshot.val() === null) {
        return false;
    } else {
        usersSnapshot.forEach(function(child) {
            child.ref.update(userDetails);
        });
        return true;
    }
};

async function insertNewUserDetails(userDetails) {
    console.log("In function updateUserDetailsByEmail");

    await database.ref("/crammingUsers").push(crammingUser);
};

async function insertNewEventDetails(crammingClique) {
    console.log("In function insertNewEventDetails");

    try {
        var newCliqueSnapshot = await database.ref("/crammingClique").push(crammingClique);
        await newCliqueSnapshot.ref.update({
            "id": newCliqueSnapshot.key
        });
        return true;
    } catch (e) {
        return false;
    }
};

async function getAllCliques() {
    console.log("In function getAllCliques");

    var cliqueSnapshot = await database.ref("/crammingClique").orderByChild("date").once("value");
    var cliques = [];
    if (cliqueSnapshot.val() === null) {
        return null;
    } else {
        cliqueSnapshot.forEach(function(clique) {
            cliques.push(clique.val());
        });
        return cliques;
    }
};


async function getCliqueDetails(cliqueId) {
    console.log("In function getCliqueDetails");

    var cliqueSnapshot = await database.ref("/crammingClique").orderByChild("id").equalTo(cliqueId).once("value");
    var cliques = [];
    if (cliqueSnapshot.val() === null) {
        return cliques;
    } else {
        cliqueSnapshot.forEach(function(clique) {
            cliques.push(clique.val());
        });
        return cliques;
    }
};


async function registerCliques(cliqueId, user) {
    console.log("In function registerCliques");

    var cliqueSnapshot = await database.ref("/crammingClique").orderByChild("id").equalTo(cliqueId).once("value");

    if (cliqueSnapshot.val() === null) {
        return false;
    } else {
        cliqueSnapshot.forEach(function(child) {
            child.ref.child("attendees").push({
                "attendee": user
            });
        });
        return true;
    }
};


async function deregisterCliques(cliqueId, user) {
    console.log("In function deregisterCliques");
    var clique;
    var cliqueKey;
    var attendeeKey;
    var cliqueSnapshots = await database.ref("/crammingClique").orderByChild("id").equalTo(cliqueId).once("value");
    
    if (cliqueSnapshots.val() === null) {
        return false;
    } else {
        cliqueSnapshots.forEach( function(element) {
            cliqueKey = element.key;
            clique = element.val();
        });

    }

    Object.keys(clique.attendees).map(function(key) {
        if (clique.attendees[key].attendee === user) {
            attendeeKey = key;
        }
    });

    if (attendeeKey !== null) {
        await database.ref("/crammingClique/" + cliqueKey + "/attendees/" + attendeeKey).remove();
        return true
    } else {
        return false;
    }

};