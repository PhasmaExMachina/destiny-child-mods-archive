import React from 'react'
import CharacterImage from './CharacterImage'
import BASE_URL from './lib/base-url'

function CharacterPreview({character}) {
  const {code, name, variants} = character,
        numMods = Object.keys(variants).reduce((acc, vId) => {
          return acc + (variants[vId].mods || []).length
        }, 0)
  return (
    <div key={code} style={{
      marginBottom: '1em',
      marginRight: '1em',
      // display: 'inline-block',
      // textAlign: 'center',
      textDecoration: 'none'
    }} href={'/characters/' + code}>
      <div style={{marginBottom: '2em', width: '100%', clear: 'both'}}>
        {/* <h2>{code} - {name} ({Object.keys(variants).length} variants, {numMods} mods)</h2> */}
        {/* <CharacterImage character={character} /> */}
        {Object.keys(character.variants).sort().map(vId => (
          <div key={`${code}_${vId}`} style={{marginRight: '1em', cextAlign: 'center', marginBottom: '1em'}}>
            <h2>{code}_{vId} {character.variants[vId].title} {character.name}</h2>
            {character.variants[vId].mods && character.variants[vId].mods.map(hash => (
              <div key={hash} style={{marginLeft: '2em', textAlign: 'center', display: 'inline-block', position: 'relative', padding: '0 1em 0'}}>
                <a href={BASE_URL + `live2d-viewer.html?model=${code}_${vId}&modHash=${hash}`} target="_blank">
                  <CharacterImage character={character} variant={vId} hash={hash} />
                </a>
                {/* <br />
                <a href={`/characters/${code}_${vId}/${hash}/${code}_${vId}.pck`} style={{position: 'absolute', top: 0, right: 0}}>
                  d/l
                </a> */}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default CharacterPreview