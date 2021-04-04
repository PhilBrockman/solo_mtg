import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { PlayingCardsList, PlayingCardsInsert, PlayingCardsUpdate, PlayingCardsMassInsert } from '../pages'

import {Game} from "./Game.jsx"


import 'bootstrap/dist/css/bootstrap.min.css'


import api, { useAPI, getMTGCardByName } from "../api";


getMTGCardByName("mox emerald").then(res =>
    console.log(res))

getMTGCardByName("nissa's triumph").then(res =>
console.log(res))



function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/playingCards" exact component={Game} />
                <Route path="/playingCards/list" exact component={PlayingCardsList} />
                <Route path="/playingCards/create" exact component={PlayingCardsMassInsert} />
                <Route
                    path="/playingCards/update/:id"
                    exact
                    component={PlayingCardsUpdate}
                />
            </Switch>
            ouei 
        </Router>
    )
}

export default App