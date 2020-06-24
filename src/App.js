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
      <h3 id="credits">Credits</h3>
      <p>
        Mods in this archive were created by various modders. It would be nice to list the author(s) with each one, but the amount of manual data entry that would take makes it prohibitive. If you're interested in helping with this, feel free to chime in on this <a href="https://github.com/PhasmaExMachina/destiny-child-mods-archive/issues/2">GitHub issue</a>.
      </p>
      <p>This site uses <em>lots</em> of technology from other coders including (but not limited to):</p>
      <ul>
        <li>Loki</li>
        <li><a href="https://github.com/Arsylk">Asylk</a></li>
        <li>TinyBanana</li>
        <li>WhoCares8128</li>
        <li>Envy</li>
      </ul>
    </div>
  )
}

export default App
