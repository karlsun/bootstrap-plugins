(function($){

    $("#dropdown").bsRichDropDown({
        width: 220,
        data:["a", "b", "c"],
        itemFormat:function(data){
            return "Item: " + data;
        },
        resultFormat:function(data){
            return "Result: " + data;
        }
    });

})(jQuery);