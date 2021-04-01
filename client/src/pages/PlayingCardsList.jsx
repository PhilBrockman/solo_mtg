
import React from 'react'
import { useTable } from 'react-table'

import api from '../api'

// import styled from 'styled-components'

// import 'react-table/react-table.css'

// const Wrapper = styled.div`
//     padding: 0 40px 40px 40px;
// `

// const Wrapper = () => {<div></div>}




const PlayingCardsList = () => {
    const [playingCards, setPlayingCards] = React.useState(null)

    React.useEffect(() => {
        console.log("running effect")
        api.getAllPlayingCards().then(playingCards => {
            console.log("in effect", playingCards.data.data)
            setPlayingCards(playingCards)
        })
       }, []);

    console.log('TCL: PlayingCardsList -> render -> playingCards', playingCards)


    return (
     <>
        <MTGTable 
            data={playingCards}
            />
    </>
    )

    // return (
    //     <>
    //         {showTable && (
                
    //         )}

    //         {!showTable && (
    //             <>
    //                 {JSON.stringify(playingCards)}
    //             </>
    //         )}
    //     </>
    // )
    
}

const MTGTable = (props) => {
    return (
        <> loading </>
    )
}

export default PlayingCardsList