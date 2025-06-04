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
    width: 1000,
    height: 600,
    wireframes: false
  }
})

function randomInt(highest) {
  return Math.floor(Math.random() * highest)+1
}


var car = Bodies.polygon(500,300,3,5, {label:"car", vertices:[
  { x: 95, y: 110 },
  { x: 105, y: 110 },
  { x: 100, y: 90 }]})

Events.on(engine, 'beforeUpdate', function() { // No grav for car
    var gravity = engine.world.gravity;
    var livecar = Composite.get(engine.world, 1001, "body")    

        Body.applyForce(livecar, livecar.position, {
            x: -gravity.x * gravity.scale * livecar.mass,
            y: -gravity.y * gravity.scale * livecar.mass
        });
});

document.addEventListener("keydown", (event) => {
    if (event.key == "ArrowLeft") {
        leftHeld = true
        document.getElementById("key").innerHTML = "left"
    } else if (event.key == "ArrowRight") {
        rightHeld = true
        document.getElementById("key").innerHTML = "right"
    } else if (event.key == "ArrowUp") {
        upHeld = true
        document.getElementById("key").innerHTML = "up"
    }
}) 

document.addEventListener("keyup", (event) => {
    if (event.key == "ArrowLeft") {
        leftHeld = false
        document.getElementById("key").innerHTML = "none"
    } else if (event.key == "ArrowRight") {
        rightHeld = false
        document.getElementById("key").innerHTML = "none"
    } else if (event.key == "ArrowUp") {
        upHeld = false
        document.getElementById("key").innerHTML = "none"
    }
})

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

Events.on(engine, "collisionStart", function(event) {
    var pairs = event.pairs.slice()
  var obj1 = pairs[0].bodyA
  var obj2 = pairs[0].bodyB
  if (obj1.label == "wall") {
      Body.setPosition(car, {x:500, y:300})
    } else if (obj2.label == "wall") {
    Body.setPosition(car, {x:500, y:300})
  }
})

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