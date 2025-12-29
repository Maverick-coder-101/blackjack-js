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
const checkBtn = document.getElementById("check-btn")

let hasSecondHand = false  // updated in split btn 
let splited = false // check for true black jack for payout
let activeHand = 0
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
 secondHandSum: 0,
 firstHandAlive: false,
 secondHandAlive: false,
 firstHandBlackJack: false,
 secondHandBlackJack: false,
 firstHandDone: false,
 secondHandDone: false,
 outcome1: "",
 outcome2: ""
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
        player.firstHandDone = false
        activeHand = 1

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
        player.outcome1 = "You have BlackJack"
        player.firstHandBlackJack = true
        player.firstHandAlive = false
        player.firstHandDone = true
        activeHand = 0
        
    } else if (player.sum > 21) {
        messageEl.textContent = "Bust"
        player.outcome1 = "Bust"
        player.firstHandBlackJack = false
        player.firstHandAlive = false
        player.firstHandDone = true
        activeHand = 0

    } else {
        messageEl.textContent = "Continue?"
        player.outcome1 = "Continue?"
        player.firstHandBlackJack = false
        player.firstHandAlive = true
        activeHand = 1
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
    //hit(player.firstHandAlive, player.firstHandBlackJack, player.secondHandAlive, player.secondHandBlackJack)

    if(activeHand === 1) {
        if (player.firstHandAlive === true && player.firstHandBlackJack === false) {
           
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
            updateFirstHandStatus()
        }
    } else if (activeHand === 2) {
        if (player.secondHandAlive === true && player.secondHandBlackJack === false) {
           
            player.secondHandSum = deal(player.secondHand, player.secondHandSum)
            secondHandEl.textContent = "Second hand: "
            deckEl.textContent = "Deck: "

            for (let i = 0; i < deck.length; i++) {
            deckEl.textContent += deck[i] + " "
            }
            for (let i = 0; i < player.secondHand.length; i++){
                secondHandEl.textContent += player.secondHand[i]
            }
            secondHandEl.textContent += " Sum: " + player.secondHandSum

            //Update for the dealer/ house
            updateSecondHandStatus()
        }
    }
})

// must take a sum & an outcome  Return the outcome
function updateFirstHandStatus() {
    if (player.sum === 21) {
        player.outcome1 = "You have BlackJack"
        player.firstHandAlive = false
        player.firstHandBlackJack = true
        player.firstHandDone = true

        if (hasSecondHand === true) {
            activeHand = 2
        } else {
            activeHand = 0
        }

        } else if (player.sum < 21) {
            player.outcome1 = "Continue?"
            player.firstHandAlive = true
            player.firstHandBlackJack = false
            activeHand = 1
        } else {
            player.outcome1 = "Bust"
            player.firstHandAlive = false
            player.firstHandBlackJack = false
            player.firstHandDone = true

            if (hasSecondHand === true) {
            activeHand = 2
            } else {
                activeHand = 0
            }
        }
}

function updateSecondHandStatus() {
    if (activeHand === 2) {
        if (player.secondHandSum === 21) {
        player.outcome2 = "You have BlackJack"
        player.secondHandAlive = false
        player.secondHandBlackJack = true
        player.secondHandDone = true
        hasSecondHand = false
        activeHand = 0

        } else if (player.secondHandSum < 21) {
            player.outcome2 = "Continue?"
            player.secondHandAlive = true
            player.secondHandBlackJack = false
            activeHand = 2
        } else {
            player.outcome2 = "Bust"
            player.secondHandAlive = false
            player.secondHandBlackJack = false
            player.secondHandDone = true
            hasSecondHand = false
            activeHand = 0
        }
    }
}

function updateSecondHandSpiltStatus() {
    if (player.secondHandSum === 21) {
        player.outcome2 = "You have BlackJack"
        player.secondHandAlive = false
        player.secondHandBlackJack = true
        player.secondHandDone = true

    } else if (player.secondHandSum < 21) {
        player.outcome2 = "Continue?"
        player.secondHandAlive = true
        player.secondHandBlackJack = false
    }
}

