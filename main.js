'use strict';

const { Contact } = require("matter-js");

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
var enemyTypes = [
  { Name: "Basic",
    Rarity: 50,
    Bullets: 1,
    Reload: 500,
    BulletSpeed: 0.005,
    BulletLifetime: 2500,
    CanMove: false,
    ContactDmg: 1,
    ContactCd: 250,
    Shape: "Circle",
    Color: "Red"
  },
  { Name: "Wave",
    Rarity: 25,
    Bullets: 30,
    Reload: 2500,
    BulletSpeed: 0.002,
    BulletLifetime: 5000,
    CanMove: false,
    ContactDmg: 1,
    ContactCd: 250,
    Shape: "Circle",
    Color: "Gray"
  }
]
updateScreen()

function randomId(length) {
  return Math.random().toString(36).substring(2, length + 2);
}

function randomInt(highest) {
  return Math.floor(Math.random() * highest)
}

function randomIntRange(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var car = Bodies.polygon(20,20,3,5, {id:1001, vertices:[{ x: 95, y: 110 },
  { x: 105, y: 110 },
  { x: 100, y: 90 }],
  collisionFilter: {group:-1}, label:"player"})

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
    for (let i=0; i<20; i++) {
    var randomAngle = (randomIntRange(-15,15) * Math.PI/180) + car.angle
    let shot = Bodies.rectangle(car.position.x, car.position.y, 20, 10, {angle:randomAngle + Math.PI / 2, collisionFilter: {group:-1}, label: "playerShot"})
    Composite.add(engine.world, shot)
    var forceMult = 0.005
    var xForce = forceMult * Math.cos(randomAngle - Math.PI / 2)
    var yForce = forceMult * Math.sin(randomAngle - Math.PI / 2)
    Body.applyForce(shot, shot.position, {x: xForce, y: yForce})
    setTimeout(() => {
      Composite.remove(engine.world,shot)
    },2500)
    }
    shotOnCd = true
    setTimeout(() => {
      shotOnCd = false
    },450)
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
  spawnEnemy(0)
}, 3000)

function spawnEnemy(index) {
  var enemy
  var chosenEnemy = enemyTypes[index]
  var enemyId = randomId(12)
  var enemyPosX = randomInt(800) + 100
  var enemyPosY = randomInt(400) + 100
  if (chosenEnemy.Shape == "Circle") {
    enemy = Bodies.circle(enemyPosX, enemyPosY, 10, {render: {fillStyle:chosenEnemy.Color, strokeStyle:"Black"}, collisionFilter: {group:-2}, label: "enemy", id:enemyId})
  }
  Composite.add(engine.world, enemy)
   let shootInt = setInterval(() => {
    for (let i=0; i<chosenEnemy.Bullets; i++) {
    var shotId = randomId(15)
    var fetchedEnemy = Composite.get(engine.world,enemyId,"body")
    var atkAngle = Math.atan2(car.position.y-enemyPosY, car.position.x-enemyPosX) 
    let enemyShot = Bodies.rectangle(fetchedEnemy.position.x, fetchedEnemy.position.y, 20,10, {angle:atkAngle, render: {fillStyle:"red", strokeStyle:"black"}, collisionFilter: {group:-2}, id:shotId, label:"enemyShot"})
    var forceMult = chosenEnemy.BulletSpeed
    var xForce = forceMult * Math.cos(atkAngle)
    var yForce = forceMult * Math.sin(atkAngle)
    Composite.add(engine.world, enemyShot)
    var fetchedShot = Composite.get(engine.world,shotId,"body")
    Body.applyForce(fetchedShot, fetchedShot.position, {x: xForce, y: yForce})
    setTimeout(() => {
      Composite.remove(engine.world,enemyShot)
    }, chosenEnemy.BulletLifetime)
    }
  }, chosenEnemy.Reload)
}


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
    Events.on(engine, "collisionStart", (e) => {
    for (const {bodyA, bodyB} of e.pairs) {
    if (bodyA.label === "player" & bodyB.label === "enemyShot") {
      Composite.remove(engine.world, bodyB)
      health--
    } else if (bodyB.label === "player" & bodyA.label === "enemyShot") {
      Composite.remove(engine.world, bodyA)
      health--
    }
  }
  })

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

function updateScreen() {
  document.getElementById("hp").innerHTML = "Health: " + health
}

Render.run(render)

var runner = Runner.create()

Runner.run(runner,engine)