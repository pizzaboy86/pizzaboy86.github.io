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
var health = 100
var render = Render.create({
  element : document.body,
  engine : engine,
  options: {
    width: 1000,
    height: 600,
    wireframes: false
  }
})

function randomId(length) {
  return Math.random().toString(36).substring(2, length + 2);
}

function randomInt(highest) {
  return Math.floor(Math.random() * highest)+1
}

var car = Bodies.polygon(20,20,3,5, {id:1001, vertices:[{ x: 95, y: 110 },
  { x: 105, y: 110 },
  { x: 100, y: 90 }],
  collisionFilter: {group:-1}})

var shotOnCd = false

const keyHandlers = {
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
    if (!shotOnCd) {
    let shot = Bodies.rectangle(car.position.x, car.position.y, 20, 10, {angle:car.angle + Math.PI / 2, collisionFilter: {group:-1}, label: "playerShot"})
    Composite.add(engine.world, shot)
    var forceMult = 0.005
    var xForce = forceMult * Math.cos(car.angle - Math.PI / 2)
    var yForce = forceMult * Math.sin(car.angle - Math.PI / 2)
    Body.applyForce(shot, shot.position, {x: xForce, y: yForce})
    var backXForce = 0.0005 * Math.cos(-car.angle - Math.PI / 2)
    var backYForce = 0.0005 * Math.sin(-car.angle - Math.PI / 2)
    Body.applyForce(car, car.position, {x: backXForce, y: backYForce})
    shotOnCd = true
    setTimeout(() => {
      shotOnCd = false
    },500)
    }
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

let enemyInt = setInterval(() => {
var enemyId = randomId(12)
var enemyPosX = randomInt(800) + 100
var enemyPosY = randomInt(400) + 100
var enemy = Bodies.circle(enemyPosX, enemyPosY, 10, {render: {fillStyle:"red", strokeStyle:"black"}, collisionFilter: {group:-2}, label: "enemy", id:enemyId})
Composite.add(engine.world,enemy)
  let shootInt = setInterval(() => {
    var shotId = randomId(15)
    var fetchedEnemy = Composite.get(engine.world,enemyId,"body")
    var atkAngle = Math.atan2(car.position.y-enemyPosY, car.position.x-enemyPosX) 
    let enemyShot = Bodies.rectangle(fetchedEnemy.position.x, fetchedEnemy.position.y, 20,10, {angle:atkAngle, render: {fillStyle:"red", strokeStyle:"black"}, collisionFilter: {group:-2}, id:shotId, label:"enemyShot"})
    var forceMult = 0.005
    var xForce = forceMult * Math.cos(atkAngle)
    var yForce = forceMult * Math.sin(atkAngle)
    Composite.add(engine.world, enemyShot)
    var fetchedShot = Composite.get(engine.world,shotId,"body")
    Body.applyForce(fetchedShot, fetchedShot.position, {x: xForce, y: yForce})
  }, randomInt(200) + 800)
  Events.on(engine, "collisionStart", (e) => {
    for (const {bodyA, bodyB} of e.pairs) {
    if (bodyA.label === "playerShot" & bodyB.label === "enemy") {
      Composite.remove(engine.world, bodyB)
      Composite.remove(engine.world, bodyA)
    } else if (bodyB.label === "playerShot" & bodyA.label === "enemy") {
      Composite.remove(engine.world, bodyA)
      Composite.remove(engine.world, bodyB)
    }
  }
  })
}, 5000)

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

let followMouse = setInterval(() => {
   car.angle = Math.atan2(mouse.position.y-car.position.y, mouse.position.x-car.position.x) + Math.PI/2
},10)


Render.run(render)

var runner = Runner.create()

Runner.run(runner,engine)