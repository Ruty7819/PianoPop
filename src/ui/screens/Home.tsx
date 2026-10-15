import { Link } from 'react-router';
import { he } from '../../i18n/he';

export function Home() {
  return (
    <main className="mx-auto grid max-w-2xl justify-items-center gap-6 p-6 text-center">
      <div>
        <h1 className="text-3xl font-bold">{he.home.title}</h1>
        <p className="mt-2 text-lg text-muted">{he.home.subtitle}</p>
      </div>
      <Link
        to="/course"
        className="inline-flex min-h-13 items-center rounded-card bg-ink px-6 text-lg font-bold text-surface"
      >
        {he.course.toCourse}
      </Link>
    </main>
  );
}
