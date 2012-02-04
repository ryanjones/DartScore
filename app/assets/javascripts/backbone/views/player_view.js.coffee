jQuery ->
  class PlayerView extends Backbone.View
    template: JST["backbone/templates/player"]
    
    initialize: () ->
      @model.bind('change', @render, @);
      
    render: ->
      # in the future.. when a an item is added, make sur eyou're at the "bottom"
      # of the overflow..
      $(@el).append(@template(@model.toJSON()))
      @
      

      
  @app = window.app ? {}
  @app.PlayerView = PlayerView
  