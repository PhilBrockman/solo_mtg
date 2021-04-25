import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'

import { NavBar } from '../components'
import { PlayingCardsList, Home } from '../pages'
import {Game} from "./Game.jsx"

import { getMTGCardByName } from "../api";

// getMTGCardByName("mox emerald").then(res =>
//     console.log(res))

// getMTGCardByName("nissa's triumph").then(res =>
// console.log(res))

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/playingCards" exact component={Game} />
                <Route path="/playingCards/list" exact component={PlayingCardsList} />
            </Switch>
        </Router>
    )
}

export default App