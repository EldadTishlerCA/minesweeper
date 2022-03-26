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

var elModal = document.querySelector('.modal')
var elBoard = document.querySelector('.board')
var elSpanFace = document.querySelector('.face-icon')

var elSpanLifes = document.querySelector('.lifes-icon')
elSpanLifes.innerText = HEART + HEART + HEART

var elSpanLights = document.querySelector('.lights')
elSpanLights.innerText = LIGHTBALL + LIGHTBALL + LIGHTBALL

var elSafeClicks = document.querySelector('.safeclicks')
elSafeClicks.innerText = gSafeClick

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
              elSpanLifes.innerText = HEART + HEART
              break
            case 1:
              elSpanLifes.innerText = HEART
              break
            case 0:
              elSpanLifes.innerText = '0'
              break
          }
          if (gGame.lifes === 0) {
            timeNum = 0
            elSpanFace.innerText = SADFACE
            elModal.style.display = 'inline-block'
            var elHeader = document.querySelector('.modal h1')
            elHeader.innerText = 'YOU LOST'
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
      elSpanFace.innerText = WINFACE
      elModal.style.display = 'inline-block'
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
  elBoard.style.display = 'inline-block'
  elModal.style.display = 'none'
  gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPasses: 0,
    points: 0,
    lifes: 3,
  }
  gFirstClick.length = 0
  timeNum = 0
  emptyCells.length = 0
  newEmptyCells.length = 0
  gMines = []
  gHintsCounter = 3
  gSafeClick = 3
  elSpanFace.innerText = HAPPYFACE
  elSpanLifes.innerText = HEART + HEART + HEART
  var elH3Span = document.querySelector('h3 span')
  elH3Span.innerText = '0'
  elSpanLights.innerText = LIGHTBALL + LIGHTBALL + LIGHTBALL
  elSafeClicks.innerText = gSafeClick
  gBoard = createBoard()
  renderBoard()
}
