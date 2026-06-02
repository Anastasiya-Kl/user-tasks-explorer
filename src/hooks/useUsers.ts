import { useQuery } from '@tanstack/react-query'
import * as E from 'fp-ts/Either'

import { getUsers } from '../api/users'
import type { ApiError } from '../api/errors'
import type { User } from '../types/user'

export const useUsers = () =>
  useQuery<User[], ApiError>({
    queryKey: ['users'],
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const result = await getUsers()()

      if (E.isLeft(result)) {
        throw result.left
      }

      return result.right
    },
  })
