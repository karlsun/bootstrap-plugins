
module.exports=function(app){
    app.get("/plugin/date",function(req,res){
        res.render("date/default");
    });
};