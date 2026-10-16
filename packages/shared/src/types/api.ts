// API envelope shared between backend and frontend
export interface Pagination {
  next_cursor: string | null;
  has_more: boolean;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  pagination?: Pagination;
  error?: ApiError;
}
