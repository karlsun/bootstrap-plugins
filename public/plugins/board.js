(function ($) {
    'use strict';
    var BOOTSTRAP_MAX_WIDTH = 12,
        ALL_CONTROLS = "default",
        BOARD_PANEL_CONTROLS = [
            {
                key:"collapse",
                icon: "fa fa-minus",
                title: "",
                onClick: function ($panel) {
                    $(".panel-collapse", $panel).collapse("toggle");
                }
            },
            {
                key:"refresh",
                icon: "fa fa-refresh",
                title: "",
                onClick: function ($panel) {
                    this.refreshContent($panel);
                }
            },
            {
                key:"fullScreen",
                icon: "fa fa-expand",
                title: "",
                onClick: function ($panel, fullScreenEvent) {
                    var ele = $panel.find(".panel-body")[0],
                        self = this;
                    if(ele.requestFullScreen) {
                        ele.removeEventListener("fullscreenchange");
                        ele.requestFullScreen();
                        if(fullScreenEvent){
                            ele.addEventListener("fullscreenchange",function(){
                                fullScreenEvent.call(self,$panel);
                            });
                        }
                    } else if(ele.mozRequestFullScreen) {
                        ele.mozRequestFullScreen();
                        if(fullScreenEvent){
                            ele.onmozfullscreenchange=function(){
                                fullScreenEvent.call(self,$panel);
                            };
                        }
                    } else if(ele.webkitRequestFullScreen) {
                        ele.webkitRequestFullScreen();
                        if(fullScreenEvent){
                            ele.onwebkitfullscreenchange=function(){
                                fullScreenEvent.call(self,$panel);
                            };
                        }
                    }

                }
            },
            {
                key:"operations",
                icon: "fa fa-bars",
                title: "",
                onClick: function ($panel, $control) {
                    var $menus = $panel.find(".operations-menus");
                    if($menus.size() == 0){
                        var menusOptions = $panel.data("_menus_");
                        if(!menusOptions) return false;
                        $menus = $("<div class='btn-group-vertical operations-menus' style='min-width:80px;'></div>");
                        $menus.insertBefore($panel.children().eq(0));
                        $.each(menusOptions,function(index, menu){
                            var $menu = $($.dlFormat(
                                "<button type='button' class='btn btn-default menu'><i class='fa {0}'></i> {1}</button>",
                                menu.icon ? menu.icon : "",
                                menu.label
                            ));
                            $menus.append($menu);
                            $menu.on("click",function(){
                                $menus.hide();
                                menu.onClick($(this), $panel);
                            });
                        });
                        $menus.hover(function(){},function(){
                            $menus.hide();
                        });
                        $panel.hover(function(){},function(){
                            $menus.hide();
                        });
                    }
                    var left = $control.position().left;
                    $menus.css({
                        "margin-left" : left - $menus.outerWidth() - $control.width() - 6
                    }).show();
                }
            },
            {
                key:"remove",
                icon: "fa fa-times",
                title: "",
                onClick: function ($panel) {
                    this.remove($panel);
                }
            }
        ];

    $.widget("dl.bsBoard", {
        options: {
            maxColumn: 3,//必须能被 BOOTSTRAP_MAX_WIDTH 整除
            onAppend: function ($panel) {
            }
        },
        _create: function () {
            this.element.addClass("bsBoard");
            this.options.minSizeWidth = BOOTSTRAP_MAX_WIDTH / this.options.maxColumn;
            this.options.minSizeWidth = this.options.minSizeWidth < 1 ? BOOTSTRAP_MAX_WIDTH : this.options.minSizeWidth;
        },
        _appendControls: function ($panel,opts) {
            var $controls = $("<div class='pull-right'><ul class='list-inline' style='margin-bottom:0px;'></ul></div>"),
                panelControlsStr = opts.controls,
                self = this;
            $(".panel-heading", $panel).append($controls);
            var $controlList = $(".list-inline", $controls),
                panelControls = panelControlsStr && panelControlsStr !== ALL_CONTROLS ? panelControlsStr.split(",") : [];
            $.each(BOARD_PANEL_CONTROLS, function (index, control) {
                if(panelControls.length > 0 && !self._containsControl(control,panelControls)){
                    return true;
                }
                var $control = $($.dlFormat(
                        "<li><a href='javascript:void(0);' title='{0}' data-key='{1}'><i class='{2}'></i></a></li>",
                        control.title,
                        control.key,
                        control.icon
                    )
                );
                $controlList.append($control);
                $("a", $control).click(function () {
                    var eventName = "on" + control.key.substr(0,1).toUpperCase() + control.key.substr(1);
                    if(opts[eventName]){
                        if(opts[eventName].call(self,$panel) !== false){
                            control.onClick.call(self, $panel, opts[eventName]);
                        };
                    }else{
                        control.onClick.call(self, $panel, $control);
                    }
                });
            });
        },
        _containsControl:function(control, panelControls){
            var contains = false;
            $.each(panelControls,function(index, panelControl){
                if(control.key === panelControl){
                    contains = true;
                    return false;
                }
            });
            return contains;
        },
        _appendPanel: function ($panel) {
            var rows = $(".row", this.element),
                panelSize = parseInt($panel.attr("data-size")),
                opts = this.options,
                self = this,
                preRow, preIndex;
            $.each(rows, function (index, row) {
                var $row = $(row),
                    $columns = $row.children(),
                    sizeCount = 0, emptyColumns = [];
                $.each($columns, function (index, column) {
                    var _$column = $(column),
                        _$panel = _$column.find(".panel");
                    if (_$panel.size() > 0) {
                        sizeCount += parseInt(_$panel.attr("data-size"));
                    } else {
                        emptyColumns.push({
                            index: index,
                            column: _$column
                        });
                    }
                });
                if (sizeCount + panelSize <= opts.maxColumn) {
                    //当前情况下肯定有emptyColumns[0]，且足够panelSize
                    var emptyColumn = self._getEmptyColumn($row, emptyColumns[0], panelSize);
                    preIndex = emptyColumn.index;
                    preRow = $row;
                    return false;
                }
            });
            if (!preRow) {
                preRow = this._createRow(panelSize);
                preIndex = 0;
            }
            preRow.children().eq(preIndex).append($panel);
        },
        /*
         * 从某行中空的column中获取needSize大小的column
         * 如果第一个空的column不够needSize，则合并、移动之后的column
         * */
        _getEmptyColumn: function ($row, emptyColumn, needSize) {
            var maxSize = 0,
                totalColumns = $row.children().size(),
                startIndex = emptyColumn.index,
                columnSize = parseInt(emptyColumn.column.attr("data-size")),
                needChangeColumn = needSize != columnSize;
            if (needChangeColumn) {
                var combineColumns = [], afterCombineSize = columnSize;
                for (var i = startIndex + 1; i < totalColumns; i++) {
                    var _$column = $row.children().eq(i),
                        _$panel = _$column.find(".panel");
                    if (_$panel.size() > 0) {
                        _$column.insertBefore($row.children().eq(emptyColumn.index));
                        emptyColumn.index = i;
                    } else {
                        combineColumns.push(_$column);
                        if ((afterCombineSize += parseInt(_$column.attr("data-size"))) >= needSize) {
                            break;
                        }
                    }
                }
                $.each(combineColumns, function (index, $column) {
                    $column.remove();
                });
                this._resizeColumn(emptyColumn.column, needSize);
                for (var i = 0; i < afterCombineSize - needSize; i++) {
                    this._createColumn(1).insertAfter(emptyColumn.column);
                }
            }
            return emptyColumn;
        },
        _createRow: function (firstPanelSize) {
            var $row = $("<div class='row'></div>");
            this.element.append($row);
            $row.append(this._createColumn(firstPanelSize));
            for (var i = 0; i < this.options.maxColumn - firstPanelSize; i++) {
                $row.append(this._createColumn(1));
            }
            return $row;
        },
        _createColumn: function (size) {
            return $($.dlFormat("<div class='col-md-{0}' data-size='{1}'></div>", size * this.options.minSizeWidth, size));
        },
        _resizeColumn: function ($column, size) {
            $column.attr({
                "class": "col-md-" + size * this.options.minSizeWidth,
                "data-size": size
            })
        },
        _onAppendPanel: function ($panel) {
            this.options.onAppend.call(this.element, $panel);
        },
        /*
         * { title:"", content:"", size:1, controls:"", icon:"", menus:[], className:"panel-default" }
         * */
        add: function (opts) {
            if(opts.size > this.options.maxColumn){
                throw new Error("size was out of range.");
                return false;
            }
            var $panel = $($.dlFormat("<div class='panel {0}' data-size='{1}'>", opts.className || "panel-default", opts.size || 1) +
                "<div class='panel-heading panel-heading-move clearfix'>" +
                $.dlFormat("<div class='pull-left'><h3 class='panel-title'>{0}{1}</h3></div>",
                    opts.icon ? "<i class='" + opts.icon + "'></i> " : "",
                    opts.title
                ) +
                "</div>" +
                "<div class='panel-collapse in'>" +
                $.dlFormat("<div class='panel-body panel-body-over-hidden'>{0}</div>", opts.content) +
                "</div>" +
                "</div>");
            this._appendPanel($panel);
            this._appendControls($panel,opts);
            $panel.data("_menus_",opts.menus);
            if(opts.onAppend){
                opts.onAppend($panel);
            }
            this._onAppendPanel($panel);
        },
        update: function () {
        },
        remove: function ($panel) {
            var $row = $panel.parent().parent();
            $panel.remove();
            if($row.find(".panel").size() == 0){
                $row.remove();
            }
        },
        refreshContent: function () {
        },
        collapse: function () {
        },
        collapseAll: function () {
        },
        expand: function () {
        },
        expandAll: function () {
        },
        destroy: function () {
        }
    });

})(jQuery);