module.exports=function(app){
    app.get("/plugin/contextmenu",function(req,res){
        res.render("contextmenu/default");
    });
};