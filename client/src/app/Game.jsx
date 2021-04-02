import React from 'react'
import api, {useAPI} from "../api"

let decklist = `1 Yixlid Jailer
2 Vengeful Dead
4 Cackling Fiend
2 Infectious Horror
2 Severed Legion
1 Abattoir Ghoul
2 Nested Ghoul
1 Fleshbag Marauder
1 Gluttonous Zombie
1 Death Baron
1 Brain Gorgers
1 Soulless One
1 Unbreathing Horde
1 Waning Wurm
1 Hollow Dogs
1 Undead Warchief
1 Damnation
1 Festering March
1 Smallpox
1 Syphon Mind
1 Army of the Damned
1 Twilight's Call
2 Delirium Skeins
2 Bad Moon
3 Grave Peril
2 Endless Ranks of the Dead
1 Forsaken Wastes
1 Call to the Grave
55 Zombie Tokens
5 Zombie Giant Tokens`.split("\n")

class Deck {
  constructor() {
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

const deck1 = new Deck();
console.log('deck1', deck1)
deck1.shuffle();
console.log(deck1.deal());
console.log(deck1.deal());

export const Game = (props) => {
  let [cards, loading] = useAPI(api.getAllPlayingCards)

  if(loading === false){
    console.log('cards', cards)
    return cards.map((item, index) =>{
      return( 
          <CardViewer
            name={item.name}
            rulesText={item.rulesText}
            key={index}
          />
        );
    })
  } else {
    return (
      <>
        Loading...
      </>
    )
  }
}

const CardViewer = props => {
  return (
    <div>
      <>{props.name}</>
      <>{props.rulesText}</>
    </div>
  )
}