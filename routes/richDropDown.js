module.exports=function(app){
    app.get("/plugin/richDropDown",function(req,res){
        res.render("richDropDown/default");
    });
};