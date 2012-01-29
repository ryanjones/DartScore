class Dartboard extends Backbone.Model

  @app = window.app ? {}
  @app.Dartboard = Dartboard

class Dartboards extends Backbone.Collection
  #would need @app.Dartboard if they were in the different files
  model: Dartboard

  @app = window.app ? {}
  @app.Dartboards = new Dartboards