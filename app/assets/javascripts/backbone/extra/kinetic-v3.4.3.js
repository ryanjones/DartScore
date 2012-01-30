/**
 * KineticJS JavaScript Library v3.4.3
 * http://www.kineticjs.com/
 * Copyright 2012, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Jan 4 2012
 *
 * Copyright (C) 2011 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
var Kinetic = {};

/****************************************
 * Layer
 */
Kinetic.Layer = function(stage, isInvisible){
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.canvas.width = stage.width;
    this.canvas.height = stage.height;
    this.canvas.style.position = 'absolute';
    this.shapes = [];
    
    if (isInvisible) {
        var that = this;
        this.context.stroke = function(){
        };
        this.context.fill = function(){
        };
        this.context.fillRect = function(x, y, width, height){
            that.context.rect(x, y, width, height);
        };
        this.context.strokeRect = function(x, y, width, height){
            that.context.rect(x, y, width, height);
        };
        this.context.drawImage = function(){
        };
        this.context.fillText = function(){
        };
        this.context.strokeText = function(){
        };
    }
    
    stage.container.appendChild(this.canvas);
}
/*
 * clear layer
 */
Kinetic.Layer.prototype.clear = function(){
    var context = this.getContext();
    var canvas = this.getCanvas();
    context.clearRect(0, 0, canvas.width, canvas.height);
}
/*
 * get layer canvas
 */
Kinetic.Layer.prototype.getCanvas = function(){
    return this.canvas;
}
/*
 * get layer context
 */
Kinetic.Layer.prototype.getContext = function(){
    return this.context;
}
/*
 * get layer shapes
 */
Kinetic.Layer.prototype.getShapes = function(){
    return this.shapes;
}
/*
 * draw all shapes in layer
 */
Kinetic.Layer.prototype.draw = function(){
    this.clear();
    var context = this.getContext();
    
    for (var n = 0; n < this.getShapes().length; n++) {
        this.getShapes()[n].draw(this);
    }
};
/*
 * set zIndices
 */
Kinetic.Layer.prototype.setZIndices = function(){
    var shapes = this.getShapes();
    
    for (var n = 0; n < shapes.length; n++) {
        shapes[n].zIndex = n;
    }
};
/****************************************
 * Stage
 */
Kinetic.Stage = function(containerId, width, height){
    this.container = document.getElementById(containerId);
    this.width = width;
    this.height = height;
    this.idCounter = 0;
    this.dblClickWindow = 400;
    // desktop flags
    this.mousePos = null;
    this.mouseDown = false;
    this.mouseUp = false;
    this.targetShape = {};
    
    // mobile flags
    this.touchPos = null;
    this.touchStart = false;
    this.touchEnd = false;
    
    // create layers
    this.bufferLayer = new Kinetic.Layer(this);
    this.backstageLayer = new Kinetic.Layer(this, true);
    this.stageLayer = new Kinetic.Layer(this);
    this.propsLayer = new Kinetic.Layer(this);
    this.actorsLayer = new Kinetic.Layer(this);
    
    this.bufferLayer.getCanvas().style.display = 'none';
    this.backstageLayer.getCanvas().style.display = 'none';
    this.listen();
    
    this.addEventListener("mouseout", function(evt){
        that.shapeDragging = undefined;
    }, false);
    var that = this;
    
    /*
     * prepare drag and drop
     */
    var types = [{
        end: "mouseup",
        move: "mousemove"
    }, {
        end: "touchend",
        move: "touchmove"
    }];
    
    for (var n = 0; n < types.length; n++) {
        var pubType = types[n];
        (function(){
            var type = pubType;
            that.on(type.move, function(evt){
                if (that.shapeDragging) {
                    var pos = type.move == "mousemove" ? that.getMousePos() : that.getTouchPos();
                    if (that.shapeDragging.drag.x) {
                        that.shapeDragging.x = pos.x - that.shapeDragging.offset.x;
                    }
                    if (that.shapeDragging.drag.y) {
                        that.shapeDragging.y = pos.y - that.shapeDragging.offset.y;
                    }
                    that.drawActors();
                }
            }, false);
            that.on(type.end, function(evt){
                // execute user defined ondragend if defined
                if (that.shapeDragging) {
                    var dragend = that.shapeDragging.eventListeners.ondragend;
                    if (dragend) {
                        var events = dragend;
                        for (var i = 0; i < events.length; i++) {
                            events[i].func.apply(that.shapeDragging, [evt]);
                        }
                    }
                }
                that.shapeDragging = undefined;
            });
        })();
    }
    
    /*
     * prepare mobile drag and drop
     */
    this.on("touchmove", function(evt){
        if (that.shapeDragging) {
            var touchPos = that.getTouchPos();
            that.shapeDragging.x = touchPos.x - that.shapeDragging.offset.x;
            that.shapeDragging.y = touchPos.y - that.shapeDragging.offset.y;
            that.drawActors();
        }
    }, false);
    this.on("touchend", function(evt){
        // execute user defined ondragend if defined
        if (that.shapeDragging) {
            var dragend = that.shapeDragging.eventListeners.ondragend;
            if (dragend) {
                var events = dragend;
                for (var i = 0; i < events.length; i++) {
                    events[i].func.apply(that.shapeDragging, [evt]);
                }
            }
        }
        that.shapeDragging = undefined;
    });
};
/*
 * get buffer layer
 */
