jQuery ->
  class Score extends Backbone.Model
    defaults:
      throw_history_d1: []
      throw_history_d2: []
      throw_history_d3: []
      name: ''
        
    initialize: (player_name) ->
      @name = player_name
          
    @app = window.app ? {}
    @app.Score = Score
  
  class Scores extends Backbone.Collection
    model: Score
  
    @app = window.app ? {}
    @app.Scores = new Scores