'use client';

// All learner state is local-only under a versioned key (Hard Constraint 1: zero
// PII, no server). These are anonymous preferences on the device — never sent.

export const PROGRESS_KEY = 'dg.v1.progress';

export type Purpose = 'work' | 'study' | 'travel';

export type ModuleState = {
  step: number; // furthest step index reached
  completed: boolean;
};

export type Progress = {
  onboarding?: {
    firstTrip?: boolean;
    purpose?: Purpose;
  };
  modules: Record<string, ModuleState>;
};

const EMPTY: Progress = { modules: {} };

export function getProgress(): Progress {
  if (typeof window === 'undefined') return EMPTY;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...EMPTY };
    const parsed = JSON.parse(raw) as Progress;
    return { ...parsed, modules: parsed.modules ?? {} };
  } catch {
    return { ...EMPTY };
  }
}

export function saveProgress(p: Progress): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(p));
  } catch {
    /* storage full / disabled — degrade silently */
  }
}

export function setOnboarding(firstTrip: boolean, purpose: Purpose): void {
  const p = getProgress();
  p.onboarding = { firstTrip, purpose };
  saveProgress(p);
}

export function getModule(id: string): ModuleState {
  return getProgress().modules[id] ?? { step: 0, completed: false };
}

export function setModuleStep(id: string, step: number): void {
  const p = getProgress();
  const cur = p.modules[id] ?? { step: 0, completed: false };
  p.modules[id] = { ...cur, step: Math.max(cur.step, step) };
  saveProgress(p);
}

export function completeModule(id: string): void {
  const p = getProgress();
  const cur = p.modules[id] ?? { step: 0, completed: false };
  p.modules[id] = { ...cur, completed: true };
  saveProgress(p);
}

export function isModuleComplete(id: string): boolean {
  return getModule(id).completed;
}

// "নতুন শিক্ষার্থী" reset for shared devices.
export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(PROGRESS_KEY);
  } catch {
    /* ignore */
  }
}
