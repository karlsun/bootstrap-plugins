/**
 * Created by Lei on 2014/8/1.
 */
$(function(){

    var $container = $("#progressBar-demo").bsProgressBar();

    var percent = 0,
        timer;

    function loading(){
        $container.bsProgressBar("setVal", percent);
        if(percent < 100){
            percent += 10;
            timer = setTimeout(loading, 500);
        }else{
            setTimeout(function(){
                $container.bsProgressBar("reset");
            },500)
        }
    }

    loading();

    $("#btnLoadingAction").on("click",function(){
        clearTimeout(timer);
        percent = 0;
        loading();
    });

    $("#btnWithSpeed").on("click", function(){
        $container.bsProgressBar("setVal", 90, 5000);
        setTimeout(function(){
            $container.bsProgressBar("reset");
        },6000);
    });
});