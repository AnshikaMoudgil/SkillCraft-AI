import { supabase, isSupabaseConfigured } from './supabase';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

async function getAuthHeaders(): Promise<Record<string, string>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (isSupabaseConfigured && supabase) {
    try {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.access_token) {
        headers['Authorization'] = `Bearer ${data.session.access_token}`;
        return headers;
      }
    } catch (e) {
      console.warn('[apiClient] Failed getting Supabase session:', e);
    }
  }

  // Fallback demo token
  const localAuth = localStorage.getItem('skillcraft_is_authenticated');
  if (localAuth === 'true') {
    headers['Authorization'] = 'Bearer mock-demo-token';
  }

  return headers;
}

export const apiClient = {
  baseUrl: BASE_URL,

  async get<T>(endpoint: string): Promise<T> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'GET',
      headers,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Request failed with status ${res.status}`);
    }
    return res.json();
  },

  async post<T>(endpoint: string, body?: any): Promise<T> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Request failed with status ${res.status}`);
    }
    return res.json();
  },

  async put<T>(endpoint: string, body?: any): Promise<T> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Request failed with status ${res.status}`);
    }
    return res.json();
  },

  async upload<T>(endpoint: string, formData: FormData): Promise<T> {
    const authHeaders = await getAuthHeaders();
    // Delete Content-Type so browser sets boundary multipart/form-data
    delete authHeaders['Content-Type'];

    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: authHeaders,
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: res.statusText }));
      throw new Error(err.detail || `Upload failed with status ${res.status}`);
    }
    return res.json();
  },
};
