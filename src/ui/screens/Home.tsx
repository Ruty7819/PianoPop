import { he } from '../../i18n/he';

export function Home() {
  return (
    <main className="mx-auto max-w-2xl p-6 text-center">
      <h1 className="text-3xl font-bold">{he.home.title}</h1>
      <p className="mt-2 text-lg text-gray-600">{he.home.subtitle}</p>
    </main>
  );
}
