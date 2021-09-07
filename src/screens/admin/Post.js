import React from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'

//

import usePost from '../../hooks/usePost'
import useSavePost from '../../hooks/useSavePost'
import useDeletePost from '../../hooks/useDeletePost'

import PostForm from '../../components/PostForm'
import { Loader } from '../../components/styled'

export default function Post() {
  const { postId } = useParams()
  const navigate = useNavigate()

  const postQuery = usePost(postId)
  const useSave = useSavePost(postId)
  const useDelete = useDeletePost(postId)

  console.log('useDelete :>> ', useDelete)

  const onSubmit = async (values) => {
    await useSave.mutate(values)
  }

  const onDelete = async () => {
    await useDelete.mutate()
    navigate('/admin')
  }

  return (
    <>
      {postQuery.isLoading ? (
        <span>
          <Loader /> Loading...
        </span>
      ) : (
        <div>
          <h3>{postQuery.data.title}</h3>
          <p>
            <Link to={`/blog/${postQuery.data.id}`}>View Post</Link>
          </p>
          <PostForm
            initialValues={postQuery.data}
            onSubmit={onSubmit}
            submitText={
              // 'Save Post'
              useSave.isLoading
                ? 'Saving...'
                : useSave.isError
                ? 'Error!'
                : useSave.isSuccess
                ? 'Saved!'
                : 'Save Post'
            }
          />

          <p>
            <button onClick={onDelete}>
              {useDelete.isLoading
                ? 'Deleting...'
                : useDelete.isError
                ? 'Error!'
                : useDelete.isSuccess
                ? 'Deleted!'
                : 'Delete Post'}
            </button>
          </p>
        </div>
      )}
    </>
  )
}
