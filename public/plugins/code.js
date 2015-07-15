/**
 * Created by Lei on 2014/8/21.
 */

;(function ($) {
    'use strict';

    var ATTR_TAG = "qtip-for";

    $.widget("dl.bsCode", {
        options:{

        },
        _create:function(){
            var $sourceCode = this._getSourceCodeElement();
            if($sourceCode != null){
                this._setSourceCode($sourceCode);
                this.element.qtip({
                    content: {
                        title : "源码",
                        text : function(event, api){
                            return $sourceCode.html();
                        }
                    },
                    style : {
                        classes : "qtip-bootstrap"
                    },
                    position:{
                        at : "right center"
                    },
                    hide:{
                        event : "unfocus"
                    }
                }).on("click",function(){
                    eval(this.options.source_code);
                }.bind(this));
            }
        },
        _getSourceCodeElement:function(){
            var id = this.element.attr("id");
            var $sourceCode = $($.dlFormat("div[{0}='{1}']",ATTR_TAG, id));
            return $sourceCode.size() > 0 ? $sourceCode : null;
        },
        _setSourceCode:function($sourceCode){
            this.options.source_code = $sourceCode.find("code").text().replace(/&gt;/g,">").replace(/&lt;/g,"<");
        }
    });


})(jQuery);