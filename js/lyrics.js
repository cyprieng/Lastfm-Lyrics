/* Create a LastFM object */
var lastfm = new LastFM({
  apiKey    : 'cd57833c5c49d7a69970e59e04e925ff',
  apiSecret : 'f59eb07f00e25b4fde2463753db7820a',
});

var username = '';
var nowPlaying = '';

/* Retrieve lyrics of the last played song on lastfm */
function loadLyrics(){
	if(username == '')
		return;

	/* Get last lastfm tracks */
	lastfm.user.getRecentTracks({user: username, limit: 2}, {success: function(data){
		if(nowPlaying != data.recenttracks.track[0].artist['#text']+''+data.recenttracks.track[0].name){
			/* Retrieve lyrics */
			$.ajax({
				type: 'GET',
				url: 'http://api.ntag.fr/lyrics/',
				contentType: 'text/plain',
				async: false,
				data: { artist: data.recenttracks.track[0].artist['#text'], title: data.recenttracks.track[0].name}
			}).done(function(lyrics){
				$('#title').html(data.recenttracks.track[0].name + "<br/>by " + data.recenttracks.track[0].artist['#text']);
				$('#lyrics').html(lyrics);
			});

			nowPlaying = data.recenttracks.track[0].artist['#text']+data.recenttracks.track[0].name;
		}

		setTimeout(loadLyrics, 5000);
	}, error: function(code, message){
		$('#lyrics').html("Error while retrieving lastfm tracks. <a href='#' onclick='loadLyrics()'>Reload</a>");
	}});
}

/* Disconnect user */
function disconnect(){
	$('#username').html('Lastfm username<br/><input type="text" /><br/><input type="submit" />');
	$('#title').html('');
	$('#lyrics').html('');
	username = '';
	nowPlaying = '';
	$.removeCookie('username');
}

/* Retrieve username from cookie */
if(typeof $.cookie('username') != 'undefined'){
	username = $.cookie('username');
	$('#username').html("Logged as " + username + " | <a href='#' onclick='disconnect()'>Disconnect</a>");
	loadLyrics();
}

/* Connect form */
$('#username').submit(function(event){
	event.preventDefault();
	username = $('#username input:eq(0)').val();
	$('#username').html("Logged as " + username + " | <a href='#' onclick='disconnect()'>Disconnect</a>");
	$.cookie('username', username);
	loadLyrics();
});