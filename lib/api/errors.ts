export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const unauthorized = (m = "Unauthorized") => new ApiError(401, m);
export const forbidden = (m = "Forbidden") => new ApiError(403, m);
export const notFound = (m = "Not found") => new ApiError(404, m);
export const badRequest = (m = "Bad request") => new ApiError(400, m);
export const conflict = (m = "Conflict") => new ApiError(409, m);
