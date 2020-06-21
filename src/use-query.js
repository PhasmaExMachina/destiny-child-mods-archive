import {useLocation} from "react-router-dom"
import queryString from 'query-string'

export default function() {
  return queryString.parse(useLocation().search)
}