
module.exports=function(app){
    app.get("/plugin/form",function(req,res){
        res.render("form/default");
    });
};