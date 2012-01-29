jQuery ->
  class DartboardView extends Backbone.View
    el: $ '#dartboards'
    template: JST["backbone/templates/dartboard"]
    
    initialize: ->
      @render()
    
    render: =>
      $(@el).append(@template())
      $('#waffles').remove()

  @app = window.app ? {}
  @app.DartboardView = DartboardView