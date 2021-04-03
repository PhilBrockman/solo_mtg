import { card } from "mtgsdk";
import React from "react"
import useCardKeyTap from "./useKeyHook.js"

export const cardName = card => {
  return card.split(" ").splice(1).join(" ");
}

const cardCount = card => {
  return parseInt(card.split(" ")[0]);
}

function shuffle(deck){
  let m = deck.length, i;

  while(m){
    i = Math.floor(Math.random() * m--);

    [deck[m], deck[i]] = [deck[i], deck[m]];
  }

  return deck
}

const deepCopy = (inObject) => {
  return JSON.parse(JSON.stringify(inObject));
}

const initializeDeck = (initialDeck, allCards, loc) => {
  let deck = []
    const tmp = initialDeck.map(item => {
      return( 
          {
            quantity: cardCount(item),
            info: allCards.filter(
                    card => cardName(item) == card.name && 
                      (card.rulesText?.length > 0 || 
                        card.url?.length > 0))[0]
          }
        )
      }
    )
    for (let cards in tmp) {
      let card = tmp[cards]
      for (let i=0; i<card.quantity; i++) {
        card.info.location = loc
        card.info.card_id = deck.length
        deck.push({...card.info});
      }
    }
    return shuffle(deck)
}

const filterByLocation = (deck, loc) => {
  let res = deck.filter(card => card.location === loc) 
  return deepCopy(res)
}

const loxs = {
  LIBRARY: "l",
  GRAVEYARD: "g",
  EXILE: "e",
  BATTLEFIELD: "b",
}

const changeElementById = (card_id, newValue, deck) => {
  let newDeckState = deepCopy(deck).map(card => {
    if(card.card_id === card_id){
      return newValue
    }
    return card
  })

  return newDeckState
}

const Zones = (props) => {
  let zones = []
  for(const k of Object.keys(loxs)){
    let tmp = <div key={k} onClick={(e) => props.handleClick(e, loxs[k])}>
                {k} ({props.locate(loxs[k])?.length})
              </div>
    zones.push(tmp)
  }
  return zones
}

//click to tap/untap
//number keys for counters
// b/g/e/l to send to a different zone
const Interaction = props => {
  const [over, setOver] = React.useState(false);
  const pressedTap = useCardKeyTap(["t"], over, () => tappedT(props.card))
  const pressedZone = useCardKeyTap(Object.values(loxs), over, (loc) => setZone(props.card, loc))

  const updateCard = card => {
    props.changeCardById(card.card_id, card)
  }

  const tappedT = card => {
    card.tapped = !(card.tapped === true)
    updateCard(card)
  }

  const setZone = (card, loc) => {
    if(card.location !== loc){
      card.location = loc
      updateCard(card)
    }
  }

  let cardstyle={}

  if(over){
    cardstyle.backgroundColor="green";
    cardstyle.transform =`scale(1.3)` 
  } else{
    cardstyle.backgroundColor='';
  }

  cardstyle.transform = props.card.tapped ? `rotate(45deg)` 
                                          : `rotate(0deg)`

  return <div style={cardstyle}
            onMouseOver={()=>setOver(true)} 
            onMouseOut={()=>setOver(false)}
            >
            {props.children}
          </div>
}

const CardViewer = props => {
  let output = props.cards.map((item, index) => {
    let display;
    if(item.url?.length > 0){
      display=<img src={item.url} />
    } else {
      display = <>
                  <div className="name">{item.name}</div>
                  <div className="rules-text">{item.rulesText}</div>
                </>
    }
    return (
      <div className={"in-play"} key={index}>
        <Interaction card={item} changeCardById={props.changeCardById}>
          {display}
        </Interaction>
      </div>
    )
  })

  return <div className="battlefield">
          {output}
          </div>
}

const HordeDeck = props => {
  const drawCard = <button onClick={props.activateHordeDeck}>Activate Horde</button>

  const damages = [-1, -5, -10].map(damage => {
    return <button key={damage} onClick={() => props.burn(damage)}>{damage}</button>
  })
  return <>
    {drawCard}
    {damages}
  </>
}

const History = props => {
  console.log("history", props)
  let output = props.history.map((item,index) => {
    if(item){
      return (<div key={index} onClick={() => props.rollbackHordeDeckTo(item, index)}>
        {index} - {filterByLocation(item, loxs.LIBRARY).length}
      </div>);
    } else {
      return (
        <></>
      )
    }
  })
  return <div className="history">
            {output.reverse()}
          </div>
}

export const PlayGame = props => {
  const [gameover, setGameOver] = React.useState(null)
  const [history, setHistory] = React.useState([])
  const [hordeDeck, setHordeDeckDirectly] = React.useState(null)
  const [activeZone, setActiveZone] = React.useState(null)

  const setHordeDeck = (deck) => {
    setHordeDeckDirectly(deck)
    setHistory([...history, deck])
  }

  const rollbackHordeDeckTo = (deck, hIndex) => {
    setHordeDeck(deck)
    setHistory(history.slice(0, hIndex+1))
  }

  const handleZoneClick = (event, value) => {
    setActiveZone(value)
  }

  const activateHordeDeck = event => {
    //deep copy the current deck
    let currentDeck = filterByLocation(hordeDeck, loxs.LIBRARY)
    let out = []
    let next

    do { //pop cards until we find a non-token
      next = currentDeck.pop()
      out.push(next)
    } while(next.name.toLowerCase().includes("token"))

    let newDeckState = deepCopy(hordeDeck).map(card => {
      if(out.map(item => item.card_id).includes(card.card_id)){
        card.location = loxs.BATTLEFIELD
      }
      return card
    })

    setActiveZone(loxs.BATTLEFIELD)
    setHordeDeck(newDeckState)
  }

  const burn = cards => {
    let library = filterByLocation(hordeDeck, loxs.LIBRARY)
    if(cards > library.length){
      setGameOver("win");
      return;
    }
    let exiles = library.slice(0,Math.abs(cards)).map(card => card.card_id)
    let newState = deepCopy(hordeDeck).map(card => {
      if(exiles.includes(card.card_id)){
        console.log("exiling", card.name)
        card.location = loxs.EXILE
        return card
      } else {
        return card
      }
    })
    setHordeDeck(newState)
  }

  const changeCardById = (card_id, newValue) => {
    setHordeDeck(changeElementById(card_id, newValue, hordeDeck))
  }

  React.useEffect(() => {
    setHordeDeck(initializeDeck(props.initialDeck, props.allCards, loxs.LIBRARY))
  }, [])

  if(hordeDeck){
    return  <div className="game-area">
              <div className="zones-changes">
                <HordeDeck 
                  activateHordeDeck={activateHordeDeck}
                  burn={burn}
                />
                <Zones 
                  locate={(loc) => filterByLocation(hordeDeck, loc)} 
                  handleClick={handleZoneClick} 
                />
              </div>
              <div className="board-state">
                <History 
                  rollbackHordeDeckTo={rollbackHordeDeckTo}
                  history={history}
                />
                <CardViewer 
                  cards={filterByLocation(hordeDeck, activeZone)}
                  changeCardById={changeCardById}
                  />
              </div>
            </div>
  } else {
    return <>Loading Game</>
  }
}