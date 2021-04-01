import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { NavBar } from '../components'
import { PlayingCardsList, PlayingCardsInsert, PlayingCardsUpdate } from '../pages'


import 'bootstrap/dist/css/bootstrap.min.css'

function App() {
    return (
        <Router>
            <NavBar />
            <Switch>
                <Route path="/playingCards/list" exact component={PlayingCardsList} />
                <Route path="/playingCards/create" exact component={PlayingCardsInsert} />
                <Route
                    path="/playingCards/update/:id"
                    exact
                    component={PlayingCardsUpdate}
                />
            </Switch>
        </Router>
    )
}

export default App