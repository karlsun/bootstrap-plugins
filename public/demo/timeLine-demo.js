$(function(){

    var $timeLine = $("#timeLine_demo").bsTimeLine({
        zoom : 60 * 1000 * 60 * 24,
        spanWidth : 130,
        startTime: Date.parse("2014-03-10 14:20:00"),
        endTime: Date.parse("2014-03-10 16:20:00"),
        onChange:function(values){
            console.log(values);
        }
    });
});