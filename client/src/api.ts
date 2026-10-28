import axios from 'axios';
import type { Page, ContactForm } from './types';

const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface UserRecord extends AuthUser {
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

const PUBLIC_CACHE_TTL = 5 * 60 * 1000;

interface CacheEntry<T> {
  data: T;
  cachedAt: number;
}

const pageCache = new Map<string, CacheEntry<Page>>();
const pageRequests = new Map<string, Promise<Page>>();
let pagesCache: CacheEntry<Page[]> | null = null;
let pagesRequest: Promise<Page[]> | null = null;

function isFresh(cachedAt: number) {
  return Date.now() - cachedAt < PUBLIC_CACHE_TTL;
}

function cachePage(page: Page, cachedAt = Date.now()) {
  // Remove an old slug if an editor renamed an existing page.
  for (const [slug, cached] of pageCache) {
    if (slug !== page.slug && page._id && cached.data._id === page._id) {
      pageCache.delete(slug);
      break;
    }
  }
  pageCache.set(page.slug, { data: page, cachedAt });
}

function invalidatePageList() {
  pagesCache = null;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('edujung_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = String(error.config?.url || '');
    const isPublicAuthRequest =
      requestUrl.includes('/auth/login') ||
      requestUrl.includes('/auth/signup') ||
      requestUrl.includes('/auth/forgot-password') ||
      requestUrl.includes('/auth/reset-password');

    if (
      error.response?.status === 401 &&
      !isPublicAuthRequest &&
      localStorage.getItem('edujung_token')
    ) {
      localStorage.removeItem('edujung_token');
      localStorage.removeItem('edujung_user');
      window.dispatchEvent(new Event('edujung:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export function peekPages(): Page[] | undefined {
  return pagesCache?.data;
}

export function peekPage(slug: string): Page | undefined {
  return pageCache.get(slug)?.data;
}

export async function getPages(options: { force?: boolean } = {}): Promise<Page[]> {
  if (!options.force && pagesCache && isFresh(pagesCache.cachedAt)) {
    return pagesCache.data;
  }
  if (!options.force && pagesRequest) {
    return pagesRequest;
  }

  const request = api.get<Page[]>('/pages').then((res) => {
    const cachedAt = Date.now();
    const pages = res.data;
    pagesCache = { data: pages, cachedAt };
    pages.forEach((page) => cachePage(page, cachedAt));
    return pages;
  });

  pagesRequest = request;
  try {
    return await request;
  } finally {
    if (pagesRequest === request) {
      pagesRequest = null;
    }
  }
}

export async function getPage(
  slug: string,
  options: { force?: boolean } = {}
): Promise<Page> {
  const cached = pageCache.get(slug);
  if (!options.force && cached && isFresh(cached.cachedAt)) {
    return cached.data;
  }
  if (!options.force && pageRequests.has(slug)) {
    return pageRequests.get(slug)!;
  }

  // The app warms the page list at startup. Reuse that request so route
  // navigation does not issue a second request for the same content.
  if (!options.force && pagesRequest) {
    const pages = await pagesRequest;
    const page = pages.find((candidate) => candidate.slug === slug);
    if (page) return page;
  }

  const request = api.get<Page>(`/pages/${slug}`).then((res) => {
    cachePage(res.data);
    return res.data;
  });

  pageRequests.set(slug, request);
  try {
    return await request;
  } finally {
    if (pageRequests.get(slug) === request) {
      pageRequests.delete(slug);
    }
  }
}

export function prefetchPage(slug: string): void {
  void getPage(slug).catch(() => {
    // Prefetching is opportunistic; the destination renders its own error UI.
  });
}

export async function savePage(id: string, page: Partial<Page>): Promise<Page> {
  const res = await api.put(`/pages/${id}`, page);
  cachePage(res.data);
  invalidatePageList();
  return res.data;
}

export async function createPage(page: Partial<Page>): Promise<Page> {
  const res = await api.post('/pages', page);
  cachePage(res.data);
  invalidatePageList();
  return res.data;
}

export async function deletePage(id: string): Promise<void> {
  await api.delete(`/pages/${id}`);
  for (const [slug, cached] of pageCache) {
    if (cached.data._id === id) {
      pageCache.delete(slug);
      break;
    }
  }
  invalidatePageList();
}

export async function loginAccount(email: string, password: string) {
  const res = await api.post('/auth/login', { email, password });
  return res.data as { token: string; user: AuthUser };
}

export async function signupAccount(
  name: string,
  email: string,
  password: string
) {
  const res = await api.post('/auth/signup', { name, email, password });
  return res.data as { token: string; user: AuthUser };
}

export async function getCurrentUser(): Promise<AuthUser> {
  const res = await api.get('/auth/me');
  return (res.data as { user: AuthUser }).user;
}

export async function requestPasswordReset(email: string): Promise<string> {
  const res = await api.post('/auth/forgot-password', { email });
  return (res.data as { message: string }).message;
}

export async function resetPassword(
  token: string,
  password: string
): Promise<string> {
  const res = await api.post('/auth/reset-password', { token, password });
  return (res.data as { message: string }).message;
}

export async function getUsers(): Promise<UserRecord[]> {
  const res = await api.get('/users');
  return res.data as UserRecord[];
}

export async function updateUserRole(
  id: string,
  role: UserRole
): Promise<UserRecord> {
  const res = await api.patch(`/users/${id}/role`, { role });
  return res.data as UserRecord;
}

export async function submitContact(data: ContactForm) {
  const res = await api.post('/contact', data);
  return res.data;
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await api.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.url as string;
}

export default api;
