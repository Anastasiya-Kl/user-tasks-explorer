import { createBrowserRouter } from 'react-router-dom'

import { routes } from './config/routes'
import { ErrorPage } from './pages/Error/Error'
import { Home } from './pages/Home/Home'
import { NotFound } from './pages/NotFound/NotFound'

export const router = createBrowserRouter([
  {
    path: routes.home,
    element: <Home />,
    errorElement: <ErrorPage />,
  },
  {
    path: routes.notFound,
    element: <NotFound />,
    errorElement: <ErrorPage />,
  },
])
