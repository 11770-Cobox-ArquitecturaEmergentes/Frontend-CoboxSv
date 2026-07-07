export type UserSettings = {
  locale?: string | null;
  name?: string | null;
  email?: string | null;
};

export type UpdateSettingsPayload = {
  locale?: string | null;
  name?: string | null;
};