export default async function callApi<T>(
  url: string,
  options?: RequestInit,
  transform?: (data: unknown) => T
): Promise<T> {
  try {
    const res = await fetch(url, options);
    if (!res.ok) {
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
