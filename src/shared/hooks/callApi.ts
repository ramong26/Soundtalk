export default async function callApi<T>(
  url: string,
  options?: RequestInit,
  transform?: (data: unknown) => T
): Promise<T> {
  try {
    const fetchOption = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      credentials: 'include' as RequestCredentials,
    };
    const res = await fetch(url, fetchOption);
    if (!res.ok) {
      if (res.status === 401 && url !== '/api/auth/refresh') {
        const refreshRes = await fetch('/api/auth/refresh', { method: 'POST' });
        if (refreshRes.ok) {
          const retryRes = await fetch(url, fetchOption);
          if (!retryRes.ok) {
            const errorText = await res.text();
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
