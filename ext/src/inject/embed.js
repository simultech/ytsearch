var searchText = [];
var captionsURL = ytplayer.config.args.ttsurl + "&kind=asr&lang=en&fmt=srv1";


function doSearch() {
	var searchTerm = $('#ytsearch').val();
	for (var i in searchText) {
		if (searchText[i].text.indexOf(searchTerm) > -1) {
			var startTime = parseInt(searchText[i].start) - 0.05;
			yt.player.getPlayerByElement("player-api").seekTo(startTime);
			yt.player.getPlayerByElement("player-api").playVideo();
			console.log(searchText[i]);
			break;
		}
	}
}

function initialize() {

	console.log('====STARTING SCRIPT====');
	console.log('winner 2');

	$.ajax({
		url: captionsURL,
		dataType: "xml",
		success: function(data) {
	  		captions = $(data).find('transcript').find('text');
	  		for(var i=0; i<captions.length; i++) {
	  			searchText.push({text: captions[i].innerHTML.toLowerCase(), start: captions[i].getAttribute('start'), duration: captions[i].getAttribute('dur')});
	  		}
    		var ytsearch = $('<input type="text" id="ytsearch" placeholder="Instant Search" />');
    		ytsearch.css({
    			'font-size': '140%',
    			'padding': '4px',
    			'width': '80%',
    			'margin': '20px auto',
    			'display': 'block'
    		});
    		ytsearch.insertAfter($("#placeholder-player"));
    		ytsearch.keyup(function() {
      			doSearch();
    		});
    		console.log("Loaded");
  		}
	});

}


include('https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js', function() {
    $(document).ready(function() {
        initialize();
    });
});



/* UTILITY FUNCTIONS */
function include(filename, onload) {
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    script.src = filename;
    script.type = 'text/javascript';
    script.onload = script.onreadystatechange = function() {
        if (script.readyState) {
            if (script.readyState === 'complete' || script.readyState === 'loaded') {
                script.onreadystatechange = null;                                                  
                onload();
            }
        } 
        else {
            onload();          
        }
    };
    head.appendChild(script);
}