Movies.Router.map(function(){
  this.resource("search", function(){
    this.route("results", { path: "/:keyword" });
  });
});