Kinetic.Stage.prototype.getBufferLayer = function(){
    return this.bufferLayer;
};
/*
 * get backstage layer
 */
Kinetic.Stage.prototype.getBackstageLayer = function(){
    return this.backstageLayer;
};
/*
 * get stage layer
 */
Kinetic.Stage.prototype.getStageLayer = function(){
    return this.stageLayer;
};
/*
 * get props layer
 */
Kinetic.Stage.prototype.getPropsLayer = function(){
    return this.propsLayer;
};
/*
 * get actors layer
 */
Kinetic.Stage.prototype.getActorsLayer = function(){
    return this.actorsLayer;
};
/*
 * clear stage
 */
Kinetic.Stage.prototype.clear = function(){
    this.stageLayer.clear();
};
/*
 * clear all canvases
 */
Kinetic.Stage.prototype.clearAll = function(){
    this.backstageLayer.clear();
    this.stageLayer.clear();
    this.propsLayer.clear();
    this.actorsLayer.clear();
};
/*
 * Composite toDataURL
 */
Kinetic.Stage.prototype.toDataURL = function(callback){
    var bufferLayer = this.getBufferLayer();
    var bufferContext = bufferLayer.getContext();
    var stageLayer = this.getStageLayer();
    var propsLayer = this.getPropsLayer();
    var actorsLayer = this.getActorsLayer();
    var layers = [stageLayer, propsLayer, actorsLayer];
    
    function addLayer(n){
        var dataURL = layers[n].getCanvas().toDataURL();
        var imageObj = new Image();
        imageObj.onload = function(){
            bufferContext.drawImage(this, 0, 0);
            n++;
            if (n < layers.length) {
                addLayer(n);
            }
            else {
                callback(bufferLayer.getCanvas().toDataURL());
            }
        };
        imageObj.src = dataURL;
    }
    
    
    bufferLayer.clear();
    addLayer(0);
};
/*
 * draw actors layer
 */
Kinetic.Stage.prototype.drawActors = function(){
    this.getActorsLayer().draw();
};
/*
 * draw props layer
 */
Kinetic.Stage.prototype.drawProps = function(){
    this.getPropsLayer().draw();
};
/*
 * draw actors and props layer.  This method should be used
 * in combination with makeActor() or makeProp()
 */
Kinetic.Stage.prototype.draw = function(){
    this.drawProps();
    this.drawActors();
};
/*
 * remove a shape from the stage
 */
