chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
	}
	console.log('honk honk');
	}, 10);
	console.log('wo wo');
});

setTimeout(function() {
	runScript();
}, 1000);

function runScript() {
  var s = document.createElement('script');
  s.src = chrome.extension.getURL('src/inject/embed.js');
  s.onload = function() {
    this.parentNode.removeChild(this);
  };
  (document.head || document.documentElement).appendChild(s);
}