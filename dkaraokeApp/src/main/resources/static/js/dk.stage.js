var songQueue = [];
var currentPlayIndex;
var currentPlayFileName = '';
var prevPlayFileName = '';
var nextPlayFileName = '';
var curSetTrack =1;
var karaokeDrive='C'; // default

function onload() {
	
	
	// load songData js
	var imported = document.createElement('script');
	imported.src = './data/songData.js';
	document.head.appendChild(imported);
	
	
	// make AJAX call to get host address
	$.get("/getHostAddress", function(ip, status){
		document.getElementById("ipAddr").appendChild(document.createTextNode(ip + '/'));
	  //  $("#ipAddr").appendChild(document.createTextNode(ip));
	});
	
	// search Karaoke drive location  C > D > E > F > G
	$.get("/getKaraokeDrive", function(drive, status){
		karaokeDrive =  drive;
	});
	
	connect(); // stomp client connect to server
	
}


function getVLC(id) {
	return document.getElementById(id);
}

function registerVLCEvent(event, handler) {
	var vlc = getVLC("vlc");
	if (vlc) {
		if (vlc.attachEvent) { // Microsoft
			vlc.attachEvent(event, handler);
		} else if (vlc.addEventListener) { // Mozilla: DOM level 2
			vlc.addEventListener(event, handler, false);
		} else {
			// DOM level 0
			vlc["on" + event] = handler;
		}
	}
}

// event callback function for testing

function mediaPlayerOpeningHandler() {
	insertText("playingSongTitle", currentPlayFileName);
}

function mediaPlayerendReachedHandler() {
	
	next();
}

function trackToggle() {
	var trackCount = vlc.audio.count;

	if (trackCount == 3) {
		if (vlc.audio.track == 0) {
			vlc.audio.track = 1;
		} else if (vlc.audio.track == 1) {
			vlc.audio.track = 2;
			if (vlc.audio.track == 1) {
				vlc.audio.track = 0;
			}
		} else if (vlc.audio.track == 2) {
			vlc.audio.track = 1;
		}
	} else {
		if (vlc.audio.track == 1) {
			vlc.audio.track = 2;
		} else if (vlc.audio.track == 2) {
			vlc.audio.track = 1;
		}
	}
	
	curSetTrack = vlc.audio.track;
}

function requestFullScreen() {
	var docElm = document.documentElement;
	if (docElm.requestFullscreen) {
		docElm.requestFullscreen();
	} else if (docElm.mozRequestFullScreen) {
		docElm.mozRequestFullScreen();
	} else if (docElm.webkitRequestFullScreen) {
		docElm.webkitRequestFullScreen();
	} else if (docElm.msRequestFullscreen) {
		docElm.msRequestFullscreen();
	}
}

function cancelFullScreen() {
	if (document.exitFullscreen) {
		document.exitFullscreen();
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen();
	} else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen();
	} else if (document.msExitFullscreen) {
		document.msExitFullscreen();
	}
}
function addFileNameToPlayList(fileName) {
	
	var id = vlc.playlist.add("file:///"+karaokeDrive+":/Karaoke/" + fileName);
	
	return id;
}

function addSong(index) {

	if (index) {
		songIndex.value = '';
		// check songQueue first to see it exists or not
		for (i = 0; i < songQueue.length; i++) {
			if (songQueue[i].substring(0, index.length).localeCompare(index) == 0) {				
				return; // index exists in songQueue
			}
		}
		
		// send songIndex to webSocket "song"
		addSongIndex(index);

	}
}

function refreshSongQueue() {
	// clear them all
	for (i = 0; i < 14; i++) {
		var tdId = 'q' + (i + 1);
		insertText(tdId, '');
	}

	// refresh with the new list;
	for (j = 0; j < songQueue.length; j++) {
		var tdId = 'q' + (j + 1);		
		insertText(tdId, songQueue[j].substring(0, songQueue[j].indexOf(" ")));
	}
}

function trim1(str) {
	return str.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // remove all
															// whitespace
}

function extractSongIndex(fileName) {
	return trim1(fileName.substring(0, fileName.indexOf(" ")));
}

function extractIndexTitleArtist(fileName) {
	var index = trim1(fileName.substring(0, 5));
	var titleArtistAlbum = fileName.substring(5);
	var vars = titleArtistAlbum.split(".");
	if (vars == 'undefined') {
		titleArtistAlbum.query.split("-");
	}

	var title = trim1(vars[0]);
	var artist = '';
	if (vars[1]) {
		artist = trim1(vars[1]);
	}
	return index + ' ' + title + artist;
}

function play() {
	if (songQueue.length > 0) {
		currentPlayFileName = extractIndexTitleArtist(songQueue[0]);
		if (vlc.playlist.items.count == 0) {
			addFileNameToPlayList(songQueue[0]);
		}

		songIndex.focus();
		if (vlc.audio.track > 0) vlc.audio.track = curSetTrack; 
		vlc.playlist.play();
	} else {
		alert("Queue is empty...");
	}
}

function next() {
	if (songQueue.length > 1) {
		vlc.playlist.items.remove(0);
		// remove the current song just finish
		var songIndexRemove = extractSongIndex(currentPlayFileName);
//		// send the remove songIndex to the server
		for (i = 0; i < songQueue.length; i++) {
			if (currentPlayFileName
					.localeCompare(extractIndexTitleArtist(songQueue[i])) == 0) {
								
				songQueue.splice(0, 1); // remove the top item
				refreshSongQueue();				
				break;
			}
		}
		currentPlayFileName = extractIndexTitleArtist(songQueue[0]);
		addFileNameToPlayList(songQueue[0]);
		songIndex.focus();
		

		removeSongIndex(songIndexRemove);

		vlc.playlist.play();

	}
}

function insertText(id, text) {
	document.getElementById(id).innerHTML = text;
}

function songIndexKeyPressHandler(event) {

	var value = songIndex.value + event.key;

	if (event.keyCode == 8) { // backspace
		value = songIndex.value.substring(0, songIndex.value.length - 1);
	}

	if (event.keyCode == 13) {
		addSong(songIndex.value);
		insertText("searchSongTitle", "");
		this.focus();
	} else if (value.length > 0) {
		found = false;
		for (i = 0; i < songData.items.length; i++) {

			if (value.localeCompare(songData.items[i].id) == 0) {
				insertText("searchSongTitle", songData.items[i].title + " "
						+ songData.items[i].artist);
				found = true;
				break;
			}
		}
		if (!found) {
			insertText("searchSongTitle", "");
		}
	} else {
		insertText("searchSongTitle", "");
	}
}

// All short cut for the app defined below here
shortcut.add("Ctrl+T",function() {
	trackToggle();
});

shortcut.add("Ctrl+F",function() {
	requestFullScreen();
});

shortcut.add("Ctrl+P",function() {
	play();
});

shortcut.add("Ctrl+N",function() {
	next();
});

shortcut.add("Ctrl+R",function() {
	rewind();
});

shortcut.add("Ctrl+S",function() {
	pause();
});

