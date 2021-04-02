import React from 'react'
import api, {useAPI} from "../api"

console.log("in game.jsx")

export const Game = (props) => {
  let cards = useAPI(api.getAllPlayingCards)
  if(cards && cards.length > 0){
    return cards.map((item, index) =>{
      return( 
        <CardViewer
          name={item.name}
          rulesText={item.rulesText}
          key={index}
        />);
    })
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