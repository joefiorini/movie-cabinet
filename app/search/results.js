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

  var loadsMore = Ember.Mixin.create(Ember.Evented, {
    canLoadMore: true,
    autoFetch: true,
    currentPage: 1,
    resetLoadMore: function(){
      this.set("currentPage", 1);
    },
    loadMore: Ember.K
  });

  var controller = Ember.ArrayController.extend(loadsMore, {
    searcher: function(){
      return this.container.lookup("route:search").modelFor("search");
    }.property(),
    canLoadMore: function(){
      var searcher = this.get("searcher");
      return searcher.get("hasMoreResults");
    }.property("searcher.hasMoreResults"),
    loadMore: function(){
      var searcher = this.get("searcher");
      if(this.get("canLoadMore")){
        this.set("isLoading", true);
        var page = searcher.nextPage();
        this.set("content", page);
      } else {
        this.set("isLoading", false);
      }
    }
  });

  var loadMoreView = Ember.View.extend({
    templateName: 'search/moreResults',
    didInsertElement: function(){
      var view = this;
      this.$().bind('inview', function(event, isInView, visiblePartX, visiblePartY){
        if(isInView){
          Ember.tryInvoke(view.get("controller"), "loadMore");
        }
      });
    }
  });

  Ember._.exports("Search", "Results", { route: route, controller: controller, moreView: loadMoreView });
}).call(Movies);
