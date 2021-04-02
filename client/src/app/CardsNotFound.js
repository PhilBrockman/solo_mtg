import React from 'react'
import api, {getMTGCardByName} from "../api"
import {useForm, PlayingCardShard, initialForm} from "../pages/_form.js"
import {PlayingCardsUpdate} from "../pages"
import {DisplayCard} from "../components"

const FetchMTGData = props => {
  const [gatherer, setGatherer] = React.useState(null)
  const [initialValues, setInitialValues] = React.useState({
    name: props.name, rulesText: '', url: ''
  })

  React.useEffect(() => {
    getMTGCardByName(props.name).then((res, err )=> {
      if(err){
        console.error(err)
      }

      res = res.filter(card => card.hasOwnProperty("imageUrl"))

      if(res.length === 0){
        console.log("no cards found with name", props.name)
        setGatherer(true)
      } else {
        console.log("res", res)
        setGatherer(res[0])
      }
  })}, [props.name])

  if(gatherer){
    console.log('gatherer', gatherer)
    let tmp = {}
        tmp.name = props.name
        tmp.rulesText = gatherer.text || ""
        tmp.url = gatherer.imageUrl || ""
    console.log("calling with ", {...tmp})
    return <PlayingCardsInsert
              initialValues={tmp}/>
  } else {
    console.log("gathering magicks")
    return <>gathering... {props.name}</>
  }
}

const PlayingCardsInsert = props => {
  const removal_id = "remove-"+props.initialValues.name
  const {state, submitHandler, changeHandler} = useForm(props.initialValues, values => handleCreatePlayingCard(values));

  const handleCreatePlayingCard = async (payload) => {
    await api.insertPlayingCard(payload).then(res => {
      document.getElementById(removal_id)?.remove()
    })
  }

  if(props.initialValues.text?.length === 0 || props.initialValues?.url.length === 0){
    return (
      <div id={removal_id}>
        <PlayingCardShard
            state={state}
            submitHandler={submitHandler}
            changeHandler={changeHandler}
            />
      </div>
    ); 
  } else {
    handleCreatePlayingCard(props.initialValues)
    return <div id={removal_id}> loaded {props.initialValues.name} </div>
  }
}

export const CardsNotFound = props => {
  let modified = props.notFound.map(card => {
    let candidates = props.allCards.filter(allCards => allCards.name === card)

    if(candidates.length > 0){
      let lastEl = candidates[candidates.length-1]
      return (<>
                <DisplayCard original={lastEl}/>
                <PlayingCardsUpdate
                  key={card}
                  directId={ lastEl._id}
                />
              </>)
    } else {
      return <FetchMTGData key={card} name={card}/>
    }
  })

  return modified
}