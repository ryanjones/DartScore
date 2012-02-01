jQuery ->
  class ScoreboardView extends Backbone.View
    el: $ 'body'
    template: JST["backbone/templates/scoreboard"]
    
    initialize: ->
      @render()
    
    render: =>
      $(@el).append(@template())
      #$('#waffles').remove()

  @app = window.app ? {}
  @app.ScoreboardView = ScoreboardView