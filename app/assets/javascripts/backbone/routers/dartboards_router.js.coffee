jQuery ->
  class DartboardsRouter extends Backbone.Router
    initialize: () ->
      @dartboards = app.Dartboards
  
    routes:
      "/index"    : "index"
      ".*"        : "index"
  
    index: ->
      @view = new app.DartboardView
    
  @app = window.app ? {}
  @app.DartboardsRouter = DartboardsRouter