import useGet from '../interfaces/useRequest'
import { POSTS } from '../constants/queryKeys'

export default function usePost(postId) {
  return useGet(`/api/posts/${postId}`, [POSTS, postId])
}
