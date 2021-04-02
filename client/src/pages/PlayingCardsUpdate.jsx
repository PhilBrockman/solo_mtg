import React from 'react'
import api, {useAPI} from '../api'
import {useForm, PlayingCardShard} from './_form.js'

const PlayingCardsUpdate = (props) => {
    const _id = props.directId || props.match.params.id
    console.log("_id", _id)
    const [values, loading] = useAPI(api.getPlayingCardById, _id)
    console.log("manual", api.getPlayingCardById(_id))

    if(loading === false){
        console.log('values', values)
        return <UpdateValues
                    values={values}
                    id={_id}
                    />
    }
    
    return <>Loading...</>
}

const UpdateValues = (props) => {
    console.log("running update values")
    const {state, submitHandler, changeHandler} = useForm(props.values, values => handleUpdatePlayingCard(values));

    const handleUpdatePlayingCard = async (payload) => {
        console.log('updating payload',props.id,  payload)
        await api.updatePlayingCardById(props.id, payload).then(res => {
            window.location.reload()
        })
    }

    return (
        <>
        Update Card
        <PlayingCardShard
            state={state}
            submitHandler={submitHandler}
            changeHandler={changeHandler}
            />
        </>
    );   
}

export default PlayingCardsUpdate