import * as request from '../interfaces/useRequest'
import { POSTS } from '../constants/queryKeys'

export default function useSavePost(postId) {
  return request.useUpdateRequest(`/api/posts/${postId}`, [POSTS, postId])
}