Kinetic.Stage.prototype.remove = function(shape){
    // remove from shapes array
    var shapes = this.getShapes();
    var layer = shape.getLayer();
    for (var n = 0; n < shapes.length; n++) {
        var id = shapes[n].id;
        if (id == shape.id) {
            shape.getLayer().getShapes().splice(n, 1);
        }
    }
    
    layer.setZIndices();
};
/*
 * remove all shapes from the stage
 */
Kinetic.Stage.prototype.removeAll = function(){
    // remove all shapes
    this.getPropsLayer().shapes = [];
    this.getActorsLayer().shapes = [];
};
/*
 * get stage canvas
 */
Kinetic.Stage.prototype.getCanvas = function(){
    return this.stageLayer.getCanvas();
};
/*
 * get stage context
 */
Kinetic.Stage.prototype.getContext = function(){
    return this.stageLayer.getContext();
};
/*
 * short-hand add event listener to stage (which is essentially
 * the container DOM)
 */
Kinetic.Stage.prototype.on = function(type, func){
    this.container.addEventListener(type, func);
};
/*
 * long-hand add event listener to stage (which is essentially
 * the container DOM)
 */
Kinetic.Stage.prototype.addEventListener = function(type, func){
    this.on(type, func);
};
/*
 * add shape to stage
 */
Kinetic.Stage.prototype.add = function(shape){
    shape.stage = this;
    if (shape.isProp) {
        shape.layer = this.propsLayer;
    }
    else {
        shape.layer = this.actorsLayer;
    }
    
    shape.getLayer().shapes.push(shape);
    
    shape.id = this.idCounter++;
    shape.zIndex = this.id;
    shape.draw(shape.layer);
};
/*
 * handle incoming event
 */
