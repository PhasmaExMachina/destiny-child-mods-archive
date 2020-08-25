import React, {useState} from 'react'
import queryString from 'query-string'
import {useHistory, useLocation, useParams, Link} from 'react-router-dom'
import lists from './lists/index.js'
import ModPreview from './ModPreview'
import characters from './data/characters.json'
import mods from './data/mods.json'
import TablePagination from '@material-ui/core/TablePagination'
import useQuery from './use-query'

const List = () => {
  const [filter, setFilter] = useState(''),
        list = lists[useParams().list] || {},
        history = useHistory(),
        location = useLocation(),
        query = useQuery(),
        setQueryParam = params => {
          const newParams = Object.assign({}, query, params)
          Object.keys(params).forEach(param => {
            if(!params[param]) delete newParams[param]
          })
          history.push(location.pathname + '?' + queryString.stringify(newParams))
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        },
        modders = Object.keys(list.mods).reduce((acc, target) => {
          const mod = mods[list.mods[target].hash] || {}
          acc[mod.modder || '?'] = acc[mod.modder || '?'] || 0
          acc[mod.modder || '?']++
          return acc
        }, {}),
        {modder} = query
  let {page = 0, perPage = 10} = query
  page = parseInt(page, 0)
  perPage = parseInt(perPage, 10)
  let filteredTargets = Object.keys(list.mods).sort()
  if(filter) {
    filteredTargets = filteredTargets.filter(target => {
      const [targetCode, targetVariant] = target.split('_'),
            character = characters[targetCode]
      return character
        ? (targetCode + '_' + targetVariant + ' ' + character.variants[targetVariant].title + ' ' + character.name).toLocaleLowerCase().match(filter.toLocaleLowerCase())
        : false
    })
  }
  if(modder) {
    filteredTargets = filteredTargets.filter(target => {
      const hash = list.mods[target].hash,
            mod = mods[hash] || {}
      return modder == '?'
        ? !mod.modder
        : mod.modder == modder
    })
  }
  return (
    <>
      <p>
          <Link to="/">Home</Link>
          {' > '}
          <Link to="/lists">Mod Lists</Link>
          {' > '}
          {list.name}
      </p>
      <h1>{list.name}</h1>
      <p>{list.description}</p>
      <p>
        Filter:{' '}
        <input onKeyUp={({target: {value}}) => {
          setQueryParam({page: 0})
          setFilter(value)
        }}/>
        {' '}by{' '}
        <select defaultValue={modder} onChange={({target: {value}}) => {
          setQueryParam({modder: value})
        }}>
          <option value="">All modders</option>
          {Object.keys(modders).sort().map(modder =>
            <option
              key={modder}
              value={modder}>
              {modder == '?' ? 'unknown' : modder} - {modders[modder]} mod{modders[modder] > 1 ? 's' : ''}
            </option>
          )}
        </select>
      </p>
      <TablePagination
        component="div"
        count={filteredTargets.length}
        page={page}
        onChangePage={(_, page) => setQueryParam({page})}
        rowsPerPage={perPage}
        onChangeRowsPerPage={({target: {value}}) => setQueryParam({perPage: value != '10' && parseInt(value, 10)})}
      />
      {filteredTargets.slice(page * perPage, page * perPage + perPage).map(target => {
        const [targetCode, targetVariant] = target.split('_'),
              {hash} = list.mods[target],
              mod = mods[hash]
        return mod
          ? (
            <div key={target} style={{marginBottom: '2em', position: 'relative'}}>
              <ModPreview character={characters[targetCode]} variant={targetVariant}/>
              <span style={{fontSize: '3em', position: 'relative', top: '-175px'}}>➡</span>
              <ModPreview character={characters[mod.code]} variant={mod.variant} hash={hash} />
            </div>
          )
          : <p>Unknown mod for {target}</p>
      })}
      <TablePagination
        component="div"
        count={filteredTargets.length}
        page={page}
        onChangePage={(_, page) => setQueryParam({page})}
        rowsPerPage={perPage}
        onChangeRowsPerPage={({target: {value}}) => setQueryParam({perPage: value != '10' && parseInt(value, 10)})}
      />
    </>
  )
}

export default List