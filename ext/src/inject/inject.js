chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		// ----------------------------------------------------------

	}
	console.log('honk honk');
	}, 10);
	console.log('wo wo');
});

setTimeout(function() {
	runScript();
}, 1000);

function runScript() {
	var scr = document.createElement('script');
	scr.textContent = '(' + function () { 
    	var captionsURL = ytplayer.config.args.ttsurl + "&kind=asr&lang=en&fmt=srv1";
    	var event = document.createEvent("CustomEvent");  
    	event.initCustomEvent("LoadCaptions", true, true, {"captionsURL":captionsURL});
    	window.dispatchEvent(event); } + ')();'
    scr.textContent; //This is needed
    (document.head || document.documentElement).appendChild(scr);
    scr.parentNode.removeChild(scr);
}

var searchText = {};

function doStuff() {
	console.log("TYPING");
}

window.addEventListener("LoadCaptions", function (e) {

  console.log('====STARTING SCRIPT====');
  console.log('winner 2');
  var captionsURL = e.detail.captionsURL;
  $.ajax({
  	url: captionsURL,
  	dataType: "xml",
  	success: function(data) {
  	  captions = $(data).find('transcript').find('text');
  	  for(var i=0; i<captions.length; i++) {
  	  	searchText[captions[i].innerHTML] = {start: captions[i].getAttribute('start'), duration: captions[i].getAttribute('dur')};
  	  }
  	  console.log(searchText);
      alert( "Load was performed." );
    }
  });
  console.log($("#placeholder-player"));
  $('<input type="text" onKeyUp="doStuff();" />').insertAfter($("#placeholder-player"));
  console.log("DONE");




});