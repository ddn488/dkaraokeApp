var stompClient = null;
var remoteControl = null;

function setConnected(connected) {
	console.log('Connected: ' + frame);
}

function connect() {
	var socket = new SockJS('/song');
	stompClient = Stomp.over(socket);
	
	stompClient.connect({}, function(frame) {			
		var subcritionId = stompClient.subscribe('/topic/song', function(message) {
			updateSongQueue(JSON.parse(message.body));
		});
				
	});
	
	//
	var remoteControlSocket = new SockJS('/remoteControl');
	remoteControl = Stomp.over(remoteControlSocket);
	
	remoteControl.connect({}, function(frame) {			
		var remoteControlId =  remoteControl.subscribe('/topic/remoteControl', function(message) {
			playerRemoteControlAction(message.body);
		});
	});
}


function sendRemote(action) {
	remoteControl.send("/app/remoteControl", {}, action);
}

function disconnect() {
	if (stompClient != null) {
		stompClient.disconnect();
	}
	setConnected(false);
	console.log("Disconnected");
}

function addSongIndex(songIndex) {
	var songAction = {action: 'add', songIndex: songIndex};
	stompClient.send("/app/song", {}, JSON.stringify(songAction));
}

function removeSongIndex(songIndex) {
	var songAction = {action: 'remove', songIndex: songIndex};
	stompClient.send("/app/song", {}, JSON.stringify(songAction));
}

// callback function invokes everytime when the client receives the update topic
function updateSongQueue(songIndexList) {
	// songIndexList parameter in the format :  80001,3456	
	// check songQueue first to see it exists or not
	for ( var i=0; i < songIndexList.length; i++) {
		
		var songIndex = songIndexList[i]
		// check song exist in the queue or not
		var notFound=true;
		
		// search in the current songQueue
		if(songQueue.length) {
			for (var j = 0; j < songQueue.length; j++) {
				var first6Char = songQueue[j].substring(0,6);
				var songIndexQueue ='';
				// if file name in format xxxxx.Acds then
				if (first6Char.indexOf('.') == -1) {
					songIndexQueue = first6Char.substring(0, first6Char.indexOf(' '));
				} else {
					songIndexQueue = first6Char.substring(0, first6Char.indexOf('.'));					
				}
				
				if (songIndex === songIndexQueue) {
					notFound = false; // song index exists in songQueue
				}
			}
		}
		
		// if the song index is not in the song q eue then do the followings:
		// 1) Search for the full name of the song in songData based on the songIndex 
		// 2) add the full file name to songQueue
		if(notFound) {
			for ( var k = 0; k < songData.items.length; k++) {
				if (songIndex == songData.items[k].id) {
					fileName = songData.items[k].fileName;
					songQueue[songQueue.length] = fileName; // add new song to queue
					break;
				}
			}
			refreshSongQueue();
		}
	}
}