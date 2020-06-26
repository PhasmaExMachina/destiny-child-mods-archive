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
        <Link to={`/characters/${code}`}>{name}</Link>
        {' > '}
        {variants[variant].name} {name} ({code}_{variant})
      </p>
      <h2>{variants[variant].name} {name} Mods</h2>
      {variants[variant].mods.map(hash =>
        <ModPreview {...{character, variant, hash}} />
      )}
    </>
  )
}

export default CharacterVariant