import * as TE from 'fp-ts/TaskEither'
import { identity, pipe } from 'fp-ts/function'

export const taskEitherToPromise = <E, A>(
  taskEither: TE.TaskEither<E, A>,
): Promise<A> =>
  pipe(
    taskEither,
    TE.match(
      (error): A => {
        throw error
      },
      identity,
    ),
  )()
