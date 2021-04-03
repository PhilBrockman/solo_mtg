import React from 'react'
import { card } from "mtgsdk";
import useCardKeyTap from "./useKeyHook.js"
import {loxs} from "./utils.js"
import * as Utils from "./utils.js"

//click to tap/untap
//number keys for counters
// b/g/e/l to send to a different zone
export const Interaction = props => {
  const [over, setOver] = React.useState(false);
  const pressedTap = useCardKeyTap(["t"], over, () => tappedT(props.card))
  const pressedZone = useCardKeyTap(Object.values(loxs), over, (loc) => setZone(props.card, loc, props.deck))

  const updateCard = card => {
    props.changeCardById(card.card_id, card)
  }

  const tappedT = card => {
    card.tapped = !(card.tapped === true)
    updateCard(card)
  }

  const setZone = (card, loc, deck) => {
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

export const ScratchArea = props => {
  const [editing, setEditing] = React.useState(false)
  const [headerText, setHeaderText] = React.useState(props.card?.header || "")
  useCardKeyTap(["Enter"], editing, ()=>saveChanges())

  const saveChanges = () => {
    setEditing(false)
    let tmp = {...props.card}
    tmp.header = headerText
    props.changeCardById(props.card.card_id, tmp)
  }

  if(editing ){
    return <input onChange={(e) => setHeaderText(e.target.value)} value={headerText}></input>
  } else {
    return <div onClick={()=>setEditing(true)}>{headerText || "click"}</div>
  }
  
}

export const CardViewer = props => {
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
        <Interaction card={item} changeCardById={props.changeCardById} deck={props.deck}>
          {item.priority}
          <ScratchArea card={item} changeCardById={props.changeCardById} />
          {display}
        </Interaction>
      </div>
    )
  })

  return <div className="battlefield">
          {output}
          </div>
}

export const HordeDeck = props => {
  const drawCard = <button onClick={props.activateHordeDeck}>Activate Horde</button>

  const damages = [-1, -5, -10].map(damage => {
    return <button key={damage} onClick={() => props.burn(damage)}>{damage}</button>
  })

  const shuffleButton = "shuffle"

  return <div className="horde-controls">
    {drawCard}
    <div>{damages} {shuffleButton}</div>
  </div>
}

export const History = props => {
  console.log("history", props)
  let output = []
  if(props.history){
    output = props.history.map((item,index) => {
      let deck = item.deck
      if(deck){
        return (<div key={index} onClick={() => props.rollbackHordeDeckTo(item, index)}>
          {Utils.filterByLocation(deck, loxs.LIBRARY).length} |  {item.playerLife}
        </div>);
      } else {
        return (
          <></>
        )
      }
    })
  }
  return <div className="history">
            {output.reverse()}
          </div>
}

export const PlayerControls = props => {
  return <input 
          value={props.playerLife} 
          onChange={(e) => props.setPlayerLife(e.target.value)}/>
}