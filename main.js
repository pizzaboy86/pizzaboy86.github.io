'use strict';
var items = [
  { Color: "Lightgray", Value: 1, Odds: 2 },
  { Color: "Green", Value: 2, Odds: 4 },
  { Color: "Blue", Value: 3.5, Odds: 12 },
  { Color: "Red", Value: 5, Odds: 48 },
  { Color: "Gold", Value: 10, Odds: 100 }
]
var rewards = [
  { Name: "<span style='color:Gold'>Jackpot!</span>", Value: 30, Tag: "jackpot"},
  { Name: "<span style='color:Red'>Minipot!</span>", Value: 20, Tag: "minipot"},
  { Name: "<span style='color:Blue'>Bananza!</span>", Value: 13.5, Tag: "bananza"},
  { Name: "<span style='color:Green'>Deluxe!</span>", Value: 10, Tag: "deluxe"}
]
var slots = {
  slot1: undefined,
  slot2: undefined,
  slot3: undefined
}
var stats = {
  rolls: 0,
  jackpot: 0,
  minipot: 0,
  bananza: 0,
  deluxe: 0,
  best: 0,
  totalEarned: 0
}
async function roll() {
  document.getElementById("output").innerHTML = ""
  document.getElementById("btn").removeAttribute("onClick")
  var points = 0
  stats.rolls++
  for (let i = 0; i < 3; i++) {
    swapColors(i + 1);
    await wait(250)
  }
  await wait(1000)
  for (let i=1;i<4;i++) {
    points = points + slots["slot" + i].Value
  }
  for (let i=0; i<rewards.length;i++) {
    if(rewards[i].Value <= points) {
      document.getElementById("output").innerHTML = rewards[i].Name
      stats[rewards[i].Tag]++
      break
    }
  }
  if (points > stats.best) {
    stats.best = points
  }
  document.getElementById("total").innerHTML = points
  document.getElementById("btn").setAttribute("onClick", "javascript:roll()")
  updateScreen()
}

async function swapColors(slot) {
  var counter = 0;
  return new Promise(resolve => {
    var x = setInterval(function() {
      counter++;
      document.getElementById("slot" + slot).style["background-color"] = items[randomInt(items.length)-1].Color;
      if (counter >= 250) {
        var rarity = randomInt(100)
          for(let i=0; i<items.length;i++) {
             if (rarity / 100 >= 1 / items[i].Odds) {
              document.getElementById("slot" + slot).style["background-color"] = items[i].Color
              slots["slot" + slot] = items[i]
              document.getElementById("slot" + slot).innerHTML = slots["slot" + slot].Value
              stats.totalEarned = stats.totalEarned + slots["slot" + slot].Value
              break
            }
          }
        clearInterval(x);
        resolve();
      }  
    }, 5);
  });
}

function randomInt(highest) {
  return Math.floor(Math.random() * highest) + 1;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

var open = false
function stats() {
  if (open) {
    document.getElementById("stats").style.display = "none"
    open = false
  } else {
    document.getElementById("stats").style.display = "block"
    open = true
  }
}

function updateScreen() {
  document.getElementById("rolls").innerHTML = "Rolls: " + stats.rolls
  document.getElementById("best").innerHTML = "Best: " + stats.best
  document.getElementById("totalEarn").innerHTML = "Total Earned: " + stats.totalEarned
  document.getElementById("jackpots").innerHTML = "Jackpots: " + stats.jackpot
  document.getElementById("minipots").innerHTML = "Minipots: " + stats.minipot
  document.getElementById("bananzas").innerHTML = "Bananzas: " + stats.bananza
  document.getElementById("deluxes").innerHTML = "Deluxes: " + stats.deluxe
}
updateScreen()
