function start() {
  const startTime = performance.now()
  const runAmount = document.getElementById("input").value
  //var returnVal = ""
  if (runAmount > 0) {
  for (i=0;i<runAmount;i++) {
    var num1 = 1
    var num2 = 1
    var result = num1 + num2
    //returnVal = returnVal + result + "\n"
  }
  const endTime = performance.now()
  const runTime = endTime-startTime
  document.getElementById("time").innerHTML = "Time ran: " + runTime + " ms"
  //document.getElementById("output").innerHTML = returnVal
  } else {
  document.getElementById("time").innerHTML = "Enter a correct # of runs"
  }
}
