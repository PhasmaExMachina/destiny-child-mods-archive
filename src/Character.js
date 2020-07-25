import React from 'react'
import {useParams, Link} from 'react-router-dom'
import characters from './data/characters.json'
import ModPreview from './ModPreview'

function CharacterVariant() {
  const {code} = useParams(),
        character = characters[code],
        {name, kname, variants} = character
  return (
    <>
      <p>
        <Link to="/">Home</Link>
        {' > '}
        <Link to="/childs">Childs Database</Link>
        {' > '}
        {name || kname}
      </p>
      <h2>{name} ({code})</h2>
      {Object.keys(variants).sort().map(variant => (
        <div key={variant}>
          <h3>{variants[variant].title} {name || kname} Mods ({code}_{variant})</h3>
          {variants[variant].mods.map(hash =>
            <ModPreview key={hash} {...{character, variant, hash}} />
          )}
        </div>
      ))}
    </>
  )
}

export default CharacterVariant