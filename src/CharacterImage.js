import React from 'react'

function CharacterImage({character: {variants, code}, variant, hash}) {
  variant = variant || ['01', '00'].reduce((acc, vId) => {
    return acc || (variants[vId] ? vId : false)
  }, false)

  return (variant && variants[variant] && (
    <img alt={code + '_' + variant} src={'./characters/' + code + '_' + variant + '/' + (hash || variants[variant].mods[0]) + '/static.png'} style={{maxWidth: '300px', maxHeight: '300px', height: '300px'}} />
  )) || null
}

export default CharacterImage