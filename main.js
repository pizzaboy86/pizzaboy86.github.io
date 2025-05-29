'use strict';
    var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Events = Matter.Events,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        Body = Matter.Body,
        Composite = Matter.Composite,
        Bodies = Matter.Bodies;

var engine = Engine.create()

var render = Render.create({
  element : document.body,
  engine : engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false
  }
})

function randomInt(highest) {
  return Math.floor(Math.random() * highest)+1
}

var catcher = Bodies.rectangle(400,550,110,60, {isStatic:true, render: {fillStyle:"white", strokeStyle:"gray", lineWidth: 3}, label:"catcher", id: 1001})
var ground = Bodies.rectangle(400, 800, 5000, 20, {isStatic:true, render: {fillStyle:"red"}, label:"ground"})

Composite.add(engine.world, [catcher, ground])

Events.on(engine, 'collisionStart', function(event) {
  var pairs = event.pairs.slice()
  var obj1 = pairs[0].bodyA
  var obj2 = pairs[0].bodyB
    if (obj1.label == "catcher" || obj1.label == "ground") {
      Composite.remove(engine.world, obj2)
    } else if (obj2.label == "catcher" || obj2.label == "ground") {
    Composite.remove(engine.world, obj1)
  }
});


    var mouse = Mouse.create(render.canvas),
        mouseConstraint = MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        });

    Composite.add(engine.world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

let x = setInterval(() => {
  var newfruit = Bodies.circle(randomInt(1000) + 200, 100, 30, {label:"fruit"})
  Composite.add(engine.world, newfruit)
}, 250);

let mouseInt = setInterval(() => {
  var liveCatcher = Composite.get(catcher, 1001)
  Body.setPosition(liveCatcher, mouse.position.x, liveCatcher.position.y)
  document.getElementById("temp").innerHTML = mouse.position.x
  document.getElementById("temp2").innerHTML = liveCatcher.position.y
},10)

Render.run(render)

var runner = Runner.create()

Runner.run(runner,engine)