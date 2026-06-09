import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import * as E from 'fp-ts/Either'
import { identity, pipe } from 'fp-ts/function'

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

  const message = pipe(
    error,
    E.fromPredicate(isRouteErrorResponse, identity),
    E.match(
      (unknownError) =>
        unknownError instanceof Error
          ? unknownError.message
          : 'Something went wrong.',
      (routeError) => routeError.statusText,
    ),
  )

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
