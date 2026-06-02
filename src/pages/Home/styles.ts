import styled from 'styled-components'

export const Page = styled.main`
  min-height: 100vh;
  background: #f6f7f9;
`

export const Container = styled.div`
  max-width: 1180px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
`

export const Header = styled.header`
  margin-bottom: 1.75rem;
`

export const PageTitle = styled.h1`
  margin: 0;
  color: #0f172a;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 750;
  letter-spacing: 0;
  line-height: 1.08;
`

export const PageSubtitle = styled.p`
  max-width: 560px;
  margin: 0.75rem 0 0;
  color: #64748b;
  font-size: 1rem;
  font-weight: 500;
  line-height: 1.6;
`

export const Content = styled.div`
  display: grid;
  grid-template-columns: minmax(280px, 360px) minmax(0, 1fr);
  gap: 1.75rem;
  align-items: start;

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`

export const Section = styled.section`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 1.125rem;
  border: 1px solid #e4e7ec;
  border-radius: 0.875rem;
  background: #ffffff;
  padding: 1.5rem;
`

export const SidebarSection = styled(Section)`
  box-shadow:
    0 1px 2px rgba(15, 23, 42, 0.04),
    0 10px 24px rgba(15, 23, 42, 0.06);
`

export const MainSection = styled(Section)`
  border-color: #edf0f4;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
  padding: 1.625rem;
`

export const SectionHeader = styled.div`
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;

  @media (max-width: 520px) {
    flex-direction: column;
  }
`

export const TitleGroup = styled.div`
  display: grid;
  gap: 0.35rem;
  min-width: 0;
`

export const SectionTitle = styled.h2`
  margin: 0;
  color: #0f172a;
  font-size: 1.075rem;
  font-weight: 750;
  letter-spacing: 0;
  line-height: 1.3;
`

export const SelectedUserName = styled.p`
  margin: 0;
  color: #64748b;
  font-size: 0.925rem;
  font-weight: 600;
  line-height: 1.35;
  overflow-wrap: anywhere;
`

export const UsersList = styled.div`
  display: grid;
  gap: 0.875rem;
  min-width: 0;
`

export const TodoList = styled.div`
  display: grid;
  gap: 0.875rem;
  min-width: 0;
`

export const CheckboxLabel = styled.label`
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  color: #475569;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
  padding-top: 0.125rem;
  white-space: nowrap;
`

export const CheckboxInput = styled.input`
  width: 1rem;
  height: 1rem;
  accent-color: #2563eb;
`

export const StateMessage = styled.p`
  margin: 0;
  border: 1px solid #e4e7ec;
  border-radius: 0.75rem;
  background: #f8fafc;
  color: #475569;
  font-size: 0.925rem;
  line-height: 1.5;
  padding: 1.125rem 1.25rem;
  overflow-wrap: anywhere;
`

export const ErrorMessage = styled(StateMessage)`
  border-color: #fecaca;
  background: #fef2f2;
  color: #991b1b;
`
