import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import Home from './Home'
import basePath from './base-path'
import CharacterVariant from './CharacterVariant'
import Character from './Character'


function App() {
  return (
    <div className="App">
      <Router basename={basePath}>
        <h1>
          <Link to="/">
            <img src={basePath + '/img/icon.png'} style={{height: '1.5em', verticalAlign: 'middle', float: 'left', marginRight: '10px'}} />
          </Link>
          Destiny Child Mods Archive
        </h1>
        <a href="https://github.com/PhasmaExMachina/destiny-child-mods-archive" style={{
          position: 'absolute',
          top: '-5px',
          right: '-5px'
        }} target="_blank" rel="noopener noreferrer">
          <img src={basePath + '/img/strip-fork-me-on-github.png'} style={{width: '100px'}}/>
        </a>
        <Switch>
          <Route path="/characters/:code/:variant/"><CharacterVariant /></Route>
          <Route path="/characters/:code/"><Character /></Route>
          <Route path="/"><Home /></Route>
        </Switch>
      </Router>
      <h3 id="credits">Credits</h3>
      <p>
        Mods in this archive were created by various modders. It would be nice to list the author(s) with each one, but the amount of manual data entry that would take makes it prohibitive. If you're interested in helping with this, feel free to chime in on this <a href="https://github.com/PhasmaExMachina/destiny-child-mods-archive/issues/2">GitHub issue</a>.
      </p>
      <p>This site uses <em>lots</em> of technology from other coders including (but not limited to):</p>
      <ul>
        <li><a href="https://en.wikipedia.org/wiki/Loki">Loki</a></li>
        <li><a href="https://github.com/Arsylk">Asylk</a> - Live2D viewer implementation, <a href="https://arsylk.pythonanywhere.com/apk/view_models">mods forum</a>, and much more</li>
        <li>TinyBanana</li>
        <li>WhoCares8128</li>
        <li>Envy</li>
        <li>Eljoseto - Site icon</li>
      </ul>
      <a href="https://github.com/PhasmaExMachina/destiny-child-mods-archive/issues" target="_blank" rel="noopener noreferrer"
       style={{
        position: 'fixed',
        bottom: 0,
        right: '3em',
        background: '#111',
        color: '#aaa',
        padding: '.25em 1em',
        borderRadius: '10px 10px 0 0',
        fontWeight: 'bold'
      }}>
        Feedback
      </a>
    </div>
  )
}

export default App
