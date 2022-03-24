'use strict'

const SADFACE = '🥵'
const HAPPYFACE = '😀'
const WINFACE = '🥳'
const HEART = '❤️'
const LIGHTBALL = '💡'

document.addEventListener(
  'contextmenu',
  function (e) {
    e.preventDefault()
  },
  false
)

var gGame = {
  isOn: false,
  shownCount: 0,
  markedCount: 0,
  secsPasses: 0,
  points: 0,
  lifes: 3,
}

var gFirstClick = {}
var gIDCell = 0
var timeNum
var gHint = false
var gHintsCounter = 3
var gSafeClick = 3

var gLevel = {
  SIZE: 4,
  MINES: 2,
}

var elH2Span = document.querySelector('h2 span')
elH2Span.innerText = HEART + HEART + HEART

var elLightsSpan = document.querySelector('.lights')
elLightsSpan.innerText = LIGHTBALL + LIGHTBALL + LIGHTBALL

var emptyCells = []
var newEmptyCells = []
var gMines = []

var gBoard = createBoard()
renderBoard()

function clickedRadio(elRadio) {
  gLevel.SIZE = Number(elRadio.id)
  gLevel.MINES = Number(elRadio.value)
  gBoard = null
  resetGame()
  gBoard = createBoard()
  renderBoard()
}

function createBoard() {
  var board = []
  for (var i = 0; i < gLevel.SIZE; i++) {
    board[i] = []
    for (var j = 0; j < gLevel.SIZE; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        isClicked: false,
      }
      board[i][j] = cell
      emptyCells.push({ i: i, j: j })
    }
  }
  return board
}

function renderBoard() {
  var strHTML = ''
  for (var i = 0; i < gBoard.length; i++) {
    strHTML += `<tr class="board-row" >\n`
    for (var j = 0; j < gBoard[0].length; j++) {
      // if (gFirstClick.i === i && gFirstClick.j === j)
      var cell = gBoard[i][j]
      var className = 'cell'
      cell.minesAroundCount = setMinesNegsCount(gBoard, i, j)
      if (cell.isMine) {
        className += ' mine'
        cell.minesAroundCount = ''
      }
      if (cell.isShown) {
        if (cell.minesAroundCount !== 0) {
          strHTML += `\t<td data-i="${i}" data-j="${j}" class="cellone" id="${gIDCell++}" onmousedown="cellClicked(this, ${i}, ${j}, event)" >${
            cell.minesAroundCount
          }</td>\n`
        } else {
          strHTML += `\t<td data-i="${i}" data-j="${j}" class="cellone" id="${gIDCell++}" onmousedown="cellClicked(this, ${i}, ${j}, event)" ></td>\n`
        }
      } else {
        if (cell.minesAroundCount === 0) {
          strHTML += `\t<td data-i="${i}" data-j="${j}" class="${className}" id="${gIDCell++}" onmousedown="cellClicked(this, ${i}, ${j}, event)" ></td>\n`
        } else {
          strHTML += `\t<td data-i="${i}" data-j="${j}" class="${className}" id="${gIDCell++}" onmousedown="cellClicked(this, ${i}, ${j}, event)" >${
            cell.minesAroundCount
          }</td>\n`
        }
      }
    }
    strHTML += `</tr\n`
  }
  var elCells = document.querySelector('.board-cells')
  elCells.innerHTML = strHTML
}

