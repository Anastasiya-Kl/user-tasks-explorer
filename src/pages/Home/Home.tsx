import {
  TodoSkeleton,
  UserCardSkeleton,
} from '../../components/Skeleton/Skeleton'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'
import { Todo } from '../../components/Todo/Todo'
import { UserCard } from '../../components/UserCard/UserCard'
import { getApiErrorMessage } from '../../api/errors'
import {
  findSelectedUser,
  isSelectedUser,
} from './model'
import { useHomePage } from './useHomePage'
import {
  CheckboxInput,
  CheckboxLabel,
  Container,
  Content,
  ErrorMessage,
  Header,
  MainSection,
  Page,
  PageSubtitle,
  PageTitle,
  SectionHeader,
  SectionTitle,
  SelectedUserName,
  SidebarSection,
  StateMessage,
  TitleGroup,
  TodoList,
  UsersList,
} from './styles'

const USER_SKELETON_COUNT = 5
const TODO_SKELETON_COUNT = 6

export function Home() {
  const {
    users,
    filteredTodos,
    selectedUserId,
    hideCompleted,
    selectUser,
    toggleHideCompleted,
    isUsersLoading,
    usersError,
    todosError,
    viewModel,
  } = useHomePage()

  const selectedUser = pipe(users, findSelectedUser(selectedUserId))
  const userIsSelectedById = isSelectedUser(selectedUserId)

  return (
    <Page>
      <Container>
        <Header>
          <PageTitle>User Tasks</PageTitle>
          <PageSubtitle>
            Browse users and explore their assigned tasks.
          </PageSubtitle>
        </Header>

        <Content>
          <SidebarSection aria-labelledby="users-heading">
            <SectionHeader>
              <SectionTitle id="users-heading">Users</SectionTitle>
            </SectionHeader>

            {isUsersLoading && (
              <UsersList>
                {RA.makeBy(USER_SKELETON_COUNT, (index) => (
                  <UserCardSkeleton key={index} />
                ))}
              </UsersList>
            )}

            {pipe(
              usersError,
              O.match(
                () => null,
                (error) => (
                  <ErrorMessage>{getApiErrorMessage(error)}</ErrorMessage>
                ),
              ),
            )}

            {viewModel.showUsersEmptyState && (
              <StateMessage>No users available.</StateMessage>
            )}

            {RA.isNonEmpty(users) && (
              <UsersList>
                {pipe(
                  users,
                  RA.map((user) => (
                    <UserCard
                      key={user.id}
                      user={user}
                      selected={userIsSelectedById(user)}
                      onSelect={selectUser}
                    />
                  )),
                )}
              </UsersList>
            )}
          </SidebarSection>

          <MainSection aria-labelledby="todos-heading">
            <SectionHeader>
              <TitleGroup>
                <SectionTitle id="todos-heading">Todos</SectionTitle>
                {pipe(
                  selectedUser,
                  O.match(
                    () => null,
                    (user) => (
                      <SelectedUserName>{user.name}</SelectedUserName>
                    ),
                  ),
                )}
              </TitleGroup>

              {viewModel.hasSelectedUser && (
                <CheckboxLabel>
                  <CheckboxInput
                    type="checkbox"
                    checked={hideCompleted}
                    onChange={toggleHideCompleted}
                  />
                  Hide completed
                </CheckboxLabel>
              )}
            </SectionHeader>

            {!viewModel.hasSelectedUser && (
              <StateMessage>Select a user to view todos.</StateMessage>
            )}

            {viewModel.showTodosLoading && (
              <TodoList>
                {RA.makeBy(TODO_SKELETON_COUNT, (index) => (
                  <TodoSkeleton key={index} />
                ))}
              </TodoList>
            )}

            {viewModel.showTodosError &&
              pipe(
                todosError,
                O.match(
                  () => null,
                  (error) => (
                    <ErrorMessage>{getApiErrorMessage(error)}</ErrorMessage>
                  ),
                ),
              )}

            {viewModel.showTodosEmptyState && (
              <StateMessage>No todos available.</StateMessage>
            )}

            {viewModel.showFilteredEmptyState && (
              <StateMessage>No todos after filtering.</StateMessage>
            )}

            {viewModel.showTodoList && (
              <TodoList>
                {pipe(
                  filteredTodos,
                  RA.map((todo) => <Todo key={todo.id} todo={todo} />),
                )}
              </TodoList>
            )}
          </MainSection>
        </Content>
      </Container>
    </Page>
  )
}
