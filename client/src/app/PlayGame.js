import { card } from "mtgsdk";
import React from "react"
import useCardKeyTap from "./useKeyHook.js"
import * as Utils from "./utils.js"
import {loxs} from "./utils.js"

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

const ScratchArea = props => {
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

const HordeDeck = props => {
  const drawCard = <button onClick={props.activateHordeDeck}>Activate Horde</button>

  const damages = [-1, -5, -10].map(damage => {
    return <button key={damage} onClick={() => props.burn(damage)}>{damage}</button>
  })

  const shuffleButton = "shuffle"

  return <div class="horde-controls">
    {drawCard}
    <div>{damages} {shuffleButton}</div>
  </div>
}

const History = props => {
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

const PlayerControls = props => {
  return <input 
          value={props.playerLife} 
          onChange={(e) => props.setPlayerLife(e.target.value)}/>
}

export const PlayGame = props => {
  const [gameover, setGameOver] = React.useState(null)
  const [history, setHistory] = React.useState([])
  const [hordeDeck, setHordeDeckDirectly] = React.useState(null)
  const [activeZone, setActiveZone] = React.useState(null)
  const [playerLife, setPlayerLife] = React.useState(30)

  const setHordeDeck = (deck) => {
    setHordeDeckDirectly(deck)
    let tmp = {
      deck: deck,
      playerLife: playerLife
    }
    setHistory([...history, tmp])
  }

  const rollbackHordeDeckTo = (moment, hIndex) => {
    setHordeDeck(moment.deck)
    setPlayerLife(moment.playerLife)
    setHistory(history.slice(0, hIndex+1))
  }

  const handleZoneClick = (event, value) => {
    setActiveZone(value)
  }

  const activateHordeDeck = event => {
    //deep copy the current deck
    let currentDeck = Utils.filterByLocation(hordeDeck, loxs.LIBRARY)
    let out = []
    let next

    do { //pop cards until we find a non-token
      next = currentDeck.pop()
      out.push(next)
    } while(next.name.toLowerCase().includes("token"))

    let newDeckState = Utils.deepCopy(hordeDeck).map(card => {
      if(out.map(item => item.card_id).includes(card.card_id)){
        card.location = loxs.BATTLEFIELD
      }
      return card
    })

    setActiveZone(loxs.BATTLEFIELD)
    setHordeDeck(newDeckState)
  }

  const burn = cards => {
    let library = Utils.filterByLocation(hordeDeck, loxs.LIBRARY)
    if(cards > library.length){
      setGameOver("win");
      return;
    }
    let exiles = library.slice(0,Math.abs(cards)).map(card => card.card_id)
    let newState = Utils.deepCopy(hordeDeck).map(card => {
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
    setHordeDeck(Utils.changeElementById(card_id, newValue, hordeDeck))
  }

  React.useEffect(() => {
    setHordeDeck(Utils.initializeDeck(props.initialDeck, props.allCards, loxs.LIBRARY))
  }, [])

  if(hordeDeck){
    if(!gameover){
      return  <div className="game-area">
                <div className="zones-changes">
                  <div className="controls">
                    <HordeDeck 
                      activateHordeDeck={activateHordeDeck}
                      burn={burn}
                    />
                    <PlayerControls
                      playerLife={playerLife}
                      setPlayerLife={setPlayerLife}
                    />
                  </div>
                  <Utils.Zones 
                    locate={(loc) => Utils.filterByLocation(hordeDeck, loc)} 
                    handleClick={handleZoneClick} 
                  />
                </div>
                <div className="board-state">
                  <History 
                      rollbackHordeDeckTo={rollbackHordeDeckTo}
                      history={history}
                    />
                  <CardViewer 
                    cards={Utils.filterByLocation(hordeDeck, activeZone)}
                    changeCardById={changeCardById}
                    />
                </div>
              </div>
    } else {
      return "Game over!"
    }
  } else {
    return <>Loading Game</>
  }
}