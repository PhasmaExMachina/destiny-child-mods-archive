import React, {useState} from 'react';
import CharacterPreview from './CharacterPreview'
import characters from './data/characters.json'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom"
import Home from './Home'
import basePath from './base-path'

function App() {
  const [filter, setFilter] = useState(''),
        [stars, setStars] = useState(''),
        [type, setType] = useState('c'),
        codes = Object.keys(characters).sort()
  let filtered = filter
    ? codes.filter(code =>
      (code + ' ' + characters[code].name).toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) > -1
    )
    : codes
  if(stars) {
    filtered = filtered.filter(code => characters[code].starLevel == parseInt(stars))
  }
  if(type) {
    filtered = filtered.filter(code => code.match(new RegExp('^' + type)))
  }
  return (
    <div className="App">
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
