import * as request from '../interfaces/useRequest'
import { POSTS } from '../constants/queryKeys'

export default function useDeletePost(postId) {
  return request.useDeleteRequest(`/api/posts/${postId}`, [POSTS, postId])
}
