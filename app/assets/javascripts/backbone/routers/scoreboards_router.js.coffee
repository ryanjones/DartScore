jQuery ->
  class ScoreboardsRouter extends Backbone.Router
    initialize: () ->
      # Create the scoreboard
      app.scoreboard = new app.Scoreboard
  
    routes:
      "/index"    : "index"
      ".*"        : "index"
  
    index: ->
      @view = new app.ScoreboardView
    
  @app = window.app ? {}
  @app.ScoreboardsRouter = ScoreboardsRouter