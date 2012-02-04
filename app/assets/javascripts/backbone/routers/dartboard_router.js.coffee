jQuery ->
  class DartboardRouter extends Backbone.Router
    initialize: () ->
  
    routes:
      "/index"    : "index"
      ".*"        : "index"
  
    index: ->
      @view = new app.ScoreboardView(model: app.main_scoreboard)
    
  @app = window.app ? {}
  @app.DartboardRouter = DartboardRouter