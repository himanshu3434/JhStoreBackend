class apiError extends Error {
  data: null;
  success: boolean;
  errors;

  constructor(
    statusCode: number,
    message = "Internal Server Error",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.data = null;
    this.success = false;
    this.errors = errors;
    this.data = null;

    if (stack) this.stack = stack;
    else Error.captureStackTrace(this, this.constructor);
  }
}

export { apiError };
