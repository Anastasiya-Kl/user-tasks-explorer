import styled from 'styled-components'

export const Card = styled.article<{ $selected: boolean }>`
  box-sizing: border-box;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  min-width: 0;
  width: 100%;
  gap: 0.875rem;
  align-items: center;
  border: 1px solid ${({ $selected }) => ($selected ? '#1d4ed8' : '#e4e7ec')};
  border-radius: 0.875rem;
  background: ${({ $selected }) => ($selected ? '#eff6ff' : '#ffffff')};
  box-shadow: ${({ $selected }) =>
    $selected
      ? '0 4px 12px rgba(37, 99, 235, 0.12)'
      : '0 1px 2px rgba(15, 23, 42, 0.04)'};
  color: #0f172a;
  padding: 1rem;
  transition:
    background 140ms ease,
    border-color 140ms ease,
    box-shadow 140ms ease;

  &:hover {
    border-color: ${({ $selected }) => ($selected ? '#1d4ed8' : '#c7d2fe')};
    box-shadow: ${({ $selected }) =>
      $selected
        ? '0 6px 16px rgba(37, 99, 235, 0.14)'
        : '0 4px 12px rgba(15, 23, 42, 0.06)'};
  }
`

export const Avatar = styled.span<{ $selected: boolean }>`
  display: inline-flex;
  width: 2.5rem;
  height: 2.5rem;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ $selected }) => ($selected ? '#93c5fd' : '#bfdbfe')};
  border-radius: 999px;
  background: ${({ $selected }) => ($selected ? '#dbeafe' : '#eff6ff')};
  color: #1d4ed8;
  font-size: 0.825rem;
  font-weight: 800;
`

export const UserInfo = styled.span`
  display: grid;
  min-width: 0;
  gap: 0.225rem;
`

export const Name = styled.span`
  font-size: 1rem;
  font-weight: 750;
  letter-spacing: 0;
  line-height: 1.35;
`

export const Username = styled.span`
  color: #64748b;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.35;
`

export const ActionButton = styled.button`
  justify-self: start;
  grid-column: 2;
  border: 1px solid #dbe3ef;
  border-radius: 0.625rem;
  background: #ffffff;
  color: #1d4ed8;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 700;
  line-height: 1;
  padding: 0.55rem 0.7rem;
  transition:
    background 140ms ease,
    border-color 140ms ease;

  &:hover {
    border-color: #93c5fd;
    background: #f8fbff;
  }

  &:focus-visible {
    outline: 3px solid rgba(37, 99, 235, 0.35);
    outline-offset: 2px;
  }

  @media (max-width: 520px) {
    grid-column: 1 / -1;
  }
`
