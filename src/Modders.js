import React from 'react'
import {Link} from 'react-router-dom'
import modders from './data/modders.json'

const Modders = () => {
  return (
    <>
      <p>
          <Link to="/">Home</Link>
          {' > '}
          Modders
      </p>
      <h1>Modders</h1>
      {Object.keys(modders).sort((a, b) => a.toLowerCase() < b.toLowerCase() ? -1 : b.toLowerCase() < a.toLowerCase ? 1 : 0)
        .map(modder =>
          <ul>
            <li>
              <Link to={`/modders/${modder}`}>
                {modder} - {modders[modder].mods.length} mods{modders[modder].modsUsingAssets && modders[modder].modsUsingAssets.length && <>
                  - {modders[modder].modsUsingAssets.length} mods using {modder}'s assets
                </>}
              </Link>
            </li>
          </ul>
        )
      }
    </>
  )
}

export default Modders