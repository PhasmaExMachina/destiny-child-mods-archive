import React from 'react'
import {useParams, Link} from 'react-router-dom'
import characters from './data/characters.json'
import ModPreview from './ModPreview'

function CharacterVariant() {
  const {code, variant} = useParams(),
        character = characters[code],
        {name, variants} = character
  return (
    <>
      <p>
        <Link to="/">Home</Link>
        {' > '}
        <Link to={`/characters/${code}`}>{name || '[unknown]'}</Link>
        {' > '}
        {variants[variant].title} {name} ({code}_{variant})
      </p>
      <h2>{variants[variant].title} {name} Mods</h2>
      {variants[variant].mods.map(hash =>
        <ModPreview key={hash} {...{character, variant, hash}} />
      )}
    </>
  )
}

export default CharacterVariant