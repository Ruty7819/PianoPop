import { createBrowserRouter } from 'react-router';
import { Home } from './ui/screens/Home';
import { NotFound } from './ui/screens/NotFound';
import { PianoDemo } from './ui/screens/PianoDemo';
import { PressKeyDemo } from './ui/screens/PressKeyDemo';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/demo', element: <PianoDemo /> },
  { path: '/demo/press-key', element: <PressKeyDemo /> },
  { path: '*', element: <NotFound /> },
];

export const router = createBrowserRouter(routes);
