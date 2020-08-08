import React from 'react'
import CharacterImage from './CharacterImage'
import ModPreview from './ModPreview'
import basePath from './base-path'

function CharacterPreview({character}) {
  const {code} = character
        // numMods = Object.keys(variants).reduce((acc, vId) => {
        //   return acc + (variants[vId].mods || []).length
        // }, 0)
  return (
    <div key={code} style={{
      marginBottom: '1em',
      marginRight: '1em',
      // display: 'inline-block',
      // textAlign: 'center',
      textDecoration: 'none'
    }} href={'/character/' + code}>
      <div style={{marginBottom: '2em', width: '100%', clear: 'both'}}>
        {/* <h2>{code} - {name} ({Object.keys(variants).length} variants, {numMods} mods)</h2> */}
        {/* <CharacterImage character={character} /> */}
        {Object.keys(character.variants).sort().map(vId => (

          <div key={`${code}_${vId}`} style={{marginRight: '1em', cextAlign: 'center', marginBottom: '1em'}}>
            <h2>{code}_{vId} {character.variants[vId].title} {character.name || character.kname}</h2>
            {character.variants[vId].mods && character.variants[vId].mods.map(hash => (
              <ModPreview {...{character, variant: vId, hash, key: hash}} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CharacterPreview