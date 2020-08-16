import React from 'react'
import {Link} from 'react-router-dom'
import basePath from './base-path'
import transitions from './data/transitions.json'

const Transitions = () => {
  return (
    <>
      <p>
          <Link to="/">Home</Link>
          {' > '}
          Transitions
      </p>
      <h1>Transitions</h1>
      <p>
        Transition screens can be found in <em>files/ux/ci/img</em>. They come in three parts: left, center, and right. To install a new transition screen, save each of the three parts of the desired image below by right clicking on the left, middle, and right and clicking "save image as" to download the files. For Global, rename each frile extension from <em>.png</em> to <em>.dcp</em>, but leave them as <em>.png</em> for KR or JP, then overwrite the desired files on your device in the game folder in <em>files/ux/ci/img</em>.
      </p>
      {Object.keys(transitions)
        .map(transition => {
          const {modder} = transitions[transition]
          return (
            <div style={{marginBottom: '1em'}}>
              <div>
                  {transition} {modder &&
                    <span>by <Link to={'/modders/' + encodeURIComponent(modder)}>{modder}</Link></span>
                  }
                  {' - '}
                  <a href={basePath + `/transitions/` + transition + '/trans_left.png'}>left</a>{', '}
                  <a href={basePath + `/transitions/` + transition + '/trans_center.png'}>center</a>{', '}
                  <a href={basePath + `/transitions/` + transition + '/trans_right.png'}>right</a>
              </div>
              <div style={{width: 100, position: "relative", overflow: 'hidden', display: 'inline-block'}}>
                <img style={{height: 200, position: 'relative', left: -100, top: 4}} src={basePath + `/transitions/` + transition + '/trans_left.png'} />
              </div>
              <img style={{height: 200}} src={basePath + `/transitions/` + transition + '/trans_center.png'} />
              <img style={{height: 200}} src={basePath + `/transitions/` + transition + '/trans_right.png'} />
            </div>
          )
        })
      }
    </>
  )
}

export default Transitions