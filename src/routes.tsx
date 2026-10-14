import { createBrowserRouter } from 'react-router';
import { Home } from './ui/screens/Home';
import { NotFound } from './ui/screens/NotFound';
import { PianoDemo } from './ui/screens/PianoDemo';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/demo', element: <PianoDemo /> },
  { path: '*', element: <NotFound /> },
];

export const router = createBrowserRouter(routes);
