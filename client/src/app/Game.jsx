import React from 'react'
import api, {useAPI, getMTGCardByName} from "../api"
import {useForm, PlayingCardShard, initialForm} from "../pages/_form.js"
import {PlayingCardsUpdate} from "../pages"
import {DisplayCard} from "../components"

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

const FetchMTGData = props => {
  const [gatherer, setGatherer] = React.useState(null)
  const [initialValues, setInitialValues] = React.useState({
    name: props.name, rulesText: '', url: ''
  })

  React.useEffect(() => {
    getMTGCardByName(props.name).then((res, err )=> {
      if(err){
        console.error(err)
      }

      res = res.filter(card => card.hasOwnProperty("imageUrl"))

      if(res.length === 0){
        console.log("no cards found with name", props.name)
        setGatherer(true)
      } else {
        console.log("res", res)
        setGatherer(res[0])
      }
  })}, [props.name])

  if(gatherer){
    console.log('gatherer', gatherer)
    let tmp = {}
        tmp.name = props.name;
        tmp.rulesText = gatherer.text;
        tmp.url = gatherer.imageUrl;
    console.log("calling with ", {...tmp})
    return <PlayingCardsInsert
              initialValues={tmp}/>
  } else {
    console.log("gathering magicks")
    return <>gathering... {props.name}</>
  }
}

const PlayingCardsInsert = props => {
  const handleCreatePlayingCard = async (payload) => {
    await api.insertPlayingCard(payload).then(res => {
      return;
    })
  }

  const {state, submitHandler, changeHandler} = useForm(props.initialValues, values => handleCreatePlayingCard(values));

  console.log("gatherer")
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
    let candidates = props.allCards.filter(allCards => allCards.name === card)

    if(candidates.length > 0){
      let lastEl = candidates[candidates.length-1]
      return (<>
                <DisplayCard original={lastEl}/>
                <PlayingCardsUpdate
                  key={card}
                  directId={ lastEl._id}
                />
              </>)
    } else {
      return <FetchMTGData key={card} name={card}/>
    }
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
    let allCards = cards 
    let totalCards = deck.split("\n").map(card => parseInt(card.split(" ")[0])).reduce((a, b) => a + b)
    let validStoredCards = cards.filter(card => card.url?.length > 0 || card.rulesText?.length > 0)

    let requestedCards = deck.split("\n").map(card => card.split(" ").splice(1).join(" "))
    let found = requestedCards.filter(card => validStoredCards.map(card => card.name).includes(card))

    let notFound = requestedCards.filter(card => !validStoredCards.map(card => card.name).includes(card))
    
    return  <>
              <textarea value={deck} onChange={handleChange}/>
              <div>Deck Size: {totalCards}</div>
              <div>Loaded: {found.length}</div>
              <div><button>Load All</button></div>
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
2 Infectious Horror`

/*
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
5 Zombie Giant Tokens`*/