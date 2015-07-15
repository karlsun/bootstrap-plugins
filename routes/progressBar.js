module.exports=function(app){
    app.get("/plugin/progressBar",function(req,res){
        res.render("progressBar/default");
    });
};/**
 * Created by Lei on 2014/8/1.
 */
