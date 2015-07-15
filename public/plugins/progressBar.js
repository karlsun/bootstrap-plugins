/**
 * Created by Lei on 2014/8/1.
 */
;(function($){

    $.widget("dl.bsProgressBar",{
        options:{
        },
        _create:function(){
            this.options.ui = {};
            this.options.percent = 0;
            this._createBg();
            this._createLine();
            this._appendToContainer();
        },
        _createBg:function(){
            this.options.ui.bg = $("<div class='bsProgressBar'></div>");
        },
        _createLine:function(){
            this.options.ui.line = $("<div class='bsProgressBar-line'></div>");
        },
        _appendToContainer:function(){
            var _ui = this.options.ui;
            _ui.bg.append(_ui.line);
            this.element.append(_ui.bg);
            this.options.ui.line_width = _ui.line.innerWidth();
        },
        reset:function(){
            this.setVal(0);
        },
        setVal:function(percent, speed){
            percent = percent > 100 ? 100 : percent;
            percent = percent < 0 ? 0 : percent;
            var _width = this.element.innerWidth(),
                _ui = this.options.ui,
                _lineWidth = _ui.line_width,
                _marginLeft = - _lineWidth + _width * percent / 100,
                _speed = speed || 1000;
            this.options.percent = percent;
            if(percent > 0){
                _ui.line.stop().animate({
                    "margin-left" : _marginLeft
                }, _speed);
            }else{
                _ui.line.stop().css({
                    "margin-left" : _marginLeft
                });
            }
        },
        getVal:function(){
            return this.options.percent;
        },
        destroy:function(){}
    });

})(jQuery);