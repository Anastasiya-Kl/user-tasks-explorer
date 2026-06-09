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
- Typed ApiError ADT for network, HTTP, and validation failures

This keeps validation and error mapping at the application boundary.

## Functional Architecture

fp-ts is used throughout the application for domain modeling and data flow:

- Option for nullable and optional values
- Either for synchronous validation
- TaskEither for asynchronous API operations
- ReadonlyArray for immutable collection processing
- ReadonlyNonEmptyArray for validation issues

The API layer keeps failures as values until the React Query boundary.

### React Query

React Query is responsible for:

- Data fetching
- Caching
- Loading states
- Error states

The UI consumes already-processed data through custom hooks.

### Page State

The Home page uses:

- A reducer-driven HomeState model
- HomeAction events
- A TodoFilter ADT
- Pure state transitions
- Session persistence through encoding/decoding functions

State transitions are tested independently from React.

## Testing

The project includes tests for:

- API decoding and validation
- TaskEither-based data fetching
- View-model and page-state logic
- Custom hooks
- UI components

Tests focus on observable behavior rather than implementation details.

## Persistence

The following values are stored in sessionStorage:

- `selectedUserId`
- `hideCompleted`

Persistence encoding and decoding are implemented as pure functions and tested independently from browser APIs.
