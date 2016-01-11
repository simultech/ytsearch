var searchText = [];
var captionsURL = ytplayer.config.args.ttsurl + "&kind=asr&lang=en&fmt=srv1";

var lastTerm = "";

function doSearch() {
	var found = false;
	var searchTerm = $('#ytsearch').val();
	if(searchTerm == lastTerm) {
		return;
	}
	lastTerm = searchTerm;
	for (var i in searchText) {
		if (searchText[i].text.indexOf(searchTerm) > -1) {
			if (!found) {
				var startTime = parseInt(searchText[i].start) - 0.05;
				yt.player.getPlayerByElement("player-api").seekTo(startTime);
				yt.player.getPlayerByElement("player-api").playVideo();
				console.log(searchText[i]);
				found = true;
			}
			searchText[i].el.css({'visibility':'visible'});
		} else {
			searchText[i].el.css({'visibility':'hidden'});
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

			var width = 850;

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

			var searchProgressBar = $('<div></div>');
			searchProgressBar.css({
				'background-color': 'white',
				'height': '10px',
				'width': width+'px',
				'border': '1px solid #999',
				'margin': '20px auto',
    			'display': 'block',
    			'margin-top': '-11px',
    			'position': 'relative'
			});


			searchProgressBar.insertAfter($("#placeholder-player"));

			captions = $(data).find('transcript').find('text');
	  		for(var i=0; i<captions.length; i++) {
	  			var duration = yt.player.getPlayerByElement("player-api").getDuration();
	  			var xpos = parseFloat(captions[i].getAttribute('start'))/parseFloat(duration) * width;
	  			var length = parseFloat(captions[i].getAttribute('dur'))/parseFloat(duration) * width;
	  			var el = $('<div></div>');
	  			el.css({
	  				'background-color': '#fdd',
	  				'width': length+'px',
	  				'left': xpos+'px',
	  				'position':'absolute',
	  				'height':'10px',
	  				'visibility':'hidden'
	  			});
	  			el.data('start',captions[i].getAttribute('start'));
	  			el.click(function() {
	  				yt.player.getPlayerByElement("player-api").seekTo($(this).data('start'));
	  			});
	  			searchText.push({el: el, text: captions[i].innerHTML.toLowerCase(), start: captions[i].getAttribute('start'), duration: captions[i].getAttribute('dur')});
	  			searchProgressBar.append(el);
	  		}

	  		var searchProgressBarCurrentTime = $('<div></div>');
	  		searchProgressBarCurrentTime.css({
	  			'background-color': 'red',
	  			'width': '2px',
	  			'height': '10px',
	  			'left': '0px',
	  			'position': 'absolute'
	  		});
	  		searchProgressBar.append(searchProgressBarCurrentTime);

	  		setInterval(function() {
	  			var currentTime = yt.player.getPlayerByElement("player-api").getCurrentTime();
	  			var duration = yt.player.getPlayerByElement("player-api").getDuration();
	  			var xpos = parseFloat(currentTime)/parseFloat(duration) * width;
	  			searchProgressBarCurrentTime.css({'left': xpos});
	  		},200);

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