DartScore.Views.Dartboards ||= {}
class DartScore.Views.Dartboards.IndexView extends Backbone.View
  template: JST["backbone/templates/dartboards/index"]


  render: =>
    $(@el).html(@template(dartboards: @options.dartboards.toJSON()))
    return this

