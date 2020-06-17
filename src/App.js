import React, {useState} from 'react';
import CharacterPreview from './CharacterPreview'
// import logo from './logo.svg';
// import './App.css';
import characters from './data/characters.json'

function App() {
  const [filter, setFilter] = useState(''),
        codes = Object.keys(characters).sort(),
        filtered = filter
          ? codes.filter(code =>
            (code + ' ' + characters[code].name).toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) > -1
          )
          : codes
  return (
    <div className="App">
      <h1>Destiny Child Mods Archive</h1>
      <p>
        Filter characters:{' '}
        <input onKeyUp={e => setFilter(e.target.value)}/>
      </p>
      {filtered.map(code => (
        <CharacterPreview key={code} character={characters[code]} />
      ))}
    </div>
  );
}

export default App;
