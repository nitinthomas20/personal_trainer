// Centralized API client for the Express backend

const API_BASE = '/api';

const getToken = (): string | null => localStorage.getItem('token');

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Token expired / invalid — force logout
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Unauthorized');
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  return res.json();
}

// ─── Auth ────────────────────────────────────────
export interface AuthResponse {
  token: string;
  user: { id: string; email: string; onboarded: boolean };
}

export const authApi = {
  register: (email: string, password: string) =>
    request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  me: () => request<any>('/auth/me'),
};

// ─── Profile ─────────────────────────────────────
export const profileApi = {
  get: () => request<any>('/profile'),
  save: (data: any) =>
    request<{ success: boolean }>('/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// ─── Workouts ────────────────────────────────────
export const workoutApi = {
  getByDate: (date: string) => request<any>(`/workouts/date/${date}`),
  save: (plan: any) =>
    request<any>('/workouts', { method: 'POST', body: JSON.stringify(plan) }),
  markComplete: (id: string) =>
    request<any>(`/workouts/${id}/complete`, { method: 'PATCH' }),
  updateActualWeights: (id: string, exercises: any[]) =>
    request<any>(`/workouts/${id}/actual-weights`, {
      method: 'PATCH',
      body: JSON.stringify({ exercises }),
    }),
  recent: (limit = 7) => request<any[]>(`/workouts/recent?limit=${limit}`),
};

// ─── Meals ───────────────────────────────────────
export const mealApi = {
  getByDate: (date: string) => request<any>(`/meals/date/${date}`),
  save: (plan: any) =>
    request<any>('/meals', { method: 'POST', body: JSON.stringify(plan) }),
  recent: (limit = 7) => request<any[]>(`/meals/recent?limit=${limit}`),
};

// ─── Check-ins ───────────────────────────────────
export const checkInApi = {
  save: (data: any) =>
    request<any>('/checkins', { method: 'POST', body: JSON.stringify(data) }),
  recent: (limit = 7) => request<any[]>(`/checkins/recent?limit=${limit}`),
};