function cellClicked(elCell, i, j, e) {
  if (gHint) {
    hintStart(i, j)
    setTimeout(hintTimeUp, 1000, i, j)
    return
  } else {
    var cell = gBoard[i][j]
    if (firstClick()) {
      gFirstClick = { i: i, j: j }
      var checkCellsCounter = 0
      while (checkCellsCounter < emptyCells.length) {
        if (
          gFirstClick.i === emptyCells[checkCellsCounter].i &&
          gFirstClick.j === emptyCells[checkCellsCounter].j
        ) {
          emptyCells.splice(checkCellsCounter, 1)
          newEmptyCells = emptyCells.slice()
        }
        checkCellsCounter++
      }
      gGame.isOn = true
      timeNum = 1
      cell.isShown = true
      startTimer()
      setMines(gLevel.MINES, gBoard)
      renderBoard(gBoard)
    }
    if (elCell.classList.contains('marked') && e.button === 0) {
      return
    }
    switch (e.button) {
      case 0:
        cell.isShown = true
        if (cell.isMine) {
          elCell.innerText = '💣'
          gGame.points++
          gGame.lifes--
          switch (gGame.lifes) {
            case 2:
              elH2Span.innerText = HEART + HEART
              break
            case 1:
              elH2Span.innerText = HEART
              break
            case 0:
              elH2Span.innerText = '0'
              break
          }
          if (gGame.lifes === 0) {
            timeNum = 0
            var elH1Span = document.querySelector('h1 span')
            elH1Span.innerText = SADFACE
            var elModal = document.querySelector('.modal')
            elModal.style.display = 'inline-block'
            var elHeader = document.querySelector('.modal h1')
            elHeader.innerText = 'YOU LOST'
            var elBoard = document.querySelector('.board')
            elBoard.style.display = 'none'
          } else {
            checkWin()
          }
        } else {
          gGame.shownCount++
          expandShown(i, j)
          checkWin()
        }
        elCell.classList.add('cellone')
        break
      case 2:
        if (cell.isMarked) {
          cell.isMarked = false
          elCell.classList.remove('marked')
          if (cell.minesAroundCount === 0) {
            elCell.innerText = ''
          } else {
            elCell.innerText = cell.minesAroundCount
          }
        } else {
          cell.isMarked = true
          elCell.classList.add('marked')
          elCell.innerText = ''
        }
        if (
          elCell.classList.contains('marked') &&
          elCell.classList.contains('mine')
        ) {
          gGame.points++
          console.log(gGame.points)
        }
        if (
          elCell.classList.contains('mine') &&
          elCell.classList.contains('marked') === false
        ) {
          gGame.points--
        }
        checkWin()
        break
    }
  }
}

function checkWin() {
  if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES) {
    if (gGame.points === gLevel.MINES) {
      var elH1Span = document.querySelector('h1 span')
      elH1Span.innerText = WINFACE
      var elModal = document.querySelector('.modal')
      elModal.style.display = 'inline-block'
      var elBoard = document.querySelector('.board')
      elBoard.style.display = 'none'
      var elHeader = document.querySelector('.modal h1')
      elHeader.innerText = 'YOU WON'
      timeNum = 0
    } else {
      return
    }
  } else {
    return
  }
}

function setMines(length, board) {
  for (var k = 0; k < length; k++) {
    var getEmpty = Math.floor(Math.random() * newEmptyCells.length)
    gMines.push(newEmptyCells[getEmpty])
    board[newEmptyCells[getEmpty].i][newEmptyCells[getEmpty].j].isMine = true
    newEmptyCells.splice(getEmpty, 1)
  }
}

function setMinesNegsCount(board, checkI, checkJ) {
  var counter = 0
  for (var i = checkI - 1; i <= checkI + 1; i++) {
    if (i < 0 || i >= board.length) continue
    for (var j = checkJ - 1; j <= checkJ + 1; j++) {
      if (i === checkI && j === checkJ) continue
      if (j < 0 || j >= board[i].length) continue
      if (board[i][j].isMine) counter++
    }
  }
  return counter
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

function firstClick() {
  if (gGame.isOn) {
    return false
  } else {
    return true
  }
}

function expandShown(i, j) {
  if (gBoard[i][j].minesAroundCount === 0) {
    for (var a = i - 1; a <= i + 1; a++) {
      if (a < 0 || a >= gLevel.SIZE) continue
      for (var b = j - 1; b <= j + 1; b++) {
        if (a === i && b === j) continue
        if (b < 0 || b >= gLevel.SIZE) continue
        if (gBoard[a][b].isMine) continue
        if (gBoard[a][b].isShown) continue
        if (gBoard[a][b].isMarked) continue
        if (gBoard[a][b].isShown === false && gBoard[a][b].isMine === false) {
          gGame.shownCount++
          var ElNewCell = document.querySelector(
            `[data-i="${a}"][data-j="${b}"]`
          )
          ElNewCell.classList.add('cellone')
          gBoard[a][b].isShown = true
        }
        if (gBoard[a][b].minesAroundCount === 0) {
          expandShown(a, b)
        }
      }
    }
  }
}

function resetGame() {
  var elBoard = document.querySelector('.board')
  elBoard.style.display = 'inline-block'
  var elModal = document.querySelector('.modal')
  elModal.style.display = 'none'
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPasses: 0,
    points: 0,
    lifes: 3,
  }
  timeNum = 0
  emptyCells = []
  newEmptyCells = []
  gMines = []
  gHintsCounter = 3
  gSafeClick = 3
  var elH1Span = document.querySelector('h1 span')
  elH1Span.innerText = HAPPYFACE
  elH2Span.innerText = HEART + HEART + HEART
  var elH3Span = document.querySelector('h3 span')
  elH3Span.innerText = '0'
  elLightsSpan = LIGHTBALL + LIGHTBALL + LIGHTBALL
  var elSafeClicks = document.querySelector('.safeclicks')
  elSafeClicks.innerText = gSafeClick
  gBoard = createBoard()
  renderBoard()
}
