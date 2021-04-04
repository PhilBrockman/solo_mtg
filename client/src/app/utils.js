export const loxs = {
  LIBRARY: "l",
  GRAVEYARD: "g",
  EXILE: "e",
  BATTLEFIELD: "b",
}

export const cardName = card => {
  return card.split(" ").splice(1).join(" ");
}

export const cardCount = card => {
  return parseInt(card.split(" ")[0]);
}

export function shuffle(deck){
  let m = deck.length, i;

  while(m){
    i = Math.floor(Math.random() * m--);

    [deck[m], deck[i]] = [deck[i], deck[m]];
  }

  return deck
}

export const deepCopy = (inObject) => {
  return JSON.parse(JSON.stringify(inObject));
}

export const initializeDeck = (initialDeck, allCards, loc) => {
  let deck = []
    const tmp = initialDeck.map(item => {
      return( 
          {
            quantity: cardCount(item),
            info: allCards.filter(
                    card => cardName(item) === card.name && 
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

export const filterByLocation = (deck, loc) => {
  let res = deck.filter(card => card.location === loc) 
  return deepCopy(res)
}

export const changeElementById = (card_id, newValue, deck) => {
  let newDeckState = deepCopy(deck).map(card => {
    if(card.card_id === card_id){
      return newValue
    }
    return card
  })

  return newDeckState
}

export const Zones = (props) => {
  let zones = []
  for(const k of Object.keys(loxs)){
    let tmp = <div key={k} onClick={(e) => props.handleClick(e, loxs[k])}>
                {k} ({props.locate(loxs[k])?.length})
              </div>
    zones.push(tmp)
  }
  return zones
}