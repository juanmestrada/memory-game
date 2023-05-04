const start = document.getElementById("start");
const gameContainer = document.getElementById("game");
const scoreCard = document.querySelector(".highscore");

let highScore;

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");
    const cardFront = document.createElement("span");
    cardFront.classList.add("front");

    const cardBack = document.createElement("span");
    cardBack.classList.add("back");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // set card color
    cardFront.style.backgroundColor = color;

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    newDiv.append(cardFront);
    newDiv.append(cardBack);
    gameContainer.append(newDiv);
  }
}

const currScore = document.querySelector(".currentscore");

let counter = 0;
currScore.innerText = counter;

let card1 = null;
let card2 = null;

let cardsInPlay;

const gameStreak = [];

function handleCardClick(event) {
  
  // only 2 cards in play at a time
  if(cardsInPlay) return;

  // flip card
  this.style.transform = "rotateY(180deg)";

  // update card1 and card2
  // cannot click same card twice
  if(card1 === null){
    // update card1
    card1 = this;

    // increment score
    counter++;
    currScore.innerText = counter;

    return;
  } else if(this !== card1){
    // update card2
    card2 = this;

    // increment score
    counter++;
    currScore.innerText = counter;

  } else{
    return;
  }

  // compare card1 to card2
  if(card1.className !== card2.className){
    // not a match

    // cards still in play
    // limit 2 at a time
    cardsInPlay = true;

    let temp1 = card1;
    let temp2 = card2;

    // hide cards
    setTimeout(function(){
      temp1.style.transform = "rotateY(0deg)";
      temp2.style.transform = "rotateY(0deg)";
      
      cardsInPlay = false;
    }, 1000)

    // reset current cards
    card1 = null;
    card2 = null;

    return;
    
  } else if(card1.className === card2.className){
    // match found

    // disable matched card pair
    card1.classList.add("disabled");
    card2.classList.add("disabled");

    card1.removeEventListener("click", handleCardClick)
    card2.removeEventListener("click", handleCardClick)
 
  }

  // push cards to gameStreak
  gameStreak.push(card1);
  gameStreak.push(card2);

  // reset current cards
  card1 = null;
  card2 = null;

  // check for ALL matches
  if(gameStreak.length === COLORS.length){
    // update if new high score
    if(parseInt(highScore) === 0 || counter < highScore){
      localStorage.setItem("highScore", JSON.stringify(counter));
    }

    // Create winner banner
    const banner = document.createElement("div");
    banner.id = "winner";

    const winText = document.createElement("p");
    winText.innerText = "Winner!";

    const winScore = document.createElement("h4");
    winScore.innerText = `Your score is ${counter}`;

    const tryBtn = document.createElement("span");
    tryBtn.innerText = "Try again?";

    banner.append(winText);
    banner.append(winScore);
    banner.append(tryBtn);

    document.body.append(banner);  
    tryBtn.addEventListener("click", tryAgain);

    // reset gamestreak and score
    gameStreak.length = 0;
    counter = 0;
  }

}
function tryAgain(e){
  e.target.parentElement.remove();

  // reset game board
  gameContainer.innerHTML = '';

  // reshuffle colors
  shuffledColors = shuffle(COLORS);

  startGame();
}

function startGame(){
  start.remove();

  // get high score or initialize
  highScore = JSON.parse(localStorage.getItem("highScore")) || "0";

  scoreCard.innerText = highScore;

  // when the DOM loads
  createDivsForColors(shuffledColors);
}

start.addEventListener("click", startGame)