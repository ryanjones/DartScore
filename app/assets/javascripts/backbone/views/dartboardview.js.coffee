jQuery ->
  class DartboardView extends Backbone.View
    el: $ '#dartboards'
    template: JST["backbone/templates/dartboard"]
    
    initialize: ->
      @render()
    
    render: =>
      $(@el).append(@template())

  @app = window.app ? {}
  @app.DartboardView = DartboardView