DartScore.Views.Dartboards ||= {}

class DartScore.Views.Dartboards.DartboardView extends Backbone.View
  template: JST["backbone/templates/dartboard"]

  render: =>
    $(@el).html(@template())
    return this

