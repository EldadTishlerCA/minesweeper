'use strict'

function clickedHint() {
  if (gGame.isOn) {
    if (gHint === false) {
      if (gHintsCounter !== 0) {
        gHint = true
        gHintsCounter--
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
      } else {
        alert('No hints left..')
      }
    } else {
      alert('Please use hint before another one')
    }
  } else {
    alert('Please click one cell before hints')
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
