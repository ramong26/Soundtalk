import { getBaseUrl } from '@/lib/utils/baseUrl';

let refreshPromise: Promise<Response> | null = null;

export default async function callApi<T>(
  url: string,
  options?: RequestInit,
  transform?: (data: unknown) => T
): Promise<T> {
  const baseUrl = getBaseUrl();
  try {
    const fetchOption = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      credentials: 'include' as RequestCredentials,
    };
    const res = await fetch(baseUrl + url, fetchOption);
    if (!res.ok) {
      if (res.status === 401 && url !== '/api/auth/refresh') {
        if (!refreshPromise) {
          refreshPromise = fetch(baseUrl + '/api/auth/refresh', {
            method: 'POST',
            credentials: 'include' as RequestCredentials,
          });
        }
        const refreshRes = await refreshPromise;
        refreshPromise = null;
        if (refreshRes.ok) {
          const retryRes = await fetch(baseUrl + url, fetchOption);
          if (!retryRes.ok) {
            const errorText = await retryRes.text();
            console.error('API 호출 실패:', res.status, res.statusText, errorText);
            throw new Error('API 호출 실패');
          }
          const retryData = await retryRes.json();
          return transform ? transform(retryData) : retryData;
        }
      }
      const errorText = await res.text();
      console.error('API 호출 실패:', res.status, res.statusText, errorText);
      throw new Error('API 호출 실패');
    }
    const data = await res.json();
    return transform ? transform(data) : data;
  } catch (error) {
    console.error('callApi() 에러:', error);
    throw error;
  }
}
