export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
}
