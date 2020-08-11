import React from 'react'
import basePath from './base-path'
import {Link} from 'react-router-dom'
import mods from './data/mods.json'
import characters from './data/characters.json'

function CharacterImage({character: {name, variants, code, regions}, variant, hash}) {
  variant = variant || ['01', '00'].reduce((acc, vId) => {
    return acc || (variants[vId] ? vId : false)
  }, false)
  const mod = mods[hash],
        modderCreditTicketTemplate = `
Use this form to sumbmit modder author/creator information for a given mod so they get credit for their work. I'll update the information in the archive as soon as I can and will close this ticket when it's done. ~Phasma

Modder:

If this mod uses assets by any other modders please list them here:

Mod link (do not change this):
https://phasmaexmachina.github.io/destiny-child-mods-archive/live2d-viewer.html?model=${code}_${variant}&modHash=${hash}&background=%23111

Mod hash (do not change this): ${hash}`

  return (variant && variants[variant] && (
    <div style={{
      display: 'inline-block',
      margin: '2em 3em 2em 1em',
      textAlign: 'center'
    }}>
      <a href={`${basePath}/live2d-viewer.html?model=${code}_${variant}&background=%23111&modHash=${hash}`} target="_blank" rel="noopener noreferrer" >
        <img alt={code + '_' + variant} src={basePath + '/characters/' + code + '_' + variant + '/' + (hash || variants[variant].mods[0]) + '/static.png'} style={{maxWidth: '300px', maxHeight: '300px', height: '300px'}} />
      </a>
      <div>{variants[variant].title} {name}</div>
      <div>
        <Link to={`/characters/${code}/${variant}/`}>
          {code}_{variant}
        </Link> {(mod && characters[code].variants[variant].mods.indexOf(hash) != 0) &&
          <span>by {mod.modder
            ? <Link to={`/modders/${encodeURIComponent(mod.modder)}`}>{mod.modder}</Link>
            : <a href={'http://github.com/PhasmaExMachina/destiny-child-mods-archive/issues/new?labels=modder&title=' +
                'Modder credit ' + (name ? 'for ' + variants[variant].title + ' ' + name : '') +
                '&body=' + encodeURIComponent(modderCreditTicketTemplate)
              }  target="_blank" rel="noopener noreferrer"
                title="Click to submit modder information">
              ?
            </a>
          }
          {mod.usingAssetsBy &&
            <span> using assets by{' '}
              <Link to={`/modders/${encodeURIComponent(mod.usingAssetsBy)}`}>{mod.usingAssetsBy}</Link>
            </span>
          }
          </span>
        }
      </div>
    </div>
  )) || null
}

export default CharacterImage