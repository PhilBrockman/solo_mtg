

import * as Magic from "mtgsdk";
import React from 'react'
import api, { useAPI } from "../api";


const getMTGCard= (name) => {
  return Magic.card.where({name:`"${name}"`})
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
  

  return <>image fetecher<img src={props.payload.url} /></>
}

export const DisplayCard = props => {
  let original = props.row.original
  const [display, setDisplay] = React.useState(original.url)

  if(!original.url || original.url.length === 0){
    getMTGCard(original.name).then(cards => {
      if(cards.length > 0){
        setDisplay(cards[0].imageUrl)
      } 
    })
  } 

  if(display && display.length > 0){
    if(original.url !== display){
      const payload = {...original}
      payload.url = display;

      return (<ImageFetcher 
                id={original._id}
                payload={payload}
                />  );
    } else {
      return <>the whole time<img src={display} /></>
    }
  } else {
    return <>{display}</>
  }
  

  
}