Kinetic.Stage.prototype.handleEvent = function(evt){
    if (!evt) {
        evt = window.event;
    }
    
    this.setMousePosition(evt);
    this.setTouchPosition(evt);
    
    var backstageLayer = this.backstageLayer;
    var backstageLayerContext = backstageLayer.getContext();
    var that = this;
    
    backstageLayer.clear();
    
    for (var n = this.getShapes().length - 1; n >= 0; n--) {
        var pubShape = this.getShapes()[n];
        (function(){
            var shape = pubShape;
            shape.draw(backstageLayer);
            var pos = that.touchPos || that.mousePos;
            var el = shape.eventListeners;
            
            if (shape.visible && pos !== null && backstageLayerContext.isPointInPath(pos.x, pos.y)) {
                // handle onmousedown
                if (that.mouseDown) {
                    that.mouseDown = false;
                    shape.clickStart = true;
                    
                    if (el.onmousedown) {
                        var events = el.onmousedown;
                        for (var i = 0; i < events.length; i++) {
                            events[i].func.apply(shape, [evt]);
                        }
                    }
                    n = -1;
                }
                // handle onmouseup & onclick
                else if (that.mouseUp) {
                    that.mouseUp = false;
                    if (el.onmouseup) {
                        var events = el.onmouseup;
                        for (var i = 0; i < events.length; i++) {
                            events[i].func.apply(shape, [evt]);
                        }
                    }
                    
                    // detect if click or double click occurred
                    if (shape.clickStart) {
                        if (el.onclick) {
                            var events = el.onclick;
                            for (var i = 0; i < events.length; i++) {
                                events[i].func.apply(shape, [evt]);
                            }
                        }
                        
                        if (el.ondblclick && shape.inDoubleClickWindow) {
                            var events = el.ondblclick;
                            for (var i = 0; i < events.length; i++) {
                                events[i].func.apply(shape, [evt]);
                            }
                        }
                        
                        shape.inDoubleClickWindow = true;
                        
                        setTimeout(function(){
                            shape.inDoubleClickWindow = false;
                        }, that.dblClickWindow);
                    }
                    n = -1;
                }
                
                // handle touchstart
                else if (that.touchStart) {
                    that.touchStart = false;
                    if (el.touchstart) {
                        var events = el.touchstart;
                        for (var i = 0; i < events.length; i++) {
                            events[i].func.apply(shape, [evt]);
                        }
                    }
                    
                    if (el.ondbltap && shape.inDoubleClickWindow) {
                        var events = el.ondbltap;
                        for (var i = 0; i < events.length; i++) {
                            events[i].func.apply(shape, [evt]);
                        }
                    }
                    
                    shape.inDoubleClickWindow = true;
                    
                    setTimeout(function(){
                        shape.inDoubleClickWindow = false;
                    }, that.dblClickWindow);
                    n = -1;
                }
                
                // handle touchend
                else if (that.touchEnd) {
                    that.touchEnd = false;
                    if (el.touchend) {
                        var events = el.touchend;
                        for (var i = 0; i < events.length; i++) {
                            events[i].func.apply(shape, [evt]);
                        }
                    }
                    n = -1;
                }
                
                // handle touchmove
                else if (el.touchmove) {
                    var events = el.touchmove;
                    for (var i = 0; i < events.length; i++) {
                        events[i].func.apply(shape, [evt]);
                    }
                    n = -1;
                }
                
                /*
                 * this condition is used to identify a new target shape.
                 * A new target shape occurs if a target shape is not defined or
                 * if the current shape is different from the current target shape and
                 * the current shape is beneath the target
                 */
                else if (that.targetShape.id === undefined || (that.targetShape.id != shape.id && that.targetShape.getZIndex() < shape.getZIndex())) {
                    /*
                     * check if old target has an onmouseout event listener
                     */
                    var oldEl = that.targetShape.eventListeners;
                    if (oldEl && oldEl.onmouseout) {
                        var events = oldEl.onmouseout;
                        for (var i = 0; i < events.length; i++) {
                            events[i].func.apply(shape, [evt]);
                        }
                    }
                    
                    // set new target shape
                    that.targetShape = shape;
                    
                    // handle onmouseover
                    if (el.onmouseover) {
                        var events = el.onmouseover;
                        for (var i = 0; i < events.length; i++) {
                            events[i].func.apply(shape, [evt]);
                        }
                    }
                    n = -1;
                }
                
                // handle onmousemove
                else if (el.onmousemove) {
                    var events = el.onmousemove;
                    for (var i = 0; i < events.length; i++) {
                        events[i].func.apply(shape, [evt]);
                    }
                    n = -1;
                }
            }
            // handle mouseout condition
            else if (that.targetShape.id == shape.id) {
                that.targetShape = {};
                if (el.onmouseout) {
                    var events = el.onmouseout;
                    for (var i = 0; i < events.length; i++) {
                        events[i].func.apply(shape, [evt]);
                    }
                }
                n = -1;
            }
        }());
    }
};
/*
 * begin listening for events by adding event handlers
 * to the container
 */
Kinetic.Stage.prototype.listen = function(){
    var that = this;
    
    // desktop events
    this.container.addEventListener("mousedown", function(evt){
        that.mouseDown = true;
        that.handleEvent(evt);
    }, false);
    
    this.container.addEventListener("mousemove", function(evt){
        that.mouseUp = false;
        that.mouseDown = false;
        that.handleEvent(evt);
    }, false);
    
    this.container.addEventListener("mouseup", function(evt){
        that.mouseUp = true;
        that.mouseDown = false;
        that.handleEvent(evt);
        
        // clear all click starts
        for (var i = 0; i < that.getShapes().length; i++) {
            that.getShapes()[i].clickStart = false;
        }
    }, false);
    
    this.container.addEventListener("mouseover", function(evt){
        that.handleEvent(evt);
    }, false);
    
    this.container.addEventListener("mouseout", function(evt){
        that.mousePos = null;
    }, false);
    // mobile events
    this.container.addEventListener("touchstart", function(evt){
        evt.preventDefault();
        that.touchStart = true;
        that.handleEvent(evt);
    }, false);
    
    this.container.addEventListener("touchmove", function(evt){
        evt.preventDefault();
        that.handleEvent(evt);
    }, false);
    
    this.container.addEventListener("touchend", function(evt){
        evt.preventDefault();
        that.touchEnd = true;
        that.handleEvent(evt);
    }, false);
};
/*
 * get mouse position for desktop apps
 */
