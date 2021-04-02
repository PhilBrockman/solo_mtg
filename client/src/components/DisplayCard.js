import * as Magic from "mtgsdk";
import React from 'react'
import api, { useAPI } from "../api";
import "./playingCardDisplay.css"


const getMTGCard= (name) => {
  return Magic.card.where({name:`"${name}"`})
}

const DisplayMTGCard = props => {
  return <img className="list-display" src={props.src} />
}

const ImageFetcher = props => {
  console.log("props", props)
  api.getPlayingCardById(props.id).then(ori => {
    console.log("at the begining:", ori.data.data.url)
    console.log("id", props.id)
    console.log("payload", props.payload)
    api.updatePlayingCardById(props.id, props.payload).then(res => {
      console.log("saved image to db", props.payload.url)
    })
  })
  return <DisplayMTGCard src={props.payload.url} />
}

export const DisplayCard = props => {
  let original = props.row.original
  const [display, setDisplay] = React.useState(original.url)
  const [rulesText, setRulesText] = React.useState(original.rulesText)

  if(!original.url || original.url.length === 0){
    getMTGCard(original.name).then(cards => {
      console.log("found some", original.name, cards)
      let filtered = cards.filter(item => item.hasOwnProperty("imageUrl"))
      console.log("filtered down to", filtered)
      if(filtered.length > 0){
        console.log(filtered)
        setDisplay(filtered[0].imageUrl)
        setRulesText(filtered[0].text)
      } 
    })
  } 

  if(display && display.length > 0){
    if(original.url !== display){
      const payload = {...original}
      payload.url = display;
      payload.rulesText = rulesText

      return (<ImageFetcher 
                id={original._id}
                payload={payload}
                />  );
    } else {
      return <DisplayMTGCard src={display} />
    }
  } else {
    return <>{display}</>
  }
  

  
}