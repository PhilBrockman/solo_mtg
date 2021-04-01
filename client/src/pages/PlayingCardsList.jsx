
import React, { Component, useEffect } from 'react'
import ReactTable from 'react-table'
import api from '../api'

console.log("aeou")
console.log("getting all cards", api.getPlayingCardById)
// import styled from 'styled-components'

// import 'react-table/react-table.css'

// const Wrapper = styled.div`
//     padding: 0 40px 40px 40px;
// `

// const Wrapper = () => {<div></div>}

const PlayingCardsList = () => {

    const [loaded, setLoaded] = React.useState(false)
    const [playingCards, setPlayingCards] = React.useState([])

    console.log('hello?')

    React.useEffect(() => {
        console.log("running effect")
        api.getAllPlayingCards().then(playingCards => {
            console.log("in effect", playingCards.data.data)
            setLoaded(false)
            setPlayingCards(playingCards)
        })
       }, []);


    console.log('TCL: PlayingCardsList -> render -> playingCards', playingCards)

    const columns = [
        {
            Header: 'ID',
            accessor: '_id',
            filterable: true,
        },
        {
            Header: 'Name',
            accessor: 'name',
            filterable: true,
        },
        {
            Header: 'Rules Text',
            accessor: 'rulesText',
            filterable: true,
        },
        {
            Header: 'Token',
            accessor: 'token',
            filterable: true,
        },
    ]

    let showTable = true
        if (!playingCards.length) {
            showTable = false
        }

    return (
        <>
            {showTable && (
                <ReactTable
                    data={playingCards}
                    columns={columns}
                    loading={!loaded}
                    defaultPageSize={10}
                    showPageSizeOptions={true}
                    minRows={0}
                />
            )}

            {!showTable && (
                <>
                    {JSON.stringify(playingCards)}
                </>
            )}
        </>
    )

        
    
}

export default PlayingCardsList