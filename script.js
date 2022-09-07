/* The Deck of Cards API expects us to provide the deck id of the deck we're playing with so it can remember 
which cards we've already drawn, how many are remaining in the deck, etc. */

let deckId = ''
let remainingCards
let card1 = {}
let card2 = {}
const cardValue = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "JACK", "QUEEN", "KING", "ACE"]

const cardsConatiner = document.getElementById('cards')
const newDeckBtn = document.getElementById('new-deck')
const drawCardBtn = document.getElementById('draw-cards')
const remainingCardsEl = document.getElementById('remaining-cards')
const showMsg = document.getElementById('show-msg')
let computerScoreEl = document.getElementById('computer-score')
let myScoreEl = document.getElementById('my-score')
let computerScore = 0
let myScore = 0

// New Game
function newGame() {
    showMsg.textContent = "Game of War"
    computerScoreEl.textContent = 0
    myScoreEl.textContent = 0
}

// When No of remaining cards become 0
function endGame() {
    
    console.log(computerScore, myScore)
    if (computerScore > myScore) {
        showMsg.textContent = "😳Computer won the game!!🥵"
    } else if(computerScore < myScore){
        showMsg.textContent = "🤩🥳You won the game!!🤩🥳"
    } else {
        showMsg.textContent = "☠️It's a tie, no-one won!!💀"
    }

    drawCardBtn.disabled = true
}


// Load remaining cards in DOM after each draw
function loadRemainingCards() {
    remainingCardsEl.textContent = `Remaining Cards: ${remainingCards}`

    if(remainingCards == 0) {
        endGame()
    }
}

// Loads of images of card we get from the api at each draw
function loadImage() {    
    cardsConatiner.children[0].innerHTML = `<img src="${card1.image}" id="card-comp" class="images"></img>`
    cardsConatiner.children[1].innerHTML = `<img src="${card2.image}" id="card-self" class="images"></img>`
}

// Set image source and remaining cards value that we get from api to variables
function setValues(data) {
    remainingCards = data.remaining
    card1.image = data.cards[0].image
    card2.image = data.cards[1].image
}

// Find the score associated with the cards drawn
function getCardScore(cardData) {

    card1.value = cardValue.indexOf(cardData[0].value) 
    card2.value = cardValue.indexOf(cardData[1].value) 

    if (card1.value > card2.value) {
        computerScore++
        showMsg.textContent = "Computer Wins!!"
    } else if (card1.value < card2.value){
        myScore++
        showMsg.textContent = "You Win!!"
    } else {
        showMsg.textContent = "It's a tie!!"
    }

    // Shows the score in DOM after each draw
    computerScoreEl.textContent = computerScore
    myScoreEl.textContent = myScore
    /*
    cardData[0].value will give me the value of card 1 (computer's card), 
    let's say we get 5 
    Now, cardValue store all the possible values we can get in acsending order or their score
    So, we need to find the index at which the computer's card value is present
    i.e. we need to find the index value of "5"
    the index value of "5" is 3 i.e. the score is 3
    similarly, the score of second card (myScore) is calculated, suppose we get "KING"
    => myScore = 11
    myScore > computerScore 
    => I win this hand!
    */
}



async function handleClick() {
    newGame()
    const res = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/")
    const data = await res.json()
    drawCardBtn.disabled = false    
    deckId = data.deck_id
    remainingCards = data.remaining
    loadRemainingCards()
}

async function drawCards() {
    const res = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    const data = await res.json()
    setValues(data) 
    loadImage()
    getCardScore(data.cards)
    loadRemainingCards()
}

newDeckBtn.addEventListener("click", handleClick)
drawCardBtn.addEventListener("click", drawCards)