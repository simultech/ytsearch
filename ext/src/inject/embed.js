var searchText = [];
var captionsURL = "";
var captionsData = "";

var lastTerm = "";

function setText(text) {
	if(text === '') {
		text = '&nbsp;';
	}
	var searchTerm = $('#ytsearch').val();
	var highlightText = text.replace(searchTerm,'<strong style="color:red">'+searchTerm+'</strong>');
	$('p#captions').html(highlightText);
}

function doSearch() {
	var results = 0;
	var found = false;
	var searchTerm = $('#ytsearch').val();
	if(searchTerm == lastTerm) {
		return;
	}
	lastTerm = searchTerm;
	for (var i in searchText) {
		if (searchText[i].text.indexOf(searchTerm) > -1 && searchTerm !== '') {
			if (!found) {
				var startTime = parseInt(searchText[i].start) - 0.05;
				yt.player.getPlayerByElement("player-api").seekTo(startTime);
				yt.player.getPlayerByElement("player-api").playVideo();
				setText(searchText[i].text);
				found = true;
			}
			searchText[i].el.css({'visibility':'visible'});
			results += 1;
		} else {
			searchText[i].el.css({'visibility':'hidden'});
		}
	}
	if(results != 1) {
		$('#resultNum').text(results + ' results');	
	} else {
		$('#resultNum').text('1 result');	
	}
	if(!found) {
		setText('');
		$('#resultNum').html('&nbsp;');
	}
	//Later - synonyms
	// $.ajax({
	// 	url: 'https://words.bighugelabs.com/api/2/fde6921b4787a02d86c61a73f94f9f33/'+searchTerm+'/json',
	// 	dataType: 'json',
	// 	success: function(data) {
	// 		var syns = [];
	// 		for(var type in data) {
	// 			console.log(data[type].syn);
	// 			syns.concat(data[type].syn);
	// 		}
	// 		console.log("SYN DATA");
	// 		console.log(syns);
 //  		},
	// });
}

function initialize() {
	searchText = [];
	captionsURL = ytplayer.config.args.ttsurl + "&kind=asr&lang=en&fmt=srv1";
	lastTerm = "";
	getCaptions(captionsURL, true);
}

function getCaptions(captionsURL, tryagain) {
	$.ajax({
		url: captionsURL,
		dataType: "xml",
		success: function(data) {
			complete(data);
  		},
  		error: function(err, a, b) {
  			if (tryagain) {
  				console.log('trying again');
	  			//Invalid URL, try the same without &kind=asr
  				captionsURL = ytplayer.config.args.ttsurl + "&lang=en&fmt=srv1";
  				getCaptions(captionsURL, false);
  			}
  		}
	});
}

function complete(data) {
	captionsData = data;
	var vWidth = $('video').width();
	var width = vWidth;

	var ytsearch = $('<input type="text" id="ytsearch" placeholder="Instant Search" />');
	var captions = $('<p id="captions">&nbsp;</p>');
	var resultNum = $('<p id="resultNum">&nbsp;</p>');
	

	ytsearch.css({
		'font-size': '140%',
		'padding': '4px',
		'width': (vWidth-10)+'px',
		'margin': '14px auto',
		'display': 'block'
	});
	captions.css({
		'margin': '0',
		'text-align': 'center',
		'line-height': 0,
		'font-size': '80%',
		'color': '#777'
	});
	resultNum.css({
		'width': '80px',
		'color': '#999',
		'margin-left': '600px',
		'text-align': 'right',
		'margin-top': '-36px',
		'margin-bottom': '36px',
		'font-size': '80%'
	});

	ytsearch.insertAfter($("#placeholder-player"));
	resultNum.insertAfter(ytsearch);
	captions.insertBefore(ytsearch);
	ytsearch.keyup(function() {
			doSearch();
	});

	renderCaptions();
}

function renderCaptions() {

	$('#searchProgressBar').remove();

	var vWidth = $('video').width();
	var width = vWidth;

	$('#ytsearch').width(vWidth-10);
	$('#resultNum').css({'margin-left':(vWidth-90)+'px'});
	
	var searchProgressBar = $('<div id="searchProgressBar"></div>');
	searchProgressBar.css({
		'background-color': 'white',
		'height': '10px',
		'width': width+'px',
		'border': '1px solid #999',
		'margin': '14px auto',
		'display': 'block',
		'margin-top': '-11px',
		'position': 'relative'
	});


	searchProgressBar.insertAfter($("#placeholder-player"));

	captions = $(captionsData).find('transcript').find('text');
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
		el.data('text',captions[i].innerHTML);
		el.click(function() {
			yt.player.getPlayerByElement("player-api").seekTo($(this).data('start'));
			setText($(this).data('text'));
		});
		searchText.push({el: el, text: captions[i].innerHTML.toLowerCase(), start: captions[i].getAttribute('start'), duration: captions[i].getAttribute('dur')});
		searchProgressBar.append(el);
	}

	var searchProgressBarCurrentTime = $('<div id="yttimeline"></div>');
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
}


include('https://ajax.googleapis.com/ajax/libs/jquery/1.7.0/jquery.min.js', function() {
    $(document).ready(function() {
    	$( window ).resize(function() {
			renderCaptions();
		});
		$('.ytp-button').click(function() { renderCaptions(); });
		$("<style type='text/css'> .watch-non-stage-mode #searchProgressBar { margin:-11px 0 14px !important; } </style>").appendTo("head");
		$("<style type='text/css'> .watch-non-stage-mode #ytsearch { margin:14px 0 !important; } </style>").appendTo("head");
    	watchForPageChange();
        initialize();
    });
});

/* WATCHERS */
function watchForPageChange() {
	var target = document.querySelector('head > title');
	var observer = new window.WebKitMutationObserver(function(mutations) {
    	mutations.forEach(function(mutation) {
        	initialize();
    	});
	});
	observer.observe(target, { subtree: true, characterData: true, childList: true });
}

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