
{
    var guid_id = 0;
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    function guid() {
        //return ("guid"+S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        return "guid" + guid_id++;

    }
    var results = [];

    $("ul").each(function() {
        var parent = "";
        if ($(this).parent().length) {
            if ($(this).parent()[0].id)
                parent = "id =" + $(this).parent()[0].id;
            if ($($(this).parent()[0]).attr('class'))
                parent += "class=" + $($(this).parent()[0]).attr('class');
        }
        var className = $(this).attr('class');
        var id = this.id;
        var index = "";

        if (className || id) {
            if (!parent) {
                parent = guid();
            }
            if (id && className)
                item = "#" + id + "." + className;
            else if (id)
                item = "#" + id;
            else
                item = "." + className;

            index = parent + "-" + item;

            //var b = $("DIV.more_body");
            //alert($("DIV.more_body>DIV").length)

            $("ul" + item + ">li").each(function() {

                //alert ("id : " + this.id + " , Class " + className );
                if (index && $(this).text().length) {
                    if (results[index]) {
                        results[index].count += 1;
                        results[index].length += $(this).text().length;

                    } else {
                        results[index] = { length: $(this).text().length, count: 1, item: item, id: id, className: className, parent: parent };
                    }
                }
            });
        }
    })

    var max = -1;
    var s = "Results :\n";
    for (var id in results) {
        if (max == -1)
            max = id;
        if (results[id].count > results[max].count) {
            //if (results[id].length > results[max].length)
                max = id;
        }
        //"[" + results[id].parent + "." + max + "] " +
        s +=  results[id].item + " : " + results[id].count + " , chars : " + results[id].length + "\n";
    }
    alert(s);
    if (max != -1) {
        var item = "";
        var id = results[max].id;
        var className = results[max].className;
        var parent = results[max].parent;
        if (id && className)
            item = "id=" + id + ",class" + className;
        else if (id)
            item = "id=" + id;
        else
            item = "class=" + className;

        alert("Max Element is " + item + " with " + results[max].count + " Divs");
        //    $(results[max].item).each(function() {
        //        //alert($(this).text());
        //        $(this).css("background", "yellow");
        //    });
        alert(item);
        //alert($("#page_right").css("background","yellow"));
        alert(max + "  is guid : " + (max.indexOf('guid') == 0));
        if (max.indexOf('guid') == 0) {
            $("Div[" + item + "]").each(function() {
                //alert($(this).text());
                $(this).css("background", "yellow");
            });
        }
        else {
            $("#" + parent).css("background", "yellow");
        }
    }
}