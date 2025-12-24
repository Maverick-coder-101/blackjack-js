# black jack

# Handling Interactions and Logic

# Start game: 
- Shuffle, deal, show UI. ✅
- Check for Blackjack immediately. ✅
# On hit: 
- Add card, recalculate, check bust. ✅
# End round: 
- Compare values, update chips, reset hands. 
# Edge cases: 
- Handle splits (multiple player hands), doubles (limit to one hit).
# Randomness: 
- Use Math.random() for shuffle—seeded if needed for testing.
# Sound effects:
- Add <audio> tags for card flips if desired.

  # Index
- toggle dark/light/system
- get username and credits in dollars ✅
- button to verify and proceed to the blackjack game ✅

- game modes
- soft ✅
- hard ✅

# game info
- A standard deck has 52 cards, divided into 4 suits (hearts, diamonds, clubs, spades)  ✅
- Ace through 10, Jack, Queen, King ✅
- players vs. the dealer
- double down? ✅
- split?
- insurance?

# Card Values:
- Number cards (2-10): Face value (e.g., 5 of hearts = 5). ✅
- Face cards (Jack, Queen, King): 10. ✅
- Ace: on soft = 11 and hard = 1 ✅

# Players: 
- 1-7 players vs. the dealer (in your game, you can simulate 1 player for starters). The dealer represents the house. ✅
# Objective: 
- Get a hand total ≤ 21 that's higher than the dealer's, or let the dealer bust (go over 21). A "Blackjack" is an Ace + 10-value card on the initial deal, paying 3:2 (or 1.5x bet).

# Dealing:
- Each player gets 2 cards face-up. ✅
- Dealer gets 2 cards: one face-up (upcard), one face-down (hole card).

    # option/buttons
# Hit: ✅
- Take another card (can hit multiple times until satisfied or bust). ✅
# Stand: ✅
- Keep current hand, end turn. ✅
# Double Down:  ✅
- Double the bet and take exactly one more card (usually allowed only on initial 2-card hands of 9-11). ✅
    # Split: 
    If initial cards are a pair (e.g., two 8s), split into two hands, place another bet, and play each separately. Aces can usually be split once, and you get one card per Ace.
    # Surrender: 
    Forfeit half the bet and end the hand (optional rule, not always included).
    If a player busts (>21), they lose immediately.

# Dealer's Turn: 
- After all players, dealer reveals hole card and must follow fixed rules:
- Hit on 16 or less.
- Stand on 17 or more (some variations: stand on all 17s, or hit on soft 17).
- Dealer doesn't make choices—it's automated.

    # Resolution:
    # Player wins if: 
    Hand > dealer's (1:1 payout) or dealer busts (1:1) or natural Blackjack (3:2). 
    # Push (tie): 
    Same total, bet returned.
    # Loss: 
    Hand < dealer's or player busts.

# Key Terms and Concepts
Bust:  ✅
- Hand over 21—automatic loss. ✅
Soft vs. Hard Hand: ✅
- Soft includes an Ace counted as 11 (e.g., Ace-6 = 17 soft, can hit without bust risk initially). Hard: No Ace or Ace as 1✅
Insurance: 
- If dealer's upcard is Ace, players can bet half their original bet that dealer has Blackjack. Pays 2:1 if true, but it's generally a bad bet (house edge ~7%).
Even Money: 
- If player has Blackjack and dealer shows Ace, option to take 1:1 payout instead of risking push.
House Edge: 
- With basic strategy, ~0.5% in favor of the house. Without, higher.

# For code/algorithm

# Shuffle (Fisher-Yates algorithm)
function shuffle() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}
# example
let game = {
  playerHand: [],
  dealerHand: [],
  playerBet: 0,
  playerChips: 1000,
  isGameOver: false
};

# Advanced Features

# Multiplayer: 
Use WebSockets (e.g., via Socket.io) for real-time.
# AI Opponents: 
Simulate other players with basic strategy.
# Stats: 
Track win rate, sessions.
# Mobile Responsiveness: 
Use media queries in CSS.
# Saving State: 
LocalStorage for chips across sessions.
# Testing: 
Console.log states; unit test functions like calculateHandValue.
# Performance: 
For large decks, optimize shuffles (but 52 cards is fine).

# black_jack old code js
let cards = []
let hasBlackjack = false
let isAlive = false
let message = ""
let sum = 0
let messageEl = document.getElementById("message-el")
let sumEl = document.getElementById("sum-el")
let cardsEl = document.getElementById("cards-el")
let chips = 100

let player = {
 name:localStorage.getItem("username")
}

let playerEl = document.getElementById("player-el")
playerEl.textContent = player.name + ": $" + chips
 
function getRandomCard() {
    let cardNumber = Math.floor(Math.random() * 13) + 1

    if (cardNumber >= 11){
        cardNumber = 10
    } else if(cardNumber === 1) {
        cardNumber = 11
    }
    return cardNumber
}

function startGame() {
    isAlive = true

    let firstCard = getRandomCard()
    let secondCard = getRandomCard()

    cards = [firstCard, secondCard]
    sum = firstCard + secondCard
    renderGame()
}

function renderGame() {
    cardsEl.textContent = "Cards: "
    for(let i = 0; i < cards.length; i++) {
        cardsEl.textContent += cards[i] + " "
    }

    sumEl.textContent = "Sum: " + sum
    if (sum <= 20) {
        message = "Do you want to draw a new card"
    } else if (sum === 21) {
        message = "You've got black jack"
        hasBlackjack = true
    } else {
        message = "You're out of the game"
        isAlive = false
    }
    
    messageEl.textContent = message
}

function newCard() {
    if(isAlive === true && hasBlackjack === false) {
        
    let card = getRandomCard()
    cards.push(card)
    sum += cards[2]
    renderGame()
    }
}