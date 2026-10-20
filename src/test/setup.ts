import '@testing-library/jest-dom/vitest';
import { cleanup, configure } from '@testing-library/react';
import { afterEach } from 'vitest';

// findBy/waitFor: room for slow machines when the whole suite runs in parallel.
configure({ asyncUtilTimeout: 5000 });

afterEach(cleanup);
