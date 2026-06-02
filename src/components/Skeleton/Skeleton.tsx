import {
  SkeletonBlock,
  TodoSkeletonShell,
  TodoCheckboxSkeleton,
  UserActionSkeleton,
  UserCardSkeletonShell,
  UserTextSkeleton,
} from './styles'

export { SkeletonBlock } from './styles'

export function UserCardSkeleton() {
  return (
    <UserCardSkeletonShell aria-hidden="true">
      <SkeletonBlock $width="2.5rem" $height="2.5rem" $radius="50%" />
      <UserTextSkeleton>
        <SkeletonBlock $width="72%" $height="1rem" />
        <SkeletonBlock $width="48%" $height="0.85rem" />
      </UserTextSkeleton>
      <UserActionSkeleton $width="5.5rem" $height="1.9rem" $radius="0.625rem" />
    </UserCardSkeletonShell>
  )
}

export function TodoSkeleton() {
  return (
    <TodoSkeletonShell aria-hidden="true">
      <TodoCheckboxSkeleton $width="1rem" $height="1rem" $radius="0.25rem" />
      <SkeletonBlock $width="82%" $height="1.45rem" />
    </TodoSkeletonShell>
  )
}
