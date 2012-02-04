jQuery ->
  class DartboardRouter extends Backbone.Router
    initialize: () ->
  
    routes:
      "/index"    : "index"
      ".*"        : "index"
  
    index: ->
      @view = new app.ScoreboardView(model: app.main_scoreboard)
      @p1view = new app.PlayerView(model: app.player_1)
      @p2view = new app.PlayerView(model: app.player_2)
       
  @app = window.app ? {}
  @app.DartboardRouter = DartboardRouter