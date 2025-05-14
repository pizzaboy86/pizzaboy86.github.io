'use strict';
var statPoints = 0
var currentMenu = 0
var stage = 1
var difficulty = Math.floor(stage / 10) + 1
var hp = 100
var baseStats = {
  damage: 1,
  atkSpeed: 1,
  maxHealth: 100,
  defense: 1,
  regen: 1,
}
var stats = {
  damage: 1,
  atkSpeed: 1,
  maxHealth: 100,
  defense: 1,
  regen: 1,
}
var rarities = [
  { Name: "Common", Odds: 2, mod: 1, Color: "Grey" },
  { Name: "Uncommon", Odds: 4, mod: 1.2, Color: "Green" },
  { Name: "Rare", Odds: 8, mod: 1.75, Color: "Blue" },
  { Name: "Epic", Odds: 32, mod: 2.5, Color: "Red" },
  { Name: "Legendary", Odds: 100, mod: 5, Color: "Gold" },
]
var beasts = [
  {
    Name: "Gargoyle",
    Img: "imgs/gargoyle.jpg",
  },
  {
    Name: "Slime",
    Img: "imgs/slime.jpeg",
  },
  {
    Name: "Werewolf",
    Img: "imgs/werewolf.jpeg",
  },
  {
    Name: "Skeleton",
    Img: "imgs/skeleton.webp",
  },
  {
    Name: "Ghoul",
    Img: "imgs/ghoul.webp"
  },
  {
    Name: "Goblin",
    Img: "imgs/goblin.jpeg"
  },
  {
    Name: "Chest Mimic",
    Img: "imgs/chestmimic.png"
  },
  {
    Name: "Evil Gnome",
    Img: "imgs/gnome.jpeg"
  },
  {
    Name: "Spider",
    Img: "imgs/spider.jpeg"
  },
  {
    Name: "Clay Golem",
    Img: "imgs/golem.jpeg"
  }
]
var bosses = [
    {
    Name: "Bloop",
    Img: "imgs/bloop.webp",
    },
    {
      Name: "Troll Squadron",
      Img: "imgs/trollsquad.jpg"
    },
    {
      Name: "Dragon",
      Img: "imgs/dragon.jpg"
    },
    {
      Name: "Desert Wurm",
      Img: "imgs/wurm.jpeg"
    }
]
var treasureBeast = [
  {
    Name: "Slenderman",
    Img: "imgs/slenderman.webp"
  },
  {
    Name: "Leprechaun",
    Img: "imgs/leprechaun.webp"
  }
]
var activeBeast = genBeast()
var items = [
  "Helmet",
  "Chestplate",
  "Leggings",
  "Boots",
  "Sword",
  "Amulet",
  "Ring",
]
var inv = []
var equipped = {
  Helmet: undefined,
  Chestplate: undefined,
  Leggings: undefined,
  Boots: undefined,
  Sword: undefined,
  Amulet: undefined,
  Ring: undefined,
}

function randomInt(highest) {
  return Math.floor(Math.random() * highest)+1
}

function dropLoot(boss) {
  if (boss) {
     for (let i = 0; i < difficulty * 3; i++) {
    inv.push(genItem())
    }
    statPoints++
  } else {
  for (let i = 0; i < difficulty; i++) {
    inv.push(genItem())
  }
  var pointRoll = randomInt(5)
  if (pointRoll == 1) {
    statPoints++
  }
}
  stage++
  updateScreen()
}

function randomArbit(min, max) {
  return Math.random() * (max - min) + min
}

function allocatePoint(stat) {
  if (statPoints > 0) {
    baseStats[stat] = roundTo(baseStats[stat] * 1.2, 2)
    statPoints--
  } else {
    console.warn("Not Enough Stat Points!")
  }
  updateScreen()
  updateStats()
}

function roundTo(n, digits) {
  if (digits === undefined) {
    digits = 0
  }
  var multiplicator = Math.pow(10, digits)
  n = parseFloat((n * multiplicator).toFixed(11))
  var test = Math.round(n) / multiplicator
  return +test.toFixed(digits)
}

function hurt(dmg) {
  // player gets hurt
  console.log("hurt")
  hp = roundTo(hp - Math.max(dmg/ stats.defense, 0),2)
  if (hp <= 0) {
  console.warn("died")
   Object.entries(equipped).forEach(([itemName, itemObj]) => {
   	equipped[itemName] = undefined
   })
  hp = stats.maxHealth
  }
  updateScreen()
}

