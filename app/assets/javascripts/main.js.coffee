# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

@app = window.app ? {}

jQuery ->
  @app.router = new app.ScoreboardsRouter
  Backbone.history.start({pushState:true})