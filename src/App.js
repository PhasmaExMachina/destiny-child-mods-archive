import React, {useState} from 'react';
import CharacterPreview from './CharacterPreview'
// import logo from './logo.svg';
// import './App.css';
import characters from './data/characters.json'

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
      <h1>Destiny Child Mods Archive</h1>
      <p>
        Filter characters:{' '}
        <input onKeyUp={e => setFilter(e.target.value)} />
        {' '}
        <select onChange={e => setStars(e.target.value)}>
          <option value="">All star levels</option>
          <option value="1">1 star</option>
          <option value="2">2 star</option>
          <option value="3">3 star</option>
          <option value="4">4 star</option>
          <option value="5">5 star</option>
        </select>
        {' '}
        <select onChange={e => setType(e.target.value)}>
          <option value="">All Types</option>
          <option value="c" selected>Childs</option>
          <option value="m">Monsters</option>
          <option value="sc">Spa Childs</option>
          <option value="sm">Spa Monsters</option>
          <option value="z">Other</option>
        </select>
      </p>
      {filtered.map(code => (
        <CharacterPreview key={code} character={characters[code]} />
      ))}
    </div>
  );
}

export default App;
