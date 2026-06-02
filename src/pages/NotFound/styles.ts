import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Page = styled.main`
  min-height: 100vh;
  background: #f6f7f9;
`

export const Container = styled.div`
  display: grid;
  max-width: 1180px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
  place-items: center;
`

export const Panel = styled.section`
  width: min(100%, 560px);
  border: 1px solid #e4e7ec;
  border-radius: 0.875rem;
  background: #ffffff;
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 10px 24px rgba(15, 23, 42, 0.06);
  padding: 2rem;
`

export const Subtitle = styled.p`
  margin: 0 0 0.75rem;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 750;
  line-height: 1.3;
`

export const Title = styled.h1`
  margin: 0;
  color: #0f172a;
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 750;
  letter-spacing: 0;
  line-height: 1.1;
`

export const Description = styled.p`
  margin: 1rem 0 0;
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.6;
`

export const HomeLink = styled(Link)`
  display: inline-flex;
  margin-top: 1.5rem;
  border: 1px solid #dbe3ef;
  border-radius: 0.625rem;
  background: #ffffff;
  color: #1d4ed8;
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1;
  padding: 0.75rem 0.875rem;
  text-decoration: none;
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
`
