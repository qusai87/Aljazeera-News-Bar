chrome_getJSON = function(url, callback) {
    console.log("Sending Ajax Request");
    if (chrome.extension) {
        chrome.extension.sendRequest({ action: 'getJSON', url: url }, callback);
    } else {
        $.getJSON(url, callback);
    }
}

jQuery(function() {
    console.log("Start news Bar");
    var newdiv = document.createElement('div');
    var close = document.createElement('a');
    close.setAttribute("class", "close");
    close.setAttribute("style", "position: absolute;z-index:3; top:10;right:10;");
    close.setAttribute("href", "#");
    close.appendChild(document.createTextNode("[-]"));
    newdiv.innerHTML = '<div id="top_bar"><div id="TICKER" style="overflow: hidden;" class="infotext"></div></div>';
    document.body.insertBefore(newdiv, document.body.firstChild);
    newdiv.insertBefore(close, newdiv.firstChild);
    $('#top_bar').mouseenter(function(){
        TICKER_PAUSED = true;
        }).mouseleave(function() {
        TICKER_PAUSED = false;
        });
    $('a.close').click(function () {

        if (top_bar.style.display != 'none') {
            this.innerHTML = "[+]";
            top_bar.style.display = 'none'
        } else {
            this.innerHTML = "[-]";
            top_bar.style.display = 'block';
        }
        return false;
    });
    
    positionFooter(); 
	function positionFooter(){
		$("#top_bar").css({position: "fixed",top:($(window).scrollTop()+$(window).height()-$("#top_bar").height() - 2)+"px"})	
		$("a.close").css({position: "fixed",top:($(window).scrollTop()+$(window).height()-$("a.close").height() - 10)+"px"})	
	}
 
	$(window)
		.scroll(positionFooter)
		.resize(positionFooter)
    rssfeed("#TICKER","http://aljazeera.net/AljazeeraRss/Rss.aspx?URL=RSS-Portal.xml", {}, function() { ticker_start(); });

});

