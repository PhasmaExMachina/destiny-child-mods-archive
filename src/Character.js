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
        {name}
      </p>
      {Object.keys(variants).sort().map(variant => (
        <div key={variant}>
          <h3>{variants[variant].name} {name} Mods ({code}_{variant})</h3>
          {variants[variant].mods.map(hash =>
            <ModPreview {...{character, variant, hash}} />
          )}
        </div>
      ))}
    </>
  )
}

export default CharacterVariant