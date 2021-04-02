import React from 'react'
import api, {getMTGCardByName} from "../api"
import {useForm, PlayingCardShard, initialForm} from "../pages/_form.js"
import {PlayingCardsUpdate} from "../pages"
import {DisplayCard} from "../components"

const FetchMTGData = props => {
  const [initialValues, setInitialValues] = React.useState(null)

  React.useEffect(() => {
    getMTGCardByName(props.name).then((res, err )=> {
      if(err){
        console.error(err)
      } else {
        res = res.filter(card => card.hasOwnProperty("imageUrl"))

        if(res.length === 0){
          console.log("no cards found with name", props.name)
          setInitialValues({name: props.name, rulesText: '', url: ''})
        } else {
          console.log("res", res)
          setInitialValues({name: props.name, rulesText: res[0].text, url: res[0].imageUrl})
        }
      }
  })}, [props.name])

  if(initialValues){
    return <PlayingCardsInsert
              initialValues={initialValues}/>
  } else {
    console.log("gathering magicks")
    return <>gathering... {props.name}</>
  }
}

const PlayingCardsInsert = props => {
  const [hidden, setHidden] = React.useState(false)
  const removal_id = "remove-"+props.initialValues.name
  const {state, submitHandler, changeHandler} = useForm(props.initialValues, values => handleCreatePlayingCard(values));

  const handleCreatePlayingCard = async (payload) => {
    await api.insertPlayingCard(payload).then((res,err) => {
      setHidden(true)
    })
  }

  let content = "";
  if(props.initialValues.text?.length === 0 || props.initialValues?.url.length === 0){
    content= (
      <>
        <PlayingCardShard
            state={state}
            submitHandler={submitHandler}
            changeHandler={changeHandler}
            />
      </>
    ); 
  } else {
    handleCreatePlayingCard(props.initialValues)
    content = <div className={removal_id}>loading {props.initialValues.name}</div> 
  }

  if(hidden){
    return ""
  } else{ 
    return <div>{content}</div>
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