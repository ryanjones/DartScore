class DartScore.Models.Dartboard extends Backbone.Model
  paramRoot: 'dartboard'

  defaults:
    title: null

class DartScore.Collections.DartboardsCollection extends Backbone.Collection
  model: DartScore.Models.Dartboard
  url: '/dartboards'
