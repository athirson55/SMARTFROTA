import { api } from "./api";

export async function loginRequest(payload) {
  return api.post("/auth/login", payload);
}

export async function registerRequest(payload) {
  return api.post("/auth/register", payload);
}

export async function recoverPasswordRequest(payload) {
  return api.post("/auth/recover-password", payload);
}
