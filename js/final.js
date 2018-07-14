/* jshint esversion: 6 */
/*global variables*/
const cards = document.querySelectorAll('.card');
const deck = document.querySelector('.deck');
let flippedCards = [];
let moves = 0;
let min = 0;
let sec = 0;
timeRunning = false;
let matches = 0;
let timer = 0;
const rewards = {
  starsCount: 3,
};
starsOne = document.getElementById('star1');
starsTwo = document.getElementById('star2');
starsThree = document.getElementById('star3');

/*Much of the code in this project is derivative from Matthew Cranford's blog series.*/

/*Shuffle the deck every new game*/
function shuffleDeck() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}

shuffleDeck();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

/*Click on the cards to run all the functions; only allow 2 cards to flip*/
/*Get the cards to flip over*/
deck.addEventListener('click', function (e) {
  const clickedCard = event.target;
  if (clickedCard.classList.contains('card') && flippedCards.length < 2) {

    clickedCard.classList.toggle('open');
    clickedCard.classList.toggle('show');
    addFlippedCards();
    startTimer();

  }

  if (flippedCards.length === 2) {
    countMoves();
    checkMatches();
    starRewards();
    endGame();
  }
});

/*Add flipped cards to an array for temporary storage*/
function addFlippedCards(cards) {
  const clickedCard = event.target;
  flippedCards.push(clickedCard);
}

/*Check to see if cards match*/
function checkMatches() {
  if (
    flippedCards[0].firstElementChild.className ===
    flippedCards[1].firstElementChild.className)
{
    flippedCards[0].classList.toggle('match');
    flippedCards[1].classList.toggle('match');
    flippedCards = [];
    matches++;
    /*Set Timeout help from Carlos. F. in Slack Channel*/
  } else setTimeout(function () {

    flippedCards.forEach(function (cards) {
      cards.classList.remove('open', 'show');
    });

    flippedCards = [];
  }, 1000);

}

/*Count the number of moves a player takes*/
function countMoves() {
  moves++;
  const counter = document.querySelector('.moves');
  counter.innerHTML = moves;
}

/*Remove stars if player takes too many moves*/
function starRewards() {
  switch (moves) {
  case 4:
    starsOne.classList.add('hidden-star');
    rewards.starsCount--;
    break;
  case 24:
    starsTwo.classList.add('hidden-star');
    rewards.starsCount--;
    break;
  case 40:
    starsThree.classList.add('hidden-star');
    rewards.starsCount--;
    break;
  default:
    break;
}
}

/* Timer from Chris Neal in Slack Channel*/

function startTimer() {
  if (timeRunning == false) {
    timer = setInterval(showTime, 1000);
    timeRunning = true;
  }

  function showTime() {
    sec++;
    if (sec < 10) {
      sec = `0${sec}`;
    }

    if (sec >= 60) {
      min++;
      sec = 0;
    }

    const timer = document.querySelector('.timer').innerHTML = min + ':' + sec;

  }
}

const restartBtn = document.getElementById('restart');
restartBtn.addEventListener('click', resetGame, false);

function endGame() {
  if (matches == 8) {
    clearInterval(timer);
    timeRunning = false;
    showModal();
    flippedCards.length = 0;
  }
}
/* Modal box help from https://www.w3schools.com/howto/howto_css_modals.asp*/
/*Traversy Media YouTube channel also helped quite a bit*/

function showModal() {
  const modal = document.querySelector('.modal-overlay');
  modal.style.display = 'block';
  modalStats();
}

function modalStats() {
  const finalMoves = document.querySelector('.modal-moves');
  finalMoves.innerHTML = 'Moves: ' + moves;
  const timeStat = document.querySelector('.modal-time');
  const finalTime = document.querySelector('.timer').innerHTML;
  timeStat.innerHTML = `Time: ${finalTime}`;

  let finalStars = document.querySelector('.score-panel');
  let modalStars = document.querySelector('.modal-stars ul.stars');
  starRewards();
  stars1 = document.querySelector('.star11');
  stars2 = document.querySelector('.star22');
  stars3 = document.querySelector('.star33');

  switch (rewards.starsCount) {
  case 3:
    stars1.classList.remove('hidden-star');
    stars2.classList.remove('hidden-star');
    stars3.classList.remove('hidden-star');
    break;
  case 2:
    stars1.classList.add('hidden-star');
    stars2.classList.remove('hidden-star');
    stars3.classList.remove('hidden-star');
    break;
  case 1:
    stars1.classList.add('hidden-star');
    stars2.classList.add('hidden-star');
    stars3.classList.remove('hidden-star');
    break;
  case 0:
    stars1.classList.add('hidden-star');
    stars2.classList.add('hidden-star');
    stars3.classList.add('hidden-star');
    break;
}
}

function closeModal() {
  const modal = document.querySelector('.modal-overlay');
  const closed = document.querySelector('.closeBtn');
  closed.addEventListener('click', closeModal);
  modal.style.display = 'none';
}

closeModal();

function resetGame() {
  resetTimer();
  resetMoves();
  resetStars();
  closeModal();
  shuffleDeck();
  resetDeck();
  matches = 0;
}

function resetDeck() {
  cards.forEach(function (cards) {
    cards.classList.remove('open', 'show', 'match');
  });
}

function resetTimer() {
  min = 0;
  sec = 0;
  clearInterval(timer);
  timeRunning = false;
  document.querySelector('.timer').innerHTML = 0 + ':' + 0;
}

function resetStars() {
  document.getElementsByClassName('.stars').innerHTML = rewards.starsCount = 3;
  starsOne.classList.remove('hidden-star');
  starsTwo.classList.remove('hidden-star');
  starsThree.classList.remove('hidden-star');
}

function resetMoves() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}

const replay = document.querySelector('.modal-replay');
replay.addEventListener('click', resetGame);
