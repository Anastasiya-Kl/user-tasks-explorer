import styled, { keyframes } from 'styled-components'

const shimmer = keyframes`
  0% {
    background-position: 100% 0;
  }

  100% {
    background-position: -100% 0;
  }
`

type SkeletonBlockProps = {
  $height?: string
  $radius?: string
  $width?: string
}

export const SkeletonBlock = styled.div<SkeletonBlockProps>`
  width: ${({ $width }) => $width ?? '100%'};
  height: ${({ $height }) => $height ?? '1rem'};
  border-radius: ${({ $radius }) => $radius ?? '0.5rem'};
  background: linear-gradient(90deg, #eef1f5 25%, #f8fafc 50%, #eef1f5 75%);
  background-size: 200% 100%;
  animation: ${shimmer} 1.4s ease-in-out infinite;
`

export const UserCardSkeletonShell = styled.article`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  min-width: 0;
  width: 100%;
  gap: 0.875rem;
  align-items: center;
  border: 1px solid #e4e7ec;
  border-radius: 0.875rem;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  padding: 1rem;
`

export const UserTextSkeleton = styled.div`
  display: grid;
  min-width: 0;
  gap: 0.225rem;
`

export const UserActionSkeleton = styled(SkeletonBlock)`
  grid-column: 2;

  @media (max-width: 520px) {
    grid-column: 1 / -1;
  }
`

export const TodoSkeletonShell = styled.article`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  width: 100%;
  min-width: 0;
  gap: 0.875rem;
  align-items: start;
  border: 1px solid #bfdbfe;
  border-radius: 0.75rem;
  background: #ffffff;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  padding: 1.125rem 1.25rem;

  @media (max-width: 520px) {
    gap: 0.75rem;
  }
`

export const TodoCheckboxSkeleton = styled(SkeletonBlock)`
  margin-top: 0.2rem;
`
