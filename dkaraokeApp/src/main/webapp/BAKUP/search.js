/**
 * Created by tunguyen on 7/21/15.
 */
var webSocket = new WebSocket('ws://tu-dell:8080/dkaraoke/chatServerEndpoint');
function search(text) {
    $("#searchResultTable").empty();
    var searchBy = $("#SearchBy :radio:checked").val();
    var matchResutlsArray = [];
    text = text.trim().toLowerCase();
    if(text.length===0)return;
    for (i = 0; i < songData.items.length; i++) {
        id = songData.items[i].id;
        title = songData.items[i].title;
        artist = songData.items[i].artist;
        if(searchBy==="Artist"){
            if(text.length===1){
                if (songData.items[i].artist.toLowerCase().indexOf(text) === 0) {
                    matchResutlsArray[matchResutlsArray.length] = id+ "-" + title + "," +  artist;
                    if(i===1000)i=songData.items.length;
                }
            }else if (songData.items[i].artist.toLowerCase().indexOf(text) != -1) {
                matchResutlsArray[matchResutlsArray.length] = id+ "-" + title + "," +  artist;
            }
        }else{
            if(text.length===1){
                if (songData.items[i].title.toLowerCase().indexOf(text) === 0) {
                    matchResutlsArray[matchResutlsArray.length] = id+ "-" + title + "," +  artist;
                    if(i===1000)i=songData.items.length;
                }
            }else if (songData.items[i].title.toLowerCase().indexOf(text) != -1) {
                matchResutlsArray[matchResutlsArray.length] = id+ "-" + title + "," +  artist;
            }
        }

    }

    if (matchResutlsArray.length > 0) {
// 			deleteAllRows('searchResultTable');
        for (i = 0; i < matchResutlsArray.length; i++) {
            addRow(i,matchResutlsArray[i]);
        }
    }
}

function addRow(row,text) {
    var songID = text.substring(0,text.indexOf('-'));
    if(!isMobileClient){
        var newRowContent = "<div id='" + row + "'><a onclick='addSong(\""+songID+"\");' class='ui-btn ui-mini ui-corner-all ui-icon-plus ui-btn-icon-left'><span>" + text + "</span></a></div>";
        $("#searchResultTable").append(newRowContent);
    }else{
        var newRowContent = "<div id='" + row + "'><a onclick='sendToKaraoke(\""+songID+"\",\"" + text + "\");' class='ui-btn ui-mini ui-corner-all ui-icon-plus ui-btn-icon-left'><span>" + text + "</span></a></div>";
        $("#searchResultTable").append(newRowContent);
    }
}
var songQueue = [];
var selectedSongID;
var songQueueId;
var currentPlayFileName='';
var prevPlayFileName='';
var nextPlayFileName='';
var vlc,fileName;

function getVLC(id) {
    return document.getElementById(id);
}

function registerVLCEvent(event, handler) {
    vlc = getVLC("vlc");
    if (vlc) {
        if (vlc.attachEvent) {          // Microsoft
            vlc.attachEvent (event, handler);
        } else if (vlc.addEventListener) {   // Mozilla: DOM level 2
            vlc.addEventListener (event, handler, false);
        } else {
            // DOM level 0
            vlc["on" + event] = handler;
        }
    }
}

// event callback function for testing

function mediaPlayerOpeningHandler() {
    insertText("playingSongTitle",currentPlayFileName);
}

function mediaPlayerendReachedHandler() {
    next();
}

