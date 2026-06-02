import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useTodos } from '../../hooks/useTodos'
import { useUsers } from '../../hooks/useUsers'
import type { Todo } from '../../types/todo'
import type { User } from '../../types/user'
import { useHomePage } from './useHomePage'

vi.mock('../../hooks/useUsers')
vi.mock('../../hooks/useTodos')

const users: User[] = [
  {
    id: 1,
    name: 'John Doe',
    username: 'john',
  },
  {
    id: 2,
    name: 'Jane Smith',
    username: 'jane',
  },
]

const todos: Todo[] = [
  {
    id: 1,
    userId: 1,
    title: 'Completed task',
    completed: true,
  },
  {
    id: 2,
    userId: 1,
    title: 'Open task',
    completed: false,
  },
]

const mockUseUsers = vi.mocked(useUsers)
const mockUseTodos = vi.mocked(useTodos)

const mockSuccessfulQueries = () => {
  mockUseUsers.mockReturnValue({
    data: users,
    isLoading: false,
    error: null,
  } as ReturnType<typeof useUsers>)

  mockUseTodos.mockReturnValue({
    data: todos,
    isLoading: false,
    error: null,
  } as ReturnType<typeof useTodos>)
}

describe('useHomePage', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.clearAllMocks()
    mockSuccessfulQueries()
  })

  it('returns all todos when hideCompleted is false', () => {
    const { result } = renderHook(() => useHomePage())

    expect(result.current.hideCompleted).toBe(false)
    expect(result.current.filteredTodos).toEqual(todos)
  })

  it('filters completed todos when hideCompleted is enabled', () => {
    const { result } = renderHook(() => useHomePage())

    act(() => {
      result.current.toggleHideCompleted()
    })

    expect(result.current.hideCompleted).toBe(true)
    expect(result.current.filteredTodos).toEqual([todos[1]])
  })

  it('resets hideCompleted when a new user is selected', () => {
    const { result } = renderHook(() => useHomePage())

    act(() => {
      result.current.toggleHideCompleted()
    })

    expect(result.current.hideCompleted).toBe(true)

    act(() => {
      result.current.selectUser(2)
    })

    expect(result.current.selectedUserId).toBe(2)
    expect(result.current.hideCompleted).toBe(false)
  })

  it('initializes selectedUserId from sessionStorage', () => {
    sessionStorage.setItem('selectedUserId', '2')

    const { result } = renderHook(() => useHomePage())

    expect(result.current.selectedUserId).toBe(2)
  })

  it('initializes hideCompleted from sessionStorage', () => {
    sessionStorage.setItem('hideCompleted', 'true')

    const { result } = renderHook(() => useHomePage())

    expect(result.current.hideCompleted).toBe(true)
  })

  it('persists selectedUserId when a user is selected', () => {
    const { result } = renderHook(() => useHomePage())

    act(() => {
      result.current.selectUser(2)
    })

    expect(sessionStorage.getItem('selectedUserId')).toBe('2')
  })

  it('persists hideCompleted when toggled', () => {
    const { result } = renderHook(() => useHomePage())

    act(() => {
      result.current.toggleHideCompleted()
    })

    expect(sessionStorage.getItem('hideCompleted')).toBe('true')
  })

  it('persists hideCompleted reset when a new user is selected', () => {
    const { result } = renderHook(() => useHomePage())

    expect(result.current.hideCompleted).toBe(false)

    act(() => {
      result.current.toggleHideCompleted()
    })

    expect(result.current.hideCompleted).toBe(true)
    expect(sessionStorage.getItem('hideCompleted')).toBe('true')

    act(() => {
      result.current.selectUser(2)
    })

    expect(result.current.hideCompleted).toBe(false)
    expect(sessionStorage.getItem('hideCompleted')).toBe('false')
  })
})
