function init() {

  //! DOM ELEMENTS 
  const grid = document.querySelector('.grid')
  const startScreen = document.querySelector('.start-screen')
  const startBtn = document.querySelector('.start')
  const restartBtn = document.querySelector('.restart')
  const scoreDisplay = document.querySelector('.score')
  const modal = document.querySelector('.modal')
  const modalText = document.querySelector('.modal-text')
  const eachScore = document.querySelector('.each-score')

  //! GAME VARIABLES 
  let squares = []
  const width = 11
  let playerIndex = 115 
  let timerId = null 
  let shootTimerId = null
  let score = 0
  scoreDisplay.innerHTML = score
  let running = false 
  let aliens = new Array(0, 1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28, 29)
  let direction = 1
  let bombDropTimerId = null
  let alienBombTimerId = null
  let storedHiScore = localStorage.getItem('storedHiScore') ? JSON.parse(localStorage.getItem('storedHiScore')) : null
  const data = JSON.parse(localStorage.getItem('storedHiScore'))

  //! FUNCTION TO OPEN POP UP AT START
  function openFirstModal() {
    startScreen.classList.add('show-modal') 
    // console.log('opening modal')
  }
  openFirstModal()

  //! FUNCTION TO CLOSE POP UP AT START
  function closeFirstModal() {
    startScreen.classList.remove('show-modal') 
  }

  //! CREATE THE GAME GRID FROM DIV SQUARES!!!!
  function makeGrid() {
    Array(width * width).join('.').split('.').forEach(() => {
      const square = document.createElement('div') // make a square every time and give it a div 
      square.classList.add('grid-item')
      squares.push(square)
      grid.appendChild(square)
    })
  }
  makeGrid()

  squares[playerIndex].classList.add('player') // controls where the player is based on the index of the square

  //! FUNCTION TO PLACE ALIENS ON GRID
  function placeAliens() {
    aliens.forEach((number) => {
      squares[number].classList.add('alien')
    })
  }
  placeAliens()

  //! FUNCTION TO CREATE HIGH SCORE DISPLAY
  function hiScoreCreate() {
    const hiScore = document.createElement('div')
    hiScore.classList.add('hi-score')
    hiScore.innerHTML = storedHiScore
    eachScore.appendChild(hiScore) 
    console.log(hiScore)
  }

  //! FUNCTION TO STORE HIGH SCORE TO LOCAL STORAGE
  function storeScores() {
    if (score > storedHiScore) { // if the current points value is higher than the value stored in local storage
      storedHiScore = score // assign storedHiScore to equal the current value of points
      localStorage.setItem('storedHiScore', JSON.stringify(storedHiScore)) // set storedHiScore into local storage
      // this is a key value pair - you are setting the key above and then giving it the value of your latest 
      // high score
      hiScoreCreate() // this will enable you to display the score immediately if needed
    }
  }

  function displayHiScore() {
    data ? hiScoreCreate(data) : null
  }
  displayHiScore()

  //! FUNCTION TO MAKE ALIENS MOVE FROM LEFT TO RIGHT
  function moveAliens() {
    removeAliens()

    // move 3 -> 14
    if (direction === 1 && aliens[0] % width === 3) {
      direction = width

      // move 14 -> 11
    } else if (direction === width && aliens[0] % width === 3) {
      direction = -1

      // move 11 -> 22
    } else if (direction === -1 && aliens[0] % width === 0) {
      direction = width

      // move 22 -> 25
    } else if (direction === width && aliens[0] % width === 0) {
      direction = 1

    } else if (aliens[0] > (width * width) - width) { // GAME OVER when aliens reach end of grid 
      gameOver()
    }
    // default option will add 1 to each alien array element until a condition is met in the loop --- this starts the aliens moving 
    addAliens()
  }
  //! FUNCTION TO ADD ALIEN CLASS
  function addAliens() {
    aliens = aliens.map(a => a + direction)
    aliens.forEach((number) => {
      squares[number].classList.add('alien') // adding alien class to each new array element
    })
  }
  //! FUNCTION TO REMOVE ALIEN CLASS
  function removeAliens() {
    aliens.forEach((number) => {
      squares[number].classList.remove('alien') // removing old alien class
    })
  }

  //! FUNCTION TO START GAME TIMER 
  function startTimer() {
    console.log(running)
    if (!running) {
      timerId = setInterval(moveAliens, 1250) 
      running = true
      console.log(running)
    } else { 
      // clearInterval(timerId) // and that is when we stop the timer
      running = false 
    }
  }

  //! FUNCTION TO MAKE SPACE SHIP MOVE
  function handleKeyDown(e) {
    // console.log(e.keyCode) // says what key you're pressing with its code
    // console.log(playerIndex) // says which array square number he is at 
    switch (e.keyCode) {
      case 39:
        if (playerIndex < 120) { // checking if player has reached the right side of the grid  
          playerIndex++
        }
        break
      case 37:
        if (playerIndex > 110) { // checking it player has reached left side of the grid
          playerIndex--
        }
        break
      case 38:
        {
          shoot()
        }
        break
    }
    squares.forEach(square => square.classList.remove('player'))
    squares[playerIndex].classList.add('player')
    // console.log('current player index is', playerIndex)
  }

  //! FUNCTION TO ALLOW 1 SHOT PER COLUMN AT A TIME
  function shoot() {
    let currentShootIndex = playerIndex - width // starts shot at square infront of player 
    let newShootIndex = currentShootIndex // new variable to stop currentShootIndex from changing
    const columnArray = [] // array for index values of column with shot in 

    for (let i = 1; i < width - 1; i++) {
      columnArray.push(newShootIndex -= 11) // making the column array based on newShootIndex
    }

    const someContainShots = columnArray.some(item => { // searching the column if it contains shots already
      // console.log(squares[item])
      return squares[item].classList.contains('shoot')
    })

    if (someContainShots === false) {
      squares[currentShootIndex].classList.add('shoot')
      shootTimerId = setInterval(shootMovement, 100) // starts the timer to make the shot move
    } else {
      console.log('you can\'t shoot!')
    }

    //! FUNCTION TO MAKE SHOT MOVE
    function shootMovement() {
      squares[currentShootIndex].classList.remove('shoot') // remove old shoot class
      if (currentShootIndex > width - 1) { // stops shot going past end of grid
        currentShootIndex = currentShootIndex - width // every instance of the timer -11 from the index
        squares[currentShootIndex].classList.add('shoot') // add new shoot class to square
        if (squares[currentShootIndex].classList.contains('alien')) { // if square already contains alien class 
          clearInterval(shootTimerId) // stop the timer for that shot 
          squares[currentShootIndex].classList.remove('alien', 'shoot') // remove both classes 
          const index = aliens.indexOf(currentShootIndex) // finds index of alien at currentShootIndex 
          aliens.splice(index, 1) // removes that alien from the alien array 
          score += 1000 // add points
          scoreDisplay.innerHTML = score // display points
        }
        if (aliens.length === 0) {
          console.log('WINNER!')
          // location.reload()
          // console.log(running)
          // running = true
          // startTimer()
          // console.log(running)
          // console.log(aliens)
          aliens = new Array(0, 1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28, 29)
          placeAliens()
          console.log(aliens)
          // alienSpeed -= 250
          // console.log(alienSpeed)
        }
        if (squares[currentShootIndex].classList.contains('bomb')) {
          console.log('bomb hit')
          squares[currentShootIndex].classList.remove('bomb', 'shoot')
          squares[currentShootIndex + width].classList.remove('bomb', 'shoot')
          clearInterval(shootTimerId)
          clearInterval(bombDropTimerId)
        }
        // check if bombs are above shot and remove and in the same column 
      }
    }
  }

  //! FUNCTION TO START BOMB TIMER
  function alienBombTimer() {
    // console.log('hello alien bombs')
    alienBombTimerId = setInterval(placeBomb, 2000)
  }

  //! FUNCTION TO PLACE BOMBS
  function placeBomb() {
    const randomAlien = Math.floor(Math.random() * aliens.length) // generate random number between the length of alien array
    let startOfBomb = aliens[randomAlien] + width
    // console.log(randomAlien) // gets random index number - 9
    // console.log(aliens[randomAlien]) // the square that that alien is at - 14
    // console.log(startOfBomb) // adds 8 to the square that alien is at - 25

    if (!squares[startOfBomb].classList.contains('alien')) { // if alien square + width does not contain alien DROP BOMB HERE
      squares[startOfBomb].classList.add('bomb')
    } else if (!squares[startOfBomb + width].classList.contains('alien')) { // if alien square + width + width does not contains alien DROP BOMB HERE 
      squares[startOfBomb + width].classList.add('bomb')
    } else {
      squares[startOfBomb + (width * 2)].classList.add('bomb') // else drop bomb in alien square + width + width + width
    }

    dropBomb()
    bombDropTimerId = setInterval(dropBomb, 200)

    //! FUNCTION TO DROP BOMBS
    function dropBomb() {
      squares[startOfBomb].classList.remove('bomb') // remove old bomb class
      // console.log(startOfBomb)
      // console.log(squares[startOfBomb])
      if (startOfBomb <= 110) {
        console.log(startOfBomb)
        startOfBomb += width // every instance of the timer -11 from the index
        squares[startOfBomb].classList.add('bomb') // add new bomb class to square
        if (squares[startOfBomb].classList.contains('player')) {
          gameOver()
        }
      } else {
        console.log('past grid')
        clearInterval(bombDropTimerId)
      }
    }
  }

  //! FUNCTION TO CLEAR GAME WHEN DEAD
  function gameOver() {
    running = false
    // console.log(running)
    clearInterval(timerId)
    clearInterval(shootTimerId)
    clearInterval(bombDropTimerId)
    clearInterval(alienBombTimerId)
    modalText.innerHTML = `D'OH! Your score: ${score}`
    gameOverModal()
  }

  //! FUNCTION TO CLEAR GRID
  function clearGrid() {
    grid.innerHTML = ''
    score = 0
    scoreDisplay.innerHTML = score   
    squares = []
    aliens = new Array(0, 1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28, 29)
    direction = 1
    playerIndex = 115
  }

  //! FUNCTION TO OPEN POP UP WHEN GAME OVER
  function gameOverModal() {
    // console.log('open')
    modal.classList.add('show-modal')
  }
  //! FUNCTION TO CLOSE POP UP WHEN GAME OVER
  function gameOverModalClose() {
    // console.log('closing')
    modal.classList.remove('show-modal')
    clearGrid()
    makeGrid()
    placeAliens()
    startTimer()
  }

  storeScores()

  //! EVENT LISTENERS
  window.addEventListener('keydown', handleKeyDown)

  startBtn.addEventListener('click', closeFirstModal)
  startBtn.addEventListener('click', startTimer)
  startBtn.addEventListener('click', alienBombTimer)

  restartBtn.addEventListener('click', gameOverModalClose)
  restartBtn.addEventListener('click', startTimer)
  restartBtn.addEventListener('click', alienBombTimer)
  restartBtn.addEventListener('click', handleKeyDown)
}

window.addEventListener('DOMContentLoaded', init)


// let storedHiScore = localStorage.getItem('storedHiiScore') ?  JSON.parse
