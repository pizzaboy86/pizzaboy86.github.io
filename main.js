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

var engine = Engine.create({
  gravity : {
    x : 0,
    y : 0
  }
})
var render = Render.create({
  element : document.body,
  engine : engine,
  options: {
    width: 1000,
    height: 600,
    wireframes: false
  }
})

function randomInt(highest) {
  return Math.floor(Math.random() * highest)+1
}

var car = Bodies.polygon(20,20,3,5, {id:1001, vertices:[{ x: 95, y: 110 },
  { x: 105, y: 110 },
  { x: 100, y: 90 }]})

const keyHandlers = {
  KeyD: () => {
    Body.setAngularVelocity(car, 0.035)
  },
  KeyA: () => {
    Body.setAngularVelocity(car, -0.035)
  },
  KeyW: () => {
    var forceMult = -0.00005
    var xForce = forceMult*Math.cos(car.angle + Math.PI/2)
    var yForce = forceMult*Math.sin(car.angle + Math.PI/2)
    Body.applyForce(car, {x: car.position.x, y: car.position.y}, {x: xForce, y: yForce})
  },
  KeyS: () => {
    var forceMult = 0.00005
    var xForce = forceMult * Math.cos(car.angle + Math.PI/2)
    var yForce = forceMult * Math.sin(car.angle + Math.PI/2)
    Body.applyForce(car, car.position, {x: xForce, y: yForce})
  },
  KeyE: () => {
    Body.setSpeed(car, 0)
    Body.setAngularSpeed(car, 0)
  },
  KeyZ: () => {
    Body.setPosition(car, {x:500,y:300})
  },
  KeyF: () => {
    let shot = Bodies.rectangle(car.position.x + 50, car.position.y, 20, 10, {angle:car.angle})
    Composite.add(engine.world, shot)
    var forceMult = 0.005
    var xForce = forceMult * Math.cos(shot.angle)
    var yForce = forceMult * Math.sin(shot.angle)
    Body.applyForce(shot, shot.position, {x: xForce, y: yForce})
  }
};

const keysDown = new Set();
document.addEventListener("keydown", event => {
  keysDown.add(event.code);
});
document.addEventListener("keyup", event => {
  keysDown.delete(event.code);
});

Matter.Events.on(engine, "beforeUpdate", event => {
  [...keysDown].forEach(k => {
    keyHandlers[k]?.();
  });
});

var upperWall = Bodies.rectangle(500,0,1000,10,{isStatic:true, label:"wall"})
var lowerWall = Bodies.rectangle(500,600, 1000, 10, {isStatic:true, label:"wall"})
var leftWall = Bodies.rectangle(0,300,10,600, {isStatic:true, label:"wall"})
var rightWall = Bodies.rectangle(1000,300,10,600, {isStatic:true, label:"wall"})

Composite.add(engine.world, [upperWall,lowerWall,leftWall,rightWall])

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

Composite.add(engine.world, car)

Render.run(render)

var runner = Runner.create()

Runner.run(runner,engine)