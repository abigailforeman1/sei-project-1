![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# General Assembly Project 1: Space Invaders

## Goal:
To create a functioning browser game using Vanilla JavaScript

## Timeframe:
9 days

## Technologies used:
* HTML5
* CSS
* JavaScript
* Github

## Deployment: 
This game has been deployed on GitHub Pages and can be found here: https://spaceinvaders-project1.herokuapp.com/

## Getting started: 
Use the clone button to download the game source code. Open the index.html file in your browser and the game should start, if not check the console for any issues.

## Brief: 
Space Invaders is a classic arcade game from the 80s. The player’s aim is to shoot an invading alien armada, before it reaches the planet's surface, and to achieve the highest score possible before either being destroyed by the aliens, or allowing them to reach the planet's surface.

This was my first project while on General Assembly’s SEI course and also my first project building with Javascript.

![screenshot of space invaders game](https://github.com/abigailforeman1/sei-project-1/raw/master/assets/space_invaders.png)

## Game architecture:
The player controls the spaceship (Lisa Simpson) and can move along the bottom row of the grid from left to right. The player can also shoot towards the invading Bart aliens by pressing the spacebar which sends a bullet up that specific column of the grid. If the bullet hits one of the Bart aliens it removes it from the grid. 

The 3 rows of invading Bart aliens are programmed to move automatically once the game starts. They move from left to right and down a row each time they reach the side of the grid. A random alien will also drop a bomb every 2 seconds which falls down towards the player. If the player is hit the game ends. If the player shoots a bullet and it collides with the bomb, both items are removed from the grid and the game continues. 

If the player manages to destroy all the invading Bart aliens then the game restarts but their score remains so they can keep playing. Once the game ends, a modal popup appears displaying the players score. This also gets added to the leaderboard from local storage.

Here are examples of my code that controls the aliens movement and fires the players bullet if the column doesn't already contain a bullet:

```javascript
  function moveAliens() {
    removeAliens()

    if (direction === 1 && aliens[0] % width === 3) {
      direction = width
    } else if (direction === width && aliens[0] % width === 3) {
      direction = -1
    } else if (direction === -1 && aliens[0] % width === 0) {
      direction = width
    } else if (direction === width && aliens[0] % width === 0) {
      direction = 1
    } else if (aliens[0] > (width * width) - width) {  
      gameOver()
    }
    addAliens()
  }
```

```javascript
  function shoot() {
  let currentShootIndex = playerIndex - width 
  let newShootIndex = currentShootIndex 
  const columnArray = [] 
  
  for (let i = 1; i < width - 1; i++) {
    columnArray.push(newShootIndex -= 11) 
  }

  const someContainShots = columnArray.some(item => { 
    return squares[item].classList.contains('shoot')
  })

  if (someContainShots === false) {
    squares[currentShootIndex].classList.add('shoot')
    shootTimerId = setInterval(shootMovement, 100) 
  } else {
    console.log('you can\'t shoot!')
  }
```

## Key learnings:
1. Breaking tasks down into smaller chunks 

I was nervous to start the project but after spending time psuedocoding and planning what part of the game I was going to tackle each day, I felt much more confident and prepared to start. I have continued using this process moving forward which has been very helpful.

2. Console logging

It was definitely during this project that I realised the power of console logging and got into the habit of console logging my way through bugs.  

3. Set intervals 

I hadn't worked with many timers prior to this project but definitely came out of it feeling more comfortable using them. The game has multiple set intervals running simultaneously, so I had to ensure I was using approriate and clear naming conventions to avoid any chaos while building! 

## Challenges and future improvements:
1. The first challenge I encountered was creating the movement for the aliens. I used an array of numbers corresponding to grid square index numbers to place the aliens, so I had to ensure that the conditions to move them left, right, up and down worked for all aliens.
2. Another challenge was stopping the players shots going through the aliens when more than one was fired up the same column. To fix this issue I wrote a piece of code that checked if a grid in that column already contained a bullet or not.
3. There are a number of future improvements that I plan to make. Firstly, I would like to add functionality for the movement of the aliens to speed up once they have all been destroyed. I would also like to develop the leaderboard with names and everyscore displaying no matter if it was the highest or not.

![screenshot of space invaders game over](https://github.com/abigailforeman1/sei-project-1/raw/master/assets/space_invaders2.png)

