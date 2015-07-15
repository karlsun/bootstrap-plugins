;(function($){
    'use strict';

    var ATTR_MODAL_FLAG = "data-bsModal";

    $.widget("dl.bsModal",{
        options:{
            title:"bsModal",
            width:400,
            onHide:function(){},
            buttons:[]
        },
        _create:function(){
            if(this.element.attr(ATTR_MODAL_FLAG)){
                this.show();
            }else{
                this.options.modalEle = $(this._createTemplate());
                $(document.body).append(this.options.modalEle);
                $(".modal-header",this.options.modalEle).css({
                    "background-color":"#3598DB",
                    color : "#fff"
                });
                $(".modal-title",this.options.modalEle).text(this.options.title);
                $(".modal-body",this.options.modalEle).append(this.element);
                this._createButtons();
                this.options.modalEle.modal({backdrop:"static",keyboard:true});
                var self =this;
                this.options.modalEle.on("hidden.bs.modal",function(e){
                    self.options.onHide.call(self.element,e);
                });
                this.element.attr(ATTR_MODAL_FLAG,1);
            }
        },
        _createTemplate:function(){
            var htmlStr = "<div class='modal fade'>"
                            + $.dlFormat("<div class='modal-dialog' style='width:{0};'>",this.options.width + "px")
                                +"<div class='modal-content'>"
                                    +"<div class='modal-header'>"
                                        +"<button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>"
                                        +"<h4 class='modal-title'></h4>"
                                    +"</div>"
                                    +"<div class='modal-body'></div>"
                                    +"<div class='modal-footer'></div>"
                                +"</div>"
                            +"</div>"
                           +"</div>";
            return htmlStr;
        },
        _createButtons:function(){
            var footer = $(".modal-footer",this.options.modalEle)
                ,self =this;
            if(this.options.buttons.length<1){
                footer.remove();
                return;
            }
            var _btnStateTemplate = "data-{0}-text='{1}'";
            this.__button = {};
            $.each(this.options.buttons,function(index,buttonInfo){
                var _status = [];
                if(buttonInfo.status && buttonInfo.status.length >0){
                    $.each(buttonInfo.status, function(n, item){
                        _status.push($.dlFormat(_btnStateTemplate, item.state, item.text));
                    });
                }
                var btn = $($.dlFormat("<button type='button' class='btn' {0}>{1}</button>",
                    _status.join(" "),
                    buttonInfo.text
                ));
                this.__button[buttonInfo.text] = btn;
                footer.append(btn);
                btn.addClass(buttonInfo.className || "btn-default");
                btn.click(function(e){
                    buttonInfo.onClick.call(self.element, e, btn);
                });
            }.bind(this));
        },
        button:function(name){
            return name ? this.__button[name] : this.__button;
        },
        show:function(){
            this.options.modalEle.modal("show");
        },
        hide:function(){
            this.options.modalEle.modal("hide");
        },
        destroy:function(){
            this.options.modalEle.remove();
        }
    });

})(jQuery);