import React from 'react'
import basePath from './base-path'

function CharacterImage({character: {name, variants, code}, variant, hash}) {
  variant = variant || ['01', '00'].reduce((acc, vId) => {
    return acc || (variants[vId] ? vId : false)
  }, false)

  return (variant && variants[variant] && (
    <div style={{
      display: 'inline-block',
      margin: '2em 3em 2em 1em',
      textAlign: 'center'
    }}>
      <a href={`${basePath}/live2d-viewer.html?model=${code}_${variant}&modHash=${hash}`} target="_blank">
        <img alt={code + '_' + variant} src={basePath + '/characters/' + code + '_' + variant + '/' + (hash || variants[variant].mods[0]) + '/static.png'} style={{maxWidth: '300px', maxHeight: '300px', height: '300px'}} />
      </a>
      <div>{variants[variant].title} {name}</div>
      <div>{code}_{variant}</div>
    </div>
  )) || null
}

export default CharacterImage