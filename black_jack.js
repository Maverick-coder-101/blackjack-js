const suits = ["♦", "♥", "♠", "♣"]
const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"]
const messageEl = document.getElementById("message-el")
const deckEl = document.getElementById("deck-el")
const cardsEl = document.getElementById("cards-el")
const playerEl = document.getElementById("player-el")
const dealerEl = document.getElementById("dealer-el")
const hitBtn = document.getElementById("hit-btn")
const standBtn = document.getElementById("stand-btn")
const doubleDownBtn = document.getElementById("double-down-btn")
const splitBtn = document.getElementById("split-btn")
const secondHandEl = document.getElementById("second-hand-el")
let hasBlackJack = false
let isAlive = false

let firstHandDone = false  // true for second hand to start 
let secondHandDone = false
let hasSecondHand = false  // updated in split btn 
let splited = false // check for true black jack for payout
//let acesSplited = false // after aces being plit no true

let deck = []
let theSum = 0

let player = {
 name:localStorage.getItem("username"),
 chips: localStorage.getItem("credits"),
 mode: localStorage.getItem("gameMode"),
 deck: [],
 sum: 0,
 secondHand: [],
 secondHandSum: 0
}

let dealer = {
    deck: [],
    sum: 0
}
    
function makeDeck() {
    deck = []
    for (let i = 0; i < ranks.length; i++) {
    for (let j = 0; j < suits.length; j++) {
        deck.push(ranks[i] + " of " + suits[j] + ", ")
    }
}
}

const playerInfoEl = document.getElementById("player-info-el")
playerInfoEl.textContent = player.name + ": $" + player.chips

function startGame() {
    if (hasSecondHand === false) {
        begin()

        for (let i = 0; i < deck.length; i++) {
            deckEl.textContent += deck[i] + " "
        }
    }
}

function begin() {
    makeDeck()
    shuffle()
    secondHandEl.textContent = ""
    messageEl.textContent = " Want to play a round?"
    deckEl.textContent = "Deck: "
    playerEl.textContent = "Player: "
    dealerEl.textContent = "Dealer: "
    player.sum = 0
    dealer.sum = 0
    player.deck = []
    dealer.deck = []
    player.sum = deal(player.deck, player.sum)
    player.sum = deal(player.deck, player.sum)
    dealer.sum = deal(dealer.deck, dealer.sum)
    dealer.sum = deal(dealer.deck, dealer.sum)

    if (player.sum === 21) {
        messageEl.textContent = "You have BlackJack"
        hasBlackJack = true
        isAlive = false
        firstHandDone = true
        
    } else if (player.sum > 21) {
        messageEl.textContent = "Bust"
        hasBlackJack = false
        isAlive = false
    } else {
        messageEl.textContent = "Continue?"
        hasBlackJack = false
        isAlive = true
     }
    playerEl.textContent += player.deck[0] + player.deck[1] + " Sum: " + player.sum
    dealerEl.textContent += dealer.deck[0] + dealer.deck[1] + " Sum: " + dealer.sum
}

function shuffle() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function deal(someDeck, sum) {
    let card = deck[0]
    deck.shift()
    someDeck.push(card)

    let numberCard = card.charAt(0)

    if (player.mode === "soft") {
        if (numberCard === "J" || numberCard === "Q" || numberCard === "K") {
            sum += 10
        } else if (numberCard === "A") {
            sum += 11
        }else {
            if (card.charAt(1) != " ") { 
                sum += parseInt(card.substring(0,2))
            } else {
                sum += parseInt(numberCard)
            }
            
        }

    } else {
        if (numberCard === "J" || numberCard === "Q" || numberCard === "K") {
            sum += 10
        } else if (numberCard === "A") {
            sum += 1
        }else {
            if (card.charAt(1) != " ") { 
                sum += parseInt(card.substring(0,2))
            }else {
                sum += parseInt(numberCard)
            }
        }
    }
    return sum
}

