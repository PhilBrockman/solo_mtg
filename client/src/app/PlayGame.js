import React from "react"

import * as Utils from "./utils.js"
import {loxs} from "./utils.js"
import * as GC from "./GameComponents.js"

const prioritize = o => {
  return o.sort((a, b) => (a.priority < b.priority) ? -1 : 1)
}

export const PlayGame = props => {
  const [gameover, setGameOver] = React.useState(null)

  const [history, setHistory] = React.useState([])
  const [hordeDeck, setHordeDeckDirectly] = React.useState(null)
  const [activeZone, setActiveZone] = React.useState(null)
  const [playerLife, setPlayerLife] = React.useState(30)
  const [counter, setCounter] = React.useState(0)

  const setHordeDeck = (deck) => {
    setHordeDeckDirectly(deck.sort((a,b) => a.priority > b.priority ? -1 : 1))
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
    // let currentDeck = cardsInZones[loxs.LIBRARY]
    let currentDeck = Utils.filterByLocation(hordeDeck, loxs.LIBRARY)
    let out = []
    let next

    do { //pop cards until we find a non-token
      next = currentDeck.pop()
      out.push(next)
    } while(next.name.toLowerCase().includes("token"))
    
    let newDeckState = Utils.deepCopy(hordeDeck)


    let tmpCounter = counter + out.length
    newDeckState = newDeckState.map(card => {
      let tmp = {...card} 
      if(out.map(item => item.card_id).includes(card.card_id)){
        tmp.location = loxs.BATTLEFIELD
        tmp.priority = tmpCounter
        tmpCounter--
        // card.priority = Math.max(Utils.filterByLocation(hordeDeck, 
        //                   loxs.BATTLEFIELD).map(item => item.priority)) + counter
        // let res = Utils.filterByLocation(hordeDeck, 
        //   loxs.BATTLEFIELD).map(item => item.priority)
        console.log("loading with priority:",  tmpCounter)
      }
      return tmp
    })

    setCounter(tmpCounter + out.length)
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
                    <GC.HordeDeck
                      activateHordeDeck={activateHordeDeck}
                      burn={burn}
                    />
                    <GC.PlayerControls
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
                  <GC.History
                      rollbackHordeDeckTo={rollbackHordeDeckTo}
                      history={history}
                    />
                  <GC.CardViewer
                    deck={hordeDeck}
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
