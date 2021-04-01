import React, { Component } from 'react'

import * as Magic from "mtgsdk";

// Magic.card.find(3)
// .then(result => {
//     console.log(result.card.name) // "Black Lotus"
// })

const PlayingCardsUpdate = props => {

        return (
            <div>
                <p>{JSON.stringify(props)}</p>
                <p>In this page you'll see the form to update the movies</p>
            </div>
        )

}

export default PlayingCardsUpdate