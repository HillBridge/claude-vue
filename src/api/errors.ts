export class RequestError extends Error {
  constructor(
    message: string,
    public statusCode: number,
  ) {
    super(message)
    this.name = 'RequestError'
  }
}

export class BusinessError extends Error {
  constructor(
    message: string,
    public code: number,
  ) {
    super(message)
    this.name = 'BusinessError'
  }
}

export function isRequestError(error: unknown): error is RequestError {
  return error instanceof RequestError
}

export function isBusinessError(error: unknown): error is BusinessError {
  return error instanceof BusinessError
}
