class DartScore.Routers.DartboardsRouter extends Backbone.Router
  initialize: (options) ->
    @dartboards = new DartScore.Collections.DartboardsCollection()
    @dartboards.reset options.dartboards

  routes:
    "/index"    : "index"
    ".*"        : "index"

  index: ->
    @view = new DartScore.Views.Dartboards.IndexView(dartboards: @dartboards)
    $("#dartboards").html(@view.render().el)

