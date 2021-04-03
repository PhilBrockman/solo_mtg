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


export const PlayGame = props => {
  const [hordeDeck, setHordeDeck] = React.useState(null)
  const [activeZone, setActiveZone] = React.useState(null)

  const handleZoneClick = (event, value) => {
    setActiveZone(value)
  }

  const zone = loc => {
    if(hordeDeck){
      return filterByLocation(hordeDeck, loc)
    }
  }

  const changeElementById = (card_id, newValue) => {
    let newDeckState = deepCopy(hordeDeck).map(card => {
      if(card.card_id === card_id){
        return newValue
      }
      return card
    })
  
    setHordeDeck(newDeckState)
  }

  const activateHordeDeck = event => {
    let currentDeck = zone(loxs.LIBRARY)
    let out = []
    let next

    do {
      next = currentDeck.pop()
      console.log("next", next)
      out.push(next)
    } while(next.name.toLowerCase().includes("token"))

    let newDeckState = deepCopy(hordeDeck).map(card => {
      if(out.map(item => item.card_id).includes(card.card_id)){
        console.log("moving to battlefiled")
        card.location = loxs.BATTLEFIELD
      }
      return card
    })

    setHordeDeck(newDeckState)
  }

  React.useEffect(() => {
    setHordeDeck(initializeDeck(props.initialDeck, props.allCards, loxs.LIBRARY))
  }, [])

  if(hordeDeck){
    return <>
            <div><button onClick={activateHordeDeck}>Activate Horde</button></div>
            <Zones locate={zone} handleClick={handleZoneClick} />
            <div><h2>{activeZone}</h2><CardViewer cards={zone(activeZone)} /></div>
          </>
  } else {
    return <>Loading Game</>
  }
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
  let [over, setOver] = React.useState(false);
  let cardstyle={}

  if(over){
    cardstyle.backgroundColor="green";
    cardstyle.transform =`scale(1.3)` 
  } else{
    cardstyle.backgroundColor='';
  }

  let [tapped, setTapped]= React.useState(false)

  const tappedT = card => {
    if(card.tapped === null || card.tapped === false){
      card.tapped = true
    } else {
      card.tapped = false
    }
    // setHordeCard(card.card_id, )
  }

  const pressedT = useCardKeyTap("t", over, () => tappedT(props.card))



  // if(over){
  //   if(pressedG){
  //     console.log("pressed", props.card.card_id)
  //   }

  //   if(pressedT){
  //     console.log("tapping", props.card.name)
  //     if(tapped){
  //       cardstyle.transform =`rotate(45deg)`
  //     } else{
  //       cardstyle.transform =`rotate(-15deg)`
  //     }
  //   }
  // }


  return <div style={cardstyle}
            onMouseOver={()=>setOver(true)} 
            onMouseOut={()=>setOver(false)}
            >
            {props.children}
          </div>
}

const CardViewer = props => {
  console.log("cardvieer's props", props)
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
        <Interaction card={item}>
          {display}
        </Interaction>
      </div>
    )
  })

  return <div className="battlefield">
          {output}
          </div>
}