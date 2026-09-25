import {
  User,
  Skill,
  MatchResult,
  ExchangeRequest,
  Exchange,
  Review,
  Notification,
} from '../types';

const API_BASE = '/api';

function getToken(): string | null {
  return localStorage.getItem('skillswap_token');
}

export function setToken(token: string) {
  localStorage.setItem('skillswap_token', token);
}

export function clearToken() {
  localStorage.removeItem('skillswap_token');
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'An error occurred while processing your request.');
  }

  return data as T;
}

export const api = {
  // Auth
  auth: {
    register: (body: any) =>
      request<{ message: string; token: string; user: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    login: (body: { email: string; password: string }) =>
      request<{ message: string; token: string; user: User }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    logout: () =>
      request<{ message: string }>('/auth/logout', {
        method: 'POST',
      }),
    me: () => request<{ user: User }>('/auth/me'),
  },

  // Users
  users: {
    list: (params: Record<string, string> = {}) => {
      const query = new URLSearchParams(params).toString();
      return request<{ users: User[] }>(`/users${query ? `?${query}` : ''}`);
    },
    getById: (id: string) => request<{ user: User }>(`/users/${id}`),
    update: (id: string, body: Partial<User>) =>
      request<{ message: string; user: User }>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      }),
  },

  // Skills
  skills: {
    list: () => request<{ skills: Skill[] }>('/skills'),
    addOffered: (name: string, category?: string) =>
      request<{ message: string; offeredSkills: Skill[] }>('/skills/offered', {
        method: 'POST',
        body: JSON.stringify({ name, category }),
      }),
    removeOffered: (skillId: string) =>
      request<{ message: string; offeredSkills: Skill[] }>(`/skills/offered/${skillId}`, {
        method: 'DELETE',
      }),
    addRequired: (name: string, category?: string) =>
      request<{ message: string; requiredSkills: Skill[] }>('/skills/required', {
        method: 'POST',
        body: JSON.stringify({ name, category }),
      }),
    removeRequired: (skillId: string) =>
      request<{ message: string; requiredSkills: Skill[] }>(`/skills/required/${skillId}`, {
        method: 'DELETE',
      }),
    updateAll: (offeredSkillNames: string[], requiredSkillNames: string[]) =>
      request<{ message: string; user: User }>('/skills/users/skills', {
        method: 'PUT',
        body: JSON.stringify({ offeredSkillNames, requiredSkillNames }),
      }),
  },

  // Matches
  matches: {
    getRecommended: () => request<{ matches: MatchResult[] }>('/matches'),
  },

  // Requests
  requests: {
    create: (body: {
      receiverId: string;
      offeredSkillName: string;
      requiredSkillName: string;
      message: string;
    }) =>
      request<{ message: string; request: ExchangeRequest }>('/requests', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    getReceived: () => request<{ requests: ExchangeRequest[] }>('/requests/received'),
    getSent: () => request<{ requests: ExchangeRequest[] }>('/requests/sent'),
    accept: (id: string) =>
      request<{ message: string; request: ExchangeRequest; exchange: Exchange }>(
        `/requests/${id}/accept`,
        { method: 'PUT' }
      ),
    reject: (id: string) =>
      request<{ message: string; request: ExchangeRequest }>(`/requests/${id}/reject`, {
        method: 'PUT',
      }),
  },

  // Exchanges
  exchanges: {
    list: () => request<{ exchanges: Exchange[] }>('/exchanges'),
    complete: (id: string) =>
      request<{ message: string; exchange: Exchange }>(`/exchanges/${id}/complete`, {
        method: 'PUT',
      }),
  },

  // Reviews
  reviews: {
    create: (body: { exchangeId: string; rating: number; feedback: string }) =>
      request<{ message: string; review: Review; reviewee: User }>('/reviews', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    getForUser: (userId: string) =>
      request<{ reviews: Review[]; averageRating: number; reviewCount: number }>(
        `/reviews/user/${userId}`
      ),
  },

  // Notifications
  notifications: {
    list: () => request<{ notifications: Notification[]; unreadCount: number }>('/notifications'),
    markRead: (id: string) =>
      request<{ message: string }>(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () =>
      request<{ message: string }>('/notifications/read-all', { method: 'PUT' }),
  },
};
