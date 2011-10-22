
{
    // start the system

    var guid_id = 0;

    var results = [];
    startAnalyze($("body"));
    //$("iframe").each(function() { startAnalyze($(this)); });
    
    
    
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    function guid() {
        //return ("guid"+S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        return "guid" + guid_id++;

    }
    function Depth($element, $parent) {
        if ($element && $parent) {
            var depth = 0;
            var el = $element;
            var p = $parent[0];
            while (el[0] && p && el[0] != p) {
                // alert(el[0].tagName);
                depth++;
                el = el.parent();
            };
            return depth;
        }
        return 1;
    }
    function BestContentAlgorithm(record) {
        if (record.count)
            return record.count * record.depth * record.length;
        else return 0;
    }
    function getElementName(id, className) {
        var item;
        if (id && className)
            item = "id=" + id + "." + className;
        else if (id)
            item = "id=" + id;
        else
            item = "class=" + className;
        return item;
    }
    
    function startAnalyze($frame) {
        //alert("Start Analyzing " + $frame);
        //analyze($frame, "Div", "Div");
        //analyze($frame, "ul", "li");
        //analyze($frame, "*", "*");
        
        analyze($frame, "*", "a");
    }

    function analyze($doc, ParentElement, ChildElement) {
        results = [];
        try {
            //alert("Start Anazlyer !");

            //alert(DOM.contents().find(ParentElement).length);
            $(ParentElement).each(function() {
              try {
                var $element = $(this);
                var id = this.id;
                var className = $element.attr('class');
                var index = "";
                var depth = Depth($element, $doc);
                var parent = "";

                // alert($element.text());
                if ($element.parent().length) {
                    var parent_id = $element.parent()[0].id;
                    var parent_class = $($element.parent()[0]).attr('class');
                    parent = getElementName(parent_id, parent_class);
                }

                if (className || id) {
                    if (!parent) {
                        parent = guid();
                    }
                    item = getElementName(id, className);

                    index = parent + "-" + item + depth;

                    //alert("Current Element : " + item);

                    $(ParentElement + "[" + item + "]>" + ChildElement).each(function() {
                      try {
                        var $nestedElement = $(this);
                        //alert ("id : " + this.id + " , Class " + className );
                        if (index && $nestedElement.text().length) {
                            if (results[index]) {
                                // update element data
                                results[index].count += 1; /*$(ParentElement + item + ">" + ChildElement + ">" + ChildElement).length*/
                                results[index].length += $nestedElement.text().length;
                                results[index].depth += depth;

                            } else {
                                // add element data
                                results[index] = { length: $nestedElement.text().length, count: 1, item: item, id: id, className: className, parent: parent, depth: Depth($nestedElement, $doc) };
                            }
                        }                    
                    } catch (e) {
                        alert(e);
                    }});
                }
            
            } catch (e) {
                alert(e);
            }});
        } catch (e) {
            alert(e);
        }
        findBestElement(ParentElement);
    }

    function findBestElement(ParentElement) {
        var max = -1;
        var stat = "";
        for (var id in results) {
            if (max == -1)
                max = id;
            if (BestContentAlgorithm(results[id]) > BestContentAlgorithm(results[max])) {
                //if (results[id].length > results[max].length)
                max = id;
            }
            //"[" + results[id].parent + "." + max + "] " +
            stat += results[id].item + " : " + results[id].count + "  , Depth : " + results[id].depth + " , chars : " + results[id].length + "\n";
        }
        alert(stat);

        if (max != -1) {
            var item = "";
            var id = results[max].id;
            var className = results[max].className;
            var parent = results[max].parent;
            var item = getElementName(id, className);          

            alert("Max Element is " + item);

            //alert(item);
            //alert($("#page_right").css("background","yellow"));
            //alert(max + "  is guid : " + (max.indexOf('guid') == 0));
            if (max.indexOf('guid') != 0) {
                $("[" + parent + "]").css("background", "red");
            }
            $(ParentElement + "[" + item + "]").each(function() {
                //alert($(this).text());
                $(this).css("background", "yellow");
            });

        }
    }
}