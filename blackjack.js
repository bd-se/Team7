// Blackjack Logic Module

class Blackjack {
    constructor() {
        this.deck = this.createDeck();
        this.shuffleDeck();
    }

    createDeck() {
        const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
        const values = [
            'Ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King'
        ];
        const deck = [];
        for (const suit of suits) {
            for (const value of values) {
                deck.push({ suit, value });
            }
        }
        return deck;
    }

    shuffleDeck() {
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    }

    dealCard() {
        return this.deck.pop();
    }

    calculateScore(hand) {
        let score = 0;
        let aceCount = 0;
        for (const card of hand) {
            if (card.value === 'Ace') {
                aceCount += 1;
                score += 11;
            } else if (['Jack', 'Queen', 'King'].includes(card.value)) {
                score += 10;
            } else {
                score += parseInt(card.value);
            }
        }
        while (score > 21 && aceCount > 0) {
            score -= 10;
            aceCount -= 1;
        }
        return score;
    }

    isBust(hand) {
        return this.calculateScore(hand) > 21;
    }

    isBlackjack(hand) {
        return hand.length === 2 && this.calculateScore(hand) === 21;
    }
}

module.exports = Blackjack;