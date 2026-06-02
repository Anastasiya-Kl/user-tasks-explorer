import styled from 'styled-components'

export const Item = styled.article<{ $completed: boolean }>`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  width: 100%;
  min-width: 0;
  gap: 0.875rem;
  align-items: start;
  border: 1px solid ${({ $completed }) => ($completed ? '#bbf7d0' : '#bfdbfe')};
  border-radius: 0.75rem;
  background: ${({ $completed }) => ($completed ? '#f7fdf9' : '#ffffff')};
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
  padding: 1.125rem 1.25rem;

  @media (max-width: 520px) {
    gap: 0.75rem;
  }
`

export const Checkbox = styled.input`
  width: 1rem;
  height: 1rem;
  margin: 0.2rem 0 0;
  flex: 0 0 auto;
  accent-color: #16a34a;
  cursor: default;
  opacity: 0.85;
  pointer-events: none;
`

export const Title = styled.p`
  margin: 0;
  color: #0f172a;
  font-size: 0.975rem;
  font-weight: 550;
  line-height: 1.5;
  overflow-wrap: anywhere;
`
