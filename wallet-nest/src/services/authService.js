import { apiRequest } from '../lib/apiClient';

export function signupRequest(payload) {
  return apiRequest('/auth/signup', { method: 'POST', body: payload });
}

export function loginRequest(payload) {
  return apiRequest('/auth/login', { method: 'POST', body: payload });
}

export function updateProfileRequest(payload, token) {
  return apiRequest('/auth/profile', { method: 'PATCH', body: payload, token });
}