Kinetic.Stage.prototype.getMousePos = function(evt){
    return this.mousePos;
};
/*
 * get touch position for mobile apps
 */
Kinetic.Stage.prototype.getTouchPos = function(evt){
    return this.touchPos;
};
/*
 * set mouse positon for desktop apps
 */
Kinetic.Stage.prototype.setMousePosition = function(evt){
    var mouseX = evt.clientX - this.getContainerPos().left + window.pageXOffset;
    var mouseY = evt.clientY - this.getContainerPos().top + window.pageYOffset;
    this.mousePos = {
        x: mouseX,
        y: mouseY
    };
};
/*
 * set touch position for mobile apps
 */
Kinetic.Stage.prototype.setTouchPosition = function(evt){
    if (evt.touches !== undefined && evt.touches.length == 1) {// Only deal with
        // one finger
        var touch = evt.touches[0];
        // Get the information for finger #1
        var touchX = touch.clientX - this.getContainerPos().left + window.pageXOffset;
        var touchY = touch.clientY - this.getContainerPos().top + window.pageYOffset;
        
        this.touchPos = {
            x: touchX,
            y: touchY
        };
    }
};
/*
 * get container position
 */
Kinetic.Stage.prototype.getContainerPos = function(){
    var obj = this.container;
    var top = 0;
    var left = 0;
    while (obj.tagName != "BODY") {
        top += obj.offsetTop;
        left += obj.offsetLeft;
        obj = obj.offsetParent;
    }
    return {
        top: top,
        left: left
    };
};
/*
 * get container DOM element
 */
Kinetic.Stage.prototype.getContainer = function(){
    return this.container;
};
/*
 * get all shapes
 */
Kinetic.Stage.prototype.getShapes = function(){
    return (this.getPropsLayer().getShapes()).concat(this.getActorsLayer().getShapes());
};
/****************************************
 * Shape
 */
Kinetic.Shape = function(drawFunc, isProp){
    this.drawFunc = drawFunc;
    this.isProp = isProp === undefined ? false : isProp;
    this.x = 0;
    this.y = 0;
    this.scale = {
        x: 1,
        y: 1
    };
    this.rotation = 0;
    // radians
    // store state for next clear
    this.lastX = 0;
    this.lastY = 0;
    this.lastRotation = 0;
    // radians
    this.lastScale = {
        x: 1,
        y: 1
    };
    
    this.eventListeners = {};
    this.clickStart = false;
    this.inDblClickWindow = false;
    this.visible = true;
    this.drag = {
        x: false,
        y: false
    };
};
/*
 * get shape temp layer context
 */
Kinetic.Shape.prototype.getContext = function(){
    return this.tempLayer.getContext();
};
/*
 * get shape temp layer canvas
 */
Kinetic.Shape.prototype.getCanvas = function(){
    return this.tempLayer.getCanvas();
};
/*
 * get stage
 */
Kinetic.Shape.prototype.getStage = function(){
    return this.stage;
};
/*
 * draw shape
 */
Kinetic.Shape.prototype.draw = function(layer){
    if (this.visible) {
        var stage = this.getStage();
        var context = layer.getContext();
        
        context.save();
        
        if (this.x !== 0 || this.y !== 0) {
            context.translate(this.x, this.y);
        }
        if (this.rotation !== 0) {
            context.rotate(this.rotation);
        }
        if (this.scale.x != 1 || this.scale.y != 1) {
            context.scale(this.scale.x, this.scale.y);
        }
        
        this.tempLayer = layer;
        this.drawFunc.call(this);
        
        context.restore();
    }
};
/*
 * initialize drag and drop
 */
