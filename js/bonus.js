'use strict'

var elHintsP = document.querySelector('.hints-p')

function clickedHint() {
  if (gGame.isOn) {
    if (gHint === false) {
      if (gHintsCounter !== 0) {
        gHint = true
        gHintsCounter--
        elHintsP.innerText = 'Hints is on - Please chose cell to show'
        console.log(gHintsCounter)
        switch (gHintsCounter) {
          case 2:
            elSpanLights.innerText = LIGHTBALL + LIGHTBALL
            break
          case 1:
            elSpanLights.innerText = LIGHTBALL
            break
          case 0:
            elSpanLights.innerText = '0'
            break
        }
      }
    }
  } else {
    elHintsP.innerText = 'Hints is off - Please click first cell'
  }
}

function hintStart(i, j) {
  for (var a = i - 1; a <= i + 1; a++) {
    if (a < 0 || a >= gLevel.SIZE) continue
    for (var b = j - 1; b <= j + 1; b++) {
      if (b < 0 || b >= gLevel.SIZE) continue
      var ElNewCell = document.querySelector(`[data-i="${a}"][data-j="${b}"]`)
      if (ElNewCell.classList.contains('mine')) {
        ElNewCell.innerText = '💣'
      }
      ElNewCell.classList.add('showCell')
    }
  }
}

function hintTimeUp(i, j) {
  for (var a = i - 1; a <= i + 1; a++) {
    if (a < 0 || a >= gLevel.SIZE) continue
    for (var b = j - 1; b <= j + 1; b++) {
      if (b < 0 || b >= gLevel.SIZE) continue
      var ElNewCell = document.querySelector(`[data-i="${a}"][data-j="${b}"]`)
      if (ElNewCell.classList.contains('mine')) {
        ElNewCell.innerText = ''
      }
      ElNewCell.classList.remove('showCell')
    }
  }
  switch (gHintsCounter) {
    case 2:
      elHintsP.innerText = 'Hints is off - For hint click lightball'
      break
    case 1:
      elHintsP.innerText = 'Hints is off - For hint click lightball'
      break
    case 0:
      elHintsP.innerText = 'Hints is off - No hints left'
      break
  }
  gHint = false
}

function safeCell() {
  if (gGame.isOn) {
    if (gSafeClick !== 0) {
      var getEmpty = Math.floor(Math.random() * newEmptyCells.length)
      var getCell = newEmptyCells[getEmpty]
      var ElNewCell = document.querySelector(
        `[data-i="${getCell.i}"][data-j="${getCell.j}"]`
      )
      if (
        ElNewCell.classList.contains('cellone') ||
        ElNewCell.classList.contains('mine')
      ) {
        safeCell()
      } else {
        SHOWCLICKMUSIC.play()
        ElNewCell.classList.add('cell-empty')
        gSafeClick--
        newEmptyCells.splice(getEmpty, 1)
        elSafeClicks.innerText = gSafeClick
      }
    } else {
      alert('No more safe clicks')
    }
  } else {
    alert('Please click one cell before safe clicks')
  }
}
