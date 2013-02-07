var config = module.exports;

config["My tests"] = {
  rootPath: "../",
  environment: "browser",
  sources: [
    "vendor/jquery.js",
    "vendor/handlebars.js",
    "vendor/ember.js",
    "lib/ember-export.js",
    "app/main.js",
    "app/routes.js",
    "app/search/**/*.js"
  ],
  tests: [
    "spec/*-spec.js"
  ]
}
