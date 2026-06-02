import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { UserCard } from './UserCard'
import type { User } from '../../types/user'

const user: User = {
  id: 1,
  name: 'John Doe',
  username: 'john',
}

afterEach(() => {
  cleanup()
})

describe('UserCard', () => {
  it('renders user information', () => {
    render(<UserCard user={user} selected={false} onSelect={vi.fn()} />)

    expect(screen.getByText('John Doe')).toBeVisible()
    expect(screen.getByText('@john')).toBeVisible()
  })

  it('renders accessible action label', () => {
    render(<UserCard user={user} selected={false} onSelect={vi.fn()} />)

    expect(
      screen.getByRole('button', {
        name: 'Show TODOs for John Doe',
      }),
    ).toBeVisible()
  })

  it('calls onSelect when button is clicked', () => {
    const onSelect = vi.fn()

    render(<UserCard user={user} selected={false} onSelect={onSelect} />)

    fireEvent.click(
      screen.getByRole('button', {
        name: 'Show TODOs for John Doe',
      }),
    )

    expect(onSelect).toHaveBeenCalledWith(1)
  })
})
