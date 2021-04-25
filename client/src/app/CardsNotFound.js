import React from 'react'
import api, {getMTGCardByName} from "../api"
import {useForm, PlayingCardShard } from "../pages/_form.js"
import {PlayingCardsUpdate} from "../pages"
import {DisplayCard} from "../components"
import { CancelButton } from '../pages/widgets'

const FetchMTGData = props => {
  const [initialValues, setInitialValues] = React.useState(null)

  React.useEffect(() => {
    // if(initialValues)
      getMTGCardByName(props?.name).then((res, err )=> {
          if(err){
            console.error(err)
          } else {
            console.log("err")
            res = res.filter(card => card.hasOwnProperty("imageUrl"))

            if(res.length === 0){
              setInitialValues({name: props.name, rulesText: '', url: ''})
             } else {
              setInitialValues({name: props.name, rulesText: res[0].text, url: res[0].imageUrl})
            }
          }
      })
    }, [props.name])

  if(initialValues){
    return <PlayingCardsInsert
              moreCardsFound={props.moreCardsFound}
              initialValues={initialValues}/>
  } else {
    return <></>
  }
}

const PlayingCardsInsert = props => {
  const [hidden, setHidden] = React.useState(false)
  const removal_id = "remove-"+props.initialValues.name
  const {state, submitHandler, changeHandler} = useForm(props.initialValues, values => handleCreatePlayingCard(values));

  const handleCreatePlayingCard = async (payload) => {
    // console.log("creating card", payload)
    await api.insertPlayingCard(payload).then((res,err) => {
      props.moreCardsFound(api.getAllPlayingCards())
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
            >
            <CancelButton onClick={() => setHidden(true)}>Canel</CancelButton>
        </PlayingCardShard>
      </>
    ); 
  } else {
    handleCreatePlayingCard(props.initialValues)
    content = <>loading {props.initialValues.name}</> 
  }

  if(hidden){
    return <div></div>
  } else { 
    return <div className={removal_id}>{content}</div>
  }  
}

export const CardsNotFound = props => {
  let modified = props.notFound.map(card => {

    let candidates = props.allCards.filter(item => item.name === card)

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
      return <FetchMTGData moreCardsFound={props.moreCardsFound} 
                    key={card} name={card}/>
    }
  })

  return modified
}