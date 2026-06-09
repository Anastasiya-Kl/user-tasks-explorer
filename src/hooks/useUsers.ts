import { useQuery } from '@tanstack/react-query'
import { pipe } from 'fp-ts/function'

import { getUsers } from '../api/users'
import type { ApiError } from '../api/errors'
import type { User } from '../types/user'
import { taskEitherToPromise } from '../utils/taskEither'

export const useUsers = () =>
  useQuery<ReadonlyArray<User>, ApiError>({
    queryKey: ['users'],
    staleTime: 5 * 60 * 1000,
    queryFn: () => pipe(getUsers(), taskEitherToPromise),
  })
