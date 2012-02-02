jQuery ->
  class ScoreboardsRouter extends Backbone.Router
    initialize: () ->
      # Create the scoreboard
      @scoreTrack = new app.Scoreboard
      
      # Add it to the global collection so I can access it later
      app.Scoreboards.add(@scoreTrack)
  
    routes:
      "/index"    : "index"
      ".*"        : "index"
  
    index: ->
      @view = new app.ScoreboardView(model: @scoreTrack)
    
  @app = window.app ? {}
  @app.ScoreboardsRouter = ScoreboardsRouter