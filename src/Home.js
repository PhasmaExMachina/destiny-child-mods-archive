import React, {useState} from 'react';
import CharacterPreview from './CharacterPreview'
import characters from './data/characters.json'
import useQuery from './use-query'
import {useHistory, useLocation} from "react-router-dom"
import queryString from 'query-string'
import ModPreview from './ModPreview';

function Home() {
  const query = useQuery(),
        location = useLocation(),
        history = useHistory(),
        {
          stars,
          type = 'c',
          perPage = '10',
          view = 'characters',
          sort = 'code',
          order = 'asc'
        } = query,
        [filter, setFilter] = useState(''),
        codes = Object.keys(characters).sort()
  let filtered = view === 'mods'
    ? codes.reduce((acc, code) => {
      acc = acc.concat(Object.keys(characters[code].variants).reduce((acc, variant) => {
        acc = acc.concat(characters[code].variants[variant].mods.map(hash => Object.assign({
          hash,
          variant
        }, characters[code])))
        return acc
      }, []))
      return acc
    }, [])
    : Object.keys(characters).reduce((acc, code) => {
      acc.push(characters[code])
      return acc
    }, [])
  const setQueryParam = params => {
    const newParams = Object.assign({}, query, params)
    Object.keys(params).forEach(param => {
      if(!params[param]) delete newParams[param]
    })
    history.push(location.pathname + '?' + queryString.stringify(newParams))
  }
  if(filter) {
    filtered = filtered.filter(({code, name, variants, variant}) =>
      (code + ' ' + (variants[variant] || {}).title + ' ' + name).toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) > -1
    )
  }
  if(stars) {
    filtered = filtered.filter(({starLevel}) => starLevel == parseInt(stars))
  }
  if(type != 'all') {
    filtered = filtered.filter(({code}) => code.match(new RegExp('^' + type)))
  }
  switch(sort) {
    case 'code':
      filtered.sort(({code, variant}, charB) => {
        const a = code + '_' + variant,
              b = charB.code + '_' + charB.variant
        return a < b ? -1 : a < b ? 1 : 0
      })
      break
    case 'added':
      break
  }
  if(order == 'desc') filtered.reverse()
  const numPerPage = perPage == 'all' ? filtered.length : parseInt(perPage)
  return (
    <>
      <h1>Destiny Child Mods Archive</h1>
      <p>All PCK files have been converted to universal and should work in both Global and KR/JP. To download, click on a mod image to launch the Live2d preview, then on the download icon in the top right. Instructions on installing mods can be found <a href="https://wiki.anime-sharing.com/hgames/index.php?title=Destiny_Child/Modding" taget="_blank">here</a> or on <a href="http://letmegooglethat.com/?q=destiny+child+how+to+install+mods" target="_blank">Google</a>. There's also a <a href="https://discord.gg/2vew9te" target="_blank">Discord community</a>.</p>
      <p>
        Filter characters:{' '}
        <input onKeyUp={e => setFilter(e.target.value)} />
        {' '}
        <select onChange={e => setQueryParam({stars: e.target.value})} value={stars}>
          <option value="">All star levels</option>
          <option value="1">1 star</option>
          <option value="2">2 star</option>
          <option value="3">3 star</option>
          <option value="4">4 star</option>
          <option value="5">5 star</option>
        </select>
        {' '}
        <select onChange={({target: {value}}) => setQueryParam({type: value == 'c' ? false : value})} defaultValue={type}>
          <option value="all">All Types</option>
          <option value="c">Childs</option>
          <option value="m">Monsters</option>
          <option value="sc">Spa Childs</option>
          <option value="sm">Spa Monsters</option>
          <option value="v">Other</option>
        </select>
      </p>
      <p>Show{' '}
        <select onChange={({target: {value}}) => setQueryParam({perPage: value == '20' ? false : value})} defaultValue={perPage}>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="all">all</option>
        </select>
        {' '}
        <select onChange={({target: {value}}) => setQueryParam({view: value == 'characters' ? false : value})} defaultValue={view}>
          <option value="characters">Characters</option>
          <option value="mods">Mods</option>
        </select>
        {' '}{perPage != 'all' ? 'per page' : ''}
        {' '}sort by{' '}
        <select onChange={({target: {value}}) => setQueryParam({sort: value == 'code' ? false : value})} defaultValue={sort}>
          <option value="code">Character Code</option>
          <option value="added">added</option>
        </select>
        {' '}
        <select onChange={({target: {value}}) => setQueryParam({order: value == 'asc' ? false : value})} defaultValue={order}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </p>
      {view == 'characters'
        ? filtered.slice(0, numPerPage).map(character => (
          <CharacterPreview key={character.code} character={character} />
        ))
        : filtered.slice(0, numPerPage).map(({code, variant, hash}) =>
          <ModPreview {...{character: characters[code], variant, hash, key: hash}} />
        )
      }
    </>
  )
}

export default Home
