import React from 'react'

function CharacterImage({character: {variants, code}, variant, hash}) {
  variant = variant || ['01', '00'].reduce((acc, vId) => {
    return acc || (variants[vId] ? vId : false)
  }, false)

  return (variant && variants[variant] && (
    <img src={'./characters/' + code + '_' + variant + '/' + (hash || variants[variant].mods[0]) + '/preview-cropped-thumb.png'} style={{maxWidth: '300px', maxHeight: '300px', height: '300px'}} />
  )) || null
}

export default CharacterImage