jQuery ->
  class PlayerView extends Backbone.View
    template: JST["backbone/templates/player"]

    initialize: () ->
      @render()

    render: ->
      $(@el).append(@template(@model.toJSON()))
      @
      
  @app = window.app ? {}
  @app.PlayerView = PlayerView
  