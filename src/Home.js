import React, {useState} from 'react';
import CharacterPreview from './CharacterPreview'
import characters from './data/characters.json'
import {Link} from "react-router-dom"

function Home() {
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
    <>
      <h1>Destiny Child Mods Archive</h1>
      <p>All PCK files have been converted to universal and should work in both Global and KR/JP. To download, click on a mod image to launch the Live2d preview, then on the douwnload icon in the top right. Instructions on installing mods can be found <a href="https://wiki.anime-sharing.com/hgames/index.php?title=Destiny_Child/Modding" taget="_blank">here</a> or on <a href="http://letmegooglethat.com/?q=destiny+child+how+to+install+mods" target="_blank">Google</a>. There's also a <a href="https://discord.gg/2vew9te" target="_blank">Discord community</a>.</p>
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
    </>
  )
}

export default Home
