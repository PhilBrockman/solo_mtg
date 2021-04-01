import React from 'react'
import api from '../api'
import styled from 'styled-components'
import {useForm, PlayingCardShard} from './_form.js'
import * as Magic from "mtgsdk";

// Magic.card.find(3)
// .then(result => {
//     console.log(result.card.name) // "Black Lotus"
// })




const PlayingCardsUpdate = (props) => {
    const [values, setValues] = React.useState(null)
    const _id = props.match.params.id

    React.useEffect(()=>{
        api.getPlayingCardById(_id).then(res => {
            setValues(res.data.data)
        })
    },[])
    
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
            window.alert(`Movie updated successfully`)
        })
    }

    return (
        <PlayingCardShard
            state={state}
            submitHandler={submitHandler}
            changeHandler={changeHandler}
            />
    );   
}

export default PlayingCardsUpdate