hitBtn.addEventListener("click", function() {
    if ((isAlive === true && hasBlackJack === false)) {
           
        player.sum = deal(player.deck, player.sum)
        playerEl.textContent = "Player: "
         deckEl.textContent = "Deck: "

        for (let i = 0; i < deck.length; i++) {
        deckEl.textContent += deck[i] + " "
        }
        for (let i = 0; i < player.deck.length; i++){
            playerEl.textContent += player.deck[i]
        }
        playerEl.textContent += " Sum: " + player.sum

        //Update for the dealer/ house
        updateStatus()
    }
})

function updateStatus() {
    if (player.sum === 21) {
        messageEl.textContent = "You have BlackJack"
        isAlive = false
        hasBlackJack = true
    } else if (player.sum < 21) {
        messageEl.textContent = "Continue?"
        isAlive = true
        hasBlackJack = false
    } else {
        messageEl.textContent = "Bust"
        isAlive = false
        hasBlackJack = false
    }
}

standBtn.addEventListener("click", function() {
    endTurn()
})

function endTurn() {
    if ((isAlive === true && hasBlackJack === false) && player.sum < 21){
        if (player.sum > dealer.sum) {
            messageEl.textContent = "You have BlackJack"
        } else if (player.sum < dealer.sum) {
            messageEl.textContent = "You lost this round😭"
        } else {
            messageEl.textContent = "Push(Tie)"
        }
        //Update so a player can not hit after
        isAlive = false
        hasBlackJack = false
    }
}

doubleDownBtn.addEventListener("click", function() {
    //double the bet & take one more card & end turn

    if ((isAlive === true && hasBlackJack === false) && (player.deck.length === 2)) {
        if (player.sum >= 9 && player.sum <=11) {
            player.sum = deal(player.deck, player.sum)
        playerEl.textContent = "Player: "
         deckEl.textContent = "Deck: "

        for (let i = 0; i < deck.length; i++) {
        deckEl.textContent += deck[i] + " "
        }
        for (let i = 0; i < player.deck.length; i++){
            playerEl.textContent += player.deck[i]
        }
        playerEl.textContent += " Sum: " + player.sum

        //Update for the dealer/ house
        updateStatus()
        endTurn()
        }
        
    }    
})

splitBtn.addEventListener("click", function() {
    //find a way to clear the second hand deck
    let tempCard1 = ""
    let tempCard2 = ""
    
    if ((hasSecondHand === false && player.deck.length === 2)) {
        
         tempCard1 = player.deck[0].substring(0,2)
         tempCard2 = player.deck[1].substring(0,2)

        if (tempCard1 === "K " || tempCard1 === "Q " || tempCard1 === "J ") {
            tempCard1 = "10"
        }
        if (tempCard2 === "K " || tempCard2 === "Q " || tempCard2 === "J ") {
            tempCard2 = "10"
        }

        if (tempCard1 === tempCard2) {
            player.secondHand.push(player.deck[1])
            player.deck.pop()
            hasSecondHand = true

            player.sum -= (player.sum/2)
            player.secondHandSum = player.sum
            //secondHandEl.textContent = "Second hand: " + player.secondHand + " Sum: " + player.secondHandSum

            playerEl.textContent = "Player: " + player.deck + " Sum: " + player.sum

            //Add second card to the 1st hand
            player.sum = deal(player.deck, player.sum)

            playerEl.textContent = "Player: " + player.deck[0] + player.deck[1] +
            " Sum: " + player.sum

            //Add second card to the second hand
            player.secondHandSum = deal(player.secondHand, player.secondHandSum)

            // to be removed
            secondHandEl.textContent = "Second hand: " + player.secondHand[0] + 
            player.secondHand[1] + " Sum: " + player.secondHandSum

            //update deck on display  to be removed
            deckEl.textContent = "Deck: " 
            for (let i = 0; i < deck.length; i++) {
                deckEl.textContent += deck[i] + " "
            }
        }
    }
})