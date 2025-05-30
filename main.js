'use strict';
var score = 0
var Engine = Matter.Engine, // Define basics
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
    width: 1100,
    height: 3000,
    wireframes: false
  }
})
var defaultCat = 0x0001,
    lostPoint = 0x0002,
    gainPoint = 0x0003,
    noCollide = 0x0004

function randomInt(highest) {
  return Math.floor(Math.random() * highest)+1
}


var mouse = Mouse.create(render.canvas), // Create mouse
    mouseConstraint = MouseConstraint.create(engine, {mouse: mouse});
Composite.add(engine.world, mouseConstraint);
render.mouse = mouse;
// Static objects
var catcher = Bodies.rectangle(600,600,80,20, {isStatic:true, render: {fillStyle:"red", strokeStyle:"black", lineWidth: 3}, label:"catcher", id: 1001, collisionFilter: {category: 1}}) 
var spawner = Bodies.circle(100, 50, 30, {isStatic:true, render: {fillStyle:"white", strokeStyle:"gray", lineWidth: 3}, label:"spawner", id: 1002, collisionFilter: {group: -1, category: 2, mask: 0}})
Composite.add(engine.world, [catcher, spawner])

for (let i=0;i<4; i++) {
  var stutter = (i%2)*50
  var stack = Composites.stack(100+stutter, i*100+150, 8, 1, 60, 0, function(x,y) {
    return Bodies.circle(x,y,20, {isStatic: true, render: {fillStyle:"white"}})
  })
  Composite.add(engine.world, stack)
}

Events.on(engine, 'collisionStart', function(event) {
  var pairs = event.pairs.slice()
  var obj1 = pairs[0].bodyA
  var obj2 = pairs[0].bodyB
    if (obj1.label == "catcher") {
      Composite.remove(engine.world, obj2)
      score++
      document.getElementById("score").innerHTML = "Score: " + score
    } else if (obj2.label == "catcher") {
    Composite.remove(engine.world, obj1)
    score++
    document.getElementById("score").innerHTML = "Score: " + score
  }
});

Events.on(mouseConstraint, 'mousedown', function() {// Click Event
  var newBall = Bodies.polygon(mouse.position.x, 50, randomInt(6)+2, randomInt(10)+15, {friction:0.0001})
  Composite.add(engine.world, newBall)
})

let mover = setInterval(() => {// Move Spawner
  var liveSpawner = Composite.get(engine.world, 1002, "body")
  Body.setPosition(liveSpawner, {x: mouse.position.x, y: 50})
}, 10);

Render.run(render)

var runner = Runner.create()

Runner.run(runner,engine)