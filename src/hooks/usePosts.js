import React from 'react'
import axios from 'axios'
import { useQuery, queryCache } from 'react-query'
import * as request from '../interfaces/useRequest'
import { POSTS } from '../constants/queryKeys'

export default function usePosts() {
  const req = request.useGetRequest('/api/posts', POSTS)

  return req
}
