(function ($) {

    $.widget("dl.bsTimeLine", {
        options: {
            zoom : 60 * 1000 * 60 * 24,
            spanWidth : 130,
            zoomStep: 10,
            lastTime: (new Date).getTime(),
            maxZoom: 10 * 365 * 24 * 60 * 60 * 1000,
            startTime: (new Date()).getTime() - 24 * 60 * 60 * 1000,
            endTime: new Date(),
            toCurrentRange:12 * 60 * 60 * 1000,
            onChange:function(timeRange){}
        },
        _create: function () {
            this._setContainer();
            this._createTimeLine();
            this._createTimeSelector();
            this._createControls();
        },
        _setContainer: function () {
            this.element.addClass("clearfix bsTimeLine");
        },
        _createTimeLine: function () {
            var $timeLine = $("<div class='bsTimeLine-time-line' onselectstart='return false;'></div>"),
                self = this;
            this.element.append($timeLine);
            this.options.timeLine = $timeLine;
            $timeLine.on("mousewheel",function(e){
                e.preventDefault();
                var up = (e.originalEvent.wheelDelta || e.originalEvent.detail) > 0 ? true : false;
                if(up){
                    self.setZoom("*1.3");
                }else{
                    self.setZoom("/1.3");
                }
            });
        },
        _createControls:function(){
            var $controls = $("<div class='pull-right bsTimeLine-controls'>"+
                                    "<a href='javascript:void(0);' class='link-go-range' data-val='1'>1h</a>"+
                                    " <a href='javascript:void(0);' class='link-go-range' data-val='2'>2h</a>"+
                                    " <a href='javascript:void(0);' class='link-go-range' data-val='3'>3h</a>"+
                                    " <a href='javascript:void(0);' class='link-go-range' data-val='6'>6h</a>"+
                                    " <a href='javascript:void(0);' class='link-go-range' data-val='12'>12h</a>"+
                                    " <a href='javascript:void(0);' class='link-go-range' data-val='24'>1d</a>"+
                                    " <a href='javascript:void(0);' class='link-go-current'>转至当前</a>"+
                                "</div>"),
                self = this;
            this.element.append($controls);
            $controls.on("click","a.link-go-current",function(){
                var now = new Date();
                self.options.lastTime = now.getTime();
                self.options.startTime = now.getTime() - self.options.toCurrentRange;
                self.options.endTime = now.getTime();
                self._refreshTicks(true);
            });
            $controls.on("click","a.link-go-range",function(){
                var $link = $(this),
                    val = +$link.attr("data-val");
                var now = new Date();
                self.options.lastTime = now.getTime();
                self.options.startTime = now.getTime() - val * 60 * 60 * 1000;
                self.options.endTime = now.getTime();
                self._refreshTicks(true);
            });
        },
        _setTimeTicks: function () {
            var opts = this.options,
                maxTick = parseInt(opts.timeLine.innerWidth() / opts.spanWidth),
                tickTemplate = "<div class='time-line-tick' style='left:{0}px;width:{1}px;' title='{2}'>{3}</div>",
                timeSpan = opts.endTime - opts.startTime,
                i = 0, ticks = [];
            opts.zoom = timeSpan > opts.zoom ? timeSpan : opts.zoom;
            var timeStep = parseInt(opts.zoom / maxTick);
            opts.zoom = maxTick * timeStep;
            var pxTime = timeStep / opts.spanWidth;
            opts.zoom += Math.round((opts.timeLine.innerWidth() - opts.spanWidth * maxTick) * pxTime);
            var startTickTime = opts.lastTime - opts.zoom;
            this.options.startTickTime = startTickTime = startTickTime > opts.startTime ? opts.endTime - opts.zoom : startTickTime;

            for(;i <= maxTick;i++){
                this.options.endTickTime = startTickTime + timeStep * i;
                var nextTickTime = new Date(this.options.endTickTime);
                ticks.push($.dlFormat(tickTemplate,
                    opts.spanWidth * i,
                    i === maxTick ? opts.timeLine.innerWidth() - opts.spanWidth * i : opts.spanWidth ,
                    this._getDateStr(nextTickTime, "yyyy-MM-dd hh:mm:ss"),
                    this._getDateStr(nextTickTime)
                ));
            }
            opts.timeLine.append(ticks.join(""));
            this._setRangeTip();
        },
        _refreshSlider : function(refreshValues){
            var _opt = {
                min: this.options.startTickTime,
                max: this.options.startTickTime + this.options.zoom
            };
            if(refreshValues){
                _opt.values = [this.options.startTime,this.options.endTime];
            }
            this.options.timeLine.slider("option", _opt);
        },
        _refreshTicks:function(refreshValues){
            this.options.timeLine.find(".time-line-tick").remove();
            this._setTimeTicks();
            this._refreshSlider(refreshValues || false);
        },
        _createTimeSelector:function(){
            var self = this;
            this.options.timeLine.slider({
                range:true,
                values:[this.options.startTime,this.options.endTime],
                change:function(event, ui){
                    self._onChange(ui.values);
                }
            });
            this._refreshTicks();
            this.options.rangeEle = this.options.timeLine.find(".ui-slider-range");
            this._setRangeEffect();
        },
        _setRangeTip: function(){
            this.__tip =
                this._getDateStr(new Date(this.options.startTime),"yyyy-MM-dd hh:mm:ss")
                + " 至 " +
                this._getDateStr(new Date(this.options.endTime),"yyyy-MM-dd hh:mm:ss") ;
        },
        _getPopoverX:function(){
            var _popoverWidth = this.options.__popover.tip().outerWidth(),
                _timeLineOffsetLeft = this.options.timeLine.offset().left,
                _timeLineWidth = this.options.timeLine.innerWidth(),
                _left = this.options.rangeEle.offset().left + this.options.rangeEle.innerWidth() / 2 - _popoverWidth / 2 - _timeLineOffsetLeft;
            _left = _timeLineWidth < _left + _popoverWidth ? _timeLineWidth - _popoverWidth : _left;
            return _left < 0 ? 0 : _left;
        },
        _setRangeEffect:function(){
            this._setRangeTip();
            this.options.rangeEle.popover({
                title : "当前选择的时间范围",
                trigger : "hover",
                container : this.options.timeLine,
                content : function(){
                  return this.__tip;
                }.bind(this),
                placement : "bottom"
            });
            this.options.__popover = this.options.rangeEle.data("bs.popover");
            this.options.rangeEle.on("shown.bs.popover",function(){
                this.options.__popover.tip().css({
                    left : this._getPopoverX()
                });
            }.bind(this));
            this.options.rangeEle.on("mousedown", function(e){
                var _inst = this.options.timeLine.slider("instance");
                _inst.elementSize = {
                    width: _inst.element.outerWidth(),
                    height: _inst.element.outerHeight()
                };
                _inst.elementOffset = _inst.element.offset();
                this.__startNormValue = _inst._getValueMouse({ x: e.pageX, y: e.pageY });
                this.__moving = true;
                this.__changed = false;
            }.bind(this)).on("mousemove", function(e){
                var _inst = this.options.timeLine.slider("instance");
                if(this.__moving){
                    var normValue = _inst._getValueMouse({ x: e.pageX, y: e.pageY }),
                        _valueDistance = Math.abs(normValue - this.__startNormValue);
                    _valueDistance = Math.round(_valueDistance);
                    if(normValue > this.__startNormValue){
                        this.__startNormValue += _valueDistance;
                        if(this.options.endTime + _valueDistance <= this.options.startTickTime + this.options.zoom){
                            _inst.options.values = [this.options.startTime += _valueDistance, this.options.endTime += _valueDistance];
                            _inst._refreshValue();
                            this._setRangeTip();
                            this.__changed = true;
                        }
                    }else{
                        this.__startNormValue -= _valueDistance;
                        if(this.options.startTime - _valueDistance >= this.options.startTickTime){
                            _inst.options.values = [this.options.startTime -= _valueDistance, this.options.endTime -= _valueDistance];
                            _inst._refreshValue();
                            this._setRangeTip();
                            this.__changed = true;
                        }
                    }
                    this.options.__popover.tip().css({
                        left: this._getPopoverX()
                    }).find(".popover-content").text(this.__tip);
                }
            }.bind(this));
            $(document).on("mouseup", function(){
                if(this.__moving){
                    this.__moving = false;
                    this._setRangeTip();
                    this.options.timeLine.slider("instance").elementSize = null;
                    if(this.__changed) {
                        this.__changed = false;
                        this.options.onChange.call(this.element, [this.options.startTime, this.options.endTime]);
                    }
                }
            }.bind(this));
        },
        _onChangeZoom: function () {
        },
        _getDateStr:function(date, format){
            var units = [
                {
                    name:"yyyy年",
                    val:31536000000
                },
                {
                    name:"yyyy年MM月",
                    val:2592000000
                },
                {
                    name:"MM月dd日",
                    val:604800000
                },
                {
                    name:"dd日 hh:mm",
                    val:36000000
                },
                {
                    name:"hh:mm",
                    val:3600000
                },
                {
                    name:"mm:ss",
                    val:60000
                },
                {
                    name:":ss",
                    val:1000
                },
                {
                    name:"S",
                    val:0
                }
            ];
            var zoom = this.options.zoom;
            if(!format){
                $.each(units, function(index, item){
                    if(zoom > item.val){
                        format = item.name;
                        return false;
                    }
                });
            }
            var o = {
                "M+" : date.getMonth()+1, //month
                "d+" : date.getDate(), //day
                "h+" : date.getHours(), //hour
                "m+" : date.getMinutes(), //minute
                "s+" : date.getSeconds(), //second
                "q+" : Math.floor((date.getMonth()+3)/3), //quarter
                "S" : date.getMilliseconds() //millisecond
            }
            if(/(y+)/.test(format)) format=format.replace(RegExp.$1,
                (date.getFullYear()+"").substr(4- RegExp.$1.length));
            for(var k in o)if(new RegExp("("+ k +")").test(format))
                format = format.replace(RegExp.$1,
                    RegExp.$1.length==1? o[k] :
                        ("00"+ o[k]).substr((""+ o[k]).length));
            return format;
        },
        _onChange:function(values){
            this.options.startTime = values[0];
            this.options.endTime = values[1];
            this._setRangeTip();
            this.options.onChange.call(this.element,values);
        },
        setZoom: function (zoom) {
            if(typeof zoom == "string"){
                this.options.zoom = parseInt(eval(this.options.zoom + zoom));
                this.options.zoom = this.options.zoom > this.options.maxZoom ? this.options.maxZoom : this.options.zoom;
            }else{

            }
            this._refreshTicks();
        },
        getTimeRange: function () {
            return [this.options.startTime, this.options.endTime];
        },
        setTimeRange: function (values) {
            this.options.startTime = values[0];
            this.options.endTime = values[1];
            this._refreshTicks(true);
        },
        getZoom:function(){
            return this.options.zoom;
        },
        getTimer: function () {
        },
        destroy: function () {
        }
    });

})(jQuery);