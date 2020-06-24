import React, {useState} from 'react';
import CharacterPreview from './CharacterPreview'
import characters from './data/characters.json'
import useQuery from './use-query'
import {useHistory, useLocation, Link} from "react-router-dom"
import queryString from 'query-string'
import ModPreview from './ModPreview';

function Home() {
  const query = useQuery(),
        location = useLocation(),
        history = useHistory(),
        {
          stars,
          type = 'c',
          perPage = '5',
          view = 'characters',
          sort = 'code',
          order = 'asc',
          page = '0'
        } = query,
        [filter, setFilter] = useState(''),
        codes = Object.keys(characters).sort()
  let filtered = view === 'mods'
    ? codes.reduce((acc, code) => {
      acc = acc.concat(Object.keys(characters[code].variants).reduce((acc, variant) => {
        acc = acc.concat(characters[code].variants[variant].mods.map(mod => Object.assign({}, characters[code], mod, {variant})))
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
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
  }
  if(filter) {
    filtered = filtered.filter(({code, name, variants, variant}) =>
      (code + ' ' + (variants[variant] || {}).title + ' ' + name).toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) > -1
    )
  }
  if(stars) {
    filtered = filtered.filter(({starLevel}) => starLevel === parseInt(stars))
  }
  if(type !== 'all') {
    filtered = filtered.filter(({code}) => code.match(new RegExp('^' + type)))
  }
  if(view === 'characters' || sort === 'code') {
    filtered.sort(({code, variant}, charB) => {
      const a = code + '_' + variant,
            b = charB.code + '_' + charB.variant
      return a < b ? -1 : a < b ? 1 : 0
    })
  }
  if(sort === 'added') {
    filtered.sort((a, b) => a.created > b.created ? -1 : a.created > b.created ? 1 : 0)
  }
  if(order === 'desc') filtered.reverse()
  const numPerPage = perPage === 'all' ? filtered.length : parseInt(perPage),
        pageNum = page ? parseInt(page) : 0,
        maxPage = Math.floor(filtered.length / numPerPage),
        PageSummary = () => (
          <p style={{maxWidth: '100%'}}>
            Page {pageNum + 1} of {Math.ceil(filtered.length / numPerPage)}{' - '}
            {pageNum !== 0 && <a href="#" onClick={() => setQueryParam({page: pageNum - 1})}>Previous</a>}
            {pageNum === 0 && 'Previous'}
            {' / '}
            {pageNum !== maxPage && <a href="#" onClick={() => setQueryParam({page: pageNum + 1})}>Next</a>}
          </p>
        )
  return (
    <>
      <h1>Destiny Child Mods Archive</h1>
      <p>All PCK files have been converted to universal and should work in both Global and KR/JP. To download, click on a mod image to launch the Live2d preview, then on the download icon in the top right. Instructions on installing mods can be found <a href="https://wiki.anime-sharing.com/hgames/index.php?title=Destiny_Child/Modding" taget="_blank">here</a> or on <a href="http://letmegooglethat.com/?q=destiny+child+how+to+install+mods" target="_blank" rel="noopener noreferrer" >Google</a>. There's also a <a href="https://discord.gg/2vew9te" target="_blank" rel="noopener noreferrer" >Discord community</a>. The <a href="#credits">credits</a> are at the bottom.</p>
      <p>
        {(view !== 'characters')
          ? <a onClick={() => setQueryParam({view: 'characters', pageNum: 0, perPage: 5, sort: 'code', order: false})}>
            Mods by Character
          </a>
          : <span style={{fontWeight: 'bold'}}>Mods by Character</span>
        }
        {' | '}
        {(view !== 'mods' || sort !== 'added' || order !== 'desc')
          ? <a style={{marginRight: '1em'}} onClick={() => setQueryParam({view: 'mods', pageNum: 0, perPage: 20, sort: 'added', order: 'desc'})}>
            Latest Mods
          </a>
          : <span style={{fontWeight: 'bold'}}>Latest Mods</span>
        }
      </p>
      <p>Show{' '}
        <select onChange={({target: {value}}) => setQueryParam({page: 0, perPage: value === '10' ? false : value})} value={perPage}>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
          <option value="100">100</option>
          <option value="all">all</option>
        </select>
        {' '}
        <select onChange={({target: {value}}) => setQueryParam({
          view: value === 'characters' ? false :
          value, page: 0,
          perPage: value === 'characters' ? 5 : 20
        })} value={view}>
          <option value="characters">Characters</option>
          <option value="mods">Mods</option>
        </select>
        {' '}{perPage !== 'all' ? 'per page' : ''}
        {' '}sorted by{' '}
        {view === 'characters'
          ? 'model code'
          : <select onChange={({target: {value}}) => setQueryParam({sort: value === 'code' ? false : value})} value={sort}>
            <option value="code">Model Code</option>
            <option value="added">Recently Added</option>
          </select>
        }
        {' '}
        <select onChange={({target: {value}}) => setQueryParam({order: value === 'asc' ? false : value})} value={order}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </p>
      <p>
        Filter:{' '}
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
        <select onChange={({target: {value}}) => setQueryParam({type: value === 'c' ? false : value})} value={type}>
          <option value="all">All Types</option>
          <option value="c">Childs</option>
          <option value="m">Monsters</option>
          <option value="sc">Spa Childs</option>
          <option value="sm">Spa Monsters</option>
          <option value="v">Other</option>
        </select>
      </p>
      <PageSummary />
      {view === 'characters'
        ? filtered.slice(pageNum * numPerPage, pageNum * numPerPage + numPerPage).map(character => (
          <CharacterPreview key={character.code} character={character} />
        ))
        : filtered.slice(pageNum * numPerPage, pageNum * numPerPage + numPerPage).map(({code, variant, hash}) =>
          <ModPreview {...{character: characters[code], variant, hash, key: hash}} />
        )
      }
      <PageSummary />
      <p>
        <a href="#" onClick={() => setQueryParam({page: 0})}>First</a>{' '}
        {new Array(maxPage).fill(1).map((_, i) => i == pageNum
          ? <span style={{marginRight: '.25em'}}>{i + 1}</span>
          : <><a href="#" onClick={() => setQueryParam({page: i})} style={{marginRight: '.25em'}}>{i + 1}</a>{' '}</>
        )}{' '}
        <a href="#" onClick={() => setQueryParam({page: maxPage})}>Last</a>
      </p>
    </>
  )
}

export default Home
