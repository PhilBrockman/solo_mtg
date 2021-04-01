import React from 'react'
import DeckTable from './DeckTable.js'
import api from '../api'
import styled from "styled-components"

const Wrapper = styled.div`
        padding: 0 40px 40px 40px;
    `

const PlayingCardsList = () => {
    const [playingCards, setPlayingCards] = React.useState(null)

    React.useEffect(() => {
        console.log("running effect")
        api.getAllPlayingCards().then(playingCards => {
            setPlayingCards(playingCards)
            console.log('Pages: PlayingCardsList -> render -> playingCards', playingCards)
        })
       }, []);

   if(playingCards){
        return (
        <Wrapper>
            <DeckTable
                data={playingCards.data.data}
                />
        </Wrapper>
        )
    } else {
        return (
            <>Loading...</>
        )
    }
}

export default PlayingCardsList