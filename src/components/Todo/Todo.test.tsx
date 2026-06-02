import '@testing-library/jest-dom/vitest'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Todo } from './Todo'
import type { Todo as TodoModel } from '../../types/todo'

const incompleteTodo: TodoModel = {
  id: 1,
  userId: 1,
  title: 'Buy milk',
  completed: false,
}

afterEach(() => {
  cleanup()
})

describe('Todo', () => {
  it('renders todo title', () => {
    render(<Todo todo={incompleteTodo} />)

    expect(screen.getByText('Buy milk')).toBeVisible()
  })

  it('renders unchecked checkbox for incomplete todo', () => {
    render(<Todo todo={incompleteTodo} />)

    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('renders checked checkbox for completed todo', () => {
    render(
      <Todo
        todo={{
          ...incompleteTodo,
          completed: true,
        }}
      />,
    )

    expect(screen.getByRole('checkbox')).toBeChecked()
  })
})
