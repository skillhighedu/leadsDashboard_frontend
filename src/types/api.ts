export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  additional?: T;
}

export interface ApiError {
  message: string;
  status: number;
}