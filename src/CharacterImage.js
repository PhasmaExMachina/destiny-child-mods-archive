import React from 'react'
import basePath from './base-path'

function CharacterImage({character: {variants, code}, variant, hash, style}) {
  variant = variant || ['01', '00'].reduce((acc, vId) => {
    return acc || (variants[vId] ? vId : false)
  }, false)

  return (variant && variants[variant] && (
    <img
      alt={code + '_' + variant}
      src={basePath + '/characters/' + code + '_' + variant + '/' + (hash || variants[variant].mods[0]) + '/static.png'}
      style={Object.assign({maxWidth: '300px', maxHeight: '300px', height: '300px'}, style)} />
  )) || null
}

export default CharacterImage