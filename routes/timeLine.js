
module.exports=function(app){
  app.get("/plugin/timeline",function(req,res){
      res.render("timeLine/default");
  });
};