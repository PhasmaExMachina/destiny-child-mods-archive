import React, {useState} from 'react'
import {useHistory, useLocation, Link} from 'react-router-dom'
import TablePagination from '@material-ui/core/TablePagination'
import queryString from 'query-string'
import useQuery from './use-query'
import characters from './data/characters.json'
import basePath from './base-path'

function Childs() {
  const [filter, setFilter] = useState(''),
        history = useHistory(),
        location = useLocation(),
        query = useQuery(),
        {
          sort = 'name',
          order = 'ask',
          element = '',
          type = ''
        } = query,
        setQueryParam = params => {
          const newParams = Object.assign({}, query, params)
          Object.keys(params).forEach(param => {
            if(!params[param]) delete newParams[param]
          })
          history.push(location.pathname + '?' + queryString.stringify(newParams))
          document.body.scrollTop = 0; // For Safari
          document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
        }
  let {page = 0, perPage = 10} = query
  page = parseInt(page, 0)
  perPage = parseInt(perPage, 10)
  const childs = Object.keys(characters).reduce((acc, code) => {
    if(code.match(/^(c|m)\d\d\d/)) {
      acc.push(characters[code])
    }
    return acc
  }, [])
  let filtered = (filter
    ? childs.filter(child => (child.name || '').toLowerCase().match(filter.toLowerCase()))
    : childs)
  if(element) filtered = filtered.filter(child => child.element === element)
  if(type) filtered = filtered.filter(child => child.type === type)
  const getAttack = ({skillAuto}) => parseInt(skillAuto.match(/\d+/)[0])
  if(sort === 'attack') {
    filtered = filtered.sort((a, b) => getAttack(a) > getAttack(b) ? 1 : getAttack(b) > getAttack(a) ? -1 : 0)
  }
  else {
    filtered = filtered.sort((a, b) => a[sort] > b[sort] ? 1 : b[sort] > a[sort] ? -1 : 0)
  }
  if(order === 'desc') filtered.reverse()
  return (
    <>
      <h2>Characters Database</h2>
      <p>
        Filter:{' '}
        <input onKeyUp={({target: {value}}) => {
          setQueryParam({page: 0})
          setFilter(value)
        }}/>
        {' '}
        Sort by
        {' '}
        <select onChange={(({target: {value}}) => setQueryParam({sort: value !== 'name' && value}))} value={sort}>
          <option value="name">Name</option>
          <option value="code">Character code</option>
          <option value="numMods">Number of mods</option>
          <option value="attack">Attack</option>
        </select>
        {' '}
        <select onChange={(({target: {value}}) => setQueryParam({order: value !== 'asc' && value}))} value={order}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </p>
      <p>
        Element:{' '}
        <select onChange={(({target: {value}}) => setQueryParam({element: value !== '' && value}))} value={element}>
          <option value="">Any element</option>
          <option value="fire">Fire</option>
          <option value="water">Water</option>
          <option value="forest">Grass</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        {' '}Type:{' '}
        <select onChange={(({target: {value}}) => setQueryParam({type: value !== '' && value}))} value={type}>
          <option value="">Any type</option>
          <option value="attacker">Attacker</option>
          <option value="debuffer">Debuffer</option>
          <option value="healer">Healer</option>
          <option value="support">Supporter</option>
          <option value="tank">Defender</option>
        </select>
      </p>
      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onChangePage={(_, page) => setQueryParam({page})}
        rowsPerPage={perPage}
        onChangeRowsPerPage={({target: {value}}) => setQueryParam({perPage: value != '10' && parseInt(value, 10)})}
      />
      {filtered.slice(page * perPage, page * perPage + perPage).map(child => (
        <div key={child.code} style={{clear: 'left', marginBottom: '1em', border: '1px solid', padding: '.5em', minHeight: '200px'}}>
          <Link to={'/characters/' + child.code}>
            <img src={child.image2 || child.image3 || child.image4 || child.image1} style={{
              height: '200px',
              width: '73px',
              float: 'left',
              marginRight: '1em',
              marginBottom: '1em'
            }}/>
          </Link>
          <h3>
            <Link to={'/characters/' + child.code}>
              {child.thumbnail &&
                <img src={child.thumbnail} style={{
                  height: '26px',
                  marginRight: '.5em',
                  verticalAlign: 'middle'
                }}/>
              }
              {child.type &&
                <>
                  <img src={basePath + '/img/types/' + child.type + '.png'} style={{
                    verticalAlign: 'middle'
                  }} />{' '}
                </>
              }
              {child.element &&
                <>
                  <img src={basePath + '/img/elements/' + child.element + '.png'} style={{
                    verticalAlign: 'middle'
                  }} />{' '}
                </>
              }
              {child.name || '?'} ({child.code})
              {child.regions.map(region =>
                <img src={basePath + '/img/icons/regions/' + region + '.png'} style={{
                  height: '24px',
                  verticalAlign: 'middle',
                  marginLeft: '.5em'
                }} title={region}/>
              )}
            </Link>
          </h3>
          <p>Variants: {Object.keys(child.variants).length} {' '} Mods: <Link to={'/characters/' + child.code}>{child.numMods}</Link></p>
          {child.skillAuto &&
            <>
              <p>Attack: {child.skillAuto}</p>
              <p>Tap Skill: {child.skillTap}</p>
              <p>Slide Skill: {child.skillSlide}</p>
              <p>Drive Skill: {child.skillDrive}</p>
              <p>Leader Skill: {child.skillLeader}</p>
            </>
          }
        </div>
      ))}
      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onChangePage={(_, page) => setQueryParam({page})}
        rowsPerPage={perPage}
        onChangeRowsPerPage={({target: {value}}) => setQueryParam({perPage: value != '10' && parseInt(value, 10)})}
      />
    </>
  )
}

export default Childs