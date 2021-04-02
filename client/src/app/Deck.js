export class Deck {
  constructor(decklist) {
    this.deck = []

    for (let cards in decklist) {
      let card = decklist[cards]
      let count = card.quantity
      for (let i=0; i<count; i++) {
        card.info.location = "LIBRARY"
        this.deck.push(card.info);
      }
    }

    console.log("intialized deck", this.deck)

    this.shuffle()
  }

  shuffle(){
    const { deck } = this;
    let m = deck.length, i;

    while(m){
      i = Math.floor(Math.random() * m--);

      [deck[m], deck[i]] = [deck[i], deck[m]];
    }

    return this;
  }

  deal(){
    let out = []
    let next

    do{
      next = this.deck.pop()
      out.push(next)
    }while(next.name.toLowerCase().includes("token"))

    return out
  }
}