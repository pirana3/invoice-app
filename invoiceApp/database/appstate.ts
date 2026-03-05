import { db } from '@/database/db';

const ONBOARDING_KEY = 'onboarding_complete';
const LANGUAGE_KEY = 'language';

const getValue = (key: string): string | null => {
  const row = db.getFirstSync<{ value: string | null }>(
    `SELECT value FROM app_state WHERE key = ?`,
    key
  );

  return row?.value ?? null;
};

const setValue = (key: string, value: string) => {
  db.runSync(
    `INSERT INTO app_state (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    key,
    value
  );
};

export const isOnboardingComplete = async (): Promise<boolean> => {
  return getValue(ONBOARDING_KEY) === 'true';
};

export const setOnboardingComplete = async (completed: boolean): Promise<void> => {
  setValue(ONBOARDING_KEY, String(completed));
};

export const getSavedLanguage = async (): Promise<'en' | 'es' | null> => {
  const value = getValue(LANGUAGE_KEY);
  return value === 'en' || value === 'es' ? value : null;
};

export const saveLanguage = async (language: 'en' | 'es'): Promise<void> => {
  setValue(LANGUAGE_KEY, language);
};
