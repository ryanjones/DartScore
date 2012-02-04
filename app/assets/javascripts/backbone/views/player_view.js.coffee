jQuery ->
  class PlayerView extends Backbone.View
    el: $('#player1_score')
    template: JST["backbone/templates/player"]

    initialize: () ->
      @render()

    render: ->
      $(@el).append(@template(@model.toJSON()))
      @
      
  @app = window.app ? {}
  @app.ScoreboardView = ScoreboardView
  