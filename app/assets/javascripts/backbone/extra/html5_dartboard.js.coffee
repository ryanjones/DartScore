$ -> 
    stage = new Kinetic.Stage("the_dartboard", 700, 768)
    
    #Build example background
    board_space = new Kinetic.Shape( (color)->
        canvas = @getCanvas()
        context = @getContext()
        context.fillStyle = '#3ac6e5'
        context.fillRect(0, 0, 700, 768)
        context.fill()
        )
    stage.add(board_space)
    
    #Build example background
    # score_space = new Kinetic.Shape( (color)->
        # canvas = @getCanvas()
        # context = @getContext()
        # context.fillStyle = '#333'
        # context.fillRect(0, 0, 324, 768)
        # context.fill()
        # )
    # stage.add(score_space)

    # Setup dartboard vars
    centreX = 350
    centreY = 384
    r1 = 50
    bandWidth = 98
    values = new Array(20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5)
    delta = Math.PI / 10
    theta = 29 * Math.PI / 20
    
    # Draw each slice piece by piece
    for num in [0..19] by 1
      DrawSlice(values[num], theta + num * delta, r1, bandWidth, stage, centreX, centreY, delta)
    

# Build a single slice of the dartboard (3 areas)  
  DrawSlice = (value, startAngle, r1, bandWidth, stage, centreX, centreY, delta) ->
    for i in [0..2] by 1
      do ()->
        outerRadius = r1 + (i + 1) * bandWidth
        innerRadius = r1 + i * bandWidth
  
        area = new Kinetic.Shape( ->
            x1 = outerRadius * Math.cos(startAngle) + centreX
            y1 = outerRadius * Math.sin(startAngle) + centreY
  
            x2 = innerRadius * Math.cos(startAngle + delta) + centreX
            y2 = innerRadius * Math.sin(startAngle + delta) + centreY
  
            context = @getContext()
            
            context.beginPath()
            context.lineWidth = 4
            context.strokeStyle = "black"
            context.fillStyle = @color
    
            context.moveTo(x1, y1)
            context.arc(centreX, centreY, outerRadius, startAngle, startAngle + delta, false)
            context.lineTo(x2, y2)
            context.arc(centreX, centreY, innerRadius, startAngle + delta, startAngle, true)
            context.lineTo(x1, y1)
    
            context.fill()
            context.stroke()
    
            textX = (outerRadius - 20) * Math.cos(startAngle + delta / 2) + centreX - 4
            textY = (outerRadius - 20) * Math.sin(startAngle + delta / 2) + centreY + 4
            context.font = "8pt Verdana"
            context.fillStyle = "#000000"
            context.fillText(@text, textX, textY)
        )        
        area.on("click", () ->
          #current_player = GetCurrentPlayer()
          #current_player.set({current_shot: @text})
          app.player_1.set({current_shot: @text})
          #determine whos turn it is, update main_scoreboard
        )
          
        area.color = "green"
        area.text = (value * (3 - i))
        stage.add(area)
      
# Check which player we're on
  GetCurrentPlayer = () ->
    app.main_scoreboard.current_player
