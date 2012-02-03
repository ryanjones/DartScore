jQuery ->
  class ScoreboardView extends Backbone.View
    el: $ '#the_scoreboard'
    template: JST["backbone/templates/scoreboard"]
    
    initialize: () ->
      @render()
    
    render: =>
      $(@el).html(@template(@model.toJSON()))
      #$('#waffles').remove()

  @app = window.app ? {}
  @app.ScoreboardView = ScoreboardView