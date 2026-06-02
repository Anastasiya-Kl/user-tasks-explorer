import {
  TodoSkeleton,
  UserCardSkeleton,
} from '../../components/Skeleton/Skeleton'
import { Todo } from '../../components/Todo/Todo'
import { UserCard } from '../../components/UserCard/UserCard'
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
    todos,
    filteredTodos,
    selectedUserId,
    hideCompleted,
    selectUser,
    toggleHideCompleted,
    isUsersLoading,
    isTodosLoading,
    usersError,
    todosError,
  } = useHomePage()

  const hasSelectedUser = selectedUserId != null
  const selectedUser = users.find((user) => user.id === selectedUserId)

  return (
    <Page>
       <Container>
        <Header>
        <PageTitle>User Tasks</PageTitle>
        <PageSubtitle>Browse users and explore their assigned tasks.</PageSubtitle>
      </Header>

      <Content>
        <SidebarSection aria-labelledby="users-heading">
          <SectionHeader>
            <SectionTitle id="users-heading">Users</SectionTitle>
          </SectionHeader>

          {isUsersLoading && (
            <UsersList>
              {Array.from({ length: USER_SKELETON_COUNT }, (_, index) => (
                <UserCardSkeleton key={index} />
              ))}
            </UsersList>
          )}

          {usersError != null && (
            <ErrorMessage>{usersError.message}</ErrorMessage>
          )}

          {!isUsersLoading && usersError == null && users.length === 0 && (
            <StateMessage>No users available.</StateMessage>
          )}

          {users.length > 0 && (
            <UsersList>
              {users.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  selected={user.id === selectedUserId}
                  onSelect={selectUser}
                />
              ))}
            </UsersList>
          )}
        </SidebarSection>

        <MainSection aria-labelledby="todos-heading">
          <SectionHeader>
            <TitleGroup>
              <SectionTitle id="todos-heading">Todos</SectionTitle>
              {selectedUser != null && (
                <SelectedUserName>{selectedUser.name}</SelectedUserName>
              )}
            </TitleGroup>

            {hasSelectedUser && (
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

          {!hasSelectedUser && (
            <StateMessage>Select a user to view todos.</StateMessage>
          )}

          {hasSelectedUser && isTodosLoading && (
            <TodoList>
              {Array.from({ length: TODO_SKELETON_COUNT }, (_, index) => (
                <TodoSkeleton key={index} />
              ))}
            </TodoList>
          )}

          {hasSelectedUser && todosError != null && (
            <ErrorMessage>{todosError.message}</ErrorMessage>
          )}

          {hasSelectedUser &&
            !isTodosLoading &&
            todosError == null &&
            todos.length === 0 && (
              <StateMessage>No todos available.</StateMessage>
            )}

          {hasSelectedUser &&
            !isTodosLoading &&
            todosError == null &&
            todos.length > 0 &&
            filteredTodos.length === 0 && (
              <StateMessage>No todos after filtering.</StateMessage>
            )}

          {hasSelectedUser && filteredTodos.length > 0 && (
            <TodoList>
              {filteredTodos.map((todo) => (
                <Todo key={todo.id} todo={todo} />
              ))}
            </TodoList>
          )}
        </MainSection>
      </Content>
       </Container>
    </Page>
  )
}
