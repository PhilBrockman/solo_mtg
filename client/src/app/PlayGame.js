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

export const PlayGame = props => {
  const [hordeDeck, setHordeDeck] = React.useState(null)

  const locations = {
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
      let count = card.quantity
      for (let i=0; i<count; i++) {
        card.info.location = locations.LIBRARY
        card.info.card_id = deck.length
        console.log(deck.length)
        deck.push({...card.info});
      }
    }
    setHordeDeck(shuffle(deck))// s.then(()=>console.log(deck))
  }, [])

  React.useEffect(() => {
    if(hordeDeck){
      console.log("changes to deck:", hordeDeck.filter(card => card.location != locations.BATTLEFIELD))
    }  
  }, [hordeDeck])


  const deepCopy = (inObject) => {
    return JSON.parse(JSON.stringify(inObject));
  }
  const library = () => {
    let res = hordeDeck.filter(item => item.location === locations.LIBRARY)
    return deepCopy(res)
  }
  const battlefield = () => {
    let res = hordeDeck.filter(card => card.location === locations.BATTLEFIELD)
    return deepCopy(res)
  }
  
  const dealHordeDeck = event => {
    let currentDeck = deepCopy(library())
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
        card.location = locations.BATTLEFIELD
      }
      return card
    })

    console.log("out", out.length)
    console.log("battlefiled", battlefield().length)
    console.log('library()', library().length)
    console.log('battlefield()', battlefield().length)
    console.log("overall deck length", hordeDeck.length)
    console.log("new deck length", newDeckState.length)
    
    setHordeDeck(newDeckState)
  }

  if(hordeDeck){
    return <>
            <>{library().length} cards</>
            <button onClick={dealHordeDeck}>Horde Action</button>
            <CardViewer cards={battlefield()} />
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