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

    const fullUrl = url.startsWith('http') ? url : baseUrl + url;
    console.log('callApi 호출 URL:', fullUrl);
    const res = await fetch(fullUrl, fetchOption);

    if (!res.ok) {
      console.log('callApi 호출 실패:', res.status, res.statusText);
      if (res.status === 401 && url !== '/api/auth/refresh') {
        if (!refreshPromise) {
          refreshPromise = fetch(baseUrl + '/api/auth/refresh', {
            method: 'POST',
            credentials: 'include' as RequestCredentials,
          });

          if (!refreshPromise) {
            throw new Error('Failed to initiate token refresh in callApi');
          }
        }

        const refreshRes = await refreshPromise;
        refreshPromise = null;
        if (refreshRes.ok) {
          const retryRes = await fetch(fullUrl, fetchOption);
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
