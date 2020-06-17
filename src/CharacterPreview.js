import React from 'react'
import CharacterImage from './CharacterImage'
import BASE_URL from './lib/base-url'

function CharacterPreview({character}) {
  const {code, name, variants} = character,
        numMods = Object.keys(variants).reduce((acc, vId) => {
          return acc + (variants[vId].mods || []).length
        }, 0)
  return (
    <a key={code} style={{
      marginBottom: '1em',
      marginRight: '1em',
      display: 'inline-block',
      textAlign: 'center',
      textDecoration: 'none'
    }} href={'/characters/' + code}>
      <div style={{marginBottom: '1em'}}>{code} - {name} ({Object.keys(variants).length} variants, {numMods} mods)</div>
      <CharacterImage character={character} />
      {/* {Object.keys(characters[code].variants).sort().map(vId => (
        <div key={`${code}_${vId}`} style={{marginLeft: '1em', display: 'inline-block'}}>
          {code}_{vId} {characters[code].variants[vId].title} {characters[code].name}
          {characters[code].variants[vId].mods && characters[code].variants[vId].mods.map(hash => (
            <div key={hash} style={{marginLeft: '2em', textAlign: 'center'}}>
              <a href={BASE_URL + `live2d-viewer.html?model=${code}_${vId}&modHash=${hash}`}>
                <CharacterImage character={characters[code]} variant={vId} />
              </a>
              <br />
              <a href={`/characters/${code}_${vId}/${hash}/${code}_${vId}.pck`}>
                {code}_{vId}.pck
              </a>
            </div>
          ))}
        </div>
      ))} */}
    </a>
  )
}

export default CharacterPreview