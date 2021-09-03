import * as request from '../interfaces/useRequest'
import { POSTS } from '../constants/queryKeys'

export default function useCreatePost() {
  return request.usePostRequest('/api/posts', POSTS)
}
