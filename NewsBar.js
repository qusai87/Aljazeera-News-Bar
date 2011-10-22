chrome_getJSON = function(url, callback) {
    console.log("sending RPC");
    chrome.extension.sendRequest({ action: 'getJSON', url: url }, callback);
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
    
    window.setTimeout("placeIt()", 100);
    rssfeed("#TICKER","http://aljazeera.net/AljazeeraRss/Rss.aspx?URL=RSS-Portal.xml", {}, function() { ticker_start(); });

});
function placeIt() {
    if (!document.all) {
        document.getElementById("top_bar").style.top = window.pageYOffset + "px"; // For Mozilla etc.
    } else {
        document.getElementById("top_bar").style.top = document.documentElement.scrollTop + "px"; // For the IE...
    }
}
function ShowHide(a) {

    if (document.getElementById('top_bar').style.display != 'none') {
        a.innerHTML = "[+]";
        document.getElementById('top_bar').style.display = 'none'
    } else {
        a.innerHTML = "[-]";
        document.getElementById('top_bar').style.display = 'block';
    }
}
