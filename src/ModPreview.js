import React from 'react'
import basePath from './base-path'
import {Link} from 'react-router-dom'
import mods from './data/mods.json'

function CharacterImage({character: {name, variants, code, regions}, variant, hash}) {
  variant = variant || ['01', '00'].reduce((acc, vId) => {
    return acc || (variants[vId] ? vId : false)
  }, false)
  const mod = mods[hash]

  return (variant && variants[variant] && (
    <div style={{
      display: 'inline-block',
      margin: '2em 3em 2em 1em',
      textAlign: 'center'
    }}>
      <a href={`${basePath}/live2d-viewer.html?model=${code}_${variant}&modHash=${hash}&background=%23111`} target="_blank" rel="noopener noreferrer" >
        <img alt={code + '_' + variant} src={basePath + '/characters/' + code + '_' + variant + '/' + (hash || variants[variant].mods[0]) + '/static.png'} style={{maxWidth: '300px', maxHeight: '300px', height: '300px'}} />
      </a>
      <div>{variants[variant].title} {name}</div>
      <div>
        <Link to={`/characters/${code}/${variant}/`}>
          {code}_{variant}
        </Link> {mod && mod.modder &&
          <span>by {mod.modder}</span>
        }
      </div>
    </div>
  )) || null
}

export default CharacterImage