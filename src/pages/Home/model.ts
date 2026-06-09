import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { flow, pipe } from 'fp-ts/function'
import * as S from 'fp-ts-std/String'

import type { Todo } from '../../types/todo'
import type { User } from '../../types/user'
import { absurd } from '../../utils/absurd'

export type TodoFilter =
  | { readonly type: 'ShowAll' }
  | { readonly type: 'HideCompleted' }

export type HomeState = Readonly<{
  selectedUserId: O.Option<number>
  todoFilter: TodoFilter
}>

export type HomeAction =
  | {
      readonly type: 'UserSelected'
      readonly userId: number
    }
  | {
      readonly type: 'FilterToggled'
    }

export type HomeViewModel = Readonly<{
  hasSelectedUser: boolean
  showUsersEmptyState: boolean
  showTodosLoading: boolean
  showTodosError: boolean
  showTodosEmptyState: boolean
  showFilteredEmptyState: boolean
  showTodoList: boolean
}>

type HomeViewModelInput = Readonly<{
  selectedUserId: O.Option<number>
  isUsersLoading: boolean
  isTodosLoading: boolean
  usersError: O.Option<unknown>
  todosError: O.Option<unknown>
  users: ReadonlyArray<User>
  todos: ReadonlyArray<Todo>
  filteredTodos: ReadonlyArray<Todo>
}>

export const showAll: TodoFilter = { type: 'ShowAll' }

export const hideCompleted: TodoFilter = { type: 'HideCompleted' }

export const initialHomeState: HomeState = {
  selectedUserId: O.none,
  todoFilter: showAll,
}

const parseUserId = flow(
  Number,
  O.fromPredicate(Number.isInteger),
)

export const decodeSelectedUserId = flow(
  O.fromNullable,
  O.flatMap(parseUserId),
)

export const encodeSelectedUserId = (
  selectedUserId: O.Option<number>,
): O.Option<string> => pipe(selectedUserId, O.map(S.fromNumber))

export const hasSelectedUser = (selectedUserId: O.Option<number>): boolean =>
  O.isSome(selectedUserId)

export const isSelectedUser =
  (selectedUserId: O.Option<number>) =>
  (user: User): boolean =>
    pipe(
      selectedUserId,
      O.exists((userId) => user.id === userId),
    )

export const findSelectedUser =
  (selectedUserId: O.Option<number>) =>
  (users: ReadonlyArray<User>): O.Option<User> =>
    pipe(
      users,
      RA.findFirst(isSelectedUser(selectedUserId)),
    )

export const createHomeViewModel = ({
  selectedUserId,
  isUsersLoading,
  isTodosLoading,
  usersError,
  todosError,
  users,
  todos,
  filteredTodos,
}: HomeViewModelInput): HomeViewModel => {
  const userIsSelected = hasSelectedUser(selectedUserId)
  const hasUsersError = O.isSome(usersError)
  const hasTodosError = O.isSome(todosError)

  return {
    hasSelectedUser: userIsSelected,
    showUsersEmptyState:
      !isUsersLoading && !hasUsersError && RA.isEmpty(users),
    showTodosLoading: userIsSelected && isTodosLoading,
    showTodosError: userIsSelected && hasTodosError,
    showTodosEmptyState:
      userIsSelected &&
      !isTodosLoading &&
      !hasTodosError &&
      RA.isEmpty(todos),
    showFilteredEmptyState:
      userIsSelected &&
      !isTodosLoading &&
      !hasTodosError &&
      RA.isNonEmpty(todos) &&
      RA.isEmpty(filteredTodos),
    showTodoList: userIsSelected && RA.isNonEmpty(filteredTodos),
  }
}

export const matchTodoFilter =
  <A>(onShowAll: () => A, onHideCompleted: () => A) =>
  (filter: TodoFilter): A => {
    switch (filter.type) {
      case 'ShowAll':
        return onShowAll()
      case 'HideCompleted':
        return onHideCompleted()
      default:
        return absurd(filter)
    }
  }

export const toggleTodoFilter = matchTodoFilter<TodoFilter>(
  () => hideCompleted,
  () => showAll,
)

export const matchHomeAction =
  <A>(
    onUserSelected: (userId: number) => A,
    onFilterToggled: () => A,
  ) =>
  (action: HomeAction): A => {
    switch (action.type) {
      case 'UserSelected':
        return onUserSelected(action.userId)
      case 'FilterToggled':
        return onFilterToggled()
      default:
        return absurd(action)
    }
  }

export const transition =
  (state: HomeState) =>
  (action: HomeAction): HomeState =>
    matchHomeAction<HomeState>(
      (userId) =>
        pipe(
          state.selectedUserId,
          O.exists((selectedUserId) => selectedUserId === userId),
        )
          ? state
          : {
              selectedUserId: O.some(userId),
              todoFilter: showAll,
            },
      () => ({
        ...state,
        todoFilter: toggleTodoFilter(state.todoFilter),
      }),
    )(action)

export const isHideCompleted = matchTodoFilter(
  () => false,
  () => true,
)

export const applyTodoFilter =
  (filter: TodoFilter) =>
  (todos: ReadonlyArray<Todo>): ReadonlyArray<Todo> =>
    matchTodoFilter(
      () => todos,
      () =>
        pipe(
          todos,
          RA.filter((todo) => !todo.completed),
        ),
    )(filter)

export const decodeTodoFilter = (value: string | null): TodoFilter =>
  pipe(
    value,
    O.fromNullable,
    O.map((persistedValue) =>
      persistedValue === 'true' ? hideCompleted : showAll,
    ),
    O.getOrElse<TodoFilter>(() => showAll),
  )

export const encodeTodoFilter = flow(isHideCompleted, S.fromBool)
