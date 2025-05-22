function start() {
  const startTime = performance.now()
  const runAmount = document.getElementById("input").value
  var returnVal = ""
  for (i=0;i<runAmount;i++) {
    var num1 = Math.random()
    var num2 = Math.random()
    var result = num1 + num2
    returnVal = returnVal + result + "\n"
  }
  const endTime = performance.now()
  const runTime = endTime-startTime
  document.getElementById("time").innerHTML = "Time ran: " + runTime + " ms"
  document.getElementById("output").innerHTML = returnVal
}
