jQuery ->
  class Scoreboard extends Backbone.Model
        
    initialize: () ->
      
    @app = window.app ? {}
    @app.Scoreboard = Scoreboard
  
  class Scoreboards extends Backbone.Collection
    # Don't think I'll even need this since I'm only using 1 scoreboard per app
    #would need app.Scoreboard if they were in the different files
    model: Scoreboard
  
    @app = window.app ? {}
    @app.Scoreboards = new Scoreboards