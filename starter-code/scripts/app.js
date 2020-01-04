function init() {

  //! DOM ELEMENTS 
  const grid = document.querySelector('.grid')
  const startBtn = document.querySelector('.start')
  const resetBtn = document.querySelector('.reset')
  const scoreDisplay = document.querySelector('.score')
  const squares = []

  //! GAME VARIABLES 
  const width = 11
  let playerIndex = 115 // starts player at grid 111
  // let alienIndex = 1 // starts alien at grid 1
  let timerId = null // a variable to store our interval id, we need to know this so we can stop it later (think ticket at the coat check/cloakroom)
  let shootTimerId = null
  let score = 0
  let running = false // a boolean value we use to determine if we should be stopping or starting the timer when the button is clicked, if it is set to false we need to start the interval, if it is true we need to stop it
  let aliens = new Array(0, 1, 2, 3, 4, 5, 6, 7, 11, 12, 13, 14, 15, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28, 29)
  let direction = 1

  //! CREATE THE GAME GRID FROM DIV SQUARES!!!! styled in the CSS file 
  Array(width * width).join('.').split('.').forEach(() => {
    const square = document.createElement('div') // make a square every time and give it a div 
    square.classList.add('grid-item')
    squares.push(square)
    grid.appendChild(square)
  })

  // places player at the starting position when grid has finished building 
  squares[playerIndex].classList.add('player') // controls where the player is based on the index of the square

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

  //! FUNCTION TO START SHOOT TIMER
  function shoot() {
    let currentShootIndex = playerIndex - 11 // starts shot at square infront of player 
    squares[currentShootIndex].classList.add('shoot')
    shootTimerId = setInterval(shooter, 300) // starts the timer to make the shot move
    console.log(shootTimerId)
    //! FUNCTION TO MAKE SHOOT MOVE UP
    function shooter() {
      squares[currentShootIndex].classList.remove('shoot') // remove old shoot class
      if (currentShootIndex > 10) { // stops shot going past end of grid
        currentShootIndex = currentShootIndex - 11 // every half second of the timer -11 from the index
        squares[currentShootIndex].classList.add('shoot') // add new shoot class to square
      }
      if (squares[currentShootIndex].classList.contains('alien')) { // if square already contains alien class 
        score += 1000 // add points 
        scoreDisplay.innerHTML = score // display points
        squares[currentShootIndex].classList.remove('alien', 'shoot') // remove both classes 
        clearInterval(shootTimerId++) // stop the timer for that shot 
      }
    }
  }


  //! FUNCTION TO PLACE ALIENS ON GRID
  function placeAliens() {
    aliens.forEach((number) => {
      squares[number].classList.add('alien')
    })
    score = 0
    scoreDisplay.innerHTML = score
  }

  //! FUNCTION TO MAKE ALIENS MOVE FROM LEFT TO RIGHT
  function moveAliens() {
    removeAliens()
    console.log(direction)

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
    }
    // aliens = aliens.map(a => a + direction)
    addAliens()
  }


  function addAliens() {
    aliens = aliens.map(a => a + direction)
    aliens.forEach((number) => {
      squares[number].classList.add('alien') // adding alien class to each new array element
    })
  }

  function removeAliens() {
    aliens.forEach((number) => {
      squares[number].classList.remove('alien') // removing old alien class
    })
  }

  //! FUNCTION TO START GAME TIMER 
  function startTimer() {
    if (!running) {
      timerId = setInterval(moveAliens, 1000) // start the interval, remember the syntax is 'what function to run, and how often to run it' and we store the return id in a variable, so we can use it to stop the interval later
      console.log(timerId)
      running = true
    } else { // so the else runs only if running was true
      clearInterval(timerId) // and that is when we stop the timer
      running = false // set the value of running back to false, so when the button is next clicked, we know to start the timer again 
    }
  }

  //! EVENT LISTENERS
  window.addEventListener('keydown', handleKeyDown)
  startBtn.addEventListener('click', startTimer)
  resetBtn.addEventListener('click', placeAliens)

}

window.addEventListener('DOMContentLoaded', init)
