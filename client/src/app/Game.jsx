import { json } from 'body-parser'
import React from 'react'
import api, {useAPI} from "../api"
import {useForm, PlayingCardShard} from "../pages/_form.js"

class Deck {
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

const PlayingCardsInsert = props => {
  console.log("props", props)

  const handleCreatePlayingCard = async (payload) => {
    await api.insertPlayingCard(payload).then(res => {
      window.location.reload()
    })
  }

  let startingValues
  let candidates = props.allCards.filter(card=> card.name === props.card)
  console.log(props.card)
  if(candidates.length > 0){
    console.log('candidates', candidates)
    startingValues={name:props.card, rulesText:candidates[0].rulesText, img: candidates[0].img}
  } else {
    console.log(" nothing found")
    startingValues = {name:props.card, rulesText:'', img: ''}
  }

  const {state, submitHandler, changeHandler} = useForm(startingValues, values => handleCreatePlayingCard(values));

  return (
    <PlayingCardShard
      state={state}
      submitHandler={submitHandler}
      changeHandler={changeHandler}
      />
  ); 
  
}

const CardsNotFound = props => {
  let modified = props.notFound.map(card => {
    return <PlayingCardsInsert
      key = {card}
      card = {card}
      allCards={props.allCards}
     />
  })

  return modified
}

export const Game = (props) => {
  let [cards, loading] = useAPI(api.getAllPlayingCards)
  let [deck, setDeck] = React.useState(starting_deck)

  const handleChange = event => {
    setDeck(event.target.value)
  }

  if(loading === false){
    let storedCards = cards.filter(card => card.url?.length > 0 || card.rulesText?.length > 0)
    let uniqueCards = deck.split("\n").map(card => card.split(" ").splice(1).join(" "))
    let found = uniqueCards.filter(card => storedCards.map(card => card.name).includes(card))
    let notFound = uniqueCards.filter(card => !storedCards.map(card => card.name).includes(card))

    let totalCards = deck.split("\n").map(card => parseInt(card.split(" ")[0])).reduce((a, b) => a + b)
    return  <>
              <textarea value={deck} onChange={handleChange}/>
              <>Deck Size: {totalCards}</>
              <>Loaded: {found.length}</>
              <>Not Found: {<CardsNotFound allCards={cards} notFound={notFound} />}</>
            </>
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

const starting_deck = `1 Yixlid Jailer
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
5 Zombie Giant Tokens`