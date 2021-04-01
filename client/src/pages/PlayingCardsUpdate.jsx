import React from 'react'
import api from '../api'
import {useForm, PlayingCardShard} from './_form.js'
import * as Magic from "mtgsdk";

const getRulesText = (name) => {
   return Magic.card.where({name:`"${name}"`})
}

const PlayingCardsUpdate = (props) => {
    const [values, setValues] = React.useState(null)
    const _id = props.match.params.id

    React.useEffect(()=>{
        api.getPlayingCardById(_id).then(res => {
            const card = res.data.data
            if(!(card.rulesText) || card.rulesText.length === 0){
                getRulesText(card.name).then(text => {
                    if(text.length > 0){
                        card.rulesText = text[0].text
                        console.log("text:", card.rulesText)
                        setValues(card)
                    } else {
                        setValues(card)
                    }
                })
            } else {
                setValues(card)
            }
            
        })
    },[_id])
    
    if(values){
        console.log("loaded:", values)
        return (
            <UpdateValues
                values={values}
                id={_id}
            />
        );
    }else {
        console.log("loading cards")
        return <>loading</>
    }
}

const UpdateValues = (props) => {
    console.log("running update values")
    const {state, submitHandler, changeHandler} = useForm(props.values, values => handleUpdatePlayingCard(values));

    const handleUpdatePlayingCard = async (payload) => {
        console.log('updating payload',props.id,  payload)
        await api.updatePlayingCardById(props.id, payload).then(res => {
            window.location.href = "/playingCards/list"
        })
    }

    console.log(getRulesText(state.name))

    return (
        <PlayingCardShard
            state={state}
            submitHandler={submitHandler}
            changeHandler={changeHandler}
            />
    );   
}

export default PlayingCardsUpdate