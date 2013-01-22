(function(app){
  var route = Ember.Route.extend({
    model: function(params){
      var model = this.modelFor("search");
      if(params.keyword){
        model.set("keyword", params.keyword);
      }
      return model.search();
    },
    serialize: function(model, params){
      return { keyword: model.get("keyword") };
    },
    setupController: function(controller, model){
      if(typeof model["search"] === "function"){
        model = model.search();
      }
      controller.set("content", model);
    },
    renderTemplate: function(){
      this.render({outlet: "results"});
    }
  });

  var controller = Ember.ArrayController.extend();

  Ember._.exports("Search", "Results", { route: route, controller: controller });
}).call(Movies);
