import { createBrowserRouter } from 'react-router';
import { Home } from './ui/screens/Home';
import { NotFound } from './ui/screens/NotFound';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '*', element: <NotFound /> },
];

export const router = createBrowserRouter(routes);
