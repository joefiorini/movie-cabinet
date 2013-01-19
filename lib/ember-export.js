(function(ember){


  var slice = Array.prototype.slice,
      app = null;

  ember._ || (ember._ = {});

  ember._.exports = function(){
    var args = slice.call(arguments),
        namespaces = args.slice(0,-1),
        objects = args.slice(-1)[0];
    
    var classPrefix = namespaces.join("");
    var exports = {};

    for(var type in objects){
      if(objects.hasOwnProperty(type)){
        var exportKey = classPrefix + type.classify();
        Movies[exportKey] = objects[type];
      }
    }
  };

  ember._.exports.setup = function(global){
    app = global;
  }

}).call(this, Ember);
