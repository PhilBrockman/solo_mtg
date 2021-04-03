import React from "react"

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

export const PlayGame = props => {
  const [hordeDeck, setHordeDeck] = React.useState(null)

  const zone = loc => {
    if(hordeDeck){
      let res = hordeDeck.filter(card => card.location === loc)
      return deepCopy(res)
    }
  }

  const loxs = {
    LIBRARY: "l",
    GRAVEYARD: "g",
    EXILE: "e",
    BATTLEFIELD: "b",
  }

  React.useEffect(() => {
    let deck = []
    const tmp = props.initialDeck.map(item => {
      return( 
          {
            quantity: cardCount(item),
            info: props.allCards.filter(
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
        card.info.location = loxs.LIBRARY
        card.info.card_id = deck.length
        console.log(deck.length)
        deck.push({...card.info});
      }
    }
    setHordeDeck(shuffle(deck))// s.then(()=>console.log(deck))
  }, [])

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

  const [activeZone, setActiveZone] = React.useState(null)

  const handleZoneClick = (event, value) => {
    setActiveZone(value)
  }
  let zones = []

    for(const k of Object.keys(loxs)){
      let tmp = <div key={k} onClick={(e) => handleZoneClick(e, loxs[k])}>
                  {k} ({zone(loxs[k])?.length})
                </div>

      zones.push(tmp)
    }
    // zones = JSON.stringify(loxs)

  if(hordeDeck){
    return <>
            <div><button onClick={activateHordeDeck}>Activate Horde</button></div>
            <>{zones}</>
            <div><CardViewer cards={zone(activeZone)} /></div>
          </>
  } else {
    return <>Loading Game</>
  }
}


//click to tap/untap
//number keys for counters
// b/g/e/l to send to a different zone

const Interaction = props => {

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
        {display}
      </div>
    )
  })

  return <div className="battlefield">
          {output}
          </div>
}