Kinetic.Shape.prototype.initDrag = function(){
    var that = this;
    var types = ["mousedown", "touchstart"];
    
    for (var n = 0; n < types.length; n++) {
        var pubType = types[n];
        (function(){
            var type = pubType;
            that.on(type + ".initdrag", function(evt){
                var stage = that.getStage();
                var pos = type == "mousedown" ? stage.getMousePos() : stage.getTouchPos();
                
                if (pos) {
                    stage.shapeDragging = that;
                    stage.shapeDragging.offset = {};
                    stage.shapeDragging.offset.x = pos.x - that.x;
                    stage.shapeDragging.offset.y = pos.y - that.y;
                    
                    // execute dragstart events if defined
                    var dragstart = that.eventListeners.ondragstart;
                    if (dragstart) {
                        var events = dragstart;
                        for (var i = 0; i < events.length; i++) {
                            events[i].func.apply(that, [evt]);
                        }
                    }
                }
            });
        })();
    }
};
/*
 * remove drag and drop event listener
 */
Kinetic.Shape.prototype.dragCleanup = function(){
    if (!this.drag.x && !this.drag.y) {
        this.off("mousedown.initdrag");
        this.off("touchstart.initdrag");
    }
};
/*
 * enable/disable drag and drop for box x and y direction
 */
Kinetic.Shape.prototype.draggable = function(setDraggable){
    if (setDraggable) {
        var needInit = !this.drag.x && !this.drag.y;
        this.drag = {
            x: true,
            y: true
        };
        if (needInit) {
            this.initDrag();
        }
    }
    else {
        this.drag = {
            x: false,
            y: false
        };
        this.dragCleanup();
    }
};
/*
 * enable/disable drag and drop for x only
 */
Kinetic.Shape.prototype.draggableX = function(setDraggable){
    if (setDraggable) {
        var needInit = !this.drag.x && !this.drag.y;
        this.drag.x = true;
        if (needInit) {
            this.initDrag();
        }
    }
    else {
        this.drag.x = false;
        this.dragCleanup();
    }
};
/*
 * enable/disable drag and drop for y only
 */
Kinetic.Shape.prototype.draggableY = function(setDraggable){
    if (setDraggable) {
        var needInit = !this.drag.x && !this.drag.y;
        this.drag.y = true;
        if (needInit) {
            this.initDrag();
        }
    }
    else {
        this.drag.y = false;
        this.dragCleanup();
    }
};
/*
 * get zIndex
 */
Kinetic.Shape.prototype.getZIndex = function(){
    return this.zIndex;
};
/*
 * set shape scale
 */
Kinetic.Shape.prototype.setScale = function(scale){
    this.scale.x = scale;
    this.scale.y = scale;
};
/*
 * scale shape
 */
Kinetic.Shape.prototype.scale = function(scale){
    this.scale.x *= scale;
    this.scale.y *= scale;
};
/*
 * move shape to position
 */
Kinetic.Shape.prototype.setPosition = function(x, y){
    this.x = x;
    this.y = y;
};
/*
 * move shape by amount
 */
Kinetic.Shape.prototype.move = function(x, y){
    this.x += x;
    this.y += y;
};
/*
 * set shape rotation
 */
Kinetic.Shape.prototype.setRotation = function(theta){
    this.rotation = theta;
};
/*
 * rotate shape by amount
 */
Kinetic.Shape.prototype.rotate = function(theta){
    this.rotation += theta;
};
/*
 * short-hand add event listener to shape
 */
Kinetic.Shape.prototype.on = function(typesStr, func){
    var types = typesStr.split(" ");
    /*
     * loop through types and attach event listeners to
     * each one.  eg. "click mouseover.namespace mouseout"
     * will create three event bindings
     */
    for (var n = 0; n < types.length; n++) {
        var type = types[n];
        var event = (type.indexOf('touch') == -1) ? 'on' + type : type;
        var parts = event.split(".");
        var baseEvent = parts[0];
        var name = parts.length > 1 ? parts[1] : "";
        
        if (!this.eventListeners[baseEvent]) {
            this.eventListeners[baseEvent] = [];
        }
        
        this.eventListeners[baseEvent].push({
            name: name,
            func: func
        });
    }
};
/*
 * long-hand add event listener to shape
 */
