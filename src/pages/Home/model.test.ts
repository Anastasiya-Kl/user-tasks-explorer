import * as O from 'fp-ts/Option'
import { describe, expect, it } from 'vitest'

import type { Todo } from '../../types/todo'
import type { User } from '../../types/user'
import {
  applyTodoFilter,
  createHomeViewModel,
  decodeSelectedUserId,
  decodeTodoFilter,
  encodeSelectedUserId,
  encodeTodoFilter,
  findSelectedUser,
  hideCompleted,
  initialHomeState,
  isSelectedUser,
  showAll,
  transition,
} from './model'

const john: User = {
  id: 1,
  name: 'John Doe',
  username: 'john',
}

const jane: User = {
  id: 2,
  name: 'Jane Smith',
  username: 'jane',
}

const users: ReadonlyArray<User> = [john, jane]

const completedTodo: Todo = {
  id: 1,
  userId: 1,
  title: 'Completed task',
  completed: true,
}

const openTodo: Todo = {
  id: 2,
  userId: 1,
  title: 'Open task',
  completed: false,
}

const todos: ReadonlyArray<Todo> = [completedTodo, openTodo]

const defaultViewModelInput = {
  selectedUserId: O.some(1),
  isUsersLoading: false,
  isTodosLoading: false,
  usersError: O.none,
  todosError: O.none,
  users,
  todos,
  filteredTodos: todos,
}

describe('Home model', () => {
  it('decodes selected user ids from persisted values', () => {
    expect(decodeSelectedUserId('2')).toEqual(O.some(2))
    expect(decodeSelectedUserId('invalid')).toEqual(O.none)
    expect(decodeSelectedUserId(null)).toEqual(O.none)
  })

  it('encodes selected user ids for persistence', () => {
    expect(encodeSelectedUserId(O.some(2))).toEqual(O.some('2'))
    expect(encodeSelectedUserId(O.none)).toEqual(O.none)
  })

  it('decodes persisted todo filters', () => {
    expect(decodeTodoFilter('true')).toEqual(hideCompleted)
    expect(decodeTodoFilter('false')).toEqual(showAll)
    expect(decodeTodoFilter(null)).toEqual(showAll)
  })

  it('encodes todo filters for persistence', () => {
    expect(encodeTodoFilter(hideCompleted)).toBe('true')
    expect(encodeTodoFilter(showAll)).toBe('false')
  })

  it('applies the selected todo filter', () => {
    expect(applyTodoFilter(showAll)(todos)).toBe(todos)
    expect(applyTodoFilter(hideCompleted)(todos)).toEqual([openTodo])
  })

  it('matches users against the selected user id', () => {
    const isSelected = isSelectedUser(O.some(2))

    expect(isSelected(john)).toBe(false)
    expect(isSelected(jane)).toBe(true)
  })

  it('finds the selected user', () => {
    expect(findSelectedUser(O.some(2))(users)).toEqual(O.some(jane))
    expect(findSelectedUser(O.none)(users)).toEqual(O.none)
  })

  it('resets the filter when a different user is selected', () => {
    const state = transition({
      selectedUserId: O.some(1),
      todoFilter: hideCompleted,
    })({
      type: 'UserSelected',
      userId: 2,
    })

    expect(state.selectedUserId).toEqual(O.some(2))
    expect(state.todoFilter).toEqual(showAll)
  })

  it('preserves the filter when the same user is selected', () => {
    const currentState = {
      selectedUserId: O.some(1),
      todoFilter: hideCompleted,
    }

    const state = transition(currentState)({
      type: 'UserSelected',
      userId: 1,
    })

    expect(state).toBe(currentState)
    expect(state.todoFilter).toEqual(hideCompleted)
  })

  it('resets the filter when a user is selected from no selection', () => {
    const state = transition({
      selectedUserId: O.none,
      todoFilter: hideCompleted,
    })({
      type: 'UserSelected',
      userId: 1,
    })

    expect(state.selectedUserId).toEqual(O.some(1))
    expect(state.todoFilter).toEqual(showAll)
  })

  it('toggles the filter without changing the selected user', () => {
    const state = transition({
      selectedUserId: O.some(1),
      todoFilter: showAll,
    })({
      type: 'FilterToggled',
    })

    expect(state.selectedUserId).toEqual(O.some(1))
    expect(state.todoFilter).toEqual(hideCompleted)
  })

  it('applies multiple transitions', () => {
    const selectedState = transition(initialHomeState)({
      type: 'UserSelected',
      userId: 1,
    })
    const hiddenState = transition(selectedState)({
      type: 'FilterToggled',
    })
    const nextUserState = transition(hiddenState)({
      type: 'UserSelected',
      userId: 2,
    })

    expect(nextUserState).toEqual({
      selectedUserId: O.some(2),
      todoFilter: showAll,
    })
  })

  it('shows the users empty state when no users are available', () => {
    const viewModel = createHomeViewModel({
      ...defaultViewModelInput,
      users: [],
    })

    expect(viewModel.showUsersEmptyState).toBe(true)
  })

  it('shows a users error instead of the users empty state', () => {
    const viewModel = createHomeViewModel({
      ...defaultViewModelInput,
      users: [],
      usersError: O.some('Failed to load users'),
    })

    expect(viewModel.showUsersEmptyState).toBe(false)
  })

  it('prompts for user selection when no user is selected', () => {
    const viewModel = createHomeViewModel({
      ...defaultViewModelInput,
      selectedUserId: O.none,
    })

    expect(viewModel.hasSelectedUser).toBe(false)
    expect(viewModel.showTodoList).toBe(false)
  })

  it('shows the todos empty state when the selected user has no todos', () => {
    const viewModel = createHomeViewModel({
      ...defaultViewModelInput,
      todos: [],
      filteredTodos: [],
    })

    expect(viewModel.showTodosEmptyState).toBe(true)
    expect(viewModel.showFilteredEmptyState).toBe(false)
    expect(viewModel.showTodoList).toBe(false)
  })

  it('shows the filtered empty state when all todos are filtered out', () => {
    const viewModel = createHomeViewModel({
      ...defaultViewModelInput,
      filteredTodos: [],
    })

    expect(viewModel.showTodosEmptyState).toBe(false)
    expect(viewModel.showFilteredEmptyState).toBe(true)
    expect(viewModel.showTodoList).toBe(false)
  })

  it('shows the todo list when filtered todos are available', () => {
    const viewModel = createHomeViewModel(defaultViewModelInput)

    expect(viewModel.showTodosEmptyState).toBe(false)
    expect(viewModel.showFilteredEmptyState).toBe(false)
    expect(viewModel.showTodoList).toBe(true)
  })
})
