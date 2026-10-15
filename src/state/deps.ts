import { course as defaultCourse, type Course } from '../content';
import { createLocalRepository, type ProgressRepository } from '../services/storage';

interface StateDeps {
  repository: ProgressRepository;
  course: Course;
}

let deps: StateDeps | null = null;

/** Repository + course the stores use; guest LocalRepository by default (architecture §6). */
export function getDeps(): StateDeps {
  deps ??= { repository: createLocalRepository(), course: defaultCourse };
  return deps;
}

/** Swap the repository (login/logout) or course (tests). */
export function setDeps(patch: Partial<StateDeps>): void {
  deps = { ...getDeps(), ...patch };
}
