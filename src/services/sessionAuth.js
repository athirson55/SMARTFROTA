const AUTH_KEY = "smart-frota-authenticated";
const REMEMBER_KEY = "smart-frota-remember";

export function isAuthenticated() {
  return (
    localStorage.getItem(AUTH_KEY) === "true" ||
    sessionStorage.getItem(AUTH_KEY) === "true"
  );
}

export function persistAuthSession(keepConnected) {
  if (keepConnected) {
    localStorage.setItem(AUTH_KEY, "true");
    localStorage.setItem(REMEMBER_KEY, "true");
    sessionStorage.removeItem(AUTH_KEY);
    sessionStorage.removeItem(REMEMBER_KEY);
    return;
  }

  sessionStorage.setItem(AUTH_KEY, "true");
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(REMEMBER_KEY);
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(REMEMBER_KEY);
  sessionStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(REMEMBER_KEY);
}
