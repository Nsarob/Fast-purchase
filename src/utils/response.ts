export interface BaseResponse<T = any> {
  success: boolean;
  message: string;
  object?: T;
  errors?: string[] | null;
}

export interface PaginatedResponse<T = any> {
  success: boolean;
  message: string;
  object: T[];
  pageNumber: number;
  pageSize: number;
  totalSize: number;
  errors?: string[] | null;
}

export const createResponse = <T>(
  success: boolean,
  message: string,
  object?: T,
  errors?: string[] | null
): BaseResponse<T> => {
  return {
    success,
    message,
    object,
    errors: errors || null,
  };
};

export const createPaginatedResponse = <T>(
  success: boolean,
  message: string,
  object: T[],
  pageNumber: number,
  pageSize: number,
  totalSize: number,
  errors?: string[] | null
): PaginatedResponse<T> => {
  return {
    success,
    message,
    object,
    pageNumber,
    pageSize,
    totalSize,
    errors: errors || null,
  };
};
