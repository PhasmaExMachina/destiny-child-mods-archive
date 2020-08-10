import React from 'react'
import {useParams, Link} from 'react-router-dom'
import mods from './data/mods.json'
import modders from './data/modders.json'
import characters from './data/characters.json'
import ModPreview from './ModPreview'

const Modder = () => {
    const {modder} = useParams(),
          modderMods = Object.keys(mods).reduce((acc, hash) => {
            if(mods[hash].modder == modder) {
              acc.push(Object.assign({}, mods[hash], {hash}))
            }
            return acc
          }, []),
          modsUsingModderAssets = Object.keys(mods).reduce((acc, hash) => {
            if(mods[hash].usingAssetsBy == modder) {
              acc.push(Object.assign({}, mods[hash], {hash}))
            }
            return acc
          }, []),
          modderDetails = modders[modder]
    return (
        <>
            <p>
                <Link to="/">Home</Link>
                {' > '}
                <Link to="/modders">Modders</Link>
                {' > '}
                {modder}
            </p>
            <h1>{modder}</h1>
            {modderDetails.profile &&
              <div dangerouslySetInnerHTML={{__html:modderDetails.profile}} />
            }
            {modderMods.map(({hash, variant, code}) => (
              <ModPreview {...{character: characters[code], variant, hash, key: hash}} />
            ))}
            {modsUsingModderAssets.length > 0 &&
              <>
                <h2>Mods Using assets by {modder}</h2>
                {modsUsingModderAssets.map(({hash, variant, code}) => (
                  <ModPreview {...{character: characters[code], variant, hash, key: hash}} />
                ))}
              </>
            }
        </>
    )
}

export default Modder