Kinetic.Shape.prototype.addEventListener = function(type, func){
    this.on(type, func);
};
/*
 * short-hand remove event listener(s)
 */
Kinetic.Shape.prototype.off = function(type){
    var event = (type.indexOf('touch') == -1) ? 'on' + type : type;
    var parts = event.split(".");
    var baseEvent = parts[0];
    
    if (this.eventListeners[baseEvent] && parts.length > 1) {
        var name = parts[1];
        
        for (var i = 0; i < this.eventListeners[baseEvent].length; i++) {
            if (this.eventListeners[baseEvent][i].name == name) {
                this.eventListeners[baseEvent].splice(i, 1);
                if (this.eventListeners[baseEvent].length == 0) {
                    this.eventListeners[baseEvent] = undefined;
                }
                break;
            }
        }
    }
    else {
        this.eventListeners[baseEvent] = undefined;
    }
};
/*
 * long-hand remove event listener(s)
 */
Kinetic.Shape.prototype.removeEventListener = function(type){
    this.off(type);
};
/*
 * show shape
 */
Kinetic.Shape.prototype.show = function(){
    this.visible = true;
};
/*
 * hide shape
 */
Kinetic.Shape.prototype.hide = function(){
    this.visible = false;
};
/*
 * move shape to top
 */
Kinetic.Shape.prototype.moveToTop = function(){
    var stage = this.stage;
    var layer = this.getLayer();
    var shapes = layer.getShapes();
    
    for (var n = 0; n < shapes.length; n++) {
        var shape = shapes[n];
        if (shape.id == this.id) {
            layer.shapes.splice(n, 1);
            layer.shapes.push(this);
            break;
        }
    }
    
    layer.setZIndices();
};
/*
 * get shape layer
 */
Kinetic.Shape.prototype.getLayer = function(){
    return this.layer;
};
/*
 * make shape into an actor
 */
Kinetic.Shape.prototype.makeActor = function(){
    var stage = this.stage;
    var layer = this.getLayer();
    var propsLayer = stage.getPropsLayer();
    var actorsLayer = stage.getActorsLayer();
    var shapes = layer.getShapes();
    
    for (var n = 0; n < shapes.length; n++) {
        var shape = shapes[n];
        if (shape.id == this.id) {
            layer.shapes.splice(n, 1);
            actorsLayer.getShapes().push(this);
            this.layer = stage.actorsLayer;
            break;
        }
    }
    
    propsLayer.setZIndices();
    actorsLayer.setZIndices();
};
/*
 * make shape into a prop
 */
Kinetic.Shape.prototype.makeProp = function(){
    var stage = this.stage;
    var layer = this.getLayer();
    var propsLayer = stage.getPropsLayer();
    var actorsLayer = stage.getActorsLayer();
    var shapes = layer.getShapes();
    for (var n = 0; n < shapes.length; n++) {
        var shape = shapes[n];
        if (shape.id == this.id) {
            layer.shapes.splice(n, 1);
            propsLayer.getShapes().push(this);
            this.layer = stage.propsLayer;
            break;
        }
    }
    
    propsLayer.setZIndices();
    actorsLayer.setZIndices();
};
/****************************************
 * Image constructor
 */
Kinetic.Image = function(config, isProp){
    this.image = config.image;
    
    var x = config.x ? config.x : 0;
    var y = config.y ? config.y : 0;
    var width = config.width ? config.width : config.image.width;
    var height = config.height ? config.height : config.image.height;
    
    var drawImage = function(){
        var context = this.getContext();
        context.drawImage(this.image, x, y, width, height);
        context.beginPath();
        context.rect(x, y, width, height);
        context.closePath();
    };
    var shape = new Kinetic.Shape(drawImage, isProp);
    
    /*
     * copy shape methods and properties to
     * Image object
     */
    for (var key in shape) {
        this[key] = shape[key];
    }
};

/*
 * set Image image
 */
Kinetic.Image.prototype.setImage = function(img){
    this.image = img;
    this.getStage().drawActors();
};
