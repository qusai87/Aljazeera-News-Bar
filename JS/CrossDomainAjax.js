/**
* jQuery.ajax mid - CROSS DOMAIN AJAX 
* ---
* @author James Padolsey (http://james.padolsey.com)
* @version 0.11
* @updated 12-JAN-10
* ---
* Note: Read the README!
* ---
* @info http://james.padolsey.com/javascript/cross-domain-requests-with-jquery/
*/

function filterData(data) {
    // filter all the nasties out
    // no body tags
    data = data.replace(/<?\/body[^>]*>/g, '');
    // no linebreaks
    data = data.replace(/[\r|\n]+/g, '');
    // no comments
    data = data.replace(/<--[\S\s]*?-->/g, '');
    // no noscript blocks
    data = data.replace(/<noscript[^>]*>[\S\s]*?<\/noscript>/g, '');
    // no script blocks
    data = data.replace(/<script[^>]*>[\S\s]*?<\/script>/g, '');
    // no self closing scripts
    data = data.replace(/<script.*\/>/, '');
    // [... add as needed ...]
    return data;
}
function getHTMLAjax(url, callback) {
    // if the URL starts with http
    if (url.match('^http')) {
        var link = "http://query.yahooapis.com/v1/public/yql?" +
                "q=select%20*%20from%20rss%20where%20url%3D%22" +
                encodeURIComponent(url) +
                "%22&format=xml'&callback=?";
        //link = "http: //query.yahooapis.com/v1/yql?q=select%20title%20from%20rss%20where%20url%3D%22http%3A%2F%2Frss.news.yahoo.com%2Frss%2Ftopstories%22&env=http%3A%2F%2Fdatatables.org%2Falltables.env";

        chrome_getJSON(link, 
                function(data) {
                    if (data.results[0]) {
                        //var data = filterData(data.results[0]);
                        //alert(data);
                        callback(data.results);
                        return;
                    }
                }
            );
    } else {
        $.ajax({
            url: url,
            timeout: 5000,
            success: function(data) {
                //alert(data);
                callback(data);
                return;
            },
            error: function(req, error) {
                if (error === 'error') {
                    error = req.statusText;
                    callback(error);
                    return;
                }
            },
            beforeSend: function(data) {
            }
        });
    }
    callback(null);
    return;
}
jQuery.ajax = (function(_ajax) {

    var protocol = location.protocol,
        hostname = location.hostname,
        exRegex = RegExp(protocol + '//' + hostname),
        YQL = 'http' + (/^https/.test(protocol) ? 's' : '') + '://query.yahooapis.com/v1/public/yql?callback=?',
        query = 'select * from html where url="{URL}" and xpath="*"';

    function isExternal(url) {
        return !exRegex.test(url) && /:\/\//.test(url);
    }

    return function(o) {

        var url = o.url;

        if (/get/i.test(o.type) && !/json/i.test(o.dataType) && isExternal(url)) {

            // Manipulate options so that JSONP-x request is made to YQL

            o.url = YQL;
            o.dataType = 'json';

            o.data = {
                q: query.replace(
                    '{URL}',
                    url + (o.data ?
                        (/\?/.test(url) ? '&' : '?') + jQuery.param(o.data)
                    : '')
                ),
                format: 'xml'
            };

            // Since it's a JSONP request
            // complete === success
            if (!o.success && o.complete) {
                o.success = o.complete;
                delete o.complete;
            }

            o.success = (function(_success) {
                return function(data) {

                    if (_success) {
                        // Fake XHR callback.
                        _success.call(this, {
                            responseText: data.results[0]
                            // YQL screws with <script>s
                            // Get rid of them
                                .replace(/<script[^>]+?\/>|<script(.|\s)*?\/script>/gi, '')
                        }, 'success');
                    }

                };
            })(o.success);

        }

        return _ajax.apply(this, arguments);

    };

})(jQuery.ajax);


$(document).ready(function(){
  var container = $('#target');
  container.attr('tabIndex','-1');
  $('.ajaxLink').click(function(){
    var trigger = $(this);
    var url = trigger.attr('href');
    if(!trigger.hasClass('loaded')){
      trigger.append('<span></span>');
      trigger.addClass('loaded');
      var msg = trigger.find('span::last');
    } else {
      var msg = trigger.find('span::last');
    }
    doAjax(url,msg,container);
    return false;
  });


});