function attack() {
  // monster gets hurt
    activeBeast.health = roundTo(activeBeast.health - stats.damage,2)
    if (activeBeast.health <= 0) {
      respawnBeast()
      dropLoot()
    }
    updateScreen()
    updateStats()
 		document.getElementById("beast").removeAttribute("onClick")
   let x = setTimeout(function () {
     document.getElementById("beast").setAttribute("onClick", "javascript: attack() ")
   }, 1000 / stats.atkSpeed)
}

var hurtCooldown = 10/activeBeast.atkSpeed
let hurtCd = setInterval(function() {
	hurtCooldown = hurtCooldown - 0.1
  if (hurtCooldown <= 0 ) {
  	hurt(activeBeast.damage)
    hurtCooldown = 10/activeBeast.atkSpeed
    updateScreen()
  }
  document.getElementById("beastAttack").innerHTML = roundTo(hurtCooldown,1)
  },100)
  
function respawnBeast() {
  activeBeast = genBeast()
  clearInterval(hurtCd)
  hurtCooldown = 10/activeBeast.atkSpeed
  hurtCd = setInterval(function() {
	hurtCooldown = hurtCooldown - 0.1
  if (hurtCooldown <= 0 ) {
  	hurt(activeBeast.damage)
    hurtCooldown = 10/activeBeast.atkSpeed
    updateScreen()
  }
  document.getElementById("beastAttack").innerHTML = roundTo(hurtCooldown,1)
  },100)
}

var regenCounter = 0
var regenLoop = setInterval(
  function () {
  regenCounter++
    if (regenCounter > (10000/stats.regen)) {
      hp = hp + 1
      if (hp > stats.maxHealth) {
      hp = stats.maxHealth
      regenCounter = 0
      }
    }
  document.getElementById("plrHealth").innerHTML = hp + " / " + stats.maxHealth
  }, (1)
)

function genItem() {
  var rarityOdd = randomInt(100)
  var chosenAtt
  for (let i = 0; i < rarities.length; i++) {
    if (rarityOdd / 100 >= 1 / rarities[i].Odds) {
      chosenAtt = rarities[i]
      break
    }
  }
  var itemRoll = items[randomInt(items.length - 1)]
  var newItem = {
    Name: itemRoll,
    Rarity: chosenAtt.Name,
    damage: roundTo(randomArbit(1, 1.1 * chosenAtt.mod), 2),
    atkSpeed: roundTo(randomArbit(1, 1.1 * chosenAtt.mod), 2),
    maxHealth: roundTo(randomArbit(1, 1.1 * chosenAtt.mod), 2),
    defense: roundTo(randomArbit(1, 1.1 * chosenAtt.mod), 2),
    regen: roundTo(randomArbit(1, 1.1 * chosenAtt.mod), 2),
  }
  return newItem
}

function genBeast() {
  var hardness = randomInt(5 * difficulty)
  var bossRoll = randomInt(25)
  console.log(bossRoll)
  if (bossRoll == 1) {
    var beastRoll = bosses[randomInt(bosses.length - 1) -1]
    hardness = hardness * 3
    var newBeast = {
    Name: "LVL " + hardness + " Boss " + beastRoll.Name,
    Img: beastRoll.Img,
    damage: roundTo(randomArbit(1 * hardness, 1.75 * hardness), 2),
    atkSpeed: roundTo(randomArbit(1 * hardness, 1.75 * hardness), 2),
    health: 5*roundTo(randomArbit(1 * hardness, 1.75 * hardness), 2),
    defense: roundTo(randomArbit(1 * hardness, 1.75 * hardness), 2),
  }
  return newBeast
  } else {
  var beastRoll = beasts[randomInt(beasts.length - 1) - 1]
  var newBeast = {
    Name: "LVL " + hardness + " " + beastRoll.Name,
    Img: beastRoll.Img,
    damage: roundTo(randomArbit(1, 1.1 * hardness), 2),
    atkSpeed: roundTo(randomArbit(1, 1.1 * hardness), 2),
    health: 5*roundTo(randomArbit(1, 1.1 * hardness), 2),
    defense: roundTo(randomArbit(1, 1.1 * hardness), 2),
  }
  return newBeast
  }
}

function updateMenu(menu) {
  if (currentMenu == menu) {
    document.getElementById("menu" + currentMenu).style.display = "none"
    currentMenu = 0
  } else {
    var toClose = document.getElementsByClassName("menu")
    for (let i = 0; i < toClose.length; i++) {
      toClose[i].style.display = "none"
    }
    currentMenu = menu
    document.getElementById("menu" + currentMenu).style.display = "block"
  }
}

function scrapInv() {
  for (i=0; i<inv.length;i++) {
    var scrapRoll = randomInt(10)
    if (scrapRoll == 1) {
      statPoints++
    }
    inv.splice(0,1)
  }
}

