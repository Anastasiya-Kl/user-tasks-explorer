import { useCallback, useEffect, useMemo, useReducer } from 'react'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/function'

import { useTodos } from '../../hooks/useTodos'
import { useUsers } from '../../hooks/useUsers'
import type { Todo } from '../../types/todo'
import type { User } from '../../types/user'
import {
  applyTodoFilter,
  createHomeViewModel,
  decodeSelectedUserId,
  decodeTodoFilter,
  encodeSelectedUserId,
  encodeTodoFilter,
  isHideCompleted,
  transition,
  type HomeAction,
  type HomeState,
} from './model'

const SELECTED_USER_ID_KEY = 'selectedUserId'
const HIDE_COMPLETED_KEY = 'hideCompleted'
const EMPTY_USERS: ReadonlyArray<User> = []
const EMPTY_TODOS: ReadonlyArray<Todo> = []

const initializeHomeState = (): HomeState => ({
  selectedUserId: decodeSelectedUserId(
    sessionStorage.getItem(SELECTED_USER_ID_KEY),
  ),
  todoFilter: decodeTodoFilter(sessionStorage.getItem(HIDE_COMPLETED_KEY)),
})

const homeReducer = (state: HomeState, action: HomeAction): HomeState =>
  transition(state)(action)

export const useHomePage = () => {
  const [state, dispatch] = useReducer(
    homeReducer,
    undefined,
    initializeHomeState,
  )

  const usersQuery = useUsers()
  const todosQuery = useTodos(state.selectedUserId)

  const users = pipe(
    usersQuery.data,
    O.fromNullable,
    O.getOrElse(() => EMPTY_USERS),
  )
  const todos = pipe(
    todosQuery.data,
    O.fromNullable,
    O.getOrElse(() => EMPTY_TODOS),
  )
  const usersError = O.fromNullable(usersQuery.error)
  const todosError = O.fromNullable(todosQuery.error)

  const filteredTodos = useMemo(
    () => pipe(todos, applyTodoFilter(state.todoFilter)),
    [state.todoFilter, todos],
  )

  const selectUser = useCallback((userId: number) => {
    dispatch({
      type: 'UserSelected',
      userId,
    })
  }, [])

  useEffect(() => {
    pipe(
      encodeSelectedUserId(state.selectedUserId),
      O.match(
        () => sessionStorage.removeItem(SELECTED_USER_ID_KEY),
        userId => sessionStorage.setItem(SELECTED_USER_ID_KEY, userId),
      ),
    )
  }, [state.selectedUserId])

  useEffect(() => {
    sessionStorage.setItem(
      HIDE_COMPLETED_KEY,
      encodeTodoFilter(state.todoFilter),
    )
  }, [state.todoFilter])

  const toggleHideCompleted = useCallback(() => {
    dispatch({ type: 'FilterToggled' })
  }, [])

  const viewModel = createHomeViewModel({
    selectedUserId: state.selectedUserId,
    isUsersLoading: usersQuery.isLoading,
    isTodosLoading: todosQuery.isLoading,
    usersError,
    todosError,
    users,
    todos,
    filteredTodos,
  })

  return {
    users,
    todos,
    filteredTodos,
    selectedUserId: state.selectedUserId,
    hideCompleted: isHideCompleted(state.todoFilter),
    selectUser,
    toggleHideCompleted,
    isUsersLoading: usersQuery.isLoading,
    isTodosLoading: todosQuery.isLoading,
    isLoading: usersQuery.isLoading || todosQuery.isLoading,
    usersError,
    todosError,
    viewModel,
  }
}
