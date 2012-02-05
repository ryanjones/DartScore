# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

@app = window.app ? {}

jQuery ->
  @app.player_1 = new app.Player({name:'p1'})
  @app.player_2 = new app.Player({name:'p2'})
  @app.main_scoreboard = new app.Scoreboard({current_player:app.player_1})
  @app.router = new app.DartboardRouter
  Backbone.history.start({pushState:true})