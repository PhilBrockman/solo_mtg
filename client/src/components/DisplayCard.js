

import * as Magic from "mtgsdk";
import React from 'react'
import api, { useAPI } from "../api";


const getMTGCard= (name) => {
  return Magic.card.where({name:`"${name}"`})
}
// getMTGCard("Call to the Grave").then(res => {
//   console.log("call to grave", res[0].imageUrl)
// })

const ImageFetcher = props => {
  console.log("props", props)
  api.updatePlayingCardById(props.id, props.payload)//.then(() => {
  //   console.log("saved image to db")
  // })

  return <img src={props.display_url} />
}

export const DisplayCard = props => {
  let original = props.row.original
  const payload = {...original}

  const [display, setDisplay] = React.useState(original.url)

  if(!original.url || original.url.length === 0){
    getMTGCard(original.name).then(cards => {
      console.log("fetched cards for", original.name, cards)
      if(cards.length > 0){
        payload.url = cards[0].imageUrl
        setDisplay(payload.url)
      } 
    })
  } 

  if(display && display.length > 0){
    if(original.url !== display){
      return (<ImageFetcher 
                id={original._id}
                payload={payload}
                display_url={display}
                />  );
    } else {
      return <img src={display} />
    }
  } else {
    return <>{display}</>
  }
  

  
}