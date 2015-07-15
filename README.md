## 说明

> 将Bootstrap提供的组件进行封装并扩展。 

> 使用jQuery.widget进行扩展，需要jquery.ui的core库支持。 

> 使用Grunt打包压缩样式及脚本文件，输出目录：/public/plugins-dist 

> Demo使用node.js + express + jade，先通过npm install安装依赖，启动Demo： node bootstrap-plugins.js

## How to use

> [使用文档](../../wikis/home)

> [Demo](http://172.16.40.146:3000/)

- - -

## Update

> ### 2014-11-17
> * bsRichDropDown : 增加此组件及相关demo。 [文档](../../wikis/RichDropDown)
> * 更新font-awesome至4.2.0

> ### 2014-10-14
> * bsModal : 增加获取button的方法，详情见wiki

> ### 2014-10-13
> * bsTimeLine: 增加时间块拖动功能，并优化所选时间范围提示
> * bsProgressBar: `setVal`增加`speed(ms)`参数，用于设定动画时间

> ### 2014-09-28
> * bsSelector: 修改选中项标签(由div>span改为ul>li);
> * bsSelector: 调用jquery sortable并修改bsSelector的"getSelected"方法，以提供排序、获取数据功能;
> * bsGrid: 调用jquery sortable并增加bsGrid的"getCurrentPageData"方法，以提供排序、获取数据功能;

> ### 2014-08-20
> * bsGrid：自定义列显示判断至少显示一列
> * 修改app.js为bootstrap-plugins.js，便于通过shell控制启停。

> ### 2014-08-05
> * 更新bsProgressBar组件，添加`getVal`方法来获取当前进度条所在位置的百分比

> ### 2014-08-04
> * 添加bsProgressBar组件，用于加载页面等处理过程的提示效果

> ### 2014-07-25
> * 更新bsTimeLine样式

> ### 2014-05-30
> * bsForm添加DropDown、TextAre、Radio、Checkbox、FileUpload

> ### 2014-05-27
> * 添加bsForm,调用方法查看[文档](../../wikis/Form)

> ### 2014-03-20
> * 添加bsMessage,调用方法```$.bsMessage({ content: '', className: 'alert-warning' })```

> ### 2014-03-19
> * bsGrid添加hasCheckBox参数,默认值: false
> * bsGrid修改分页显示
> * bsTimeLine在'转至当前'触发时触发onChange事件

> ### 2014-03-18
> * 去除bsGrid中```table-hover```样式;
> * bsTimeLine添加转至当前功能
> * bsGrid添加全选,并修改'No Data'显示方式并支持自定义

> ### 2014-03-12
> * 添加contextMenu

> ### 2014-02-26
> * bsGrid添加自定显示列功能
> 操作时触发事件```onChangeVisible(column,columns)```

- - -

## TODO List
* bsForm：FileUpload需要优化，配合服务端，完成上传控制、进度显示； 文档编写