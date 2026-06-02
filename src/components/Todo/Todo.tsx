import type { Todo as TodoModel } from '../../types/todo'
import { Checkbox, Item, Title } from './styles'

type TodoProps = {
  todo: TodoModel
}

export function Todo({ todo }: TodoProps) {
  return (
    <Item $completed={todo.completed}>
      <Checkbox type="checkbox" checked={todo.completed} readOnly tabIndex={-1} />
      <Title>{todo.title}</Title>
    </Item>
  )
}
