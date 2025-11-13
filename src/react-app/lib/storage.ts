const STORAGE_KEY = "workshopper-progress";

interface StoredProgress {
  [exerciseId: string]: {
    code: string;
    lastModified: number;
  };
}

export function saveProgress(exerciseId: string, code: string): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const progress: StoredProgress = stored ? JSON.parse(stored) : {};

    progress[exerciseId] = {
      code,
      lastModified: Date.now(),
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
}

export function loadProgress(exerciseId: string): string | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;

    const progress: StoredProgress = JSON.parse(stored);
    return progress[exerciseId]?.code || null;
  } catch (error) {
    console.error("Failed to load progress:", error);
    return null;
  }
}

export function clearProgress(exerciseId: string): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;

    const progress: StoredProgress = JSON.parse(stored);
    delete progress[exerciseId];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Failed to clear progress:", error);
  }
}

export function clearAllProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear all progress:", error);
  }
}

// 現在のレッスン状態を保存
const CURRENT_STATE_KEY = "workshopper-current-state";

interface CurrentState {
  lessonId: string;
  step: "description" | "coding";
  exerciseId?: string;
}

export function saveCurrentState(state: CurrentState): void {
  try {
    localStorage.setItem(CURRENT_STATE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save current state:", error);
  }
}

export function loadCurrentState(): CurrentState | null {
  try {
    const stored = localStorage.getItem(CURRENT_STATE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Failed to load current state:", error);
    return null;
  }
}
