 var defaults = { limit: 10, header: true, titletag: 'h4', date: true, content: true, snippet: true, showerror: true, errormsg: '', key: null };
 var options = $.extend(defaults, options);
 var element = null;
 var callBack = null;
 function rssfeed(element, url, options, callBack) {
     this.callBack = callBack;
    console.log("Read RSS into " + element);
    this.element = element;
    var $e = $(element);
    if (!$e.hasClass('rssFeed'))
        $e.addClass('rssFeed');
    if (url == null)
        return false;
    var api = "http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q=" + url;
    if (options.limit != null)
        api += "&num=" + options.limit;
    if (options.key != null)
        api += "&key=" + options.key;
    //$.getJSON(api, onGetData);
    /*
    var xhr = new XMLHttpRequest();
    xhr.open("GET", api, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        // JSON.parse does not evaluate the attacker's scripts.
        var resp = JSON.parse(xhr.responseText);
        handleStateChange(resp);
      }
    }
    xhr.send();   */
    var htmlText = getHTMLAjax(url,onLoadHTML);


}
function onLoadHTML(htmlData) {
    if (htmlData) {
        var feeds = htmlToJson(htmlData);
        console.log('RSS contains ' + feeds.length + ' Feeds');         
        LoadFeeds(element, feeds, options, callBack);
    }
}
function htmlToJson(htmlData) {
    var results = [];
    for (var htmlElement in htmlData) {
        results.push(xml2json.parser(htmlData[htmlElement]));
    }
    return results;
}
/*
function handleStateChange(results) {
    console.log("get Json Feed");
    if (data.responseStatus == 200) {
        LoadFeeds(element, results.responseData.feed, options, callBack);
    }
    else if (options.showerror) {
        if (options.errormsg != '') {
             var msg = options.errormsg;
        } else {
            var msg = results.responseDetails;
        };
    }
    $(element).html('<div class="rssError"><p>' + msg + '</p></div>');
}*/
function LoadFeeds(element, feeds, options, callBack) {
    console.log("Load RSS Feeds");
    if (!feeds) { return false; }
    var html = '';
    var row = 'odd';
    if (options.header) {
        //html += '<div class="rssHeader">' + '<a href="' + feeds.link + '" title="' + feeds.description + '">' + feeds.title + '</a>' + '</div>';
    }
    //html += '<div class="rssBody">' + '<ul>';
    for (var i = 0; i < feeds.length; i++) {
        var entry = feeds[i].item;
        var entryDate = new Date(entry.publishedDate);
        var pubDate = entryDate.toLocaleDateString() + ' ' + entryDate.toLocaleTimeString();
        //html += '<li class="rssRow ' + row + '">' + '<' + options.titletag + '><a href="' + entry.link + '" title="View this feed at ' + feeds.title + '">' + entry.title + '</a></' + options.titletag + '>'
        //html += "<span style='background-color: #0088FF;'>;
        html += "<b><a class='ajaxLink' href=" + entry.link + "><font color='#000000' size='3px';>" + entry.title + "</font></a></b>";
        //html += "</span>";
        var imgsrc = 'Aljazeera.png'
        if (chrome.extension)
            imgsrc = chrome.extension.getURL('Aljazeera.png');
        html += " <img src='" +imgsrc+"' width=20 height=20> ";
        if (options.date) {
            //html += '<div>' + pubDate + '</div>'
        }
        if (options.content) {
            if (options.snippet && entry.contentSnippet != '') {
                var content = entry.contentSnippet;
            } else {
                var content = entry.content;
            }
            //html += '<p>' + content + '</p>'
        }
        //html += '</li>'; if (row == 'odd') { row = 'even'; } else { row = 'odd'; }
    }
    //html += '</ul>' + '</div>'
    $(element).html(html);
    callBack();
};