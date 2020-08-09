import React from 'react'
import {useParams, Link} from 'react-router-dom'
import mods from './data/mods.json'
import characters from './data/characters.json'
import ModPreview from './ModPreview'

const Modder = () => {
    const {modder} = useParams(),
          modderMods = Object.keys(mods).reduce((acc, hash) => {
            if(mods[hash].modder == modder) {
              acc.push(Object.assign({}, mods[hash], {hash}))
            }
            return acc
          }, [])
    console.log(modder, modderMods)
    return (
        <>
            <p>
                <Link to="/">Home</Link>
                {' > '}
                {/* <Link to="/modders">Modders</Link> */}
                Modders
                {' > '}
                {modder}
            </p>
            <h1>{modder}</h1>
            {modderMods.map(({hash, variant, code}) => (
              <ModPreview {...{character: characters[code], variant, hash, key: hash}} />
            ))}
        </>
    )
}

export default Modder