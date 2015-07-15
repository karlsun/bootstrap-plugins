/**
 * Created by Lei on 2014/5/27.
 */
$(function(){
    $("#form-demo1").bsForm({
        items : [
            {
                component: "Text",
                label: "ID",
                name: "id",
                required: true,
                validTip: "开头必须以ID_开始",
                validate: "/^ID_/"
            },
            {
                component: "TextArea",
                label: "DESC",
                name: "desc",
                required: true,
                validTip: "开头必须以DESC_开始",
                validate: "/^DESC_/"
            },
            {
                component: "Radio",
                label: "RADIO1",
                name: "radio1",
                radioitem:"a,b,c,d",
                checked:"a"
            },
            {
                  component: "DropDown",
                  label: "dropdown1",
                  name: "drop1",
                  dropdownitem:"bread,milk,icecream,potato"
            },
            {
                component: "Checkbox",
                label: "checkbox1",
                name: "ck1",
                checkboxitem:"pen1,pen2,pen3,pen4",
                required: true,
                validTip:"至少选择一项",
                validate: "/[^\s]{1,}/"
            },
            {
                component: "FileUpload",
                label: "File1",
                name: "file1",
                required: true,
                validTip:"请选择文件"
            }
        ],
        buttons:[
            {
                text:"保存",
                className:"btn-primary",
                onClick:function(){
                    if($(this).bsForm("valid")){
                        var formValues = $(this).bsForm("getFormValues");
                        console.log(formValues);
                    }
                }
            }
        ]
    });
});

