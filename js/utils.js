'use strict'

function firstClick() {
  if (gGame.isOn) {
    return false
  } else {
    return true
  }
}

function startTimer() {
  var elTimer = document.querySelector('h3 span')
  elTimer.innerText = gGame.secsPasses
  if (timeNum === 1) {
    gGame.secsPasses = gGame.secsPasses + 1
    setTimeout(startTimer, 1000)
  } else {
    elTimer.innerText = gGame.secsPasses
  }
}

function getRandomInt(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor((max - min + 1) * Math.random() + min)
}
