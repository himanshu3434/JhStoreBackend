class apiResponse {
  constructor(
    public success: boolean,
    public statusCode: number,
    public data: any,
    public message = "Default message"
  ) {
    this.statusCode = statusCode;

    this.data = data;
    this.message = message;
  }
}

export { apiResponse };
