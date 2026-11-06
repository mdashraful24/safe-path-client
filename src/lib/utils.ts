export { cn } from "cn";

interface ApiError extends Error {
  status?: number;
  statusCode?: number;
  data?: {
    message?: string;
  };
}

export function getErrorMessage(error: Error) {
  const apiError = error as ApiError;

  return (
    apiError.data?.message ||
    apiError.message ||
    "Something went wrong. Please try again."
  );
}

export function getErrorStatus(error: Error) {
  const apiError = error as ApiError;

  return apiError.status ?? apiError.statusCode;
}
