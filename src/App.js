import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom"
import Home from './Home'
import basePath from './base-path'


function App() {
  return (
    <div className="App">
      <a href="https://github.com/PhasmaExMachina/destiny-child-mods-archive" style={{
        position: 'absolute',
        top: '-5px',
        right: '-5px'
      }} target="_blank" rel="noopener noreferrer">
        <img src={basePath + '/img/strip-fork-me-on-github.png'} style={{width: '100px'}}/>
      </a>
      <Router basename={basePath}>
        <Switch>
          <Route path="/character/:code">
            Character
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
