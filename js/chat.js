var selfEasyrtcid = "";

function addToConversation(who, content) {
    // Escape html special characters, then add linefeeds.
    content = content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    content = content.replace(/\n/g, '<br />');
    document.getElementById('conversation').innerHTML += 
    "<b>" + who + ":</b>&nbsp;" + content + "<br />";
}

function connect() {
    easyRTC.setDataListener(addToConversation);
    easyRTC.setLoggedInListener(convertListToButtons);
    easyRTC.connect("im", loginSuccess, loginFailure);
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

function convertListToButtons (data) {
    otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
    for(var i in data) {        
        var button = document.createElement('button');
        button.onclick = function(easyrtcid) {        
            return function() {
                sendStuffWS(easyrtcid);
		console.log(data);
            }
        }(i);
        var label = document.createTextNode("Send to " + easyRTC.idToName(i));
        button.appendChild(label);
        button.className += "btn btn-primary btn-lg";        
        otherClientDiv.appendChild(button);        
    }
    if( !otherClientDiv.hasChildNodes() ) {
        otherClientDiv.innerHTML = "<em>Nobody else logged in to talk to...</em>";
    }
}


function sendStuffWS(otherEasyrtcid) {    
    var text = document.getElementById('sendMessageText').value;    
    if(text.replace(/\s/g, "").length == 0) { // Don't send just whitespace
        return;
    }
    
    easyRTC.sendDataWS(otherEasyrtcid, text);
    addToConversation("Me", text);
    document.getElementById('sendMessageText').value = "";        
}


function loginSuccess(easyRTCId) {
    selfEasyrtcid = easyRTCId;
    document.getElementById("iam").innerHTML = "I am " + name1;
}


function loginFailure(message) {
    easyRTC.showError("LOGIN-FAILURE", message);
}