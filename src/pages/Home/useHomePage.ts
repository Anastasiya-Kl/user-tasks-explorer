import { useCallback, useEffect, useMemo, useState } from 'react'

import { useTodos } from '../../hooks/useTodos'
import { useUsers } from '../../hooks/useUsers'
import type { Todo } from '../../types/todo'
import type { User } from '../../types/user'

const SELECTED_USER_ID_KEY = 'selectedUserId'
const HIDE_COMPLETED_KEY = 'hideCompleted'
const EMPTY_USERS: readonly User[] = []
const EMPTY_TODOS: readonly Todo[] = []

const readSelectedUserId = (): number | null => {
  const value = sessionStorage.getItem(SELECTED_USER_ID_KEY)

  if (value == null) {
    return null
  }

  const userId = Number(value)

  return Number.isInteger(userId) ? userId : null
}

const readHideCompleted = (): boolean =>
  sessionStorage.getItem(HIDE_COMPLETED_KEY) === 'true'

export const useHomePage = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(
    readSelectedUserId,
  )
  const [hideCompleted, setHideCompleted] = useState(readHideCompleted)

  const usersQuery = useUsers()
  const todosQuery = useTodos(selectedUserId)

  const users = usersQuery.data ?? EMPTY_USERS
  const todos = todosQuery.data ?? EMPTY_TODOS

  const filteredTodos = useMemo(
    () => (hideCompleted ? todos.filter((todo) => !todo.completed) : todos),
    [hideCompleted, todos],
  )

  const selectUser = useCallback((userId: number) => {
    setSelectedUserId(userId)
    setHideCompleted(false)
  }, [])

  useEffect(() => {
    if (selectedUserId == null) {
      sessionStorage.removeItem(SELECTED_USER_ID_KEY)
      return
    }

    sessionStorage.setItem(SELECTED_USER_ID_KEY, String(selectedUserId))
  }, [selectedUserId])

  useEffect(() => {
    sessionStorage.setItem(HIDE_COMPLETED_KEY, String(hideCompleted))
  }, [hideCompleted])

  const toggleHideCompleted = useCallback(() => {
    setHideCompleted((currentValue) => !currentValue)
  }, [])

  return {
    users,
    todos,
    filteredTodos,
    selectedUserId,
    hideCompleted,
    selectUser,
    toggleHideCompleted,
    isUsersLoading: usersQuery.isLoading,
    isTodosLoading: todosQuery.isLoading,
    isLoading: usersQuery.isLoading || todosQuery.isLoading,
    usersError: usersQuery.error,
    todosError: todosQuery.error,
    error: usersQuery.error ?? todosQuery.error,
  }
}