var threeTrack,twoTrack;
function reUseTrack(){
    var trackCount = vlc.audio.count;
    if(trackCount===3){
        if(threeTrack){
            vlc.audio.track = threeTrack;
        }
    }else{
        if(twoTrack){
            vlc.audio.track = twoTrack;
        }
    }
}
function trackToggle() {
    var trackCount = vlc.audio.count;

    if(trackCount ==3) {
        if(vlc.audio.track==0) {
            vlc.audio.track=1;
        } else if (vlc.audio.track== 1) {
            vlc.audio.track=2;
            if(vlc.audio.track== 1) {
                vlc.audio.track=0;
            }
        } else if (vlc.audio.track== 2) {
            vlc.audio.track=1;
        }
        threeTrack=vlc.audio.track;
    } else 	{
        if (vlc.audio.track == 1) {
            vlc.audio.track = 2;
        } else if (vlc.audio.track == 2) {
            vlc.audio.track = 1;
        }
        twoTrack = vlc.audio.track;
    }
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

function addDennisPlayList() {
    // addFileNameToPlayList("10091   Tinh Yeu Con Dau.Vboys.Unknown");
    addFileNameToPlayList("6345     Mua Chieu Ky Niem.Dam Vinh Hung.Ph");
    addFileNameToPlayList("8938     Tan Phai Giac Mo.Hoang Bach.Tn");
    addFileNameToPlayList("6806     Neu Ngay Do.Dam Vinh Hung.Tn");
    addFileNameToPlayList("11283   Yeu De Roi Biet Xot Xa.David Meng.Tn");
    addFileNameToPlayList("4231     Hay Yeu Nhu Chua Yeu Lan Nao - Quach Tuan Du");
    addFileNameToPlayList("2838     Doc Thoai.Tuan Hung.Unknown");
    addFileNameToPlayList("9055     Thao Thuc Vi Em.Bao Thi.Unknown");
    addFileNameToPlayList("11434   Yeu Trong Doi Cho (Remix).Le Hieu.YSing");
    addFileNameToPlayList("4190     Hay Quay Ve.Phan Dinh Tung.G");
    addFileNameToPlayList("5594     Loi Cuoi Cho Em.Elvis Phuong.Ye");
    addFileNameToPlayList("2773     Dinh Menh.Philip Huy & My Huyen.Unknown");
    addFileNameToPlayList("11417   Yeu Rat That.Quach Tuan Du.Unknown");
    addFileNameToPlayList("8550     Ta Mai Yeu Nhau.Dam Vinh");
    addFileNameToPlayList("4942     Kiep Phieu Bong.Trinh Lam.YSing");
    addFileNameToPlayList("2700     Di Vang Cuoc Tinh.Philip Huy.Unknown");
    addFileNameToPlayList("4218     Hay Ve Voi Anh.Quang Dung.G");
    addFileNameToPlayList("774    Binh Yen Nhe.Cao Thai Son.Unknown");
    addFileNameToPlayList("10884   Vi Anh Yeu Em.Le Hieu.YSing");
    addFileNameToPlayList("2707     Di Vang Nhat Nhoa.Lay Minh & Tu Quyen.Unknown");
    addFileNameToPlayList("6275     Mot Thoi Da Xa.Johnny Dung & Minh Tuyet.Unknown");
    addFileNameToPlayList("4636     Khi Giac Mo Ve.Lam Nhat Tien & Nhu Loan.Unknown");

}

function addFileNameToPlayList(fileName) {
    //var id = vlc.playlist.add("file:///D:/KaraokeNew/karaoke/" + fileName );
    var id = vlc.playlist.add("file:///H:/karaoke/" + fileName );
    return id;
}

function addSong(index) {
    var songI = $("#songIndex");
    if(index) {
        // check songQueue first to see it exists or not
        for (i=0; i < songQueue.length; i++) {
            if(songQueue[i].substring(0, index.length).localeCompare(index) == 0 ) {
                songI.value = '';
                return; // index exists in songQueue
            }
        }
        $("#selectedSongList").empty();
        for (i = 0; i < songData.items.length; i++) {
            if (index.localeCompare(songData.items[i].id) == 0) {
                fileName = songData.items[i].fileName;
                songQueue[songQueue.length]= fileName;
                break;
            }
        }
        // reset the value
        songI.value = '';
        refreshSongQueue();
    }

}
function confirmClearSongs(){
    $("#popupClearList").panel("toggle");
}
function clearAllSongs(){
    vlc.playlist.stop();
    vlc.playlist.clear();
    songQueue = [];
    var selSongL = $("#selectedSongList");
    selSongL.empty();
}
function deleteSong(songQId){
    songQueue.splice(songQId, 1);
    refreshSongQueue();
}
function PlayFirst(songQId){
    if(!songQueue)return;
    vlc.playlist.stop();
    vlc.playlist.clear();
    var tempQueue = [];
    tempQueue[0] = songQueue[songQId];
    songQueue.splice(songQId, 1);
    for (j=0; j<songQueue.length;j++) {
        tempQueue.push(songQueue[j]);
    }
    songQueue = tempQueue;
    refreshSongQueue();
    play();
}
function refreshSongQueue() {
    var selSongL = $("#selectedSongList");
    selSongL.empty();
    // refresh with the new list;
    for (j=0; j<songQueue.length;j++) {
        var str = songQueue[j].split(' ');
        selectedSongID = str[0];
        selSongL.append("<span><a title='"+ extractIndexTitleArtist(songQueue[j]) + "' onclick='songQueueId=\"" + j + "\";' class='ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-play ui-btn-icon-left ui-btn-b' href='#popupMenu' data-transition='slideup' data-rel='popup'>" + selectedSongID + "</a></span>");
        //selSongL.append("<span><a title='"+ extractIndexTitleArtist(songQueue[j]) + "' onmouseover='showSongTitle(\"" + j + "\");' onmouseout='hideSongTitle();' onclick='songQueueId=\"" + j + "\";' class='ui-btn ui-corner-all ui-shadow ui-btn-inline ui-icon-play ui-btn-icon-left ui-btn-b' href='#popupMenu' data-transition='slideup' data-rel='popup'>" + selectedSongID + "</a></span>");
    }
}
function play() {
    if(vlc){
        if(songQueue.length > 0) {
            vlc.playlist.stop();
            vlc.playlist.clear();
            currentPlayFileName = extractIndexTitleArtist(songQueue[0]);
            for (i = 0; i < songQueue.length; i++) {
                addFileNameToPlayList(songQueue[i]);
            }
            $("#songIndex").val("").focus();
            insertText("currentSong", currentPlayFileName);
            reUseTrack();
            vlc.playlist.play();
        }
    }
}
function next() {
    if(songQueue.length > 1) {
        vlc.playlist.stop();
        vlc.playlist.clear();
        deleteSong(0);
        // remove the current song just finish
        for (i = 0; i < songQueue.length; i++) {
            addFileNameToPlayList(songQueue[i]);
        }
        currentPlayFileName=extractIndexTitleArtist(songQueue[0]);
        $("#songIndex").val("").focus();
        reUseTrack();
        insertText("currentSong",currentPlayFileName);
        vlc.playlist.play();
    }
}
function showSongTitleOnDialog(songQueueId){
    var lblSong = $("#lblSong");
    lblSong.empty();
    var str = songQueue[songQueueId].split(' ');
    selectedSongID = str[0];
    lblSong.append(selectedSongID + ": " + extractIndexTitleArtist(songQueue[songQueueId]));
}
function showSongTitle(songQId){
    $("#searchSongTitle").append(extractIndexTitleArtist(songQueue[songQId]));
}
function hideSongTitle(){
    $("#searchSongTitle").empty();
}
function trim1(str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, ''); // remove all whitespace
}

