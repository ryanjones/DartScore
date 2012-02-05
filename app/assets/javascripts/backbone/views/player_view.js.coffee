jQuery ->
  class PlayerView extends Backbone.View
    template: JST["backbone/templates/player"]
    
    initialize: () ->
      @model.bind('change:current_shot', @render, @);
      
    render: ->
      $(@el).append(@template(@model.toJSON()))
      # Keep the scrollbar at the bottom of the player score area
      $("#player_scorearea").scrollTop($("#player_scorearea")[0].scrollHeight);
      @
      

      
  @app = window.app ? {}
  @app.PlayerView = PlayerView
  