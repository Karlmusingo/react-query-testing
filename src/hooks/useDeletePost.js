import * as request from '../interfaces/useRequest'
import { POSTS } from '../constants/queryKeys'

export default function useDeletePost(postId) {
  return request.useDeleteRequest(`/api/posts/${postId}`, [POSTS, postId])
}

// export default function useDeletePost() {
//   const [state, setState] = React.useReducer((_, action) => action, {
//     isIdle: true,
//   })

//   const mutate = React.useCallback(async (postId) => {
//     setState({ isLoading: true })
//     try {
//       await axios.delete(`/api/posts/${postId}`).then((res) => res.data)
//       setState({ isSuccess: true })
//     } catch (error) {
//       setState({ isError: true, error })
//     }
//   }, [])

//   return [mutate, state]
// }
