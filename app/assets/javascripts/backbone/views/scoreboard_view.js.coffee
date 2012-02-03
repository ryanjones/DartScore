jQuery ->
  class ScoreboardView extends Backbone.View
    el: $ '#main_scoreboard'
    template: JST["backbone/templates/scoreboard"]

    initialize: () ->
      @render()

    render: ->
      $(@el).html(@template(@model.toJSON()))
      @

  @app = window.app ? {}
  @app.ScoreboardView = ScoreboardView