function extractIndexTitleArtist(fileName) {
    if(fileName){
        var index = fileName.split(' ')[0];
        var titleArtistAlbum = fileName.substring(index.length,fileName.length);
        var vars = titleArtistAlbum.split(".");
        if (vars == 'undefined') {
            titleArtistAlbum.query.split("-");
        }

        var title = trim1(vars[0]);
        var artist='';
        if (vars[1]) {
            artist = trim1(vars[1]);
        }
        return title + ' by ' + artist;
    }
}

function insertText (id, text) {
    document.getElementById(id).innerHTML = text;
}

function songIndexKeyPressHandler(event) {
    if(isNaN(event.key) && event.keyCode!== 8 && event.keyCode !== 13){
        event.preventDefault();
    }


    var value;
    if(event.keyCode == 8) {  // backspace
        value = $("#songIndex").val().substring(0, $("#songIndex").val().length-1);
    }else
    {
        if(event.keyCode !== 13)
            value = $("#songIndex").val()+event.key;
        else
            value = $("#songIndex").val();
    }


    if(event.keyCode == 13) {
        addSong(value);
        insertText("searchSongTitle","");
        $("#songIndex").val("").focus();
        if(songQueue.length===1){
            play();
        }
        $('#popupNewSong').panel('toggle');
    } else if( value.length > 0) {
        found=false;
        for (i = 0; i < songData.items.length; i++) {
            if (value.localeCompare(songData.items[i].id) == 0) {
                insertText("searchSongTitle",songData.items[i].title + "," + songData.items[i].artist);
                found=true;
                break;
            }
        }
        if(!found) {
            insertText("searchSongTitle","");
        }
    } else {
        insertText("searchSongTitle","");
    }
}

function searchTextKeyPressHandler(event){
    if(event.keyCode === 13){
        $("#searchResultTable").empty();
        search($("#searchText").val().trim());
        $("#butSearch").focus().select();
    }
}


function registerPlayerEvents(){
    // Register a bunch of callbacks.
    //registerVLCEvent('MediaPlayerNothingSpecial', handleEvents);
    registerVLCEvent('MediaPlayerOpening', mediaPlayerOpeningHandler);
    //registerVLCEvent('MediaPlayerBuffering', handleEvents);
    //registerVLCEvent('MediaPlayerPlaying', handleEvents);
    //registerVLCEvent('MediaPlayerPaused', handleEvents);
    //registerVLCEvent('MediaPlayerForward', handleEvents);
    //registerVLCEvent('MediaPlayerBackward', handleEvents);
    //registerVLCEvent('MediaPlayerEncounteredError', handleEvents);
    registerVLCEvent('MediaPlayerEndReached', mediaPlayerendReachedHandler);
    //registerVLCEvent('MediaPlayerTimeChanged', handleEvents);
    //registerVLCEvent('MediaPlayerPositionChanged', handleEvents);
    //registerVLCEvent('MediaPlayerSeekableChanged', handleEvents);
    //registerVLCEvent('MediaPlayerPausableChanged', handleEvents);
}
// Make the function wait until the connection is made...
function waitForSocketConnection(socket, callback){
    setTimeout(
        function () {
            if (socket.readyState === 1) {
                console.log("Connection is made")
                if(callback != null){
                    callback();
                }
                return;

            } else {
                console.log("wait for connection...")
                waitForSocketConnection(socket, callback);
            }

        }, 5); // wait 5 milisecond for the connection...
}

