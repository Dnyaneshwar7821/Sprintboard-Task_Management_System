export const ADMIN_ROLE = "Administrator";

export const isAdminRole = (role?: string) => role === ADMIN_ROLE;

export const normalizeIdentity = (value?: string) =>
  value?.trim().toLowerCase().replace(/\s+/g, " ") ?? "";
