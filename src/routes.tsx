import { createBrowserRouter } from 'react-router';
import { Home } from './ui/screens/Home';
import { CourseMap } from './ui/screens/course/CourseMap';
import { LessonPlayer } from './ui/screens/lesson/LessonPlayer';
import { LessonDone } from './ui/screens/lesson/LessonDone';
import { UnitTest } from './ui/screens/UnitTest';
import { Start } from './ui/screens/Start';
import { Placement } from './ui/screens/Placement';
import { Practice } from './ui/screens/Practice';
import { NotFound } from './ui/screens/NotFound';
import { PianoDemo } from './ui/screens/PianoDemo';
import { PressKeyDemo } from './ui/screens/PressKeyDemo';
import { ReadNoteDemo } from './ui/screens/ReadNoteDemo';
import { PlaySequenceDemo } from './ui/screens/PlaySequenceDemo';
import { HigherLowerDemo } from './ui/screens/HigherLowerDemo';
import { TapRhythmDemo } from './ui/screens/TapRhythmDemo';

export const routes = [
  { path: '/', element: <Home /> },
  { path: '/start', element: <Start /> },
  { path: '/placement', element: <Placement /> },
  { path: '/course', element: <CourseMap /> },
  { path: '/practice', element: <Practice /> },
  { path: '/lesson/:lessonId', element: <LessonPlayer /> },
  { path: '/lesson/:lessonId/done', element: <LessonDone /> },
  { path: '/unit/:unitId/test', element: <UnitTest /> },
  { path: '/demo', element: <PianoDemo /> },
  { path: '/demo/press-key', element: <PressKeyDemo /> },
  { path: '/demo/read-note', element: <ReadNoteDemo /> },
  { path: '/demo/play-sequence', element: <PlaySequenceDemo /> },
  { path: '/demo/higher-lower', element: <HigherLowerDemo /> },
  { path: '/demo/tap-rhythm', element: <TapRhythmDemo /> },
  { path: '*', element: <NotFound /> },
];

export const router = createBrowserRouter(routes);
