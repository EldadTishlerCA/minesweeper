'use strict'

const sadFace = '🥵'
const happyFace = '😀'
const winFace = '🥳'

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

var gLevel = {
  SIZE: 4,
  MINES: 2,
}

var emptyCells = []
var newEmptyCells = []
var gMines = []

var gBoard = createBoard()
renderBoard()

function clickedRadio(elRadio) {
  gLevel.SIZE = elRadio.id
  gLevel.MINES = elRadio.value
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
      strHTML += `\t<td data-i="${i}" data-j="${j}" class="${className}" id="${gIDCell++}" onmousedown="cellClicked(this, ${i}, ${j}, event)" >${
        cell.minesAroundCount
      }</td>\n`
    }
    strHTML += `</tr\n`
  }

  var elCells = document.querySelector('.board-cells')
  elCells.innerHTML = strHTML
}

function cellClicked(elCell, i, j, e) {
  if (firstClick()) {
    gFirstClick = { i: i, j: j }
    console.log(gFirstClick)
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
    startTimer()
    setMines(gLevel.MINES, gBoard)
    gGame.shownCount++
    var firstNum = setMinesNegsCount(gBoard, i, j)
    elCell.innerHTML = firstNum
    expandShown(i, j)
    renderBoard(gBoard)
  }
  var cell = gBoard[i][j]
  if (elCell.classList.contains('marked') && e.button === 0) {
    return
  }
  switch (e.button) {
    case 0:
      cell.isShown = true
      if (cell.isMine) {
        elCell.innerText = '💣'
        gGame.lifes--
        var elH2Span = document.querySelector('h2 span')
        elH2Span.innerText = gGame.lifes
        if (gGame.lifes === 0) {
          var elH1Span = document.querySelector('h1 span')
          elH1Span.innerText = sadFace
          // need to add modal button for reset
        }
      } else {
        elCell.innerText = cell.minesAroundCount
        gGame.shownCount++
        expandShown(i, j)
      }
      if (gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES) {
        checkWin(elCell)
      }
      elCell.style.color = 'white'
      elCell.classList.add('noClick')
      break
    case 2:
      elCell.classList.toggle('marked')
      elCell.innerText = ''
      checkWin(elCell)
      break
  }
}

function checkWin(cell) {
  if (cell.classList.contains('marked') && cell.classList.contains('mine')) {
    gGame.points++
    console.log(gGame.points)
  }
  if (
    cell.classList.contains('mine') &&
    cell.classList.contains('marked') === false
  ) {
    gGame.points--
    console.log(gGame.points)
  }
  if (
    gGame.points === gLevel.MINES &&
    gGame.shownCount === gLevel.SIZE * gLevel.SIZE - gLevel.MINES
  ) {
    console.log('you win!')
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
      if (a < 0 || a === gLevel.SIZE) continue
      for (var b = j - 1; b <= j + 1; b++) {
        if (a === i && b === j) continue
        if (b < 0 || b === gLevel.SIZE) continue
        if (gBoard[a][b].isMine) continue
        console.log(a, b)
        var ElNewCell = document.querySelector(`[data-i="${a}"][data-j="${b}"]`)
        ElNewCell.style.color = 'white'
        ElNewCell.classList.add('noClick')
      }
    }
  }
}

function resetGame() {
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
  var elH1Span = document.querySelector('h1 span')
  elH1Span.innerText = happyFace
  var elH2Span = document.querySelector('h2 span')
  elH2Span.innerText = 3

  gBoard = createBoard()
  renderBoard()
}