standBtn.addEventListener("click", function() {
     if (player.firstHandDone === false) {
        endTurn(player.firstHandAlive, player.firstHandBlackJack, player.sum, player.outcome1, player.firstHandDone)
    } else {
        endTurn(player.secondHandAlive, player.secondHandBlackJack, player.secondHandSum, player.outcome2, player.secondHandDone)
    }
})

function endTurn(isAlive, hasBlackJack, sum, outcome, handDone) {
    if ((isAlive === true && hasBlackJack === false) && sum < 21){
        if (sum > dealer.sum) {
            outcome = "You have BlackJack"
            handDone = true
        } else if (sum < dealer.sum) {
            outcome = "You lost this round😭"
            handDone = true
        } else {
            outcome = "Push(Tie)"
            handDone = true
        }
        //Update so a player can not hit after
        isAlive = false
        hasBlackJack = false
    }
}

doubleDownBtn.addEventListener("click", function() {
    if (player.firstHandDone === false) {
        doubleDown(player.firstHandAlive, player.firstHandBlackJack, player.deck)
    } else {
        doubleDown(player.secondHandAlive, player.secondHandBlackJack, player.secondHand)
    }
})

function doubleDown(isAlive, hasBlackJack, playerDeck) {
    //double the bet & take one more card & end turn

    // Receive isAlive, hasBlackJack, deck/hand sum 
    if ((isAlive === true && hasBlackJack === false) && (playerDeck.length === 2)) {
        if (player.firstHandDone === false) {
        
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

        updateStatus(player.sum, player.firstHandAlive, player.firstHandBlackJack, player.firstHandDone, player.outcome1)
        endTurn(player.firstHandAlive, player.firstHandBlackJack, player.sum, player.outcome1, player.firstHandDone)
    } else {

        if (player.secondHandSum >= 9 && player.secondHandSum <=11) {
            player.secondHandSum = deal(player.deck, player.secondHandSum)
        playerEl.textContent = "Player: "
         deckEl.textContent = "Deck: "

        for (let i = 0; i < deck.length; i++) {
        deckEl.textContent += deck[i] + " "
        }
        for (let i = 0; i < player.deck.length; i++){
            playerEl.textContent += player.deck[i]
        }
        playerEl.textContent += " Sum: " + player.secondHandSum

        updateStatus(player.secondHandSum, player.secondHandAlive, player.secondHandBlackJack, player.secondHandDone, player.outcome2)
        endTurn(player.secondHandAlive, player.secondHandBlackJack, player.secondHandSum, player.outcome2, player.secondHandDone)
    }
        //Update for the dealer/ house
        }
        
    }
}
}

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
            splited = true

            player.sum -= (player.sum/2)
            player.secondHandSum = player.sum

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

            activeHand = 1
            updateFirstHandStatus()
            updateSecondHandSpiltStatus()
        
            //update deck on display  to be removed
            deckEl.textContent = "Deck: " 
            for (let i = 0; i < deck.length; i++) {
                deckEl.textContent += deck[i] + " "
            }
        }
    }
})

checkBtn.addEventListener("click", function() {
    console.clear()
    console.log("has second hand: " + hasSecondHand)
    console.log("player sum: " + player.sum)
    console.log("Player second sum: " + player.secondHandSum)
    console.log("player first hand alive: " + player.firstHandAlive)
    console.log("player second hand alive: " + player.secondHandAlive)
    console.log("player first hand black jack: " + player.firstHandBlackJack)
    console.log("player second hand black jack: " + player.secondHandBlackJack)
    console.log("player first hand done: " + player.firstHandDone)
    console.log("player second hand done: " + player.secondHandDone)
    console.log("player outcome 1: " + player.outcome1)
    console.log("player outcome 2: " + player.outcome2)
    console.log("dealer sum: " + dealer.sum)
    console.log("dealer deck: " + dealer.deck)
    console.log("player first deck: " + player.deck)
    console.log("player second deck: " + player.secondHand)
    console.log("Active hand: " + activeHand)
    // console.log()
})