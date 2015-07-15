
;(function($){
    'use strict';

    $.widget("dl.bsRichDropDown",{
        options:{
            data: null,
            width : 220,
            onSearch:function(q, callback){
                if(this.options.data || this.options.data.length > 0){
                    var _regex = new RegExp(q),
                        _targetData = [];
                    $.each(this.options.data, function(n, item){
                        if(_regex.test(this._getText(item))){
                            _targetData.push(item);
                        }
                    }.bind(this));
                    callback(_targetData);
                }
            },
            onSelect:function(item){},
            itemFormat: function(dataItem){
                return typeof dataItem === "string" ? dataItem : dataItem.text;
            },
            resultFormat: function(dataItem){
                return typeof dataItem === "string" ? dataItem : dataItem.text;
            }
        },
        _ele:{},
        _cache : null,
        _create:function(){
            this._createSelectPanel();
            this._eventBind();
            this._cache = this.options.data;
        },
        _init:function(){
            this._setSelectItems(this._cache);
        },
        _eventBind:function(){
            var _self = this;
            this.element.on("click", function(e){
                _self._showSelectPanel();
                e.stopPropagation();
                e.preventDefault();
                return false;
            }).on("keydown", function(e){
                if(!_self._cache || _self._cache.length === 0){
                    return;
                }
                if(!_self._isSelectPanelShow()){
                    if(e.keyCode === $.ui.keyCode.UP || e.keyCode === $.ui.keyCode.DOWN){
                        _self._showSelectPanel();
                    }
                    return;
                }
                var _$selected = _self._ele.$selectUL.find(">li.selected"),
                    _index = _$selected.size() > 0 ? _$selected.index() : -1;
                switch (e.keyCode){
                    case $.ui.keyCode.ENTER:
                        if(_$selected.size() > 0) _self._onSelect(_$selected);
                        break;
                    case $.ui.keyCode.UP:
                        if(--_index < 0){
                            _index = _self._cache.length - 1;
                        }
                        if(_$selected.size() > 0) _$selected.removeClass("selected");
                        _self._ele.$selectUL.children().eq(_index).addClass("selected");
                        break;
                    case $.ui.keyCode.DOWN:
                        if(++_index >= _self._cache.length){
                            _index = 0;
                        }
                        if(_$selected.size() > 0) _$selected.removeClass("selected");
                        _self._ele.$selectUL.children().eq(_index).addClass("selected");
                        break;
                    default:
                        // do nothing
                        break;
                }
            });
            this._ele.$selectControl.on("click", function(e){
                e.stopPropagation();
                e.preventDefault();
                return false;
            });
            $(window).on("click", function(e){
                if(!_self._ele.$selectControl.hasClass("hide")){
                    _self._ele.$selectControl.addClass("hide");
                }
            });
            var _$searchInput = this._ele.$selectControl.find(".select-search-input input.search-input");
            var _$searchLink = this._ele.$selectControl.find(".select-search-input a.search-link").on("click", function(){
                var _q = _$searchInput.val();
                _self._doFilterAction(_q);
                _self.element.focus();
            });
            _$searchInput.on("keyup", function(e){
                if(e.keyCode === $.ui.keyCode.ENTER){
                    _$searchLink.click();
                }
            }).on("keydown", function(e){

            });
            this._ele.$selectUL.on("click", "li.item", function(e){
                _self._onSelect($(this));
            });
        },
        _onSelect:function($item){
            var _index = $item.index(),
                _dataItem = this._cache[_index];
            this.element.val(this.options.resultFormat(_dataItem));
            this._hideSelectPanel();
            this.options.onSelect(_dataItem);
        },
        _doFilterAction:function(q){
            this._ele.$searchIcon.removeClass("hide");
            this.options.onSearch.call(this, q, function(data){
                this._ele.$searchIcon.addClass("hide");
                this._cache = data;
                this._setSelectItems(this._cache);
            }.bind(this));
        },
        _showSelectPanel:function(){
            var _offset = this.element.offset(),
                _height = this.element.innerHeight();
            this._ele.$selectControl.removeClass("hide").css({
                left : _offset.left,
                top : _offset.top + _height + 4
            });
            if(this._cache && this._cache.length > 0){
                this._ele.$selectUL.find(">li.selected").removeClass("selected");
            }
        },
        _hideSelectPanel:function(){
            this._ele.$selectControl.addClass("hide");
        },
        _isSelectPanelShow:function(){
            return !this._ele.$selectControl.hasClass("hide");
        },
        _createSelectPanel:function(){
            var _$selectControl = $("<div class='richDropDown hide'>"+
                                        "<div class='select-search-input'>"+
                                            "<input type='text' class='form-control input-sm search-input' placeholder='关键字' />"+
                                            "<i class='fa fa-circle-o-notch hide search-loading'></i>"+
                                            "<a class='search-link' href='javascript:void(0);'><i class='fa fa-search fa-lg'></i></a>"+
                                        "</div>"+
                                        "<div class='select-pool'>"+
                                            "<div class='select-pool-empty'><i>No data exists.</i></div>"+
                                            "<ul class='list-unstyled'></ul>"+
                                        "</div>"+
                                    "</div>");
            _$selectControl.width(this.options.width);
            $(document.body).append(_$selectControl);
            this._ele.$selectControl = _$selectControl;
            this._ele.$selectUL = _$selectControl.find("div.select-pool ul");
            this._ele.$emptyTip = _$selectControl.find("div.select-pool-empty");
            this._ele.$searchIcon = _$selectControl.find("i.search-loading");
            _$selectControl.find(".search-input").width(this.options.width - 78);
        },
        _setSelectItems:function(data){
            if(data && data.length > 0){
                var _itemsHtml = [];
                $.each(data, function(n, item){
                    _itemsHtml.push(this._makeItem(item));
                }.bind(this));
                this._ele.$emptyTip.addClass("hide");
                this._ele.$selectUL.empty().append(_itemsHtml.join(""));
            }else{
                this._ele.$emptyTip.removeClass("hide");
                this._ele.$selectUL.empty();
            }
        },
        _makeItem:function(dataItem){
            var _item = $.dlFormat("<li class='item'>{0}</li>", this._getText(dataItem));
            return _item;
        },
        _getText:function(dataItem){
            return this.options.itemFormat(dataItem);
        },
        destroy: function(){
            this._ele.$selectControl.remove();
        }
    });

})(jQuery);