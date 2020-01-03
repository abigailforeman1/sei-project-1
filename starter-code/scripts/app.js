function init() {

  //! DOM ELEMENTS 
  const grid = document.querySelector('.grid')
  const startBtn = document.querySelector('.start')
  const resetBtn = document.querySelector('.reset')
  const squares = []

  //! GAME VARIABLES 
  const width = 11
  let playerIndex = 115 // starts player at grid 111
  // let alienIndex = 1 // starts alien at grid 1
  let timerId = null // a variable to store our interval id, we need to know this so we can stop it later (think ticket at the coat check/cloakroom)
  let running = false // a boolean value we use to determine if we should be stopping or starting the timer when the button is clicked, if it is set to false we need to start the interval, if it is true we need to stop it
  let topAliens = new Array(0, 1, 2, 3, 4, 5, 6, 7)
  let middleAliens = new Array(11, 12, 13, 14, 15, 16, 17, 18)
  let bottomAliens = new Array(22, 23, 24, 25, 26, 27, 28, 29)

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
      default:
        console.log('You can\'t move with this key!')
    }
    squares.forEach(square => square.classList.remove('player'))
    squares[playerIndex].classList.add('player')
    console.log('current player index is', playerIndex)
  }

  //! FUNCTION TO PLACE ALIENS ON GRID
  function placeAliens() {
    // console.log('Here come the aliens!')
    topAliens.forEach((number) => {
      squares[number].classList.add('alien')
    })
    middleAliens.forEach((number) => {
      squares[number].classList.add('alien')
    })
    bottomAliens.forEach((number) => {
      squares[number].classList.add('alien')
    })
  }

  //! FUNCTION TO MAKE ALIENS MOVE FROM LEFT TO RIGHT
  function moveAliens() {
    // console.log(topAliens[7])
    // console.log(topAliens)
    let allAliens = topAliens.concat(middleAliens, bottomAliens) // joining the three arrays into one array 

    if (allAliens[7] < 10) {

      // if (topAliens[7] < 10 && middleAliens[7] < 21 && bottomAliens[7] < 32) { // checking if alien rows have reached the right side yet

      // allAliens.forEach((number) => {
      //   squares[number].classList.remove('alien') // removing top row old alien class
      // })

      allAliens = allAliens.map(a => a + 1) // adding 1 to each element in topAlien array 
      console.log(allAliens)

      // allAliens.forEach((number) => {
      //   squares[number].classList.add('alien') // adding alien class to each new array element
      // })
    }

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
