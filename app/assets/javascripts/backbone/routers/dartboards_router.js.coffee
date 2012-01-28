class DartScore.Routers.DartboardsRouter extends Backbone.Router
  initialize: () ->
    @dartboards = new DartScore.Collections.DartboardsCollection()

  routes:
    "/index"    : "index"
    ".*"        : "index"

  index: ->
    @view = new DartScore.Views.Dartboards.DartboardView()
    $("#dartboards").html(@view.render().el)

