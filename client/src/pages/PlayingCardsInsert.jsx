import React from 'react'
import api from '../api'
import styled from 'styled-components'
import {useForm, PlayingCardShard} from './_form.js'

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
`

const PlayingCardsInsert = props => {
    const handleCreatePlayingCard = async (payload) => {
        await api.insertPlayingCard(payload).then(res => {
            window.alert(`Movie updated successfully`)
        })
    }

    const {state, submitHandler, changeHandler} = useForm(null, values => handleCreatePlayingCard(values));

    return (
        <PlayingCardShard
            state={state}
            submitHandler={submitHandler}
            changeHandler={changeHandler}
            />
    ); 
    
}

export default PlayingCardsInsert