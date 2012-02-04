jQuery ->
  class PlayerView extends Backbone.View
    template: JST["backbone/templates/player"]
    
    initialize: () ->
      this.model.bind('change', this.render, this);
      
    render: ->
      $(@el).append(@template(@model.toJSON()))
      @
      

      
  @app = window.app ? {}
  @app.PlayerView = PlayerView
  