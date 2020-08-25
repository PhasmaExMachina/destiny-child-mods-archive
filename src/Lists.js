import React from 'react'
import {Link} from 'react-router-dom'
import lists from './lists/index.js'

const ListItem = ({name, list}) => (
  <li>
    <p>
      <Link to={'/lists/' + name}>{list.name} - {Object.keys(list.mods).length.toLocaleString()} mods</Link><br />
      {list.description}
    </p>
  </li>
)

const Lists = () => {
  return (
    <>
      <h1>Mod Lists</h1>
      <p>The following is a collection of community-curated mod lists.</p>
      <ul>
        {Object.keys(lists).map(name =>
          <ListItem name={name} list={lists[name]} />
        )}
      </ul>
    </>
  )
}

export default Lists