function equipItem(cell) {
  var toEquip = inv[cell]
  if (toEquip && equipped[toEquip.Name]) {
    var moddedSlot = document.getElementById("invSlot" + cell)
    var storedName = moddedSlot.innerHTML
      moddedSlot.innerHTML = "Are You Sure? This will replace your existing " + toEquip.Name
      moddedSlot.removeAttribute("onClick")
      moddedSlot.addEventListener("click", function() {
        equipped[toEquip.Name] = toEquip
        inv.splice(cell, 1)
        updateScreen()
        updateStats()
      })
    x = setTimeout(function(){
        moddedSlot.removeEventListener("click", function() {
        equipped[toEquip.Name] = toEquip
        inv.splice(cell, 1)
      })
        moddedSlot.setAttribute("onClick", "javascript: equipItem(" + cell + ")")
        moddedSlot.style["background-color"] = findRarity(toEquip.Rarity).Color
        moddedSlot.innerHTML = storedName
    },50000)
  } else {
    equipped[toEquip.Name] = toEquip
    inv.splice(cell, 1)
    updateScreen()
    updateStats()
  }
}

function updateScreen() {
  // Stats
  document.getElementById("points").innerHTML = "Points: " + statPoints
  document.getElementById("damage").innerHTML = "Damage: " + stats.damage
  document.getElementById("atkSpeed").innerHTML = "Attack Speed: " + stats.atkSpeed
  document.getElementById("health").innerHTML = "Health: " + stats.maxHealth
  document.getElementById("defense").innerHTML = "Defense: " + stats.defense
  document.getElementById("regen").innerHTML = "Regen: " + stats.regen
  // HUD
  document.getElementById("plrHealth").innerHTML = hp + " / " + stats.maxHealth
  document.getElementById("stage").innerHTML = "Stage: " + stage
  document.getElementById("beast").src = activeBeast.Img
  document.getElementById("beastName").innerHTML = activeBeast.Name
  document.getElementById("beastHealth").innerHTML = activeBeast.health + " HP"
  // Inventory
  document.getElementById("menu2").innerHTML = ""
  for (let i = 0; i < inv.length; i++) {
    var displayed = inv[i]
    var box = document.createElement("div")
    document.getElementById("menu2").append(box)
    box.id = "invSlot" + i
    box.setAttribute("onClick", "javascript: equipItem(" + i + ")")
    box.innerHTML = i + 1 + ". " + displayed.Rarity + " " + displayed.Name 
      + "   +%" + (Math.round(displayed.damage*100-100)) + " Damage"
      + "   +%" + (Math.round(displayed.atkSpeed*100-100)) + " AtkSpeed"
      + "   +%" + (Math.round(displayed.maxHealth*100-100)) + " MaxHP"
      + "   +%" + (Math.round(displayed.defense*100-100)) + " Defense"
      + "   +%" + (Math.round(displayed.regen*100-100)) + " Regen"
    box.style = "background-color: " + findRarity(displayed.Rarity).Color
  }
  // Equipped
  document.getElementById("menu3").innerHTML = ""
  Object.entries(equipped).forEach(([itemName, itemObj]) => {
    if (itemObj) {
      var box = document.createElement("div")
      document.getElementById("menu3").append(box)
      box.innerHTML = itemObj.Rarity +" "+ itemObj.Name
        + "   +%" + (Math.round(itemObj.damage*100-100)) + " Damage"
        + "   +%" + (Math.round(itemObj.atkSpeed*100-100)) + " AtkSpeed"
        + "   +%" + (Math.round(itemObj.maxHealth*100-100)) + " MaxHP"
        + "   +%" + (Math.round(itemObj.defense*100-100)) + " Defense"
        + "   +%" + (Math.round(itemObj.regen*100-100)) + " Regen"
      box.style = "background-color: " + findRarity(itemObj.Rarity).Color
      box.className = "itemSlot"
    }
  })
}



function findRarity(rare) {
  for (let i = 0; i < rarities.length; i++) {
    if (rarities[i].Name == rare) {
      return rarities[i]
      break
    }
  }
}

function updateStats() {
  Object.entries(baseStats).forEach(([stat, statVal]) => {
    stats[stat] = statVal
  })
  Object.entries(baseStats).forEach(([stat, statVal]) => {
    Object.entries(equipped).forEach(([itemName, itemObj]) => {
      if (itemObj) {
        stats[stat] = roundTo(stats[stat] * itemObj[stat],2)
      }
    })
  })
  difficulty = Math.floor(stage / 10) + 1
}
updateStats()
updateScreen()
