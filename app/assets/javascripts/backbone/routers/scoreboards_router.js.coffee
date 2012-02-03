jQuery ->
  class ScoreboardsRouter extends Backbone.Router
    initialize: () ->
  
    routes:
      "/index"    : "index"
      ".*"        : "index"
  
    index: ->
      @view = new app.ScoreboardView(model: app.main_scoreboard)
    
  @app = window.app ? {}
  @app.ScoreboardsRouter = ScoreboardsRouter