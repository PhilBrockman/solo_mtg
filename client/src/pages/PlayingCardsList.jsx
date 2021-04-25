import React from 'react'
import DeckTable from './DeckTable.js'
import api, {useAPI} from '../api'
import styled from "styled-components"

const Wrapper = styled.div`
        padding: 0 40px 40px 40px;
    `

const PlayingCardsList = () => {
    const [playingCards, loading] = useAPI(api.getAllPlayingCards)

   if(loading === false){
       if(playingCards.length > 0){
            return (
                <Wrapper>
                    <DeckTable
                        data={playingCards}
                        />
                </Wrapper>
                )
            }
        else {
            return "No cards found."
        }
    } else {
        return (
            <>Loading...</>
        )
    }
}

export default PlayingCardsList