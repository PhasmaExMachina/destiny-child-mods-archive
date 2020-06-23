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
