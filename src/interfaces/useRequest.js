import React from 'react'
import axios from 'axios'
// import { useQuery, queryCache } from 'react-query'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { POSTS } from '../constants/queryKeys'

export const useGetRequest = (url, storeKey) =>
  useQuery(storeKey, () => axios.get(url).then((res) => res.data))

// ==========================================

export const usePostRequest = (
  url,
  STORE_KEY, // store key to update
  options = {}
) => {
  const queryClient = useQueryClient()
  const { onMutate, onError, ...rest } = options

  return useMutation(
    (values) => axios.post(url, values).then((res) => res.data),
    {
      onMutate:
        typeof onMutate === 'function'
          ? onMutate
          : async (newRecord) => {
              await queryClient.cancelQueries(STORE_KEY)
              const oldData = queryClient.getQueryData(STORE_KEY)

              if (oldData) {
                queryClient.setQueryData(STORE_KEY, (old) => [
                  ...old,
                  newRecord,
                ])
              } else {
                queryClient.setQueryData(STORE_KEY, [oldData])
              }
              return { oldData }
            },
      onError:
        typeof onError === 'function'
          ? onError
          : (error, _newPost, context) => {
              queryClient.setQueryData(STORE_KEY, context.oldData)
            },
      onSettled: () => {
        queryClient.invalidateQueries(STORE_KEY)
      },
      ...rest,
    }
  )
}

export const useUpdateRequest = (url, STORE_KEY, options = {}) => {
  const queryClient = useQueryClient()
  const { onMutate, onSuccess, ...rest } = options

  return useMutation((data) => axios.patch(url, data).then((res) => res.data), {
    onMutate:
      typeof onMutate === 'function'
        ? onMutate
        : (newData) => {
            // update the data
            queryClient.setQueryData(STORE_KEY, newData)
          },
    onSuccess:
      typeof onSuccess === 'function'
        ? onSuccess
        : (newData) => {
            queryClient.setQueryData(STORE_KEY, newData)

            // just for example
            if (queryClient.getQueryData('POSTS')) {
              queryClient.setQueryData('POSTS', (old) => {
                return old.map((d) => {
                  if (d.id === newData.id) {
                    return newData
                  }
                  return d
                })
              })
            } else {
              queryClient.setQueryData('POSTS', [newData])
              queryClient.invalidateQueries('POSTS')
            }
          },
    onSettled: () => {
      queryClient.invalidateQueries(STORE_KEY)
    },
    ...rest,
  })
}

export const useDeleteRequest = (url, STORE_KEY, options = {}) => {
  const queryClient = useQueryClient()
  const { onMutate, onError, onSettled } = options

  return useMutation(
    () => {
      axios.delete(url).then((res) => res.data)
    },
    {
      onMutate:
        typeof onMutate === 'function'
          ? onMutate
          : async (editedValue) => {
              await queryClient.cancelQueries(STORE_KEY)

              // just for example
              const previousValue = queryClient.getQueryData('POSTS')
              if (previousValue) {
                const updatedValue = [...previousValue]
                console.log('updatedValue.length :>> ', updatedValue.length)
                const removeDeleted = updatedValue.filter(
                  (eachValue) => eachValue.id !== editedValue.id
                )
                console.log('removeDeleted.length :>> ', removeDeleted.length)
                queryClient.setQueryData('POSTS', removeDeleted)
              }

              return () => queryClient.setQueryData('POSTS', previousValue)
            },
      onError:
        typeof onError === 'function'
          ? onError
          : (error, editedValue, context) => {
              queryClient.setQueryData(STORE_KEY, context.previousValue)
            },
      onSettled:
        typeof onSettled === 'function'
          ? onSettled
          : () => {
              queryClient.removeQueries(STORE_KEY, { exact: true })
            },
      // ...rest,
    }
  )
}

export default useGetRequest
