import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

import { routes } from '../../config/routes'
import {
  Container,
  Description,
  HomeLink,
  Page,
  Panel,
  Subtitle,
  Title,
} from '../NotFound/styles'

export function ErrorPage() {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? error.statusText
    : error instanceof Error
      ? error.message
      : 'Something went wrong.'

  return (
    <Page>
      <Container>
        <Panel>
          <Subtitle>Error</Subtitle>
          <Title>Something went wrong</Title>
          <Description>{message}</Description>
          <HomeLink to={routes.home}>Back to Home</HomeLink>
        </Panel>
      </Container>
    </Page>
  )
}
