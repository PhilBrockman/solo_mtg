export class Deck {
  constructor(decklist) {
    this.deck = []

    for (let cards in decklist) {
      let card = decklist[cards]
      let count = parseInt(card.split(" ")[0])
      let cardName = card.split(" ").splice(1).join(" ")
      console.log("we found", count, cardName)
      for (let i=0; i<count; i++) {
        this.deck.push(`${cardName}`);
      }
    }
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
    }while(next.toLowerCase().includes("token"))

    return out
  }
}