
import React from "react"
import * as Widget from "./widgets.js"
import api from "../api"

const PlayingCardsMassInsert = props => {
  const [cards, setCards] = React.useState()

  const submitHandler = (event) => {
    event.preventDefault()

    cards.split("\n").map(item => {
      let card = item.split(" ").splice(1).join(" ")
      console.log("item", card)
      api.insertPlayingCard({name: card})
    })
  }

  const changeHandler = event =>{
    setCards(event.target.value)
  }

  return (
    <form onSubmit={submitHandler}>
      <textarea value={cards} onChange={changeHandler} />
      
      <Widget.Button>Submit</Widget.Button> 
      <Widget.CancelButton  href={'/playingCards'}>Cancel</Widget.CancelButton>
    </form>
  );
}


export default PlayingCardsMassInsert