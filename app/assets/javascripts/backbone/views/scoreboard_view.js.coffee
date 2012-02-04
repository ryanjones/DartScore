jQuery ->
  class ScoreboardView extends Backbone.View
    el: $('#the_scoreboard')
    template: JST["backbone/templates/scoreboard"]

    initialize: () ->
      @render()
      
    render: ->
      $(@el).append(@template(@model.toJSON()))
      @
      
  @app = window.app ? {}
  @app.ScoreboardView = ScoreboardView
  