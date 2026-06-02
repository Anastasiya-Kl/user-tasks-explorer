import { routes } from '../../config/routes'
import {
  Container,
  Description,
  Subtitle,
  HomeLink,
  Page,
  Panel,
  Title,
} from './styles'

export function NotFound() {
  return (
    <Page>
      <Container>
        <Panel>
          <Subtitle>404</Subtitle>
          <Title>Page not found</Title>
          <Description>
            The page you are looking for does not exist or may have been moved.
          </Description>
          <HomeLink to={routes.home}>Back to Home</HomeLink>
        </Panel>
      </Container>
    </Page>
  )
}
