import type { User } from '../../types/user'
import { ActionButton, Avatar, Card, Name, UserInfo, Username } from './styles'

type UserCardProps = {
  user: User
  selected: boolean
  onSelect: (userId: number) => void
}

const getInitials = (name: string): string =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()

export function UserCard({ user, selected, onSelect }: UserCardProps) {
  return (
    <Card $selected={selected}>
      <Avatar $selected={selected}>{getInitials(user.name)}</Avatar>
      <UserInfo>
        <Name>{user.name}</Name>
        <Username>@{user.username}</Username>
      </UserInfo>
      <ActionButton 
        type="button" 
        aria-label={`Show TODOs for ${user.name}`} 
        onClick={() => onSelect(user.id)}
      >
        Show TODOs
      </ActionButton>
    </Card>
  )
}
