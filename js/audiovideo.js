var selfEasyrtcid = "";


function connect() {
    console.log("Initializing.");
    easyRTC.setLoggedInListener(convertListToButtons);
    easyRTC.initManaged("audioVideo", "selfVideo", ["callerVideo"], loginSuccess);
	name1 = localStorage.name1;
	if (!name1) {
    	name1 = prompt("What is your name?");
    	localStorage.name1 = name1;
		location.reload();
	}
	for(var name in localStorage) {
    	var name = localStorage[name];
	}
 }


function clearConnectList() {
    otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
}


function convertListToButtons (data) {
    clearConnectList();
    otherClientDiv = document.getElementById('otherClients');
    for(var i in data) {
        var button = document.createElement('button');
        button.onclick = function(easyrtcid) {
            return function() {
                performCall(easyrtcid);
            }
        }(i);

        label = document.createTextNode(easyRTC.idToName(i));
        button.appendChild(label);
		button.className += "btn btn-primary btn-lg";
        otherClientDiv.appendChild(button);
    }
}


function performCall(otherEasyrtcid) {
    easyRTC.hangupAll();
    var acceptedCB = function(accepted, caller) {
        if( !accepted ) {
            easyRTC.showError("CALL-REJECTED", "Sorry, your call to " + easyRTC.idToName(caller) + " was rejected");
        }
    }
    var successCB = function() {};
    var failureCB = function() {};
    easyRTC.call(otherEasyrtcid, successCB, failureCB, acceptedCB);
}


function loginSuccess(easyRTCId) {
    selfEasyrtcid = easyRTCId;
    document.getElementById("iam").innerHTML = "I am " + name1;
}


function loginFailure(message) {
    easyRTC.showError("LOGIN-FAILURE", message);
}


// Sets calls so they are automatically accepted (this is default behaviour)
easyRTC.setAcceptChecker(function(caller, cb) {
    cb(true);
} );


