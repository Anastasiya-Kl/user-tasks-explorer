import * as TE from 'fp-ts/TaskEither'
import { describe, expect, it } from 'vitest'

import { taskEitherToPromise } from './taskEither'

describe('taskEitherToPromise', () => {
  it('resolves with the Right value', async () => {
    await expect(taskEitherToPromise(TE.right('users'))).resolves.toBe('users')
  })

  it('rejects with the original Left value', async () => {
    const error = { type: 'NetworkError', message: 'Failed to fetch' }

    await expect(taskEitherToPromise(TE.left(error))).rejects.toBe(error)
  })
})
