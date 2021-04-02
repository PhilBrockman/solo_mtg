import React from 'react'
import api, {useAPI} from '../api'
import {useForm, PlayingCardShard} from './_form.js'
import * as Magic from "mtgsdk";

const getRulesText = (name) => {
   return Magic.card.where({name:`"${name}"`})
}

const PlayingCardsUpdate = (props) => {
    const _id = props.match.params.id
    const [values, loading] = useAPI(api.getPlayingCardById, _id)

    if(loading == false){
        console.log('values', values)
        return <UpdateValues
                    values={values}
                    id={_id}
                    />
    }
    
    return <>working</>
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