# User Tasks Explorer

A React + TypeScript application that allows browsing users and viewing their TODO items from the JSONPlaceholder API.

## Features

- Fetches and displays users as cards
- Loads TODOs for the selected user
- Highlights the currently selected user
- Supports hiding completed TODOs
- Resets the filter when a different user is selected
- Persists selected user and filter state across page refreshes using sessionStorage
- Handles loading, error, and empty states
- Responsive layout
- Runtime API validation using Zod
- Functional error handling in the API layer using fp-ts
- Unit tests for page logic and UI components

## Tech Stack

- React
- TypeScript
- React Router v6
- TanStack React Query
- fp-ts
- Zod
- styled-components
- Vitest
- React Testing Library

## Running the Project

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Run linting:
```bash
npm run lint
```

Run tests:
```bash
npm test
```

## Architecture Notes

### API Layer

The API layer uses:

- Zod for runtime validation
- fp-ts TaskEither for explicit success/error modeling
- Typed ApiError models for network and validation failures

This keeps validation and error mapping at the application boundary.

### React Query

React Query is responsible for:

- Data fetching
- Caching
- Loading states
- Error states

The UI consumes already-processed data through custom hooks.

### Page State

The Home page uses a dedicated `useHomePage` hook that manages:

- Selected user
- Filter state
- Session persistence
- Derived filtered TODOs

This keeps UI components focused on rendering.

## Testing

The project includes:

- Hook tests for business logic and persistence behavior
- Component tests for rendering and user interaction

Tests focus on behavior rather than implementation details or styling.

## Persistence

The following values are stored in sessionStorage:

- `selectedUserId`
- `hideCompleted`

This preserves the page state across browser refreshes while keeping the implementation simple.
