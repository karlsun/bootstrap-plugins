(function ($) {
    'use strict';

    var seriesID = (new Date).getTime(),
        BSFORM_CONTROLS = {
            Text:{
                make:function(id, itemSettings){
                    return $.dlFormat("<input type='text' class='form-control' id='{0}' name='{1}' />",
                        id,
                        itemSettings.name
                    );
                },
                getValue:function($form, itemSettings){
                    return $form.find($.dlFormat("input:text[name={0}]",itemSettings.name)).val();
                },
                setValue:function($form, itemSettings, value){
                    $form.find($.dlFormat("input:text[name={0}]",itemSettings.name)).val(value);
                }
            },
            DropDown:{
                make:function(id, itemSettings){
                    var dropdownItem=itemSettings.dropdownitem.split(",");
                    var result=$.dlFormat("<select class='form-control' id='{0}' name='{1}'>",
                        id,
                        itemSettings.name
                    );
                    dropdownItem.forEach(function(item){
                        result+=$.dlFormat("<option value='{0}'>",item)+item+"</option>";
                    })
                    result+="</select>";
                    return result;
                },
                getValue:function($form, itemSettings){
                    var result=$form.find($.dlFormat("select[name={0}] option:selected",itemSettings.name)).val()
                    console.log("DropDown value:"+result);
                    return result;
                },
                setValue:function($form, itemSettings, value){
                    $form.find($.dlFormat("select[name={0}] option[value={1}]",itemSettings.name,value)).prop("selected",true);
                }
            },
            TextArea:{
                make:function(id, itemSettings){
                    return $.dlFormat("<textarea class='form-control' rows='4' id='{0}' name='{1}' />",
                        id,
                        itemSettings.name
                    );
                },
                getValue:function($form, itemSettings){
                    var result=$form.find($.dlFormat("textarea[name={0}]",itemSettings.name)).val();
                    console.log("TextArea value:"+result);
                    return result;
                },
                setValue:function($form, itemSettings, value){
                    $form.find($.dlFormat("textarea[name={0}]",itemSettings.name)).val(value);
                }
            },
            Radio:{
                make:function(id, itemSettings){
                    var radioItem=itemSettings.radioitem.split(",");
                    var result= $.dlFormat("<div id='{0}' >",id);
                    radioItem.forEach(function(item){
                        if(itemSettings.checked == item){
                            result+=$.dlFormat("<label class='radio-inline'><input type='radio' name='{0}' value='{1}' checked='checked' >",
                                itemSettings.name,
                                item
                            )+item+"</label>"}

                        else{
                            result+=$.dlFormat("<label class='radio-inline'><input type='radio' name='{0}' value='{1}' >",
                            itemSettings.name,
                            item
                        )+item+"</label>"
                        }
                    }
                    );
                    result+="</div>";
                    return result;
                },
                getValue:function($form, itemSettings){
                    var result=$form.find("input[type=radio][name="+itemSettings.name+"]:checked").val();
                    console.log("Radio value:"+result);
                    return result;
                },
                setValue:function($form, itemSettings, value){
                   $form.find($("input[type=radio][value='"+value+"']")).prop('checked',true);
                }
            },
            Checkbox:{
                make:function(id, itemSettings){
                    var dropdownItem=itemSettings.checkboxitem.split(",");
                    var result= $.dlFormat("<div id='{0}'>",id);
                    dropdownItem.forEach(function(item){
                            result+= $.dlFormat("<label class='checkbox-inline'><input type='checkbox' name='{0}' value='{1}'>",itemSettings.name,item)+item+"</label> ";
                    });
                    result+="</div>";
                    return result;
                },
                getValue:function($form, itemSettings){
                    var result=[];
                    $form.find($.dlFormat("input[type=checkbox][name={0}]:checked",itemSettings.name)).each(function(){result.push($(this).val());});
                    console.log("Checkbox value:"+result);
                    return result;
                },
                setValue:function($form, itemSettings, value){
                    $form.find($.dlFormat("input[type=checkbox][name={0}]",itemSettings.name)).prop("checked",false);
                    value.forEach(function(item){
                       $("input[type=checkbox][name="+itemSettings.name+"][value="+item+"]").prop("checked",true);
                    });
                }
            },
            FileUpload:{
                make:function(id, itemSettings){
                    return $.dlFormat("<input type='file' class='form-control' id='{0}' name='{1}'>",
                        id,
                        itemSettings.name
                    );
                },
                getValue:function($form, itemSettings){
                    var result=$form.find($.dlFormat("input:file[name={0}]",itemSettings.name)).val();
                    console.log("fileupload value:"+result);
                    return result;
                },
                setValue:function($form, itemSettings, value){
                    $form.find($.dlFormat("input:file[name={0}]",itemSettings.name)).val(value);
                }
            }
        };

    $.widget("dl.bsForm", {
        options: {
            title:"bsForm",
            items:[],
            data: null,
            buttons:[
                {
                    text: "保存",
                    className:"btn-primary",
                    onClick:function(){
                    }
                }
            ]
        },
        _create: function () {
            this.options.container = $("<form class='form-horizontal bsForm' role='form'></form>")
            this.element.append(this.options.container);
            this._initControls();
            this._initButtons();
        },
        _initControls:function(){
            var self = this;
            this.options.items.forEach(function(item){
                self.options.container.append(self._createControl(item));
            });
        },
        _createID:function(item){
            return $.dlFormat("bsForm-{0}-{1}", item.name, seriesID++);
        },
        _createControl:function(item){
            var id = this._createID(item),
                $control = $("<div class='form-group'>"+
                    $.dlFormat("<label class='col-sm-2 control-label' for='{0}'>{1}</label>", id, item.label)+
                    $.dlFormat("<div class='col-sm-10'>{0}</div>",
                        BSFORM_CONTROLS[item.component].make(id, item)+
                        $.dlFormat("<span class='help-block bsForm-help-block' data-name='{0}'>{1}</span>", item.name, item.validTip)
                    )+
                "</div>");
            return $control;
        },
        _initButtons:function(){
            var self = this,
                $buttons = $("<div class='clearfix'></div>");
            this.options.container.append($buttons);
            this.options.buttons.forEach(function(button){
                $buttons.append(self._createButton(button));
            });
        },
        _createButton:function(button){
            var self = this,
                $btn = $($.dlFormat("<div class='pull-right'><button type='button' class='btn {0}'>{1}</button></div>",
                button.className ? button.className : "btn-default",
                button.text
            ));
            $btn.on("click",function(){
                button.onClick.call(self.element);
            });
            return $btn;
        },
        _hideValidTip:function(item){
            this.options.container.find($.dlFormat("span.bsForm-help-block[data-name='{0}']", item.name)).hide().parent().removeClass("has-error");
        },
        _showValidTip:function(item){
            this.options.container.find($.dlFormat("span.bsForm-help-block[data-name='{0}']", item.name)).show().parent().addClass("has-error");
        },
        valid:function(){
            var validFlag = true, self = this;
            this.options.items.forEach(function(item){
                var value = BSFORM_CONTROLS[item.component].getValue(self.options.container, item),
                    flag = true;
                if(value == ""){
                console.log(item.component+"valid value:"+value);
                }
                if(item.required === true && value === ""){
                    console.log(item.component+"valid value 空！");
                    flag = validFlag = false;
                }else if(item.validate){
                    var expr = eval(item.validate);
                    if(!expr.test(value)){
                        flag = validFlag = false;
                    }
                }
                if(flag){
                    self._hideValidTip(item);
                }else{
                    self._showValidTip(item);
                }
            });
            return validFlag;
        },
        getFormValues:function(){
            var formValues = {}, validFlag = false, self = this;
            this.options.items.forEach(function(item){
                formValues[item.name] = BSFORM_CONTROLS[item.component].getValue(self.options.container, item);
            });
            return formValues;
        },
        setFormValues:function(values){
            var self = this;
            var valuesobj = JSON.parse(values);
            this.options.items.forEach(function(item){
                if(typeof valuesobj[item]!=undefined)
                {
                    BSFORM_CONTROLS[item.component].setValue(self.options.container,item,valuesobj[item]);
                }
            });
        },
        destroy:function(){
            this.element.empty();
        }
    });
})(jQuery);